import React, { useState } from 'react';
import { X, Trash2, ArrowRight, CheckCircle2, Mail } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import {
  InquirySubmitResult,
  submitQuickRfqInquiry,
} from '../utils/inquiryTransport';
import { INDUSTRIAL_EASE } from './MotionPrimitives';

export function RfqDrawer() {
  const {
    isDrawerOpen,
    closeDrawer,
    rfqItems,
    updateRfqQuantity,
    removeFromRfq,
    clearRfq,
    navigate,
  } = useApp();

  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionInfo, setSubmissionInfo] = useState<InquirySubmitResult | null>(null);

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!company.trim()) {
      setError('Please enter your company or panel shop name.');
      return;
    }
    if (!emailPattern.test(email.trim())) {
      setError('Please enter a valid work email address.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const result = await submitQuickRfqInquiry({
        company: company.trim(),
        email: email.trim(),
        items: rfqItems,
      });
      setSubmissionInfo(result);
      setSubmitted(true);
      clearRfq();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Network error while submitting RFQ. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setSubmitted(false);
    setSubmissionInfo(null);
    setEmail('');
    setCompany('');
    setError('');
    closeDrawer();
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-xs"
          onClick={resetAndClose}
        >
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Quick Request for Quote Drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.28, ease: INDUSTRIAL_EASE }}
            className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl border-l border-[#DCE2E8]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#DCE2E8] px-6 py-4 bg-[#101D2B] text-white">
              <div>
                <h2 className="font-display text-lg font-bold text-white">
                  Quick RFQ Queue
                </h2>
                <p className="text-xs text-[#94A3B8]">
                  {rfqItems.length} {rfqItems.length === 1 ? 'item' : 'items'} selected for quotation
                </p>
              </div>
              <button
                type="button"
                aria-label="Close RFQ drawer"
                onClick={resetAndClose}
                className="rounded-md p-2 text-[#CBD5E1] hover:bg-[#1E2E3F] hover:text-white transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.22, ease: INDUSTRIAL_EASE }}
                  className="rounded-lg border border-slate-200 bg-[#F7F9FB] p-6 text-center"
                >
                  <CheckCircle2 className="mx-auto h-10 w-10 text-[#0F766E]" />
                  <h3 className="mt-3 font-display text-base font-bold text-[#0F172A]">
                    RFQ Submitted
                  </h3>
                  {submissionInfo?.referenceId && (
                    <div className="mt-2 inline-block rounded border border-[#0F766E]/25 bg-white px-2.5 py-1 font-mono text-xs font-semibold text-[#0F766E]">
                      Ref: {submissionInfo.referenceId}
                    </div>
                  )}
                  <p className="mt-2 text-sm text-[#475569]">
                    {submissionInfo?.emailStatus === 'sent'
                      ? `Your RFQ details have been sent to ${submissionInfo.recipientEmail}. We will reply to `
                      : 'Your selected terminal block specifications have been queued for our sales engineering team. We will reply to '}
                    <span className="font-medium text-[#0F172A]">{email}</span>.
                  </p>
                  {submissionInfo?.emailMessage && (
                    <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                      {submissionInfo.emailMessage}
                    </p>
                  )}
                  <div className="mt-5 space-y-2">
                    <button
                      type="button"
                      onClick={resetAndClose}
                      className="w-full rounded-lg bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0D9488] transition-colors cursor-pointer"
                    >
                      Continue Browsing
                    </button>
                    {submissionInfo?.mailtoHref && (
                      <a
                        href={submissionInfo.mailtoHref}
                        className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-[#0F172A] hover:border-[#0F766E] hover:text-[#0F766E] transition-colors"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        <span>Open in Email App</span>
                      </a>
                    )}
                  </div>
                </motion.div>
              ) : rfqItems.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-300 bg-[#F7F9FB] p-8 text-center">
                  <p className="text-sm font-medium text-[#0F172A]">
                    Your RFQ list is empty
                  </p>
                  <p className="mt-1 text-xs text-[#64748B]">
                    Add any product series or individual SKU from our specification tables, or open the full quote builder.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      resetAndClose();
                      navigate('/quote');
                    }}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#0F766E] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0D9488] transition-colors cursor-pointer"
                  >
                    <span>Open Full Quote Page</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence initial={false}>
                    {rfqItems.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 24 }}
                        transition={{ duration: 0.18, ease: INDUSTRIAL_EASE }}
                        className="rounded-lg border border-slate-200 bg-[#F7F9FB] p-3.5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="font-mono text-xs font-semibold text-[#0F766E]">
                              {item.model}
                            </div>
                            <div className="text-sm font-semibold text-[#0F172A] truncate">
                              {item.title}
                            </div>
                            <div className="mt-0.5 text-xs text-[#64748B]">
                              {item.category} · {item.specSummary}
                            </div>
                          </div>
                          <button
                            type="button"
                            aria-label={`Remove ${item.model}`}
                            onClick={() => removeFromRfq(item.id)}
                            className="p-1.5 text-[#64748B] hover:text-rose-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-2.5">
                          <label
                            htmlFor={`qty-${item.id}`}
                            className="text-xs font-medium text-[#475569]"
                          >
                            Est. Quantity (pcs)
                          </label>
                          <input
                            id={`qty-${item.id}`}
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) =>
                              updateRfqQuantity(item.id, parseInt(e.target.value || '1', 10))
                            }
                            className="w-24 rounded border border-slate-300 bg-white px-2.5 py-1 text-right font-mono text-xs text-[#0F172A] tabular-nums focus:border-[#0F766E] focus:outline-none"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {!submitted && rfqItems.length > 0 && (
              <div className="border-t border-slate-200 bg-[#F7F9FB] p-6">
                <form onSubmit={handleQuickSubmit} className="space-y-3">
                  <div>
                    <label htmlFor="rfq-company" className="block text-xs font-medium text-[#475569] mb-1">
                      Company / Panel Builder
                    </label>
                    <input
                      id="rfq-company"
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Acme Switchgear Pvt. Ltd."
                      className="w-full rounded-md border border-[#CBD5E1] bg-white px-3 py-2 text-sm text-[#101D2B] placeholder:text-slate-400 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="rfq-email" className="block text-xs font-medium text-[#475569] mb-1">
                      Work Email
                    </label>
                    <input
                      id="rfq-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="engineering@company.com"
                      className="w-full rounded-md border border-[#CBD5E1] bg-white px-3 py-2 text-sm text-[#101D2B] placeholder:text-slate-400 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15 focus:outline-none transition-colors"
                    />
                  </div>
                  {error && (
                    <div role="alert" className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-800">
                      {error}
                    </div>
                  )}
                  <div className="flex flex-col gap-2 pt-1">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full rounded-lg bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0D9488] disabled:opacity-60 transition-colors cursor-pointer min-h-[44px]"
                    >
                      {submitting ? 'Submitting RFQ...' : 'Submit Quick RFQ'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        closeDrawer();
                        navigate('/quote');
                      }}
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-[#0F172A] hover:border-[#0F766E] transition-colors cursor-pointer min-h-[44px]"
                    >
                      Open Full Quote Form
                    </button>
                  </div>
                </form>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
