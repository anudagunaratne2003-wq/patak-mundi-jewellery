'use client';

import { useState } from 'react';
import { Eye, ShoppingBag } from 'lucide-react';
import { type Product } from '@/data/products';
import { useRouter } from '@/router/Router';
import { useStore } from '@/store/StoreContext';
import { Price, StarRating, WishlistButton } from '@/components/ui/Stars';

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { navigate } = useRouter();
  const { addToCart } = useStore();
  const [hovered, setHovered] = useState(false);

  const hasSizes = (product.sizes?.length ?? 0) > 0;
  const primaryImg = product.images[0];
  const secondaryImg = product.images[1] ?? product.images[0];

  return (
    <div
      className="group cursor-pointer animate-fade-up"
      style={{ animationDelay: `${(index % 4) * 80}ms` }}
      onClick={() => navigate({ name: 'product', params: { id: product.id } })}
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

        <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between p-3">
          <div className="flex flex-col gap-1.5">
            {product.isNew && (
              <span className="bg-charcoal-900 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-ivory-50">
                New
              </span>
            )}
            {product.oldPrice && (
              <span className="bg-champagne-500 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-white">
                Sale
              </span>
            )}
          </div>
          <WishlistButton productId={product.id} />
        </div>

        <div
          className={`absolute inset-x-0 bottom-0 z-10 translate-y-full p-3 transition-transform duration-500 ease-out group-hover:translate-y-0`}
        >
          <div className="flex gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate({ name: 'product', params: { id: product.id } });
              }}
              className="flex flex-1 items-center justify-center gap-2 bg-white/95 px-4 py-3 text-xs font-medium uppercase tracking-widest text-charcoal-800 backdrop-blur transition-colors hover:bg-white"
            >
              <Eye size={15} /> Quick View
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (hasSizes) {
                  navigate({ name: 'product', params: { id: product.id } });
                } else {
                  addToCart(product.id, 1);
                }
              }}
              className="flex flex-1 items-center justify-center gap-2 bg-charcoal-900 px-4 py-3 text-xs font-medium uppercase tracking-widest text-ivory-50 transition-colors hover:bg-charcoal-800"
            >
              <ShoppingBag size={15} /> Add to Bag
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-1.5">
        <p className="text-[10px] uppercase tracking-widest text-champagne-600">
          {product.material}
        </p>
        <h3 className="font-serif text-lg leading-snug text-charcoal-800 transition-colors group-hover:text-champagne-700">
          {product.name}
        </h3>
        <StarRating rating={product.rating} showValue reviewCount={product.reviewCount} />
        <Price value={product.price} oldPrice={product.oldPrice} />
      </div>
    </div>
  );
}
