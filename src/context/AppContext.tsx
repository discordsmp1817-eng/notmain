import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RoutePath } from '../data/termicoreData';
import { findModelByRoute } from '../utils/modelSpecifications';

gsap.registerPlugin(ScrollTrigger);

export interface RfqItem {
  id: string;
  model: string;
  title: string;
  category: string;
  specSummary: string;
  quantity: number;
}

export type LegalModalType = 'privacy' | 'terms' | 'sitemap' | null;

export interface NavigationFilter {
  typeFilter?: string;
  pitchFilter?: 'All' | 'fine' | 'standard' | 'power';
  processFilter?: 'All' | 'tht' | 'thr' | 'plug';
  accessoryCategory?: string;
}

interface AppContextValue {
  route: RoutePath;
  navigate: (to: RoutePath, filter?: NavigationFilter) => void;
  navFilter: (NavigationFilter & { nonce: number }) | null;
  clearNavFilter: () => void;
  scrollToTarget: (target: string | number) => void;
  rfqItems: RfqItem[];
  addToRfq: (
    item: Omit<RfqItem, 'quantity'> & { quantity?: number },
    options?: { openDrawer?: boolean }
  ) => void;
  updateRfqQuantity: (id: string, quantity: number) => void;
  removeFromRfq: (id: string) => void;
  clearRfq: () => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  legalModal: LegalModalType;
  setLegalModal: (modal: LegalModalType) => void;
}

const VALID_ROUTES: RoutePath[] = [
  '/',
  '/products',
  '/accessories',
  '/spring-cage-connection',
  '/screw-connection',
  '/screw-support',
  '/bolt-connection',
  '/nut-connection',
  '/pcb-terminal-blocks',
  '/pcb-connectors',
  '/barrier-terminal-blocks',
  '/quality',
  '/about',
  '/contact',
  '/quote',
];

function getBasePrefix(): string {
  const metaEnv = (import.meta as unknown as { env?: { BASE_URL?: string } }).env;
  const base = metaEnv?.BASE_URL ?? '/';
  if (base && base !== '/' && base !== './') {
    return base.replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined' && window.location.hostname.endsWith('github.io')) {
    const firstSeg = window.location.pathname.split('/').filter(Boolean)[0];
    if (firstSeg && !VALID_ROUTES.includes(`/${firstSeg}` as RoutePath)) {
      return `/${firstSeg}`;
    }
  }
  return '';
}

function normalizePath(rawPath: string): RoutePath {
  const basePrefix = getBasePrefix();
  let stripped = rawPath;
  if (basePrefix && stripped.startsWith(basePrefix)) {
    stripped = stripped.slice(basePrefix.length) || '/';
  }
  const cleaned = stripped.replace(/\/+$/, '').replace(/\.html$/i, '') || '/';
  if (cleaned === '/index') return '/';
  if (VALID_ROUTES.includes(cleaned as RoutePath)) {
    return cleaned as RoutePath;
  }
  if (cleaned.startsWith('/model/') && findModelByRoute(cleaned)) {
    return cleaned as RoutePath;
  }
  return '/';
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<RoutePath>(() => normalizePath(window.location.pathname));
  const [navFilter, setNavFilter] = useState<(NavigationFilter & { nonce: number }) | null>(null);
  const [rfqItems, setRfqItems] = useState<RfqItem[]>(() => {
    try {
      const saved = localStorage.getItem('termicore_rfq_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [legalModal, setLegalModal] = useState<LegalModalType>(null);
  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Lenis smooth scrolling integrated with GSAP ScrollTrigger
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    lenisRef.current = lenis;

    const onLenisScroll = () => {
      ScrollTrigger.update();
    };
    lenis.on('scroll', onLenisScroll);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.off('scroll', onLenisScroll);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Pause Lenis background scroll when drawer or legal modal is open
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (isDrawerOpen || legalModal) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [isDrawerOpen, legalModal]);

  // Refresh ScrollTrigger measurements when route changes
  useEffect(() => {
    const timer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 220);
    return () => window.clearTimeout(timer);
  }, [route]);

  useEffect(() => {
    try {
      localStorage.setItem('termicore_rfq_items', JSON.stringify(rfqItems));
    } catch {
      // Ignore storage quota errors
    }
  }, [rfqItems]);

  useEffect(() => {
    const onPopState = () => {
      setRoute(normalizePath(window.location.pathname));
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const scrollToTarget = useCallback((target: string | number) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset: -72, duration: 0.9 });
    } else if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'auto' });
    } else {
      const el = document.querySelector(target);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const navigate = useCallback((to: RoutePath, filter?: NavigationFilter) => {
    const normalized = normalizePath(to);
    const basePrefix = getBasePrefix();
    const targetUrl = basePrefix
      ? `${basePrefix}${normalized === '/' ? '/' : normalized}`
      : normalized;
    if (window.location.pathname !== targetUrl) {
      window.history.pushState({}, '', targetUrl);
    }
    setNavFilter(filter ? { ...filter, nonce: Date.now() } : null);
    setRoute(normalized);
    setIsDrawerOpen(false);
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, []);

  const clearNavFilter = useCallback(() => {
    setNavFilter(null);
  }, []);

  const addToRfq = useCallback(
    (
      item: Omit<RfqItem, 'quantity'> & { quantity?: number },
      options?: { openDrawer?: boolean }
    ) => {
      const qtyToAdd = item.quantity && item.quantity > 0 ? item.quantity : 100;
      setRfqItems((prev) => {
        const existing = prev.find((i) => i.id === item.id);
        if (existing) {
          return prev.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + qtyToAdd } : i
          );
        }
        return [...prev, { ...item, quantity: qtyToAdd }];
      });
      if (options?.openDrawer !== false) {
        setIsDrawerOpen(true);
      }
    },
    []
  );

  const updateRfqQuantity = useCallback((id: string, quantity: number) => {
    setRfqItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  }, []);

  const removeFromRfq = useCallback((id: string) => {
    setRfqItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearRfq = useCallback(() => {
    setRfqItems([]);
  }, []);

  return (
    <AppContext.Provider
      value={{
        route,
        navigate,
        navFilter,
        clearNavFilter,
        scrollToTarget,
        rfqItems,
        addToRfq,
        updateRfqQuantity,
        removeFromRfq,
        clearRfq,
        isDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
        legalModal,
        setLegalModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
