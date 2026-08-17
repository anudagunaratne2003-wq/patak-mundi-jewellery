'use client';

import { useEffect, useMemo, useState } from 'react';
import { SlidersHorizontal, X, Search, Check } from 'lucide-react';
import {
  PRODUCTS,
  type Category,
  type Collection,
  type Gemstone,
  type Material,
} from '@/data/products';
import { ProductCard } from '@/components/ProductCard';

const ALL_CATEGORIES: Category[] = ['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Watches'];
const ALL_MATERIALS: Material[] = ['18k Gold', 'Platinum', 'Sterling Silver', 'Rose Gold', 'White Gold'];
const ALL_GEMSTONES: Gemstone[] = ['Diamond', 'Sapphire', 'Emerald', 'Pearl', 'Ruby', 'None'];
const ALL_COLLECTIONS: Collection[] = [
  'Everyday Elegance',
  'Bridal Collection',
  'Gold Collection',
  'Diamond Collection',
  'Minimalist Collection',
  'Statement Pieces',
];

type SortOption = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating';

const PRICE_BUCKETS = [
  { label: 'Under $1,000', min: 0, max: 1000 },
  { label: '$1,000 – $2,500', min: 1000, max: 2500 },
  { label: '$2,500 – $5,000', min: 2500, max: 5000 },
  { label: 'Over $5,000', min: 5000, max: Infinity },
];

