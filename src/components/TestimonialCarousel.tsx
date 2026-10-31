'use client';

import { useEffect, useState } from 'react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { TESTIMONIALS } from '@/data/products';
import { StarRating } from '@/components/ui/Stars';

const AUTOPLAY_MS = 5500;

export function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const total = TESTIMONIALS.length;

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % total), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [total]);

  const active = TESTIMONIALS[index];

  return (
    <div className="mt-14">
      {/* Featured quote */}
      <div className="relative mx-auto max-w-3xl px-4 text-center">
        <Quote
          size={40}
          className="mx-auto text-champagne-300"
          strokeWidth={1}
        />
        <div key={index} className="animate-fade-in">
          <p className="mt-6 font-serif text-2xl italic leading-relaxed text-charcoal-800 sm:text-3xl">
            "{active.text}"
          </p>
          <div className="mt-6 flex flex-col items-center gap-2">
            <StarRating rating={active.rating} size={16} />
            <p className="text-sm font-medium text-charcoal-800">{active.name}</p>
            <p className="text-xs uppercase tracking-widest text-champagne-600">
              {active.location}
            </p>
          </div>
        </div>

        {/* Arrows */}
        <button
          type="button"
          onClick={() => setIndex((i) => (i - 1 + total) % total)}
          aria-label="Previous testimonial"
          className="absolute left-0 top-1/2 hidden -translate-y-1/2 items-center justify-center text-charcoal-300 transition-colors hover:text-champagne-600 sm:flex"
        >
          <ChevronLeft size={28} strokeWidth={1.25} />
        </button>
        <button
          type="button"
          onClick={() => setIndex((i) => (i + 1) % total)}
          aria-label="Next testimonial"
          className="absolute right-0 top-1/2 hidden -translate-y-1/2 items-center justify-center text-charcoal-300 transition-colors hover:text-champagne-600 sm:flex"
        >
          <ChevronRight size={28} strokeWidth={1.25} />
        </button>
      </div>

      {/* Dots */}
      <div className="mt-10 flex items-center justify-center gap-2">
        {TESTIMONIALS.map((t, i) => (
          <button
            key={t.name}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show testimonial from ${t.name}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? 'w-8 bg-champagne-500' : 'w-1.5 bg-charcoal-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
