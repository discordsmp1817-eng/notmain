import { useState, useRef, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Layers,
  Plus,
  Search,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  PRODUCT_CATEGORIES,
  ProductCategory,
  resolveAssetUrl,
} from '../data/termicoreData';
import { useApp } from '../context/AppContext';
import {
  CatalogTopEntry,
  DIN_RAIL_GROUP_ID,
  NeedFilter,
  buildCatalogTopEntries,
  filterCatalogTopEntries,
  getMatchingSkusForEntries,
} from '../utils/catalogGrouping';
import { EngineeringImage } from './EngineeringImage';
import { SpecTable } from './SpecTable';
import {
  GlowCard,
  INDUSTRIAL_EASE,
  RevealBlock,
  StaggerGrid,
} from './MotionPrimitives';

interface ProductCatalogSectionProps {
  compactHeading?: boolean;
}

const NEED_OPTIONS: { id: NeedFilter; label: string }[] = [
  { id: 'all', label: 'All Applications' },
  { id: 'control', label: 'Control & PLC Wiring' },
  { id: 'vibration', label: 'Vibration-Proof' },
  { id: 'pcb', label: 'PCB & Board-to-Wire' },
  { id: 'test-disconnect', label: 'Disconnect & CT/PT Test' },
  { id: 'high-power', label: 'Heavy Power (110–300 A)' },
  { id: 'distribution', label: '1-to-Many Power Split' },
];

const BEST_FOR_LABELS: Record<string, string> = {
  [DIN_RAIL_GROUP_ID]:
    'TS 35 & G 32 control, metering, heavy lug & 1-nut distribution blocks across 5 connection technologies up to 300 A',
  'spring-cage': 'Fast, tool-assisted control wiring in high-vibration panels',
  'screw-connection': 'Universal panel & field wiring with Reakdyn locking',
  'screw-support': 'Metering, CT/PT test loops & vibration-prone circuits',
  'bolt-connection': 'Heavy-duty busbar feeders & ring/fork lug terminations',
  'nut-connection': 'Splitting 1 main incoming cable into 2–8 branch circuits',
  'pcb-terminal-blocks':
    'Direct-solder screw, lever & THR PCB clamps up to 232 A / 1000 V (2.54–15 mm)',
  'pcb-connectors':
    'Two-piece pluggable PCB headers, THR sockets & locking plugs up to 125 A / 1000 V',
  'barrier-terminal-blocks':
    'Single-row, bi-level, pluggable & panel-mount screw barrier strips up to 85 A / 600 V',
};

