import { useState, useRef, useEffect } from 'react';
import { TermiCoreLogo } from './TermiCoreLogo';
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  ChevronDown,
  FileSpreadsheet,
  Home,
  Layers,
  Menu,
  Phone,
  PhoneCall,
  ShieldCheck,
  Wrench,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  CONTACT_INFO,
  IMAGES,
  PRODUCT_CATEGORIES,
  PRODUCT_NAV_GROUPS,
  RoutePath,
  resolveAssetUrl,
} from '../data/termicoreData';
import { NavigationFilter, useApp } from '../context/AppContext';
import { INDUSTRIAL_EASE, MagneticButton } from './MotionPrimitives';

export function Header() {
  const { route, navigate, rfqItems, openDrawer } = useApp();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMobileGroup, setExpandedMobileGroup] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const headerContainerRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const lastHoverOpenRef = useRef<number>(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        headerContainerRef.current &&
        !headerContainerRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDropdownOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  // Lock background page scroll while mobile navigation drawer is open
  useEffect(() => {
    if (!mobileOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileOpen]);

  // Auto-open the matching product family accordion when opening mobile menu on a product page
  useEffect(() => {
    if (!mobileOpen) return;
    const matchingGroup = PRODUCT_NAV_GROUPS.find(
      (g) => g.route === route || g.items.some((item) => item.route === route)
    );
    setExpandedMobileGroup(matchingGroup ? matchingGroup.id : null);
  }, [mobileOpen, route]);

  const openMenu = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setDropdownOpen((prev) => {
      if (!prev) {
        lastHoverOpenRef.current = Date.now();
      }
      return true;
    });
  };

  const handleToggleMenuClick = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setDropdownOpen((prev) => {
      if (prev && Date.now() - lastHoverOpenRef.current < 450) {
        return true;
      }
      return !prev;
    });
  };

  const scheduleCloseMenu = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = window.setTimeout(() => {
      setDropdownOpen(false);
    }, 140);
  };

  const handleNav = (to: RoutePath, filter?: NavigationFilter) => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate(to, filter);
  };

  const isProductRoute =
    route === '/products' ||
    PRODUCT_CATEGORIES.some((cat) => cat.slug === route);

  const navItemClass = (active: boolean) =>
    `relative whitespace-nowrap shrink-0 py-1.5 text-sm font-medium transition-colors duration-200 cursor-pointer ${
      active
        ? 'text-[#0F172A] font-semibold'
        : 'text-[#475569] hover:text-[#0F172A]'
    }`;

  const mobilePrimaryLinks: {
    label: string;
    path: RoutePath;
    icon: typeof Home;
    active: boolean;
  }[] = [
    { label: 'Home', path: '/', icon: Home, active: route === '/' },
    {
      label: 'Products',
      path: '/products',
      icon: Layers,
      active: isProductRoute,
    },
    {
      label: 'Accessories',
      path: '/accessories',
      icon: Wrench,
      active: route === '/accessories',
    },
    {
      label: 'Quality',
      path: '/quality',
      icon: ShieldCheck,
      active: route === '/quality',
    },
    {
      label: 'About Us',
      path: '/about',
      icon: Building2,
      active: route === '/about',
    },
    {
      label: 'Contact',
      path: '/contact',
      icon: PhoneCall,
      active: route === '/contact',
    },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled || mobileOpen
          ? 'border-b border-[#DCE2E8] bg-white/95 backdrop-blur-md shadow-[0_10px_28px_rgba(16,29,43,0.06)]'
          : 'border-b border-[#DCE2E8]/80 bg-[#F5F7F9]/90 backdrop-blur-sm'
      }`}
    >
      <div
        ref={headerContainerRef}
        className="relative mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-3 px-4 sm:gap-6 sm:px-6 lg:h-[68px] lg:gap-8"
      >
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleNav('/')}
          className="group flex items-center gap-2.5 sm:gap-3 text-left whitespace-nowrap shrink-0 cursor-pointer rounded"
          aria-label="TermiCore Home"
        >
          <div className="flex items-center">
            <TermiCoreLogo className="h-9 w-9 shrink-0 shadow-2xs transition-transform duration-300 group-hover:scale-105" />
          </div>
          <span className="font-display text-base sm:text-lg font-extrabold tracking-tight text-[#101D2B]">
            TermiCore
          </span>
        </button>

        {/* Zone 2: Concise Single-Line Navigation Links (Desktop) */}
        <nav aria-label="Primary" className="hidden lg:flex items-center gap-7">
          <button
            type="button"
            onClick={() => handleNav('/')}
            className={navItemClass(route === '/')}
          >
            <span>Home</span>
            {route === '/' && (
              <motion.span
                layoutId="headerTealUnderline"
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-[#0F766E]"
              />
            )}
          </button>

          <div
            onMouseEnter={openMenu}
            onMouseLeave={scheduleCloseMenu}
            className="flex items-center gap-1 py-2"
          >
            <button
              type="button"
              onClick={() => handleNav('/products')}
              className={navItemClass(isProductRoute)}
            >
              <span>Products</span>
              {isProductRoute && (
                <motion.span
                  layoutId="headerTealUnderline"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-[#0F766E]"
                />
              )}
            </button>
            <button
              type="button"
              aria-expanded={dropdownOpen}
              aria-label="Toggle product series menu"
              onClick={handleToggleMenuClick}
              className="p-1 text-[#475569] hover:text-[#0F766E] transition-colors cursor-pointer rounded"
            >
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  dropdownOpen ? 'rotate-180 text-[#0F766E]' : ''
                }`}
              />
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleNav('/accessories')}
            className={navItemClass(route === '/accessories')}
          >
            <span>Accessories</span>
            {route === '/accessories' && (
              <motion.span
                layoutId="headerTealUnderline"
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-[#0F766E]"
              />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleNav('/quality')}
            className={navItemClass(route === '/quality')}
          >
            <span>Quality</span>
            {route === '/quality' && (
              <motion.span
                layoutId="headerTealUnderline"
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-[#0F766E]"
              />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleNav('/about')}
            className={navItemClass(route === '/about')}
          >
            <span>About Us</span>
            {route === '/about' && (
              <motion.span
                layoutId="headerTealUnderline"
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-[#0F766E]"
              />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleNav('/contact')}
            className={navItemClass(route === '/contact')}
          >
            <span>Contact</span>
            {route === '/contact' && (
              <motion.span
                layoutId="headerTealUnderline"
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-[#0F766E]"
              />
            )}
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {rfqItems.length > 0 ? (
            <MagneticButton
              type="button"
              onClick={() => {
                setMobileOpen(false);
                openDrawer();
              }}
              className="inline-flex items-center gap-1.5 sm:gap-2 rounded-lg bg-[#0F766E] px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-[#0D9488] transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[40px]"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>RFQ ({rfqItems.length})</span>
            </MagneticButton>
          ) : (
            <MagneticButton
              type="button"
              onClick={() => handleNav('/quote')}
              className="inline-flex items-center justify-center rounded-lg bg-[#0F766E] px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-[#0D9488] transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[40px]"
            >
              Get a Quote
            </MagneticButton>
          )}

          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation-drawer"
            onClick={() => setMobileOpen((o) => !o)}
            className={`inline-flex lg:hidden items-center justify-center rounded-lg border p-2 cursor-pointer min-h-[44px] min-w-[44px] transition-colors ${
              mobileOpen
                ? 'border-[#0F766E] bg-[#0F766E]/10 text-[#0F766E]'
                : 'border-[#CBD5E1] bg-white text-[#101D2B] hover:border-[#0F766E]'
            }`}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* 3-Column Products Mega Menu (Desktop) */}
        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              role="region"
              aria-label="Product Categories Mega Menu"
              onMouseEnter={openMenu}
              onMouseLeave={scheduleCloseMenu}
              initial={{ opacity: 0, y: -6, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.99 }}
              transition={{ duration: 0.16, ease: INDUSTRIAL_EASE }}
              className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[min(1020px,calc(100vw-2rem))] max-h-[calc(100vh-84px)] overflow-y-auto rounded-xl border border-[#DCE2E8] bg-white p-4 shadow-[0_24px_60px_rgba(16,29,43,0.14)] origin-top z-50 before:content-[''] before:absolute before:-top-3 before:inset-x-0 before:h-3"
            >
              <div className="mb-3 flex items-center justify-between border-b border-[#EEF2F6] pb-2.5">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#0F766E]">
                    TermiCore Connection Architecture
                  </span>
                  <span className="hidden xl:inline text-xs text-[#657382]">
                    Select a terminal family or jump straight to a series
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleNav('/products')}
                  className="inline-flex items-center gap-1.5 rounded-md border border-[#DCE2E8] bg-[#F5F7F9] px-2.5 py-1 text-xs font-semibold text-[#101D2B] hover:border-[#0F766E] hover:text-[#0F766E] transition-colors cursor-pointer"
                >
                  <span>Full Product Catalog</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3.5 items-stretch">
                {PRODUCT_NAV_GROUPS.map((group) => (
                  <div
                    key={group.id}
                    className="group/col flex flex-col rounded-lg border border-[#DCE2E8] bg-[#F8FAFC] p-3 transition-colors hover:border-[#0F766E]/40"
                  >
                    <button
                      type="button"
                      onClick={() => handleNav(group.route)}
                      className="flex flex-col text-left cursor-pointer focus:outline-none"
                    >
                      <div className="w-full h-24 overflow-hidden rounded-md border border-[#DCE2E8] bg-white">
                        <img
                          src={resolveAssetUrl(group.image)}
                          alt={group.imageAlt}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover/col:scale-[1.03]"
                        />
                      </div>

                      <span className="mt-2 font-mono text-[10px] font-semibold tracking-wide text-[#0F766E] truncate">
                        {group.seriesBadge}
                      </span>
                      <span className="mt-0.5 font-display text-sm font-bold leading-snug text-[#101D2B] group-hover/col:text-[#0F766E] transition-colors truncate">
                        {group.title}
                      </span>
                      <p className="mt-0.5 text-[11px] leading-snug text-[#657382] truncate">
                        {group.summary}
                      </p>
                    </button>

                    <ul className="mt-2.5 space-y-0.5 border-t border-[#E2E8F0] pt-2">
                      {group.items.map((item) => (
                        <li key={item.label}>
                          <button
                            type="button"
                            onClick={() => handleNav(item.route, item.filter)}
                            className="group/item flex w-full items-center justify-between gap-2 rounded-md px-2 py-1 text-left text-xs font-medium text-[#334155] hover:bg-white hover:text-[#0F766E] hover:shadow-2xs transition-all cursor-pointer"
                          >
                            <span className="truncate">{item.label}</span>
                            {item.specTag && (
                              <span className="font-mono text-[10px] text-[#64748B] group-hover/item:text-[#0F766E] shrink-0">
                                {item.specTag}
                              </span>
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Responsive Mobile Navigation Drawer + Backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-navigation-drawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: INDUSTRIAL_EASE }}
            className="fixed inset-x-0 top-16 bottom-0 z-50 lg:hidden flex flex-col"
          >
            {/* Dimmed tap-to-close backdrop */}
            <div
              aria-hidden="true"
              onClick={() => setMobileOpen(false)}
              className="absolute inset-0 bg-[#101D2B]/40 backdrop-blur-[2px]"
            />

            <motion.nav
              aria-label="Mobile Navigation"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: INDUSTRIAL_EASE }}
              className="relative z-10 flex h-[calc(100dvh-4rem)] w-full flex-col bg-white"
            >
              {/* Scrollable Navigation Body */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
                {/* Quick 2-Column Primary Site Links */}
                <div>
                  <p className="mb-2 px-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#657382]">
                    Navigation
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {mobilePrimaryLinks.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.path}
                          type="button"
                          onClick={() => handleNav(item.path)}
                          className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-sm font-medium min-h-[44px] cursor-pointer transition-colors ${
                            item.active
                              ? 'border-[#0F766E] bg-[#0F766E]/8 text-[#0F766E] font-semibold'
                              : 'border-[#DCE2E8] bg-[#F8FAFC] text-[#101D2B] hover:border-[#0F766E]/40 hover:bg-white'
                          }`}
                        >
                          <Icon
                            className={`h-4 w-4 shrink-0 ${
                              item.active ? 'text-[#0F766E]' : 'text-[#657382]'
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Collapsible Product Family Accordions */}
                <div className="border-t border-[#EEF2F6] pt-4">
                  <div className="mb-2.5 flex items-center justify-between px-1">
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#657382]">
                      Product Families
                    </span>
                    <button
                      type="button"
                      onClick={() => handleNav('/products')}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#0F766E] hover:text-[#0D9488] cursor-pointer"
                    >
                      <span>View Catalog</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {PRODUCT_NAV_GROUPS.map((group) => {
                      const isExpanded = expandedMobileGroup === group.id;
                      return (
                        <div
                          key={group.id}
                          className={`overflow-hidden rounded-lg border transition-colors ${
                            isExpanded
                              ? 'border-[#0F766E]/40 bg-[#F8FAFC]'
                              : 'border-[#DCE2E8] bg-white'
                          }`}
                        >
                          <button
                            type="button"
                            aria-expanded={isExpanded}
                            onClick={() =>
                              setExpandedMobileGroup((prev) =>
                                prev === group.id ? null : group.id
                              )
                            }
                            className="flex w-full items-center justify-between gap-3 px-3.5 py-3 text-left min-h-[52px] cursor-pointer"
                          >
                            <div className="min-w-0">
                              <div className="font-mono text-[10px] font-semibold tracking-wide text-[#0F766E] truncate">
                                {group.seriesBadge}
                              </div>
                              <div className="font-display text-sm font-bold text-[#101D2B] truncate">
                                {group.title}
                              </div>
                            </div>
                            <ChevronDown
                              className={`h-4 w-4 shrink-0 text-[#657382] transition-transform duration-200 ${
                                isExpanded ? 'rotate-180 text-[#0F766E]' : ''
                              }`}
                            />
                          </button>

                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.18, ease: INDUSTRIAL_EASE }}
                                className="overflow-hidden border-t border-[#E2E8F0] bg-white"
                              >
                                <div className="p-2 space-y-0.5">
                                  <button
                                    type="button"
                                    onClick={() => handleNav(group.route)}
                                    className="flex w-full items-center justify-between rounded-md bg-[#EEF2F6]/70 px-3 py-2 text-left text-xs font-semibold text-[#0F766E] hover:bg-[#EEF2F6] min-h-[40px] cursor-pointer"
                                  >
                                    <span>Explore All {group.title}</span>
                                    <ArrowRight className="h-3.5 w-3.5" />
                                  </button>

                                  {group.items.map((item) => (
                                    <button
                                      key={`${group.id}-${item.label}`}
                                      type="button"
                                      onClick={() => handleNav(item.route, item.filter)}
                                      className="flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm text-[#334155] hover:bg-[#F5F7F9] hover:text-[#0F766E] min-h-[42px] cursor-pointer transition-colors"
                                    >
                                      <span className="truncate">{item.label}</span>
                                      {item.specTag && (
                                        <span className="font-mono text-[11px] text-[#657382] shrink-0">
                                          {item.specTag}
                                        </span>
                                      )}
                                    </button>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Pinned Bottom Action Bar */}
              <div className="border-t border-[#DCE2E8] bg-[#F5F7F9] px-4 py-3 space-y-2.5">
                <div className="flex items-center justify-between gap-2 text-xs text-[#475569]">
                  <a
                    href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, '')}`}
                    className="inline-flex items-center gap-1.5 font-medium text-[#101D2B] hover:text-[#0F766E] tabular-nums"
                  >
                    <Phone className="h-3.5 w-3.5 text-[#0F766E]" />
                    <span>{CONTACT_INFO.phone}</span>
                  </a>
                  <a
                    href={`mailto:${CONTACT_INFO.email}`}
                    className="font-mono text-[11px] text-[#0F766E] hover:underline truncate"
                  >
                    {CONTACT_INFO.email}
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleNav('/quote')}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0D9488] min-h-[44px] cursor-pointer transition-colors"
                  >
                    <span>Request Factory-Direct Quote</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  {rfqItems.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setMobileOpen(false);
                        openDrawer();
                      }}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#0F766E] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#0F766E] min-h-[44px] cursor-pointer shrink-0"
                    >
                      <FileSpreadsheet className="h-4 w-4" />
                      <span>({rfqItems.length})</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
