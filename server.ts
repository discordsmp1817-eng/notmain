import 'dotenv/config';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express, { type Request, type Response } from 'express';
import nodemailer from 'nodemailer';
import {
  ACCESSORIES,
  CERTIFICATIONS,
  PRODUCT_CATEGORIES,
  TESTING_PROTOCOLS,
} from './src/data/termicoreData.ts';
import {
  OWNER_INBOX_EMAIL,
  buildContactEmailContent,
  buildQuoteEmailContent,
  buildRfqEmailContent,
} from './src/utils/emailFormatter.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';
const DATA_DIR = path.resolve(__dirname, 'data');
const STORE_FILE = path.join(DATA_DIR, 'submissions.json');
const RECIPIENT_EMAIL = (process.env.RECIPIENT_EMAIL || OWNER_INBOX_EMAIL).trim();

export interface RfqLineItem {
  id: string;
  model: string;
  title: string;
  category: string;
  specSummary: string;
  quantity: number;
}

export interface RfqRecord {
  referenceId: string;
  company: string;
  email: string;
  items: RfqLineItem[];
  totalUnits: number;
  createdAt: string;
}

export interface QuoteRecord {
  referenceId: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  notes: string;
  items: RfqLineItem[];
  totalUnits: number;
  createdAt: string;
}

export interface ContactRecord {
  referenceId: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
}

interface SubmissionStore {
  rfqs: RfqRecord[];
  quotes: QuoteRecord[];
  contacts: ContactRecord[];
}

const memoryStore: SubmissionStore = {
  rfqs: [],
  quotes: [],
  contacts: [],
};

function readStore(): SubmissionStore {
  try {
    if (!fs.existsSync(STORE_FILE)) {
      return memoryStore;
    }
    const raw = fs.readFileSync(STORE_FILE, 'utf8');
    const parsed = JSON.parse(raw) as Partial<SubmissionStore>;
    return {
      rfqs: Array.isArray(parsed.rfqs) ? parsed.rfqs : [],
      quotes: Array.isArray(parsed.quotes) ? parsed.quotes : [],
      contacts: Array.isArray(parsed.contacts) ? parsed.contacts : [],
    };
  } catch {
    return memoryStore;
  }
}

function writeStore(next: SubmissionStore): void {
  memoryStore.rfqs = next.rfqs;
  memoryStore.quotes = next.quotes;
  memoryStore.contacts = next.contacts;

  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(STORE_FILE, JSON.stringify(next, null, 2), 'utf8');
  } catch {
    // Fallback to in-memory store if filesystem is read-only
  }
}

function makeReference(prefix: 'RFQ' | 'QT' | 'INQ'): string {
  const year = new Date().getFullYear();
  const suffix = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `${prefix}-${year}-${suffix}`;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+\d\s()-]{7,20}$/;

function sanitizeItems(rawItems: unknown): RfqLineItem[] {
  if (!Array.isArray(rawItems)) return [];
  return rawItems
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))
    .map((item) => ({
      id: String(item.id ?? '').trim(),
      model: String(item.model ?? '').trim(),
      title: String(item.title ?? '').trim(),
      category: String(item.category ?? 'General').trim(),
      specSummary: String(item.specSummary ?? '').trim(),
      quantity: Math.max(1, Math.min(1_000_000, Number(item.quantity) || 1)),
    }))
    .filter((item) => item.model.length > 0 && item.title.length > 0);
}

interface EmailDeliveryOutcome {
  emailDelivered: boolean;
  emailProvider: 'smtp' | 'resend' | 'formsubmit' | 'none';
  emailStatus: 'sent' | 'activation_required' | 'queued_locally';
  emailMessage?: string;
  recipientEmail: string;
}

