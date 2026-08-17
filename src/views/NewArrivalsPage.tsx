'use client';

import { useMemo } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { useProducts } from '@/store/ProductsContext';

export function NewArrivalsPage() {
  const { products: PRODUCTS } = useProducts();
  const products = useMemo(() => PRODUCTS.filter((p) => p.isNew), [PRODUCTS]);

  return (
    <div className="animate-fade-in">
      <div className="border-b border-charcoal-100 bg-ivory-100">
        <div className="container-lux py-14 text-center lg:py-20">
          <p className="text-xs uppercase tracking-ultra text-champagne-600">Just Arrived</p>
          <h1 className="mt-3 font-serif text-4xl text-charcoal-900 lg:text-5xl">
            New Arrivals
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm font-light text-charcoal-500">
            The latest additions to our atelier — fresh silhouettes, new stones, and modern
            interpretations of timeless forms.
          </p>
        </div>
      </div>

      <div className="container-lux py-16">
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
