import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Globe, Plus, Search, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { INDUSTRIAL_EASE } from './MotionPrimitives';
import {
  CatalogSearchItem,
  CountryEntry,
  QUANTITY_PRESETS,
  isPresetQuantity,
  searchCatalogProducts,
  searchCountries,
  splitHighlightParts,
} from '../utils/quoteAutocomplete';
import { RfqItem } from '../context/AppContext';

const INPUT_CLASS =
  'w-full rounded-md border border-[#CBD5E1] bg-[#F5F7F9] px-3.5 py-2.5 text-sm text-[#101D2B] placeholder:text-slate-400 hover:border-[#94A3B8] focus:border-[#0F766E] focus:bg-white focus:ring-2 focus:ring-[#0F766E]/15 focus:outline-none transition-colors';

function HighlightedText({
  text,
  query,
}: {
  text: string;
  query: string;
}) {
  const parts = useMemo(() => splitHighlightParts(text, query), [text, query]);
  return (
    <>
      {parts.map((part, idx) =>
        part.match ? (
          <mark
            key={`${idx}-${part.text}`}
            className="bg-[#0F766E]/15 text-[#0F766E] font-semibold rounded-[2px] px-0.5"
          >
            {part.text}
          </mark>
        ) : (
          <React.Fragment key={`${idx}-${part.text}`}>{part.text}</React.Fragment>
        )
      )}
    </>
  );
}

interface ProductAutocompleteProps {
  selectedItems: RfqItem[];
  defaultQuantity: number;
  onSelectProduct: (item: CatalogSearchItem) => void;
}