async function deliverInquiryEmail(params: {
  subject: string;
  text: string;
  html: string;
  replyTo: string;
  formSubmitPayload: Record<string, string>;
  originHeader?: string;
}): Promise<EmailDeliveryOutcome> {
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.trim();
  const smtpHost = (process.env.SMTP_HOST || 'smtp.gmail.com').trim();
  const smtpPort = Number(process.env.SMTP_PORT || 465);
  const smtpSecure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE !== 'false'
    : smtpPort === 465;

  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: { user: smtpUser, pass: smtpPass },
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM?.trim() || `"TermiCore Website" <${smtpUser}>`,
        to: RECIPIENT_EMAIL,
        replyTo: params.replyTo,
        subject: params.subject,
        text: params.text,
        html: params.html,
      });

      return {
        emailDelivered: true,
        emailProvider: 'smtp',
        emailStatus: 'sent',
        recipientEmail: RECIPIENT_EMAIL,
      };
    } catch (err) {
      console.error('SMTP email delivery failed:', err);
    }
  }

  const resendKey = process.env.RESEND_API_KEY?.trim();
  if (resendKey) {
    try {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM?.trim() || 'TermiCore Inquiries <onboarding@resend.dev>',
          to: [RECIPIENT_EMAIL],
          reply_to: params.replyTo,
          subject: params.subject,
          text: params.text,
          html: params.html,
        }),
      });

      if (resendRes.ok) {
        return {
          emailDelivered: true,
          emailProvider: 'resend',
          emailStatus: 'sent',
          recipientEmail: RECIPIENT_EMAIL,
        };
      }
      const errText = await resendRes.text();
      console.error('Resend API email delivery failed:', resendRes.status, errText);
    } catch (err) {
      console.error('Resend API request error:', err);
    }
  }

  // Zero-config FormSubmit relay fallback when SMTP/Resend env vars are unset
  if (process.env.ENABLE_FORMSUBMIT_RELAY !== 'false') {
    try {
      const referer =
        params.originHeader && !params.originHeader.includes('localhost')
          ? params.originHeader
          : 'https://termicore-inquiries.github.io/';
      const relayRes = await fetch(
        `https://formsubmit.co/ajax/${encodeURIComponent(RECIPIENT_EMAIL)}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Origin: referer,
            Referer: referer,
          },
          body: JSON.stringify(params.formSubmitPayload),
        }
      );

      const relayData = (await relayRes.json().catch(() => ({}))) as {
        success?: boolean | string;
        message?: string;
      };

      const isSuccess = relayData.success === true || relayData.success === 'true';
      if (relayRes.ok && isSuccess) {
        return {
          emailDelivered: true,
          emailProvider: 'formsubmit',
          emailStatus: 'sent',
          recipientEmail: RECIPIENT_EMAIL,
        };
      }

      const relayMsg = String(relayData.message || '');
      if (relayMsg.toLowerCase().includes('activat')) {
        return {
          emailDelivered: false,
          emailProvider: 'formsubmit',
          emailStatus: 'activation_required',
          emailMessage: `A one-time FormSubmit activation link was sent to ${RECIPIENT_EMAIL}. Click Activate in that email to receive future submissions automatically, or add SMTP credentials in .env.`,
          recipientEmail: RECIPIENT_EMAIL,
        };
      }
    } catch (err) {
      console.error('FormSubmit relay error:', err);
    }
  }

  return {
    emailDelivered: false,
    emailProvider: 'none',
    emailStatus: 'queued_locally',
    emailMessage: `Inquiry saved on server. Configure SMTP_USER/SMTP_PASS (Gmail App Password) in .env to email ${RECIPIENT_EMAIL} directly.`,
    recipientEmail: RECIPIENT_EMAIL,
  };
}

async function startServer() {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '1mb' }));

  // 1. Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'termicore-api',
      timestamp: new Date().toISOString(),
    });
  });

  // 2. Catalog & Certifications API
  app.get('/api/catalog', (req: Request, res: Response) => {
    const query = String(req.query.q ?? '').trim().toLowerCase();
    const series = String(req.query.series ?? '').trim().toLowerCase();
    const classification = String(req.query.classification ?? '').trim().toLowerCase();

    let categories = PRODUCT_CATEGORIES;

    if (series) {
      categories = categories.filter(
        (cat) =>
          cat.id.toLowerCase() === series ||
          cat.seriesCode.toLowerCase().includes(series)
      );
    }

    if (classification) {
      categories = categories.filter(
        (cat) => cat.classification.toLowerCase() === classification
      );
    }

    if (query) {
      categories = categories
        .map((cat) => {
          const catMatches =
            cat.title.toLowerCase().includes(query) ||
            cat.seriesCode.toLowerCase().includes(query) ||
            cat.tagline.toLowerCase().includes(query) ||
            cat.description.toLowerCase().includes(query);

          const matchingSkus = cat.skus.filter(
            (sku) =>
              sku.model.toLowerCase().includes(query) ||
              sku.name.toLowerCase().includes(query) ||
              sku.connectionType.toLowerCase().includes(query) ||
              sku.wireRangeIec.toLowerCase().includes(query)
          );

          if (!catMatches && matchingSkus.length === 0) {
            return null;
          }

          return {
            ...cat,
            skus: matchingSkus.length > 0 ? matchingSkus : cat.skus,
          };
        })
        .filter((cat): cat is (typeof PRODUCT_CATEGORIES)[number] => cat !== null);
    }

    res.json({
      categories,
      accessories: ACCESSORIES,
      totalCategories: categories.length,
      totalSkus: categories.reduce((sum, c) => sum + c.skus.length, 0),
    });
  });

  app.get('/api/catalog/:id', (req: Request, res: Response) => {
    const target = String(req.params.id ?? '').trim().toLowerCase();
    const found = PRODUCT_CATEGORIES.find(
      (cat) =>
        cat.id.toLowerCase() === target ||
        cat.seriesCode.toLowerCase() === target
    );

    if (!found) {
      res.status(404).json({ error: 'Product series not found.' });
      return;
    }

    res.json({ category: found });
  });

  app.get('/api/certifications', (_req: Request, res: Response) => {
    res.json({
      certifications: CERTIFICATIONS,
      testingProtocols: TESTING_PROTOCOLS,
    });
  });

  // 3. Quick RFQ Queue submission
  app.post('/api/rfq', async (req: Request, res: Response) => {
    const company = String(req.body?.company ?? '').trim();
    const email = String(req.body?.email ?? '').trim();
    const items = sanitizeItems(req.body?.items);

    if (!company) {
      res.status(400).json({ error: 'Please enter your company or panel shop name.' });
      return;
    }
    if (!EMAIL_RE.test(email)) {
      res.status(400).json({ error: 'Please enter a valid work email address.' });
      return;
    }
    if (items.length === 0) {
      res.status(400).json({ error: 'Your RFQ queue must include at least one valid SKU or series.' });
      return;
    }

    const totalUnits = items.reduce((acc, item) => acc + item.quantity, 0);
    const record: RfqRecord = {
      referenceId: makeReference('RFQ'),
      company,
      email,
      items,
      totalUnits,
      createdAt: new Date().toISOString(),
    };

    const store = readStore();
    store.rfqs.unshift(record);
    writeStore(store);

    const formatted = buildRfqEmailContent(record);
    const delivery = await deliverInquiryEmail({
      subject: formatted.subject,
      text: formatted.text,
      html: formatted.html,
      replyTo: email,
      formSubmitPayload: formatted.formSubmitPayload,
      originHeader: req.get('origin') || req.get('referer'),
    });

    res.status(201).json({
      ok: true,
      referenceId: record.referenceId,
      receivedAt: record.createdAt,
      itemCount: items.length,
      totalUnits,
      ...delivery,
    });
  });

  // 4. Full Factory-Direct Quote Request submission
  app.post('/api/quote', async (req: Request, res: Response) => {
    const name = String(req.body?.name ?? '').trim();
    const company = String(req.body?.company ?? '').trim();
    const email = String(req.body?.email ?? '').trim();
    const phone = String(req.body?.phone ?? '').trim();
    const notes = String(req.body?.notes ?? '').trim();
    const items = sanitizeItems(req.body?.items);

    if (!name || !company) {
      res.status(400).json({ error: 'Please provide your full name and company name.' });
      return;
    }
    if (!EMAIL_RE.test(email)) {
      res.status(400).json({ error: 'Please enter a valid work email address.' });
      return;
    }
    if (phone && !PHONE_RE.test(phone)) {
      res.status(400).json({ error: 'Please enter a valid phone number.' });
      return;
    }

    const totalUnits = items.reduce((acc, item) => acc + item.quantity, 0);
    const record: QuoteRecord = {
      referenceId: makeReference('QT'),
      name,
      company,
      email,
      phone,
      notes,
      items,
      totalUnits,
      createdAt: new Date().toISOString(),
    };

    const store = readStore();
    store.quotes.unshift(record);
    writeStore(store);

    const formatted = buildQuoteEmailContent(record);
    const delivery = await deliverInquiryEmail({
      subject: formatted.subject,
      text: formatted.text,
      html: formatted.html,
      replyTo: email,
      formSubmitPayload: formatted.formSubmitPayload,
      originHeader: req.get('origin') || req.get('referer'),
    });

    res.status(201).json({
      ok: true,
      referenceId: record.referenceId,
      receivedAt: record.createdAt,
      itemCount: items.length,
      totalUnits,
      ...delivery,
    });
  });

  // 5. Technical Contact Inquiry submission
  app.post('/api/contact', async (req: Request, res: Response) => {
    const name = String(req.body?.name ?? '').trim();
    const email = String(req.body?.email ?? '').trim();
    const phone = String(req.body?.phone ?? '').trim();
    const subject = String(req.body?.subject ?? 'General Inquiry').trim();
    const message = String(req.body?.message ?? '').trim();

    if (!name) {
      res.status(400).json({ error: 'Please enter your full name.' });
      return;
    }
    if (!EMAIL_RE.test(email)) {
      res.status(400).json({ error: 'Please enter a valid email address.' });
      return;
    }
    if (phone && !PHONE_RE.test(phone)) {
      res.status(400).json({ error: 'Please enter a valid phone number.' });
      return;
    }
    if (!message) {
      res.status(400).json({ error: 'Please enter your project or technical inquiry.' });
      return;
    }

    const record: ContactRecord = {
      referenceId: makeReference('INQ'),
      name,
      email,
      phone,
      subject,
      message,
      createdAt: new Date().toISOString(),
    };

    const store = readStore();
    store.contacts.unshift(record);
    writeStore(store);

    const formatted = buildContactEmailContent(record);
    const delivery = await deliverInquiryEmail({
      subject: formatted.subject,
      text: formatted.text,
      html: formatted.html,
      replyTo: email,
      formSubmitPayload: formatted.formSubmitPayload,
      originHeader: req.get('origin') || req.get('referer'),
    });

    res.status(201).json({
      ok: true,
      referenceId: record.referenceId,
      receivedAt: record.createdAt,
      ...delivery,
    });
  });

  // 6. Sanitized Inquiry Summary (non-PII operational overview)
  app.get('/api/inquiries/summary', (_req: Request, res: Response) => {
    const store = readStore();
    res.json({
      counts: {
        rfqs: store.rfqs.length,
        quotes: store.quotes.length,
        contacts: store.contacts.length,
      },
      recent: [
        ...store.rfqs.slice(0, 5).map((r) => ({
          type: 'rfq' as const,
          referenceId: r.referenceId,
          label: r.company,
          itemCount: r.items.length,
          createdAt: r.createdAt,
        })),
        ...store.quotes.slice(0, 5).map((q) => ({
          type: 'quote' as const,
          referenceId: q.referenceId,
          label: q.company,
          itemCount: q.items.length,
          createdAt: q.createdAt,
        })),
        ...store.contacts.slice(0, 5).map((c) => ({
          type: 'contact' as const,
          referenceId: c.referenceId,
          label: c.subject,
          itemCount: 0,
          createdAt: c.createdAt,
        })),
      ]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 10),
    });
  });

  // Catch unknown /api routes with JSON 404
  app.use('/api', (_req: Request, res: Response) => {
    res.status(404).json({ error: 'API endpoint not found.' });
  });

  // Vite dev middleware or production static serving
  if (!IS_PROD) {
    const viteReady = import('vite').then(({ createServer: createViteServer }) =>
      createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      })
    );
    viteReady.catch((err) => {
      console.error('Vite middleware initialization failed:', err);
    });

    app.use((req, res, next) => {
      viteReady
        .then((vite) => vite.middlewares(req, res, next))
        .catch(next);
    });
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    const imagesDir = path.resolve(__dirname, 'src/assets/images');
    if (fs.existsSync(imagesDir)) {
      app.use('/src/assets/images', express.static(imagesDir));
    }
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TermiCore server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start TermiCore server:', err);
  process.exit(1);
});
