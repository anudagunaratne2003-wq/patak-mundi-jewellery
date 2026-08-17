'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from '@/router/Router';
import { useProducts } from '@/store/ProductsContext';

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { navigate } = useRouter();
  const { products: PRODUCTS } = useProducts();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.collection.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        p.gemstone.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] animate-fade-in">
      <div className="absolute inset-0 bg-charcoal-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-x-0 top-0 bg-ivory-50 shadow-2xl animate-fade-down">
        <div className="container-lux py-8">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl text-charcoal-800">Search</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-charcoal-400 transition-colors hover:text-charcoal-700"
              aria-label="Close search"
            >
              <X size={24} />
            </button>
          </div>
          <div className="mt-6 flex items-center gap-3 border-b border-charcoal-200 pb-4">
            <Search size={22} className="text-champagne-500" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search rings, necklaces, diamonds…"
              className="w-full bg-transparent font-serif text-xl text-charcoal-800 placeholder:text-charcoal-300 focus:outline-none"
            />
          </div>

          {query && (
            <div className="mt-6">
              {results.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="font-serif text-lg text-charcoal-500">
                    No pieces match "{query}"
                  </p>
                  <p className="mt-2 text-sm text-charcoal-400">
                    Try another word, or explore our collections.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {results.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        navigate({ name: 'product', params: { id: p.id } });
                        onClose();
                      }}
                      className="group flex items-center gap-4 bg-white p-3 text-left transition-colors hover:bg-ivory-100"
                    >
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="h-16 w-16 object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-[10px] uppercase tracking-widest text-champagne-600">
                          {p.category}
                        </p>
                        <p className="font-serif text-base text-charcoal-800 group-hover:text-champagne-700">
                          {p.name}
                        </p>
                        <p className="text-sm text-charcoal-500">
                          ${p.price.toLocaleString('en-US')}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