export function ProductAutocomplete({
  selectedItems,
  defaultQuantity,
  onSelectProduct,
}: ProductAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lastAddedModel, setLastAddedModel] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listboxId = useId();
  const shouldReduce = useReducedMotion();

  const matches = useMemo(() => searchCatalogProducts(query, 12), [query]);

  const selectedQuantityMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of selectedItems) {
      map.set(item.id, item.quantity);
    }
    return map;
  }, [selectedItems]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !listRef.current) return;
    const activeEl = listRef.current.querySelector<HTMLElement>(
      `[data-option-index="${activeIndex}"]`
    );
    activeEl?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, isOpen]);

  const handleChoose = (item: CatalogSearchItem) => {
    onSelectProduct(item);
    setLastAddedModel(item.model);
    setQuery('');
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        return;
      }
      if (matches.length > 0) {
        setActiveIndex((prev) => (prev + 1) % matches.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        return;
      }
      if (matches.length > 0) {
        setActiveIndex((prev) => (prev - 1 + matches.length) % matches.length);
      }
    } else if (e.key === 'Enter') {
      if (isOpen && matches[activeIndex]) {
        e.preventDefault();
        handleChoose(matches[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      if (isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    }
  };

  return (
    <div ref={containerRef} className={`relative ${isOpen ? 'z-40' : 'z-10'}`}>
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <label
          htmlFor="quote-product-search"
          className="block text-xs font-semibold text-[#475569]"
        >
          Search &amp; Add Products (Model, Name, or Category)
        </label>
        {lastAddedModel && (
          <span className="text-[11px] font-medium text-[#0F766E]">
            Added {lastAddedModel} ({defaultQuantity.toLocaleString()} pcs)
          </span>
        )}
      </div>

      <div className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]"
        />
        <input
          ref={inputRef}
          id="quote-product-search"
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            isOpen && matches[activeIndex]
              ? `${listboxId}-opt-${activeIndex}`
              : undefined
          }
          value={query}
          onFocus={() => setIsOpen(true)}
          onClick={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setLastAddedModel(null);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Type SKU, product name, or category (e.g. TSC 2.5, TBC 70, Spring Cage)..."
          className={`${INPUT_CLASS} pl-9 pr-9`}
        />
        {query ? (
          <button
            type="button"
            aria-label="Clear product search"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setQuery('');
              setIsOpen(true);
              inputRef.current?.focus();
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#64748B] hover:text-[#0F172A] cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : (
          <button
            type="button"
            aria-label="Toggle product suggestions"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setIsOpen((prev) => !prev);
              inputRef.current?.focus();
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#64748B] hover:text-[#0F172A] cursor-pointer"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-150 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={shouldReduce ? { opacity: 1 } : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={{ duration: 0.16, ease: INDUSTRIAL_EASE }}
            className="absolute z-30 mt-1.5 w-full rounded-md border border-slate-200 bg-white shadow-lg overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-slate-100 bg-[#F7F9FB] px-3 py-1.5 text-[11px] text-[#64748B]">
              <span>
                {query.trim()
                  ? `${matches.length} matching TermiCore ${matches.length === 1 ? 'product' : 'products'}`
                  : 'TermiCore Catalog — Select multiple items to add'}
              </span>
              <span className="hidden sm:inline font-mono">↑↓ Navigate · Enter Add</span>
            </div>

            {matches.length > 0 ? (
              <ul
                ref={listRef}
                id={listboxId}
                role="listbox"
                aria-label="TermiCore matching products"
                data-lenis-prevent
                className="max-h-64 overflow-y-auto divide-y divide-slate-100"
              >
                {matches.map((item, idx) => {
                  const isActive = idx === activeIndex;
                  const existingQty = selectedQuantityMap.get(item.id);
                  return (
                    <li
                      key={item.id}
                      id={`${listboxId}-opt-${idx}`}
                      data-option-index={idx}
                      role="option"
                      aria-selected={isActive}
                      onMouseEnter={() => setActiveIndex(idx)}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleChoose(item)}
                      className={`flex items-center justify-between gap-3 px-3.5 py-2.5 text-left transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#0F766E]/[0.07]'
                          : 'bg-white hover:bg-[#F7F9FB]'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="font-mono text-xs font-semibold text-[#0F766E] shrink-0">
                            <HighlightedText text={item.model} query={query} />
                          </span>
                          <span className="text-sm font-medium text-[#0F172A] truncate">
                            <HighlightedText text={item.name} query={query} />
                          </span>
                        </div>
                        <div className="mt-0.5 text-xs text-[#64748B] truncate">
                          <HighlightedText text={item.category} query={query} />
                          {item.specSummary && (
                            <>
                              <span className="mx-1.5 text-slate-300">·</span>
                              <span className="font-mono text-[11px]">{item.specSummary}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-1.5 text-xs font-semibold">
                        {existingQty ? (
                          <span className="inline-flex items-center gap-1 text-[#0F766E]">
                            <Check className="h-3.5 w-3.5" />
                            <span className="tabular-nums">Added ({existingQty})</span>
                          </span>
                        ) : (
                          <span
                            className={`inline-flex items-center gap-1 ${
                              isActive ? 'text-[#0F766E]' : 'text-[#475569]'
                            }`}
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Add</span>
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="px-4 py-4 text-xs text-[#64748B]">
                No matching products in the TermiCore catalogue for &ldquo;{query.trim()}&rdquo;. Try searching by series (`TSC`, `TSC-R`, `TSS`, `TBC`, `TNC`), wire range, or accessory (`EP Series`, `Jumper`).
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface QuantitySelectorProps {
  quantity: number;
  isCustomMode: boolean;
  onSelectPreset: (value: number) => void;
  onEnableCustom: () => void;
  onChangeQuantity: (value: number) => void;
}

export function QuantitySelector({
  quantity,
  isCustomMode,
  onSelectPreset,
  onEnableCustom,
  onChangeQuantity,
}: QuantitySelectorProps) {
  const customInputRef = useRef<HTMLInputElement>(null);
  const customActive = isCustomMode || !isPresetQuantity(quantity);

  return (
    <div className="relative z-0">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <label
          htmlFor="quote-quantity"
          className="block text-xs font-semibold text-[#475569]"
        >
          Order Quantity (pcs)
        </label>
        <span className="font-mono text-[11px] text-[#64748B] tabular-nums">
          Selected: {quantity > 0 ? quantity.toLocaleString() : 'Custom'} pcs
        </span>
      </div>

      <div
        role="group"
        aria-label="Quantity suggestions"
        className="flex flex-wrap gap-2"
      >
        {QUANTITY_PRESETS.map((preset) => {
          const active = !customActive && quantity === preset;
          return (
            <button
              key={preset}
              type="button"
              aria-pressed={active}
              onClick={() => onSelectPreset(preset)}
              className={`min-h-[40px] flex-1 min-w-[68px] rounded-md border px-3 py-2 font-mono text-xs font-semibold tabular-nums whitespace-nowrap transition-colors cursor-pointer ${
                active
                  ? 'border-[#0F766E] bg-[#0F766E] text-white shadow-xs'
                  : 'border-slate-300 bg-[#F7F9FB] text-[#0F172A] hover:border-[#0F766E] hover:bg-white hover:text-[#0F766E]'
              }`}
            >
              {preset.toLocaleString()}
            </button>
          );
        })}

        <button
          type="button"
          aria-pressed={customActive}
          onClick={() => {
            onEnableCustom();
            requestAnimationFrame(() => customInputRef.current?.focus());
          }}
          className={`min-h-[40px] flex-1 sm:flex-none rounded-md border px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            customActive
              ? 'border-[#0F766E] bg-[#0F766E] text-white shadow-xs'
              : 'border-slate-300 bg-[#F7F9FB] text-[#0F172A] hover:border-[#0F766E] hover:bg-white hover:text-[#0F766E]'
          }`}
        >
          Custom Quantity
        </button>
      </div>

      <div className="mt-2.5 flex items-center gap-3">
        <input
          ref={customInputRef}
          id="quote-quantity"
          type="number"
          min={1}
          max={10000000}
          inputMode="numeric"
          value={quantity > 0 ? quantity : ''}
          onChange={(e) => {
            const parsed = parseInt(e.target.value, 10);
            onChangeQuantity(Number.isNaN(parsed) ? 0 : Math.max(0, parsed));
          }}
          placeholder="Enter custom quantity (e.g. 250, 2500)"
          className={`${INPUT_CLASS} font-mono tabular-nums`}
        />
      </div>
    </div>
  );
}

interface CountryAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
}

export function CountryAutocomplete({ value, onChange }: CountryAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listboxId = useId();
  const shouldReduce = useReducedMotion();

  const matches = useMemo(() => searchCountries(value, 10), [value]);

  useEffect(() => {
    setActiveIndex(0);
  }, [value]);

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !listRef.current) return;
    const activeEl = listRef.current.querySelector<HTMLElement>(
      `[data-option-index="${activeIndex}"]`
    );
    activeEl?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, isOpen]);

  const handleSelectCountry = (entry: CountryEntry) => {
    onChange(entry.name);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        return;
      }
      if (matches.length > 0) {
        setActiveIndex((prev) => (prev + 1) % matches.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        return;
      }
      if (matches.length > 0) {
        setActiveIndex((prev) => (prev - 1 + matches.length) % matches.length);
      }
    } else if (e.key === 'Enter') {
      if (isOpen && matches[activeIndex]) {
        e.preventDefault();
        handleSelectCountry(matches[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      if (isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    }
  };

  return (
    <div ref={containerRef} className={`relative ${isOpen ? 'z-40' : 'z-10'}`}>
      <label
        htmlFor="quote-country"
        className="block text-xs font-semibold text-[#475569] mb-1.5"
      >
        Country / Delivery Region
      </label>

      <div className="relative">
        <Globe
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]"
        />
        <input
          ref={inputRef}
          id="quote-country"
          type="text"
          role="combobox"
          autoComplete="off"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            isOpen && matches[activeIndex]
              ? `${listboxId}-opt-${activeIndex}`
              : undefined
          }
          value={value}
          onFocus={() => setIsOpen(true)}
          onClick={() => setIsOpen(true)}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search country (e.g. India, Germany, United States)..."
          className={`${INPUT_CLASS} pl-9 pr-9`}
        />
        {value ? (
          <button
            type="button"
            aria-label="Clear country"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              onChange('');
              setIsOpen(true);
              inputRef.current?.focus();
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#64748B] hover:text-[#0F172A] cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : (
          <button
            type="button"
            aria-label="Toggle country list"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setIsOpen((prev) => !prev);
              inputRef.current?.focus();
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#64748B] hover:text-[#0F172A] cursor-pointer"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-150 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={shouldReduce ? { opacity: 1 } : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={{ duration: 0.16, ease: INDUSTRIAL_EASE }}
            className="absolute z-30 mt-1.5 w-full rounded-md border border-slate-200 bg-white shadow-lg overflow-hidden"
          >
            {matches.length > 0 ? (
              <ul
                ref={listRef}
                id={listboxId}
                role="listbox"
                aria-label="Country suggestions"
                data-lenis-prevent
                className="max-h-56 overflow-y-auto divide-y divide-slate-100"
              >
                {matches.map((country, idx) => {
                  const isActive = idx === activeIndex;
                  const isSelected =
                    value.trim().toLowerCase() === country.name.toLowerCase();
                  return (
                    <li
                      key={country.code}
                      id={`${listboxId}-opt-${idx}`}
                      data-option-index={idx}
                      role="option"
                      aria-selected={isActive || isSelected}
                      onMouseEnter={() => setActiveIndex(idx)}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSelectCountry(country)}
                      className={`flex items-center justify-between gap-2 px-3.5 py-2 text-sm cursor-pointer transition-colors ${
                        isActive
                          ? 'bg-[#0F766E]/[0.07] text-[#0F172A]'
                          : 'bg-white text-[#0F172A] hover:bg-[#F7F9FB]'
                      }`}
                    >
                      <span className="truncate">
                        <HighlightedText text={country.name} query={value} />
                      </span>
                      <span className="font-mono text-[11px] text-[#64748B] shrink-0">
                        {isSelected ? (
                          <Check className="h-3.5 w-3.5 text-[#0F766E]" />
                        ) : (
                          country.code
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="px-4 py-3 text-xs text-[#64748B]">
                No countries found matching &ldquo;{value.trim()}&rdquo;.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
