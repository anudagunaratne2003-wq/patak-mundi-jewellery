'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { useStore } from '@/store/StoreContext';

export function StarRating({
  rating,
  size = 14,
  showValue = false,
  reviewCount,
}: {
  rating: number;
  size?: number;
  showValue?: boolean;
  reviewCount?: number;
}) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < full;
          const half = i === full && hasHalf;
          return (
            <Star
              key={i}
              size={size}
              className={
                filled || half
                  ? 'fill-champagne-400 text-champagne-400'
                  : 'fill-transparent text-champagne-300'
              }
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-xs font-medium text-charcoal-500">
          {rating.toFixed(1)}
          {reviewCount !== undefined && (
            <span className="text-charcoal-400"> ({reviewCount})</span>
          )}
        </span>
      )}
    </div>
  );
}

export function Price({
  value,
  oldPrice,
  className = '',
}: {
  value: number;
  oldPrice?: number;
  className?: string;
}) {
  return (
    <div className={`flex items-baseline gap-2 ${className}`}>
      <span className="font-serif text-lg text-charcoal-800">
        ${value.toLocaleString('en-US')}
      </span>
      {oldPrice && (
        <span className="text-sm text-charcoal-400 line-through">
          ${oldPrice.toLocaleString('en-US')}
        </span>
      )}
    </div>
  );
}

export function WishlistButton({
  productId,
  className = '',
}: {
  productId: string;
  className?: string;
}) {
  const { toggleWishlist, isWishlisted } = useStore();
  const wished = isWishlisted(productId);
  const [animate, setAnimate] = useState(false);

  return (
    <button
      type="button"
      aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        setAnimate(true);
        setTimeout(() => setAnimate(false), 400);
        toggleWishlist(productId);
      }}
      className={`group/heart flex h-9 w-9 items-center justify-center rounded-full bg-ivory-100/90 backdrop-blur transition-all hover:bg-white ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className={`h-[18px] w-[18px] transition-all ${
          animate ? 'scale-125' : 'group-hover/heart:scale-110'
        } ${wished ? 'fill-champagne-500 stroke-champagne-500' : 'fill-none stroke-charcoal-600 group-hover/heart:stroke-champagne-500'}`}
        strokeWidth={1.5}
      >
        <path d="M12 21s-7.5-4.8-10-9.2C.4 8.5 2 5 5.5 5c2 0 3.3 1.1 4.5 2.6C11.2 6.1 12.5 5 14.5 5 18 5 19.6 8.5 22 11.8 19.5 16.2 12 21 12 21z" />
      </svg>
    </button>
  );
}
