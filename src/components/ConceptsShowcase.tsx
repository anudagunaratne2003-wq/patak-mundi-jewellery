'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { CONCEPTS } from '@/data/concepts';

const SLIDE_DURATION = 6000;

/**
 * "Discover the Concepts" — a framed image slideshow on the left. The
 * active concept drives the copy AND the secondary figure image on the
 * right, so both sides change together as the slide advances.
 */
export function ConceptsShowcase() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [progressKey, setProgressKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const total = CONCEPTS.length;
  const active = CONCEPTS[index];

  const goTo = (next: number) => {
    setIndex(((next % total) + total) % total);
    setProgressKey((k) => k + 1);
  };

  useEffect(() => {
    if (!playing) return;
    timerRef.current = setTimeout(() => goTo(index + 1), SLIDE_DURATION);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, playing]);

  return (
    <section className="container-lux py-20 lg:py-28">
      <div className="text-center">
        <p className="text-xs uppercase tracking-ultra text-champagne-600">
          Explore
        </p>
        <h2 className="mt-3 font-serif text-4xl text-charcoal-900 lg:text-5xl">
          Discover the Concepts
        </h2>
        <p className="mt-4 text-sm font-light text-charcoal-500">
          Each one more unique than the other.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        {/* Left: framed slideshow */}
        <div className="relative mx-auto w-full max-w-md">
          <div className="relative bg-white p-3 shadow-xl ring-1 ring-charcoal-100 sm:p-4">
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-charcoal-900">
              {CONCEPTS.map((c, i) => (
                <img
                  key={c.id}
                  src={c.image}
                  alt={c.title}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${
                    i === index ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal-900/50 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-4 text-center">
                <p className="font-logo text-lg tracking-widest text-ivory-50">
                  PÁTAK MUNDI
                </p>
              </div>
            </div>
          </div>

          {/* Prev / next arrows */}
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              goTo(index - 1);
            }}
            aria-label="Previous concept"
            className="absolute left-0 top-1/2 -translate-x-4 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-charcoal-700 shadow-md transition-colors hover:text-champagne-600"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              goTo(index + 1);
            }}
            aria-label="Next concept"
            className="absolute right-0 top-1/2 translate-x-4 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-charcoal-700 shadow-md transition-colors hover:text-champagne-600"
          >
            <ChevronRight size={18} />
          </button>

          {/* Dots + play/pause */}
          <div className="mt-6 flex items-center justify-center gap-3">
            {CONCEPTS.map((c, i) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setPlaying(false);
                  goTo(i);
                }}
                aria-label={`Show ${c.title}`}
                className="group relative h-1.5 w-8 overflow-hidden bg-charcoal-200"
              >
                <span
                  className="absolute inset-y-0 left-0 bg-champagne-500"
                  style={
                    i === index
                      ? {
                          animationName: playing ? 'slideProgress' : 'none',
                          animationDuration: `${SLIDE_DURATION}ms`,
                          animationTimingFunction: 'linear',
                          animationFillMode: 'forwards',
                          width: playing ? undefined : '100%',
                        }
                      : { width: i < index ? '100%' : '0%' }
                  }
                  key={`${c.id}-${progressKey}`}
                />
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? 'Pause slideshow' : 'Play slideshow'}
              className="ml-2 flex h-7 w-7 items-center justify-center text-charcoal-500 transition-colors hover:text-champagne-600"
            >
              {playing ? <Pause size={14} /> : <Play size={14} />}
            </button>
          </div>
        </div>

        {/* Right: dynamic text + figure */}
        <div key={active.id} className="animate-fade-in">
          <p className="text-xs uppercase tracking-ultra text-champagne-600">
            {active.tagline}
          </p>
          <h3 className="mt-3 font-serif text-3xl text-charcoal-900 sm:text-4xl">
            {active.title}
          </h3>
          <p className="mt-5 max-w-md whitespace-pre-line text-base font-light leading-relaxed text-charcoal-600">
            {active.description}
          </p>

          <div className="mt-8 flex items-end gap-5">
            <div className="relative h-56 w-40 shrink-0 overflow-hidden bg-ivory-200 shadow-lg sm:h-64 sm:w-44">
              <img
                src={active.sideImage}
                alt={`${active.title} worn`}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <p className="pb-2 text-sm font-light text-charcoal-400">
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              <br />
              <span className="text-charcoal-300">Concept</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
