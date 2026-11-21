import { Mail, Phone, MapPin, Clock, ArrowRight, X } from 'lucide-react';
import { TermiCoreLogo } from './TermiCoreLogo';
import { AnimatePresence, motion } from 'motion/react';
import {
  CONTACT_INFO,
  IMAGES,
  PRODUCT_NAV_GROUPS,
  RoutePath,
  resolveAssetUrl,
} from '../data/termicoreData';
import { NavigationFilter, useApp } from '../context/AppContext';
import { INDUSTRIAL_EASE } from './MotionPrimitives';

export function Footer() {
  const { navigate, legalModal, setLegalModal } = useApp();

  const handleLink = (to: RoutePath, filter?: NavigationFilter) => {
    navigate(to, filter);
  };

  const dinGroup = PRODUCT_NAV_GROUPS.find((g) => g.id === 'din-rail');
  const pcbGroup = PRODUCT_NAV_GROUPS.find((g) => g.id === 'pcb');
  const barrierGroup = PRODUCT_NAV_GROUPS.find((g) => g.id === 'barrier');

  return (
    <footer className="bg-[#101D2B] text-[#CBD5E1] border-t border-[#243447]">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 py-14 lg:py-16">
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-[1.22fr_0.65fr_1.12fr_1.15fr_1.18fr_1.12fr] xl:gap-5">
          {/* Brand Column */}
          <div>
            <button
              type="button"
              onClick={() => handleLink('/')}
              className="flex items-center gap-3 text-left cursor-pointer rounded"
            >
              <TermiCoreLogo className="h-9 w-9 shrink-0 shadow-xs" />
              <span className="font-display text-lg font-extrabold tracking-tight text-white">
                TermiCore
              </span>
            </button>

            <p className="mt-4 text-[13px] leading-relaxed text-[#94A3B8] max-w-xs">
              Precision DIN rail, PCB, and barrier terminal block systems for industrial automation, switchgear, and power distribution.
            </p>

            <p className="mt-3.5 font-mono text-[10.5px] tracking-tight text-[#2DD4BF] whitespace-nowrap">
              UL 1059 · IEC 60947-7-1 · ISO 9001
            </p>

            <button
              type="button"
              onClick={() => handleLink('/quote')}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#0F766E] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#0D9488] transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[40px]"
            >
              <span>Request Factory Quote</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="font-display text-sm font-bold text-white tracking-wide whitespace-nowrap">
              Company
            </h3>
            <ul className="mt-4 space-y-2.5 text-[13px]">
              {[
                { label: 'Home', path: '/' as RoutePath },
                { label: 'All Products', path: '/products' as RoutePath },
                { label: 'Accessories', path: '/accessories' as RoutePath },
                { label: 'Quality & Approvals', path: '/quality' as RoutePath },
                { label: 'About Us', path: '/about' as RoutePath },
                { label: 'Contact', path: '/contact' as RoutePath },
              ].map((item) => (
                <li key={item.path}>
                  <button
                    type="button"
                    onClick={() => handleLink(item.path)}
                    className="text-left text-[#CBD5E1] hover:text-[#2DD4BF] transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* DIN Rail Terminal Blocks (Separate Div) */}
          {dinGroup && (
            <div>
              <h3 className="font-display text-sm font-bold text-white tracking-wide whitespace-nowrap">
                {dinGroup.title}
              </h3>
              <ul className="mt-4 space-y-2.5 text-[13px]">
                {dinGroup.items.map((item) => (
                  <li key={item.label}>
                    <button
                      type="button"
                      onClick={() => handleLink(item.route, item.filter)}
                      className="text-left leading-snug text-[#CBD5E1] hover:text-[#2DD4BF] transition-colors cursor-pointer"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* PCB Terminal Blocks (Separate Div) */}
          {pcbGroup && (
            <div>
              <h3 className="font-display text-sm font-bold text-white tracking-wide whitespace-nowrap">
                {pcbGroup.title}
              </h3>
              <ul className="mt-4 space-y-2.5 text-[13px]">
                {pcbGroup.items.map((item) => (
                  <li key={item.label}>
                    <button
                      type="button"
                      onClick={() => handleLink(item.route, item.filter)}
                      className="text-left leading-snug text-[#CBD5E1] hover:text-[#2DD4BF] transition-colors cursor-pointer"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Barrier Terminal Blocks (Separate Div) */}
          {barrierGroup && (
            <div>
              <h3 className="font-display text-sm font-bold text-white tracking-wide whitespace-nowrap">
                {barrierGroup.title}
              </h3>
              <ul className="mt-4 space-y-2.5 text-[13px]">
                {barrierGroup.items.map((item) => (
                  <li key={item.label}>
                    <button
                      type="button"
                      onClick={() => handleLink(item.route, item.filter)}
                      className="text-left leading-snug text-[#CBD5E1] hover:text-[#2DD4BF] transition-colors cursor-pointer"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact Us */}
          <div>
            <h3 className="font-display text-sm font-bold text-white tracking-wide whitespace-nowrap">
              Engineering Desk
            </h3>
            <ul className="mt-4 space-y-3 text-[13px] text-[#CBD5E1]">
              <li className="flex items-start gap-2.5">
                <Mail className="h-4 w-4 text-[#2DD4BF] shrink-0 mt-0.5" />
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="hover:text-white transition-colors break-all"
                >
                  {CONTACT_INFO.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="h-4 w-4 text-[#2DD4BF] shrink-0 mt-0.5" />
                <a
                  href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, '')}`}
                  className="hover:text-white transition-colors tabular-nums whitespace-nowrap"
                >
                  {CONTACT_INFO.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="h-4 w-4 text-[#2DD4BF] shrink-0 mt-0.5" />
                <span className="tabular-nums whitespace-nowrap">Mon–Sat · 09:00–18:30</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#2DD4BF] shrink-0 mt-0.5" />
                <span>{CONTACT_INFO.location}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-[#243447] pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#94A3B8]">
          <div>&copy; {new Date().getFullYear()} TermiCore Industrial Connectivity. All rights reserved.</div>
          <div className="flex flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={() => setLegalModal('privacy')}
              className="py-1 hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => setLegalModal('terms')}
              className="py-1 hover:text-white transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              type="button"
              onClick={() => setLegalModal('sitemap')}
              className="py-1 hover:text-white transition-colors cursor-pointer"
            >
              Sitemap
            </button>
          </div>
        </div>
      </div>

      {/* Legal & Sitemap Modal */}
      <AnimatePresence>
        {legalModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-xs"
            onClick={() => setLegalModal(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="legal-modal-title"
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.2, ease: INDUSTRIAL_EASE }}
              className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-6 text-[#0F172A] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 id="legal-modal-title" className="font-display text-lg font-bold text-[#0F172A]">
                  {legalModal === 'privacy' && 'Privacy Policy'}
                  {legalModal === 'terms' && 'Terms of Service'}
                  {legalModal === 'sitemap' && 'TermiCore Site Directory'}
                </h3>
                <button
                  type="button"
                  aria-label="Close dialog"
                  onClick={() => setLegalModal(null)}
                  className="rounded-md p-1.5 text-[#64748B] hover:bg-slate-100 hover:text-[#0F172A] transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 text-sm text-[#475569] space-y-3 leading-relaxed">
                {legalModal === 'privacy' && (
                  <>
                    <p>
                      TermiCore collects contact and technical specification data solely to process engineering inquiries, sample dispatches, and factory-direct quote requests.
                    </p>
                    <p>
                      For compliance documentation or data inquiries, contact{' '}
                      <span className="font-medium text-[#0F766E]">{CONTACT_INFO.email}</span>.
                    </p>
                  </>
                )}

                {legalModal === 'terms' && (
                  <>
                    <p>
                      All electrical ratings, tightening torques, and wire cross-section tolerances published in TermiCore product tables must be verified by qualified panel builders against applicable IEC 60947-7-1 and UL 1059 installation requirements.
                    </p>
                    <p>
                      Product specifications are subject to engineering verification at the time of formal quotation.
                    </p>
                  </>
                )}

                {legalModal === 'sitemap' && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {[
                      { label: 'Home', path: '/' as RoutePath },
                      { label: 'All Products', path: '/products' as RoutePath },
                      { label: 'Accessories', path: '/accessories' as RoutePath },
                      { label: 'Spring Cage (TSC)', path: '/spring-cage-connection' as RoutePath },
                      { label: 'Screw Clamp (TSC-R)', path: '/screw-connection' as RoutePath },
                      { label: 'Spring Support (TSS)', path: '/screw-support' as RoutePath },
                      { label: 'Bolt Stud (TBC/TBH)', path: '/bolt-connection' as RoutePath },
                      { label: '1-Nut IC/OG (TNC/TNO)', path: '/nut-connection' as RoutePath },
                      { label: 'PCB Blocks (TPC/TPS)', path: '/pcb-terminal-blocks' as RoutePath },
                      { label: 'PCB Connectors (TPL/TPH)', path: '/pcb-connectors' as RoutePath },
                      { label: 'Barrier Blocks (TBB/TBD)', path: '/barrier-terminal-blocks' as RoutePath },
                      { label: 'Quality & Standards', path: '/quality' as RoutePath },
                      { label: 'About TermiCore', path: '/about' as RoutePath },
                      { label: 'Contact Engineering', path: '/contact' as RoutePath },
                      { label: 'Request a Quote', path: '/quote' as RoutePath },
                    ].map((item) => (
                      <button
                        key={item.path}
                        type="button"
                        onClick={() => {
                          setLegalModal(null);
                          handleLink(item.path);
                        }}
                        className="rounded-md border border-slate-200 bg-[#F7F9FB] px-3 py-2 text-left text-xs font-medium text-[#0F172A] hover:border-[#0F766E] hover:text-[#0F766E] transition-colors cursor-pointer"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