export function ProductCatalogSection({
  compactHeading = false,
}: ProductCatalogSectionProps) {
  const { navigate, addToRfq } = useApp();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [needFilter, setNeedFilter] = useState<NeedFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const topEntries = useMemo(() => buildCatalogTopEntries(PRODUCT_CATEGORIES), []);
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const matchingModels = useMemo(
    () =>
      getMatchingSkusForEntries(topEntries, {
        activeFilter,
        needFilter,
        searchQuery,
      }),
    [topEntries, activeFilter, needFilter, searchQuery]
  );

  const visibleEntries = useMemo(
    () =>
      filterCatalogTopEntries(topEntries, {
        activeFilter,
        needFilter,
        searchQuery,
      }),
    [topEntries, activeFilter, needFilter, searchQuery]
  );

  const expandedGroup = useMemo(() => {
    if (!expandedGroupId) return undefined;
    const found = topEntries.find(
      (entry) => entry.kind === 'group' && entry.id === expandedGroupId
    );
    return found?.kind === 'group' ? found : undefined;
  }, [topEntries, expandedGroupId]);

  const expandedCategory: ProductCategory | undefined = PRODUCT_CATEGORIES.find(
    (c) => c.id === expandedCategoryId
  );

  // Keep downstream ScrollTriggers aligned whenever cards hide/expand/filter
  useEffect(() => {
    const timer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 260);
    return () => window.clearTimeout(timer);
  }, [expandedGroupId, expandedCategoryId, activeFilter, needFilter, normalizedQuery]);

  const scrollSectionIntoView = () => {
    requestAnimationFrame(() => {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  };

  const handleOpenGroup = (groupId: string) => {
    setExpandedCategoryId(null);
    setExpandedGroupId(groupId);
    scrollSectionIntoView();
  };

  const handleToggleSpecs = (catId: string) => {
    setExpandedCategoryId((prev) => {
      const next = prev === catId ? null : catId;
      if (next) {
        scrollSectionIntoView();
      }
      return next;
    });
  };

  const resetAllFilters = () => {
    setActiveFilter('all');
    setNeedFilter('all');
    setSearchQuery('');
    setExpandedGroupId(null);
    setExpandedCategoryId(null);
  };

  const hasActiveFilters =
    activeFilter !== 'all' || needFilter !== 'all' || normalizedQuery.length > 0;

  const isFocusedMode = Boolean(expandedCategory || expandedGroup);

  const renderCategorySubCard = (cat: ProductCategory, fromGroup = false) => (
    <div key={cat.id} data-stagger-item className="flex">
      <GlowCard
        as="article"
        variant="light"
        className="group w-full bg-[#F5F7F9] hover:-translate-y-1 focus-within:border-[#0F766E] focus-within:ring-2 focus-within:ring-[#0F766E]/20"
      >
        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-center justify-between gap-2 text-xs font-medium text-[#657382]">
            <span className="font-mono font-semibold text-[#0F766E]">
              {cat.seriesCode}
            </span>
            <span>
              {cat.classification} · {cat.skus.length} models
            </span>
          </div>

          <div className="mt-4 overflow-hidden rounded-md border border-[#DCE2E8] bg-white aspect-[4/3]">
            <EngineeringImage
              src={cat.image}
              alt={cat.imageAlt}
              fallbackTitle={cat.title}
              className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
            />
          </div>

          <h3 className="mt-5 font-display text-xl font-bold tracking-tight text-[#101D2B] group-hover:text-[#0F766E] transition-colors">
            <a
              href={resolveAssetUrl(cat.slug)}
              onClick={(e) => {
                e.preventDefault();
                navigate(cat.slug);
              }}
              className="focus:outline-none after:absolute after:inset-0 after:z-10 after:content-['']"
            >
              {cat.title}
            </a>
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-[#475569]">
            {BEST_FOR_LABELS[cat.id] || cat.tagline}
          </p>

          <dl className="mt-4 grid grid-cols-3 gap-2.5 rounded-md border border-[#DCE2E8] bg-white p-3 text-xs">
            <div>
              <dt className="text-[#657382]">Wire Size</dt>
              <dd className="mt-0.5 font-mono font-semibold text-[#101D2B] tabular-nums">
                {cat.wireRangeSummary}
              </dd>
            </div>
            <div>
              <dt className="text-[#657382]">Max Current</dt>
              <dd className="mt-0.5 font-mono font-semibold text-[#101D2B] tabular-nums">
                {cat.currentMaxSummary}
              </dd>
            </div>
            <div>
              <dt className="text-[#657382]">Voltage</dt>
              <dd className="mt-0.5 font-mono font-semibold text-[#101D2B] tabular-nums">
                {cat.voltageMaxSummary}
              </dd>
            </div>
          </dl>

          <div className="relative z-20 mt-auto pt-5 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (fromGroup) {
                  setExpandedGroupId(DIN_RAIL_GROUP_ID);
                }
                handleToggleSpecs(cat.id);
              }}
              aria-expanded={false}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#0F766E] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#0D9488] transition-colors whitespace-nowrap cursor-pointer min-h-[40px]"
            >
              <span>See Models &amp; Specs</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={() => navigate(cat.slug)}
              className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-xs font-semibold text-[#0F172A] hover:border-[#0F766E] hover:text-[#0F766E] transition-colors whitespace-nowrap cursor-pointer min-h-[40px]"
            >
              <span>Details</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              title={`Add ${cat.title} to RFQ`}
              aria-label={`Add ${cat.title} series to RFQ`}
              onClick={() =>
                addToRfq({
                  id: cat.seriesCode,
                  model: cat.seriesCode,
                  title: cat.title,
                  category: 'Series Inquiry',
                  specSummary: `${cat.wireRangeSummary} · Max ${cat.currentMaxSummary}`,
                })
              }
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white p-2.5 text-[#0F172A] hover:border-[#0F766E] hover:text-[#0F766E] transition-colors cursor-pointer min-h-[40px] min-w-[40px]"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </GlowCard>
    </div>
  );

  const renderTopEntryCard = (entry: CatalogTopEntry) => {
    if (entry.kind === 'category') {
      const cat = entry.category;
      return (
        <div key={entry.id} data-stagger-item className="flex">
          <GlowCard
            as="article"
            variant="light"
            className="group w-full bg-[#F5F7F9] hover:-translate-y-1 focus-within:border-[#0F766E] focus-within:ring-2 focus-within:ring-[#0F766E]/20"
          >
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center justify-between gap-2 text-xs font-medium text-[#657382]">
                <span className="font-mono font-semibold text-[#0F766E]">
                  {cat.seriesCode}
                </span>
                <span>
                  {cat.classification} · {cat.skus.length} models
                </span>
              </div>

              <div className="mt-4 overflow-hidden rounded-md border border-[#DCE2E8] bg-white aspect-[16/10]">
                <EngineeringImage
                  src={cat.image}
                  alt={cat.imageAlt}
                  fallbackTitle={cat.title}
                  className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                />
              </div>

              <h3 className="mt-5 font-display text-xl font-bold tracking-tight text-[#101D2B] group-hover:text-[#0F766E] transition-colors">
                <a
                  href={resolveAssetUrl(cat.slug)}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(cat.slug);
                  }}
                  className="focus:outline-none after:absolute after:inset-0 after:z-10 after:content-['']"
                >
                  {cat.title}
                </a>
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[#475569]">
                {BEST_FOR_LABELS[cat.id] || cat.tagline}
              </p>

              <dl className="mt-4 grid grid-cols-3 gap-2.5 rounded-md border border-[#DCE2E8] bg-white p-3 text-xs">
                <div>
                  <dt className="text-[#657382]">Wire Size</dt>
                  <dd className="mt-0.5 font-mono font-semibold text-[#101D2B] tabular-nums">
                    {cat.wireRangeSummary}
                  </dd>
                </div>
                <div>
                  <dt className="text-[#657382]">Max Current</dt>
                  <dd className="mt-0.5 font-mono font-semibold text-[#101D2B] tabular-nums">
                    {cat.currentMaxSummary}
                  </dd>
                </div>
                <div>
                  <dt className="text-[#657382]">Voltage</dt>
                  <dd className="mt-0.5 font-mono font-semibold text-[#101D2B] tabular-nums">
                    {cat.voltageMaxSummary}
                  </dd>
                </div>
              </dl>

              <div className="relative z-20 mt-auto pt-5 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleSpecs(cat.id)}
                  aria-expanded={false}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#0F766E] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#0D9488] transition-colors whitespace-nowrap cursor-pointer min-h-[40px]"
                >
                  <span>See Models &amp; Specs</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => navigate(cat.slug)}
                  className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-xs font-semibold text-[#0F172A] hover:border-[#0F766E] hover:text-[#0F766E] transition-colors whitespace-nowrap cursor-pointer min-h-[40px]"
                >
                  <span>Details</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  title={`Add ${cat.title} to RFQ`}
                  aria-label={`Add ${cat.title} series to RFQ`}
                  onClick={() =>
                    addToRfq({
                      id: cat.seriesCode,
                      model: cat.seriesCode,
                      title: cat.title,
                      category: 'Series Inquiry',
                      specSummary: `${cat.wireRangeSummary} · Max ${cat.currentMaxSummary}`,
                    })
                  }
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white p-2.5 text-[#0F172A] hover:border-[#0F766E] hover:text-[#0F766E] transition-colors cursor-pointer min-h-[40px] min-w-[40px]"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </GlowCard>
        </div>
      );
    }

    // Parent Card: DIN Rail Terminal Block
    return (
      <div key={entry.id} data-stagger-item className="flex">
        <GlowCard
          as="article"
          variant="light"
          className="group w-full bg-[#F5F7F9] hover:-translate-y-1 focus-within:border-[#0F766E] focus-within:ring-2 focus-within:ring-[#0F766E]/20"
        >
          <div className="p-6 flex flex-col flex-1">
            <div className="flex items-center justify-between gap-2 text-xs font-medium text-[#657382]">
              <span className="font-mono font-semibold text-[#0F766E]">
                {entry.seriesCode}
              </span>
              <span>
                {entry.classification} · {entry.totalModels} models
              </span>
            </div>

            <div className="mt-4 overflow-hidden rounded-md border border-[#DCE2E8] bg-white aspect-[16/10]">
              <EngineeringImage
                src={entry.image}
                alt={entry.imageAlt}
                fallbackTitle={entry.title}
                className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
              />
            </div>

            <h3 className="mt-5 font-display text-xl font-bold tracking-tight text-[#101D2B] group-hover:text-[#0F766E] transition-colors">
              <button
                type="button"
                onClick={() => handleOpenGroup(entry.id)}
                className="text-left focus:outline-none after:absolute after:inset-0 after:z-10 after:content-[''] cursor-pointer"
              >
                {entry.title}
              </button>
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[#475569]">
              {BEST_FOR_LABELS[entry.id] || entry.tagline}
            </p>

            <dl className="mt-4 grid grid-cols-3 gap-2.5 rounded-md border border-[#DCE2E8] bg-white p-3 text-xs">
              <div>
                <dt className="text-[#657382]">Wire Size</dt>
                <dd className="mt-0.5 font-mono font-semibold text-[#101D2B] tabular-nums">
                  {entry.wireRangeSummary}
                </dd>
              </div>
              <div>
                <dt className="text-[#657382]">Max Current</dt>
                <dd className="mt-0.5 font-mono font-semibold text-[#101D2B] tabular-nums">
                  {entry.currentMaxSummary}
                </dd>
              </div>
              <div>
                <dt className="text-[#657382]">Voltage</dt>
                <dd className="mt-0.5 font-mono font-semibold text-[#101D2B] tabular-nums">
                  {entry.voltageMaxSummary}
                </dd>
              </div>
            </dl>

            <div className="relative z-20 mt-auto pt-5 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleOpenGroup(entry.id)}
                aria-expanded={false}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#0F766E] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#0D9488] transition-colors whitespace-nowrap cursor-pointer min-h-[40px]"
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Explore {entry.childCategories.length} Sub-Series</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                title={`Add ${entry.title} to RFQ`}
                aria-label={`Add ${entry.title} family to RFQ`}
                onClick={() =>
                  addToRfq({
                    id: 'DIN-RAIL-SERIES',
                    model: entry.seriesCode,
                    title: entry.title,
                    category: 'Product Family Inquiry',
                    specSummary: `${entry.wireRangeSummary} · Max ${entry.currentMaxSummary}`,
                  })
                }
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white p-2.5 text-[#0F172A] hover:border-[#0F766E] hover:text-[#0F766E] transition-colors cursor-pointer min-h-[40px] min-w-[40px]"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </GlowCard>
      </div>
    );
  };

  return (
    <section
      ref={sectionRef}
      id="products"
      className="bg-[#EEF2F6] border-y border-[#DCE2E8] px-4 sm:px-6 py-14 lg:py-20"
    >
      <div className="mx-auto max-w-[1280px] rounded-xl border border-[#DCE2E8] bg-white p-5 sm:p-8 lg:p-10 shadow-[0_14px_40px_rgba(16,29,43,0.05)]">
        <RevealBlock className="mb-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="font-mono text-xs font-semibold tracking-wide text-[#0F766E]">
                Find Your Terminal Block
              </p>
              <h2
                className={`mt-2 font-display font-extrabold tracking-tight text-[#101D2B] text-balance ${
                  compactHeading
                    ? 'text-2xl sm:text-3xl'
                    : 'text-3xl sm:text-4xl'
                }`}
              >
                Browse by Terminal Block Family or Rating
              </h2>
              <p className="mt-2.5 text-sm sm:text-base text-[#475569]">
                Pick a terminal block family below, choose your panel need, or search by part number, wire size, or current rating to find the exact block.
              </p>
            </div>

            {hasActiveFilters && !isFocusedMode && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="self-start lg:self-auto inline-flex items-center gap-1.5 rounded-lg border border-[#CBD5E1] bg-[#F5F7F9] px-3.5 py-2 text-xs font-semibold text-[#101D2B] hover:border-[#0F766E] hover:text-[#0F766E] transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Easy Customer Finder Toolbar */}
          {!isFocusedMode && (
            <div className="mt-6 rounded-lg border border-[#DCE2E8] bg-[#F5F7F9] p-3.5 sm:p-4 space-y-3">
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
                {/* Search Input */}
                <div className="lg:col-span-7 relative">
                  <label htmlFor="section-product-finder" className="sr-only">
                    Search terminal blocks by model, wire size, or rating
                  </label>
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#657382]" />
                  <input
                    id="section-product-finder"
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search model, wire size, or rating (e.g. TSC 4, TPC 5.08, TPL, 150 A)..."
                    className="w-full rounded-md border border-[#CBD5E1] bg-white pl-10 pr-9 py-2.5 text-sm text-[#101D2B] placeholder:text-slate-400 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15 focus:outline-none transition-colors"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      aria-label="Clear product search"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-[#64748B] hover:text-[#0F172A] cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Application Need Dropdown */}
                <div className="lg:col-span-5">
                  <label htmlFor="section-need-filter" className="sr-only">
                    Filter by application need
                  </label>
                  <select
                    id="section-need-filter"
                    value={needFilter}
                    onChange={(e) => setNeedFilter(e.target.value as NeedFilter)}
                    className="w-full rounded-md border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-[#0F172A] focus:border-[#0F766E] focus:outline-none transition-colors cursor-pointer"
                  >
                    {NEED_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        Need: {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Product Family Filter Tabs */}
              <div
                role="tablist"
                aria-label="Filter product families"
                className="flex flex-wrap items-center gap-1.5 border-t border-slate-200/80 pt-3"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeFilter === 'all'}
                  onClick={() => {
                    setActiveFilter('all');
                    setExpandedGroupId(null);
                    setExpandedCategoryId(null);
                  }}
                  className={`relative rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[34px] ${
                    activeFilter === 'all'
                      ? 'text-white'
                      : 'text-[#475569] hover:bg-[#EEF2F6] hover:text-[#0F172A]'
                  }`}
                >
                  {activeFilter === 'all' && (
                    <motion.span
                      layoutId="catalogFilterPill"
                      transition={{ type: 'spring', stiffness: 460, damping: 34 }}
                      className="absolute inset-0 rounded-md bg-[#0F766E]"
                    />
                  )}
                  <span className="relative z-10">
                    All Families ({topEntries.length})
                  </span>
                </button>
                {topEntries.map((entry) => {
                  const isTabActive = activeFilter === entry.id;
                  return (
                    <button
                      key={entry.id}
                      type="button"
                      role="tab"
                      aria-selected={isTabActive}
                      onClick={() => {
                        setActiveFilter(entry.id);
                        setExpandedGroupId(null);
                        setExpandedCategoryId(null);
                      }}
                      className={`relative rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[34px] ${
                        isTabActive
                          ? 'text-white'
                          : 'text-[#475569] hover:bg-[#EEF2F6] hover:text-[#0F172A]'
                      }`}
                    >
                      {isTabActive && (
                        <motion.span
                          layoutId="catalogFilterPill"
                          transition={{ type: 'spring', stiffness: 460, damping: 34 }}
                          className="absolute inset-0 rounded-md bg-[#0F766E]"
                        />
                      )}
                      <span className="relative z-10">{entry.shortTitle}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </RevealBlock>

        {/* Focused Single-Series Specs View OR Focused DIN Rail Parent Sub-Series View OR 4-Card Top Grid */}
        <AnimatePresence mode="wait">
          {expandedCategory ? (
            <motion.div
              key={`focused-${expandedCategory.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: INDUSTRIAL_EASE }}
              className="space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setExpandedCategoryId(null)}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-[#0F172A] hover:border-[#0F766E] hover:text-[#0F766E] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>
                    {expandedGroup
                      ? `Back to ${expandedGroup.title}`
                      : 'Back to All Families'}
                  </span>
                </button>
                <span className="text-xs font-medium text-[#64748B]">
                  Showing {expandedCategory.skus.length} models in {expandedCategory.title}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
                {/* Selected Product Card */}
                <div className="lg:col-span-4">
                  <GlowCard
                    as="article"
                    variant="elevated"
                    active
                    className="group w-full focus-within:ring-2 focus-within:ring-[#0F766E]/25"
                  >
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center justify-between gap-2 text-xs font-medium text-[#64748B]">
                        <span className="font-mono font-semibold text-[#0F766E]">
                          {expandedCategory.seriesCode}
                        </span>
                        <span>{expandedCategory.classification}</span>
                      </div>

                      <div className="mt-4 overflow-hidden rounded-md border border-slate-200 bg-[#F7F9FB] aspect-[4/3]">
                        <EngineeringImage
                          src={expandedCategory.image}
                          alt={expandedCategory.imageAlt}
                          fallbackTitle={expandedCategory.title}
                          className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                        />
                      </div>

                      <h3 className="mt-5 font-display text-xl font-bold tracking-tight text-[#0F172A] group-hover:text-[#0F766E] transition-colors">
                        <a
                          href={resolveAssetUrl(expandedCategory.slug)}
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(expandedCategory.slug);
                          }}
                          className="focus:outline-none after:absolute after:inset-0 after:z-10 after:content-['']"
                        >
                          {expandedCategory.title}
                        </a>
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                        {BEST_FOR_LABELS[expandedCategory.id] || expandedCategory.tagline}
                      </p>

                      <dl className="mt-5 grid grid-cols-3 gap-2.5 rounded-md border border-slate-100 bg-[#F7F9FB] p-3 text-xs">
                        <div>
                          <dt className="text-[#64748B]">Wire Size</dt>
                          <dd className="mt-0.5 font-mono font-semibold text-[#0F172A] tabular-nums">
                            {expandedCategory.wireRangeSummary}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[#64748B]">Max Current</dt>
                          <dd className="mt-0.5 font-mono font-semibold text-[#0F172A] tabular-nums">
                            {expandedCategory.currentMaxSummary}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[#64748B]">Voltage</dt>
                          <dd className="mt-0.5 font-mono font-semibold text-[#0F172A] tabular-nums">
                            {expandedCategory.voltageMaxSummary}
                          </dd>
                        </div>
                      </dl>

                      <div className="relative z-20 mt-auto pt-5 flex flex-wrap items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => navigate(expandedCategory.slug)}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#0F766E] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#0D9488] transition-colors whitespace-nowrap cursor-pointer min-h-[40px]"
                        >
                          <span>Full Series Page</span>
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleSpecs(expandedCategory.id)}
                          aria-expanded={true}
                          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#0F766E] bg-[#0F766E]/10 px-3.5 py-2.5 text-xs font-semibold text-[#0F766E] hover:bg-[#0F766E]/15 transition-colors whitespace-nowrap cursor-pointer min-h-[40px]"
                        >
                          <span>Hide Specs</span>
                          <ChevronUp className="h-3.5 w-3.5" />
                        </button>

                        <button
                          type="button"
                          title={`Add ${expandedCategory.title} to RFQ`}
                          aria-label={`Add ${expandedCategory.title} series to RFQ`}
                          onClick={() =>
                            addToRfq({
                              id: expandedCategory.seriesCode,
                              model: expandedCategory.seriesCode,
                              title: expandedCategory.title,
                              category: 'Series Inquiry',
                              specSummary: `${expandedCategory.wireRangeSummary} · Max ${expandedCategory.currentMaxSummary}`,
                            })
                          }
                          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white p-2.5 text-[#0F172A] hover:border-[#0F766E] hover:text-[#0F766E] transition-colors cursor-pointer min-h-[40px] min-w-[40px]"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </GlowCard>
                </div>

                {/* Specification Matrix Panel Replacing Hidden Containers */}
                <div className="lg:col-span-8 rounded-lg border border-slate-200 bg-white p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-5 border-b border-slate-200">
                    <div>
                      <div className="font-mono text-xs font-semibold text-[#0F766E]">
                        {expandedCategory.seriesCode} · {expandedCategory.railCompatibility}
                      </div>
                      <h3 className="mt-1 font-display text-xl font-bold text-[#0F172A]">
                        {expandedCategory.title} — All Models ({expandedCategory.skus.length})
                      </h3>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <button
                        type="button"
                        onClick={resetAllFilters}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-[#F7F9FB] px-3.5 py-2 text-xs font-semibold text-[#0F172A] hover:border-[#0F766E] hover:text-[#0F766E] transition-colors whitespace-nowrap cursor-pointer min-h-[38px]"
                      >
                        <span>All Families</span>
                      </button>
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate(expandedCategory.slug)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F766E] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0D9488] transition-colors whitespace-nowrap cursor-pointer min-h-[38px]"
                      >
                        <span>Learn How It Works</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </motion.button>
                    </div>
                  </div>

                  <SpecTable
                    skus={expandedCategory.skus}
                    categoryTitle={expandedCategory.title}
                    columns={2}
                    fallbackImage={expandedCategory.image}
                  />
                </div>
              </div>
            </motion.div>
          ) : expandedGroup ? (
            <motion.div
              key={`group-${expandedGroup.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: INDUSTRIAL_EASE }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <button
                    type="button"
                    onClick={() => setExpandedGroupId(null)}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-[#0F172A] hover:border-[#0F766E] hover:text-[#0F766E] transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to All Families</span>
                  </button>
                  <div className="mt-4">
                    <span className="font-mono text-xs font-semibold text-[#0F766E]">
                      {expandedGroup.seriesCode} · {expandedGroup.railCompatibility}
                    </span>
                    <h3 className="mt-1 font-display text-2xl font-bold text-[#101D2B]">
                      {expandedGroup.title} — {expandedGroup.childCategories.length} Sub-Series
                    </h3>
                    <p className="mt-1 text-sm text-[#475569]">
                      Select any DIN-rail connection technology below to view its models, ratings, and CAD/circuit specs.
                    </p>
                  </div>
                </div>
                <span className="font-mono text-xs font-semibold text-[#64748B] shrink-0">
                  {expandedGroup.totalModels} DIN Rail Models
                </span>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {expandedGroup.childCategories.map((cat) =>
                  renderCategorySubCard(cat, true)
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`grid-${activeFilter}-${needFilter}-${normalizedQuery}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: INDUSTRIAL_EASE }}
              className="space-y-8"
            >
              {/* Instant Matching SKUs Table when customer searches or picks Disconnect/Test */}
              {(normalizedQuery || needFilter === 'test-disconnect') && (
                <div className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
                    <div>
                      <p className="font-mono text-xs font-semibold text-[#0F766E]">
                        Direct Part Matches
                      </p>
                      <h3 className="mt-0.5 font-display text-lg font-bold text-[#0F172A]">
                        {matchingModels.length} Matching Terminal Block{' '}
                        {matchingModels.length === 1 ? 'Model' : 'Models'}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={resetAllFilters}
                      className="self-start sm:self-auto text-xs font-semibold text-[#0F766E] hover:text-[#0D9488] cursor-pointer"
                    >
                      Clear Search
                    </button>
                  </div>

                  {matchingModels.length > 0 ? (
                    <SpecTable
                      skus={matchingModels}
                      categoryTitle="Matched Products"
                    />
                  ) : (
                    <p className="text-sm text-[#475569]">
                      No models matched &ldquo;{searchQuery}&rdquo;. Try searching by wire size (e.g. <span className="font-mono text-[#0F172A]">4 mm²</span>), current (<span className="font-mono text-[#0F172A]">150 A</span>), or series (<span className="font-mono text-[#0F172A]">TSC</span>, <span className="font-mono text-[#0F172A]">TBC</span>, <span className="font-mono text-[#0F172A]">TPC</span>, <span className="font-mono text-[#0F172A]">TPL</span>).
                    </p>
                  )}
                </div>
              )}

              {visibleEntries.length > 0 ? (
                <StaggerGrid
                  key={`${activeFilter}-${needFilter}-${normalizedQuery}`}
                  className="grid grid-cols-1 gap-6 md:grid-cols-2"
                  stagger={0.07}
                  y={20}
                >
                  {visibleEntries.map((entry) => renderTopEntryCard(entry))}
                </StaggerGrid>
              ) : (
                <div className="rounded-lg border border-slate-200 bg-white p-10 text-center">
                  <h3 className="font-display text-lg font-bold text-[#0F172A]">
                    No Product Families Match That Filter
                  </h3>
                  <p className="mt-1.5 text-sm text-[#475569]">
                    Clear your search or switch back to all applications to view all {topEntries.length} terminal block families.
                  </p>
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#0F766E] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#0D9488] transition-colors cursor-pointer"
                  >
                    <span>Show All Product Families</span>
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
