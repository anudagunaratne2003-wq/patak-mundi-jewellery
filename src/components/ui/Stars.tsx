'use client';

import { Star } from 'lucide-react';

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
