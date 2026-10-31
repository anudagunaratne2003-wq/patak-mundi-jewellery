'use client';

import { useState } from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { type Product } from '@/data/products';
import { useRouter } from '@/router/Router';
import { openDesignChat } from '@/lib/designChat';

/** A single past commission in the portfolio grid. */
export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { navigate } = useRouter();
  const [hovered, setHovered] = useState(false);

  const primaryImg = product.images[0];
  const secondaryImg = product.images[1] ?? product.images[0];

  return (
    <div
      className="group cursor-pointer animate-fade-up"
      style={{ animationDelay: `${(index % 4) * 80}ms` }}
      onClick={() => navigate({ name: 'design', params: { id: product.id } })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-ivory-200">
        <img
          src={primaryImg}
          alt={product.name}
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out ${
            hovered ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
          }`}
        />
        <img
          src={secondaryImg}
          alt={product.name}
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out ${
            hovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
          }`}
        />

        <div className="absolute left-3 top-3 z-10">
          <span className="bg-ivory-50/90 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-charcoal-800 backdrop-blur">
            Bespoke Commission
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 translate-y-full p-3 transition-transform duration-500 ease-out group-hover:translate-y-0">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate({ name: 'design', params: { id: product.id } });
              }}
              className="flex flex-1 items-center justify-center gap-2 bg-white/95 px-3 py-3 text-[11px] font-medium uppercase tracking-widest text-charcoal-800 backdrop-blur transition-colors hover:bg-white"
            >
              <ArrowUpRight size={15} /> View Design
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openDesignChat(
                  `I love the ${product.name} from your portfolio. Could we design something in a similar spirit for me?`
                );
              }}
              className="flex flex-1 items-center justify-center gap-2 bg-charcoal-900 px-3 py-3 text-[11px] font-medium uppercase tracking-widest text-ivory-50 transition-colors hover:bg-charcoal-800"
            >
              <Sparkles size={15} /> Design Similar
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-1.5">
        <p className="text-[10px] uppercase tracking-widest text-champagne-600">
          {[product.category, product.material].filter(Boolean).join(' · ')}
        </p>
        <h3 className="font-serif text-lg leading-snug text-charcoal-800 transition-colors group-hover:text-champagne-700">
          {product.name}
        </h3>
        <p className="text-xs font-light text-charcoal-400">
          {product.gemstone ?? 'Pure metalwork'}
        </p>
      </div>
    </div>
  );
}