export function ShopPage({ initialCategory, initialCollection }: { initialCategory?: string; initialCollection?: string }) {
  const [categories, setCategories] = useState<Set<string>>(
    initialCategory ? new Set([initialCategory]) : new Set()
  );
  const [materials, setMaterials] = useState<Set<string>>(new Set());
  const [gemstones, setGemstones] = useState<Set<string>>(new Set());
  const [collections, setCollections] = useState<Set<string>>(
    initialCollection ? new Set([initialCollection]) : new Set()
  );
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceBucket, setPriceBucket] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, [categories, materials, gemstones, collections, priceBucket, search, sort, inStockOnly]);

  useEffect(() => {
    if (initialCategory) setCategories(new Set([initialCategory]));
  }, [initialCategory]);

  useEffect(() => {
    if (initialCollection) setCollections(new Set([initialCollection]));
  }, [initialCollection]);

  const toggle = (set: Set<string>, value: string, setter: (s: Set<string>) => void) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
  };

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) => {
      if (categories.size && !categories.has(p.category)) return false;
      if (materials.size && !materials.has(p.material)) return false;
      if (gemstones.size && !gemstones.has(p.gemstone)) return false;
      if (collections.size && !collections.has(p.collection)) return false;
      if (inStockOnly && !p.inStock) return false;
      if (priceBucket) {
        const bucket = PRICE_BUCKETS.find((b) => b.label === priceBucket);
        if (bucket && (p.price < bucket.min || p.price >= bucket.max)) return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        if (
          !p.name.toLowerCase().includes(q) &&
          !p.category.toLowerCase().includes(q) &&
          !p.collection.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });

    switch (sort) {
      case 'newest':
        list = [...list].sort((a, b) => Number(b.isNew) - Number(a.isNew));
        break;
      case 'price-asc':
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      default:
        list = [...list].sort(
          (a, b) => Number(b.isBestSeller) - Number(a.isBestSeller)
        );
    }
    return list;
  }, [categories, materials, gemstones, collections, inStockOnly, priceBucket, search, sort]);

  const activeCount =
    categories.size +
    materials.size +
    gemstones.size +
    collections.size +
    (priceBucket ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  const clearAll = () => {
    setCategories(new Set());
    setMaterials(new Set());
    setGemstones(new Set());
    setCollections(new Set());
    setPriceBucket(null);
    setInStockOnly(false);
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
        title="Category"
        options={ALL_CATEGORIES}
        selected={categories}
        onToggle={(v) => toggle(categories, v, setCategories)}
      />
      <div className="border-b border-charcoal-100 py-5">
        <h4 className="text-xs font-medium uppercase tracking-widest text-charcoal-800">
          Price
        </h4>
        <ul className="mt-3 space-y-2.5">
          {PRICE_BUCKETS.map((b) => (
            <li key={b.label}>
              <button
                type="button"
                onClick={() => setPriceBucket(priceBucket === b.label ? null : b.label)}
                className="group flex items-center gap-2.5 text-sm text-charcoal-600 transition-colors hover:text-charcoal-900"
              >
                <span
                  className={`flex h-4 w-4 items-center justify-center border transition-colors ${
                    priceBucket === b.label
                      ? 'border-champagne-500 bg-champagne-500'
                      : 'border-charcoal-300 group-hover:border-champagne-400'
                  }`}
                >
                  {priceBucket === b.label && <Check size={12} className="text-white" />}
                </span>
                {b.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <FilterSection
        title="Material"
        options={ALL_MATERIALS}
        selected={materials}
        onToggle={(v) => toggle(materials, v, setMaterials)}
      />
      <FilterSection
        title="Gemstone"
        options={ALL_GEMSTONES}
        selected={gemstones}
        onToggle={(v) => toggle(gemstones, v, setGemstones)}
      />
      <FilterSection
        title="Collection"
        options={ALL_COLLECTIONS}
        selected={collections}
        onToggle={(v) => toggle(collections, v, setCollections)}
      />
      <div className="py-5">
        <h4 className="text-xs font-medium uppercase tracking-widest text-charcoal-800">
          Availability
        </h4>
        <button
          type="button"
          onClick={() => setInStockOnly(!inStockOnly)}
          className="group mt-3 flex items-center gap-2.5 text-sm text-charcoal-600 transition-colors hover:text-charcoal-900"
        >
          <span
            className={`flex h-4 w-4 items-center justify-center border transition-colors ${
              inStockOnly
                ? 'border-champagne-500 bg-champagne-500'
                : 'border-charcoal-300 group-hover:border-champagne-400'
            }`}
          >
            {inStockOnly && <Check size={12} className="text-white" />}
          </span>
          In stock only
        </button>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      {/* Page header */}
      <div className="border-b border-charcoal-100 bg-ivory-100">
        <div className="container-lux py-12 text-center lg:py-16">
          <p className="text-xs uppercase tracking-ultra text-champagne-600">The Boutique</p>
          <h1 className="mt-3 font-serif text-4xl text-charcoal-900 lg:text-5xl">
            Shop All Jewellery
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm font-light text-charcoal-500">
            Explore our complete collection of handcrafted fine jewellery.
          </p>
        </div>
      </div>

      <div className="container-lux py-10">
        <div className="flex gap-10">
          {/* Sidebar filters */}
          <aside className="hidden w-60 shrink-0 lg:block">
            <div className="sticky top-28">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg text-charcoal-900">Filters</h3>
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
              <div className="flex flex-1 items-center gap-3">
                <div className="relative flex-1 max-w-xs">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400"
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search…"
                    className="w-full border border-charcoal-200 bg-white py-2.5 pl-10 pr-4 text-sm text-charcoal-800 placeholder:text-charcoal-400 focus:border-champagne-400 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowFilters(true)}
                  className="flex items-center gap-2 border border-charcoal-200 px-4 py-2.5 text-xs font-medium uppercase tracking-widest text-charcoal-700 transition-colors hover:border-champagne-400 lg:hidden"
                >
                  <SlidersHorizontal size={15} /> Filters
                  {activeCount > 0 && (
                    <span className="bg-champagne-500 px-1.5 text-[10px] text-white">
                      {activeCount}
                    </span>
                  )}
                </button>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="border border-charcoal-200 bg-white px-4 py-2.5 text-xs font-medium uppercase tracking-widest text-charcoal-700 focus:border-champagne-400 focus:outline-none"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Best Rated</option>
                </select>
              </div>
            </div>

            <p className="mt-4 text-sm text-charcoal-500">
              {loading ? 'Loading…' : `${filtered.length} piece${filtered.length === 1 ? '' : 's'}`}
            </p>

            {/* Grid */}
            {loading ? (
              <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[4/5] shimmer-bg" />
                    <div className="mt-4 h-4 w-20 shimmer-bg" />
                    <div className="mt-2 h-5 w-40 shimmer-bg" />
                    <div className="mt-2 h-5 w-24 shimmer-bg" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="mt-20 flex flex-col items-center text-center">
                <p className="font-serif text-2xl text-charcoal-700">No pieces found</p>
                <p className="mt-2 text-sm text-charcoal-400">
                  Try adjusting your filters or search terms.
                </p>
                <button
                  type="button"
                  onClick={clearAll}
                  className="mt-6 border border-charcoal-300 px-6 py-3 text-xs font-medium uppercase tracking-widest text-charcoal-700 transition-colors hover:border-champagne-400 hover:text-champagne-700"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            )}
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
              <h3 className="font-serif text-xl text-charcoal-900">Filters</h3>
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
