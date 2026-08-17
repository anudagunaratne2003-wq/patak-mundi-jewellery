'use client';

import { ArrowRight } from 'lucide-react';
import { COLLECTIONS } from '@/data/products';
import { useRouter } from '@/router/Router';

export function CollectionsPage() {
  const { navigate } = useRouter();

  return (
    <div className="animate-fade-in">
      <div className="border-b border-charcoal-100 bg-ivory-100">
        <div className="container-lux py-14 text-center lg:py-20">
          <p className="text-xs uppercase tracking-ultra text-champagne-600">Curated Edits</p>
          <h1 className="mt-3 font-serif text-4xl text-charcoal-900 lg:text-5xl">
            Our Collections
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm font-light text-charcoal-500">
            Each collection is a world of its own — explore the moods, materials, and moments
            that define Lumière.
          </p>
        </div>
      </div>

      <div className="container-lux py-16">
        <div className="space-y-6">
          {COLLECTIONS.map((c, i) => (
            <button
              key={c.name}
              type="button"
              onClick={() => navigate({ name: 'collection', params: { collection: c.name } })}
              className={`group grid w-full grid-cols-1 overflow-hidden bg-ivory-100 text-left lg:grid-cols-2 ${
                i % 2 === 1 ? 'lg:[direction:rtl]' : ''
              }`}
            >
              <div className="relative aspect-[16/10] overflow-hidden [direction:ltr]">
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-center p-8 lg:p-14 [direction:ltr]">
                <p className="text-xs uppercase tracking-ultra text-champagne-600">
                  Collection {String(i + 1).padStart(2, '0')}
                </p>
                <h2 className="mt-3 font-serif text-3xl text-charcoal-900 lg:text-4xl">
                  {c.name}
                </h2>
                <p className="mt-4 max-w-md text-base font-light leading-relaxed text-charcoal-600">
                  {c.description}
                </p>
                <span className="group mt-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-charcoal-700 transition-colors group-hover:text-champagne-600">
                  Discover Collection
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
