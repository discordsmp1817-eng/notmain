import { useEffect, useRef, useState } from 'react';
import { Plus, Check, LayoutGrid, Table2 } from 'lucide-react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ProductSku, resolveAssetUrl } from '../data/termicoreData';
import { useApp } from '../context/AppContext';
import { getModelRoute } from '../utils/modelSpecifications';
import { EngineeringImage } from './EngineeringImage';
import { GlowCard, usePrefersReducedMotion } from './MotionPrimitives';

gsap.registerPlugin(ScrollTrigger);

interface SpecTableProps {
  skus: ProductSku[];
  categoryTitle: string;
  torqueColumnLabel?: string;
  columns?: 2 | 3;
  fallbackImage?: string;
  viewMode?: 'cards' | 'table';
  onViewModeChange?: (mode: 'cards' | 'table') => void;
  hideToolbar?: boolean;
}

export function SpecTable({
  skus,
  categoryTitle,
  torqueColumnLabel = 'Torque / Strip',
  columns = 3,
  fallbackImage,
  viewMode: controlledViewMode,
  onViewModeChange,
  hideToolbar = false,
}: SpecTableProps) {
  const { rfqItems, addToRfq, navigate } = useApp();
  const [internalViewMode, setInternalViewMode] = useState<'cards' | 'table'>('cards');
  const viewMode = controlledViewMode ?? internalViewMode;
  const setViewMode = (mode: 'cards' | 'table') => {
    if (onViewModeChange) {
      onViewModeChange(mode);
    } else {
      setInternalViewMode(mode);
    }
  };
  const gridRef = useRef<HTMLDivElement>(null);
  const tbodyRef = useRef<HTMLTableSectionElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    if (viewMode === 'cards') {
      const container = gridRef.current;
      if (!container) return;
      const ctx = gsap.context(() => {
        const cards = container.querySelectorAll('[data-model-card]');
        if (!cards.length) return;
        gsap.fromTo(
          cards,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.42,
            stagger: 0.04,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
            scrollTrigger: {
              trigger: container,
              start: 'top 92%',
              once: true,
            },
          }
        );
      }, gridRef);
      return () => ctx.revert();
    }

    const tbody = tbodyRef.current;
    if (!tbody) return;
    const ctx = gsap.context(() => {
      const rows = tbody.querySelectorAll('tr');
      if (!rows.length) return;
      gsap.fromTo(
        rows,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.42,
          stagger: 0.03,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: tbody,
            start: 'top 90%',
            once: true,
          },
        }
      );
    }, tbodyRef);

    return () => ctx.revert();
  }, [skus, viewMode, reducedMotion]);

  const gridColsClass =
    columns === 2
      ? 'grid-cols-1 md:grid-cols-2'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <div className="space-y-4">
      {/* Compact View Switcher */}
      {!hideToolbar && (
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-medium text-[#64748B]">
            {skus.length} individual {skus.length === 1 ? 'model' : 'models'}
          </span>
          <div
            role="group"
            aria-label="Specification display mode"
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-[#F7F9FB] p-1"
          >
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              aria-pressed={viewMode === 'cards'}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-[#0F766E] text-white'
                  : 'text-[#475569] hover:text-[#0F172A]'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Model Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              aria-pressed={viewMode === 'table'}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[#0F766E] text-white'
                  : 'text-[#475569] hover:text-[#0F172A]'
              }`}
            >
              <Table2 className="h-3.5 w-3.5" />
              <span>Table</span>
            </button>
          </div>
        </div>
      )}

      {viewMode === 'cards' ? (
        <div ref={gridRef} className={`grid gap-4 ${gridColsClass}`}>
          {skus.map((sku) => {
            const inRfq = rfqItems.some((item) => item.id === sku.model);
            const cardImage = sku.image || fallbackImage;
            const modelRoute = getModelRoute(sku.model);
            return (
              <div key={sku.model} data-model-card className="flex">
                <GlowCard
                  as="article"
                  variant="light"
                  active={inRfq}
                  className="group w-full p-5 flex flex-col justify-between bg-[#F7F9FB] hover:-translate-y-1 focus-within:border-[#0F766E] focus-within:ring-2 focus-within:ring-[#0F766E]/20"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono text-sm font-bold text-[#0F766E]">
                        {sku.model}
                      </span>
                      <span className="text-[11px] font-medium text-[#64748B] text-right">
                        {sku.connectionType}
                      </span>
                    </div>

                    {cardImage && (
                      <div className="relative mt-3 overflow-hidden rounded-md border border-[#DCE2E8] bg-white aspect-[4/3]">
                        <EngineeringImage
                          src={cardImage}
                          alt={`${sku.name} (${sku.model})`}
                          fallbackTitle={sku.model}
                          className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                        />
                        <div className="pointer-events-none absolute bottom-2 left-2 rounded border border-[#DCE2E8] bg-white/95 px-2 py-0.5 font-mono text-[11px] font-semibold text-[#101D2B] shadow-2xs backdrop-blur-xs">
                          {sku.wireRangeIec} · {sku.currentRating}
                        </div>
                      </div>
                    )}

                    <h4 className="mt-3.5 font-display text-base font-bold text-[#101D2B] leading-snug group-hover:text-[#0F766E] transition-colors">
                      <a
                        href={resolveAssetUrl(modelRoute)}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(modelRoute);
                        }}
                        className="focus:outline-none after:absolute after:inset-0 after:z-10 after:content-['']"
                      >
                        {sku.name}
                      </a>
                    </h4>

                    {/* Key Electrical & Mechanical Spec Grid */}
                    <dl className="mt-4 grid grid-cols-2 gap-2.5 rounded-md border border-[#DCE2E8] bg-white p-3 text-xs">
                      <div>
                        <dt className="text-[11px] text-[#64748B]">Wire Size (IEC)</dt>
                        <dd className="mt-0.5 font-mono font-semibold text-[#0F172A] tabular-nums">
                          {sku.wireRangeIec}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[11px] text-[#64748B]">Current Rating</dt>
                        <dd className="mt-0.5 font-mono font-semibold text-[#0F172A] tabular-nums">
                          {sku.currentRating}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[11px] text-[#64748B]">Voltage Rating</dt>
                        <dd className="mt-0.5 font-mono font-semibold text-[#0F172A] tabular-nums">
                          {sku.voltageRating}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[11px] text-[#64748B]">Width / Frame</dt>
                        <dd className="mt-0.5 font-mono font-semibold text-[#0F172A] tabular-nums">
                          {sku.widthOrPitch || '—'}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[11px] text-[#64748B]">{torqueColumnLabel}</dt>
                        <dd className="mt-0.5 font-mono font-semibold text-[#475569] tabular-nums">
                          {sku.torqueOrStrip || '—'}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[11px] text-[#64748B]">Mounting</dt>
                        <dd className="mt-0.5 font-medium text-[#475569]">
                          {sku.mounting}
                        </dd>
                      </div>
                    </dl>

                    {(sku.wireRangeUl || sku.approvals.length > 0) && (
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#64748B]">
                        {sku.wireRangeUl && (
                          <span className="font-mono text-[#475569]">
                            {sku.wireRangeUl}
                          </span>
                        )}
                        <span className="font-medium text-[#0F766E]">
                          {sku.approvals.join(' · ')}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="relative z-20 mt-4 pt-3 border-t border-slate-200/80">
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      onClick={() =>
                        addToRfq({
                          id: sku.model,
                          model: sku.model,
                          title: sku.name,
                          category: categoryTitle,
                          specSummary: `${sku.wireRangeIec} · ${sku.currentRating} · ${sku.voltageRating}`,
                        })
                      }
                      className={`w-full inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer min-h-[38px] ${
                        inRfq
                          ? 'border border-[#0F766E]/40 bg-[#0F766E]/10 text-[#0F766E] hover:bg-[#0F766E]/15'
                          : 'bg-[#0F766E] text-white hover:bg-[#0D9488]'
                      }`}
                    >
                      {inRfq ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>Added to RFQ</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-3.5 w-3.5" />
                          <span>Add Model to RFQ</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </GlowCard>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[#DCE2E8] bg-white shadow-2xs">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-[#EEF2F6] text-[#101D2B] border-b border-[#DCE2E8]">
                <th className="sticky left-0 z-10 bg-[#EEF2F6] px-3 py-3 font-display text-xs font-bold tracking-wide text-[#0F766E] whitespace-nowrap border-r border-[#DCE2E8]">
                  Model / Cat No.
                </th>
                <th className="px-3 py-3 font-display text-xs font-bold tracking-wide whitespace-nowrap">
                  Type
                </th>
                <th className="px-3 py-3 font-display text-xs font-bold tracking-wide whitespace-nowrap">
                  Wire Range (IEC)
                </th>
                <th className="px-3 py-3 font-display text-xs font-bold tracking-wide whitespace-nowrap">
                  UL / Notes
                </th>
                <th className="px-3 py-3 font-display text-xs font-bold tracking-wide whitespace-nowrap">
                  Current
                </th>
                <th className="px-3 py-3 font-display text-xs font-bold tracking-wide whitespace-nowrap">
                  Voltage
                </th>
                <th className="px-3 py-3 font-display text-xs font-bold tracking-wide whitespace-nowrap">
                  Width / Pitch
                </th>
                <th className="px-3 py-3 font-display text-xs font-bold tracking-wide whitespace-nowrap">
                  {torqueColumnLabel}
                </th>
                <th className="px-3 py-3 font-display text-xs font-bold tracking-wide whitespace-nowrap">
                  Mounting
                </th>
                <th className="sticky right-0 z-10 bg-[#EEF2F6] px-3 py-3 text-right font-display text-xs font-bold tracking-wide whitespace-nowrap border-l border-[#DCE2E8]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody ref={tbodyRef} className="divide-y divide-[#DCE2E8]">
              {skus.map((sku) => {
                const inRfq = rfqItems.some((item) => item.id === sku.model);
                const modelRoute = getModelRoute(sku.model);
                return (
                  <tr
                    key={sku.model}
                    className="group odd:bg-white even:bg-[#F5F7F9] hover:bg-[#EEF2F6]/80 transition-colors duration-150"
                  >
                    <td className="sticky left-0 z-10 bg-white group-even:bg-[#F5F7F9] group-hover:bg-[#EEF2F6] transition-colors px-3 py-3 font-mono text-xs font-bold text-[#0F766E] whitespace-nowrap border-r border-[#DCE2E8]">
                      <a
                        href={resolveAssetUrl(modelRoute)}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(modelRoute);
                        }}
                        className="hover:underline focus:outline-none focus:underline"
                      >
                        {sku.model}
                      </a>
                    </td>
                    <td className="px-3 py-3 text-xs font-medium text-[#101D2B] whitespace-nowrap">
                      {sku.connectionType}
                    </td>
                    <td className="px-3 py-3 font-mono text-xs text-[#475569] tabular-nums whitespace-nowrap">
                      {sku.wireRangeIec}
                    </td>
                    <td className="px-3 py-3 font-mono text-xs text-[#657382] tabular-nums whitespace-nowrap">
                      {sku.wireRangeUl || '—'}
                    </td>
                    <td className="px-3 py-3 font-mono text-xs font-bold text-[#101D2B] tabular-nums whitespace-nowrap">
                      {sku.currentRating}
                    </td>
                    <td className="px-3 py-3 font-mono text-xs font-semibold text-[#202B36] tabular-nums whitespace-nowrap">
                      {sku.voltageRating}
                    </td>
                    <td className="px-3 py-3 font-mono text-xs text-[#475569] tabular-nums whitespace-nowrap">
                      {sku.widthOrPitch || '—'}
                    </td>
                    <td className="px-3 py-3 font-mono text-xs text-[#475569] tabular-nums whitespace-nowrap">
                      {sku.torqueOrStrip || '—'}
                    </td>
                    <td className="px-3 py-3 text-xs text-[#475569] whitespace-nowrap">
                      {sku.mounting}
                    </td>
                    <td className="sticky right-0 z-10 bg-white group-even:bg-[#F5F7F9] group-hover:bg-[#EEF2F6] transition-colors px-3 py-3 text-right whitespace-nowrap border-l border-[#DCE2E8]">
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.96 }}
                        onClick={() =>
                          addToRfq({
                            id: sku.model,
                            model: sku.model,
                            title: sku.name,
                            category: categoryTitle,
                            specSummary: `${sku.wireRangeIec} · ${sku.currentRating} · ${sku.voltageRating}`,
                          })
                        }
                        className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                          inRfq
                            ? 'border border-[#0F766E]/40 bg-[#0F766E]/10 text-[#0F766E] hover:bg-[#0F766E]/15'
                            : 'bg-[#101D2B] text-white hover:bg-[#0F766E]'
                        }`}
                      >
                        {inRfq ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            <span>In RFQ</span>
                          </>
                        ) : (
                          <>
                            <Plus className="h-3.5 w-3.5" />
                            <span>Add to RFQ</span>
                          </>
                        )}
                      </motion.button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
