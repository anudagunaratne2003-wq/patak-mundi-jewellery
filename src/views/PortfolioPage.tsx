'use client';

import { useEffect, useMemo, useState } from 'react';
import { SlidersHorizontal, X, Search, Check, Sparkles } from 'lucide-react';
import { CATEGORIES, COLLECTIONS } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import { useProducts } from '@/store/ProductsContext';
import { openDesignChat } from '@/lib/designChat';

const ALL_CATEGORIES = CATEGORIES.map((c) => c.name);
const ALL_COLLECTIONS = COLLECTIONS.map((c) => c.name);

export function PortfolioPage({
  initialCategory,
  initialCollection,
}: {
  initialCategory?: string;
  initialCollection?: string;
}) {
  const { products: PRODUCTS } = useProducts();
  const [categories, setCategories] = useState<Set<string>>(
    initialCategory ? new Set([initialCategory]) : new Set()
  );
  const [materials, setMaterials] = useState<Set<string>>(new Set());
  const [gemstones, setGemstones] = useState<Set<string>>(new Set());
  const [collections, setCollections] = useState<Set<string>>(
    initialCollection ? new Set([initialCollection]) : new Set()
  );
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (initialCategory) setCategories(new Set([initialCategory]));
  }, [initialCategory]);

  useEffect(() => {
    if (initialCollection) setCollections(new Set([initialCollection]));
  }, [initialCollection]);

  // Material / gemstone filter options come from whatever is in the portfolio.
  const allMaterials = useMemo(
    () => Array.from(new Set(PRODUCTS.map((p) => p.material).filter((m): m is string => !!m))).sort(),
    [PRODUCTS]
  );
  const allGemstones = useMemo(
    () => Array.from(new Set(PRODUCTS.map((p) => p.gemstone ?? 'None'))).sort(),
    [PRODUCTS]
  );

  const toggle = (set: Set<string>, value: string, setter: (s: Set<string>) => void) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      if (categories.size && !categories.has(p.category)) return false;
      if (materials.size && !materials.has(p.material ?? '')) return false;
      if (gemstones.size && !gemstones.has(p.gemstone ?? 'None')) return false;
      if (collections.size && !collections.has(p.collection ?? '')) return false;
      if (
        q &&
        !p.name.toLowerCase().includes(q) &&
        !p.category.toLowerCase().includes(q) &&
        !(p.collection ?? '').toLowerCase().includes(q) &&
        !(p.gemstone ?? '').toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [PRODUCTS, categories, materials, gemstones, collections, search]);

  const activeCount = categories.size + materials.size + gemstones.size + collections.size;

  const clearAll = () => {
    setCategories(new Set());
    setMaterials(new Set());
    setGemstones(new Set());
    setCollections(new Set());
    setSearch('');
  };

  const FilterSection = ({
    title,
    options,
    selected,
    onToggle,
  }: {
    title: string;
    options: string[];
    selected: Set<string>;
    onToggle: (v: string) => void;
  }) => (
    <div className="border-b border-charcoal-100 py-5">
      <h4 className="text-xs font-medium uppercase tracking-widest text-charcoal-800">
        {title}
      </h4>
      <ul className="mt-3 space-y-2.5">
        {options.map((opt) => (
          <li key={opt}>
            <button
              type="button"
              onClick={() => onToggle(opt)}
              className="group flex items-center gap-2.5 text-sm text-charcoal-600 transition-colors hover:text-charcoal-900"
            >
              <span
                className={`flex h-4 w-4 items-center justify-center border transition-colors ${
                  selected.has(opt)
                    ? 'border-champagne-500 bg-champagne-500'
                    : 'border-charcoal-300 group-hover:border-champagne-400'
                }`}
              >
                {selected.has(opt) && <Check size={12} className="text-white" />}
              </span>
              {opt === 'None' ? 'No Gemstone' : opt}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  const FilterPanel = () => (
    <div>
      <FilterSection
        title="Piece"
        options={ALL_CATEGORIES}
        selected={categories}
        onToggle={(v) => toggle(categories, v, setCategories)}
      />
      <FilterSection
        title="Material"
        options={allMaterials}
        selected={materials}
        onToggle={(v) => toggle(materials, v, setMaterials)}
      />
      <FilterSection
        title="Gemstone"
        options={allGemstones}
        selected={gemstones}
        onToggle={(v) => toggle(gemstones, v, setGemstones)}
      />
      {ALL_COLLECTIONS.length > 0 && (
        <FilterSection
          title="Collection"
          options={ALL_COLLECTIONS}
          selected={collections}
          onToggle={(v) => toggle(collections, v, setCollections)}
        />
      )}
    </div>
  );

  return (
    <div className="animate-fade-in">
      {/* Page header */}
      <div className="border-b border-charcoal-100 bg-ivory-100">
        <div className="container-lux py-12 text-center lg:py-16">
          <p className="text-xs uppercase tracking-ultra text-champagne-600">The Portfolio</p>
          <h1 className="mt-3 font-serif text-4xl text-charcoal-900 lg:text-5xl">
            Pieces We've Designed
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm font-light text-charcoal-500">
            Every piece here was designed for one client and made only once. Browse for
            inspiration — then tell us what you have in mind and we'll design yours.
          </p>
        </div>
      </div>

      <div className="container-lux py-10">
        <div className="flex gap-10">
          {/* Sidebar filters */}
          <aside className="hidden w-60 shrink-0 lg:block">
            <div className="sticky top-28">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg text-charcoal-900">Refine</h3>
                {activeCount > 0 && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-xs text-champagne-600 transition-colors hover:text-champagne-700"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="mt-4">
                <FilterPanel />
              </div>
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col gap-4 border-b border-charcoal-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative max-w-xs flex-1">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search the portfolio…"
                  className="w-full border border-charcoal-200 bg-white py-2.5 pl-10 pr-4 text-sm text-charcoal-800 placeholder:text-charcoal-400 focus:border-champagne-400 focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-2 self-start border border-charcoal-200 px-4 py-2.5 text-xs font-medium uppercase tracking-widest text-charcoal-700 transition-colors hover:border-champagne-400 lg:hidden"
              >
                <SlidersHorizontal size={15} /> Refine
                {activeCount > 0 && (
                  <span className="bg-champagne-500 px-1.5 text-[10px] text-white">
                    {activeCount}
                  </span>
                )}
              </button>
            </div>

            <p className="mt-4 text-sm text-charcoal-500">
              {filtered.length} commission{filtered.length === 1 ? '' : 's'}
            </p>

            {filtered.length === 0 ? (
              <div className="mt-20 flex flex-col items-center text-center">
                <p className="font-serif text-2xl text-charcoal-700">Nothing quite like that yet</p>
                <p className="mt-2 max-w-sm text-sm text-charcoal-400">
                  We haven't made this one before — which means it could be yours first.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => openDesignChat()}
                    className="flex items-center justify-center gap-2 bg-charcoal-900 px-6 py-3 text-xs font-medium uppercase tracking-widest text-ivory-50 transition-colors hover:bg-champagne-500"
                  >
                    <Sparkles size={14} /> Design It With Us
                  </button>
                  <button
                    type="button"
                    onClick={clearAll}
                    className="border border-charcoal-300 px-6 py-3 text-xs font-medium uppercase tracking-widest text-charcoal-700 transition-colors hover:border-champagne-400 hover:text-champagne-700"
                  >
                    Clear filters
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            )}

            {/* Custom-design prompt */}
            <div className="mt-20 flex flex-col items-center gap-5 border border-charcoal-100 bg-ivory-100 px-6 py-12 text-center">
              <p className="text-xs uppercase tracking-ultra text-champagne-600">Your Turn</p>
              <h2 className="font-serif text-3xl text-charcoal-900">
                None of these are for sale — yours will be made just for you.
              </h2>
              <p className="max-w-lg text-sm font-light text-charcoal-500">
                Share a sketch, a photo, or just a feeling. Our designer will work with you one-on-one
                until it's exactly right.
              </p>
              <button
                type="button"
                onClick={() => openDesignChat()}
                className="flex items-center gap-2 bg-charcoal-900 px-8 py-4 text-xs font-medium uppercase tracking-widest text-ivory-50 transition-colors hover:bg-champagne-500"
              >
                <Sparkles size={15} /> Start Your Design
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div
            className="absolute inset-0 bg-charcoal-900/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto bg-ivory-50 shadow-2xl animate-slide-in-right">
            <div className="flex items-center justify-between border-b border-charcoal-100 p-5">
              <h3 className="font-serif text-xl text-charcoal-900">Refine</h3>
              <button
                type="button"
                onClick={() => setShowFilters(false)}
                className="text-charcoal-500"
                aria-label="Close filters"
              >
                <X size={24} />
              </button>
            </div>
            <div className="px-5">
              <FilterPanel />
            </div>
            <div className="sticky bottom-0 flex gap-3 border-t border-charcoal-100 bg-ivory-50 p-5">
              <button
                type="button"
                onClick={clearAll}
                className="flex-1 border border-charcoal-300 py-3 text-xs font-medium uppercase tracking-widest text-charcoal-700"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={() => setShowFilters(false)}
                className="flex-1 bg-charcoal-900 py-3 text-xs font-medium uppercase tracking-widest text-ivory-50"
              >
                Show {filtered.length}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
