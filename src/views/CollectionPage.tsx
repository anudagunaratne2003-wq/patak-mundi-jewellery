'use client';

import { useMemo } from 'react';
import { COLLECTIONS } from '@/data/products';
import { useRouter } from '@/router/Router';
import { ProductCard } from '@/components/ProductCard';
import { useProducts } from '@/store/ProductsContext';

export function CollectionPage({ collection }: { collection: string }) {
  const { navigate } = useRouter();
  const { products: PRODUCTS } = useProducts();
  const meta = useMemo(
    () => COLLECTIONS.find((c) => c.name === collection),
    [collection]
  );
  const products = useMemo(
    () => PRODUCTS.filter((p) => p.collection === collection),
    [collection]
  );

  if (!meta) {
    return (
      <div className="container-lux py-32 text-center">
        <h1 className="font-serif text-3xl text-charcoal-800">Collection not found</h1>
        <button
          type="button"
          onClick={() => navigate({ name: 'collections' })}
          className="mt-8 bg-charcoal-900 px-8 py-4 text-xs font-medium uppercase tracking-widest text-ivory-50"
        >
          View All Collections
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img src={meta.image} alt={meta.name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-charcoal-900/55" />
        <div className="relative z-10 flex h-full items-center justify-center text-center">
          <div className="max-w-2xl px-6">
            <p className="text-xs uppercase tracking-ultra text-ivory-200/90">Collection</p>
            <h1 className="mt-3 font-serif text-4xl text-ivory-50 sm:text-5xl lg:text-6xl">
              {meta.name}
            </h1>
            <p className="mx-auto mt-5 max-w-md text-base font-light text-ivory-100/85">
              {meta.description}
            </p>
          </div>
        </div>
      </div>

      <div className="container-lux py-16">
        <p className="text-sm text-charcoal-500">
          {products.length} piece{products.length === 1 ? '' : 's'} in this collection
        </p>
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
