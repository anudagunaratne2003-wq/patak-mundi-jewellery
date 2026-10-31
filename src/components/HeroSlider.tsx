"use client";

import { useEffect, useState } from "react";

const SLIDE_DURATION = 4000;

/** `position` keeps the piece in frame when a portrait photo is cropped to the wide hero. */
const SLIDES = [
  {
    src: "/images/portfolio/pendants/winged-eyes-pendant.jpg",
    alt: "Open silver ring with a moonstone and a green accent stone",
    position: "center 50%",
  },
  {
    src: "/images/portfolio/rings/concentric-two-stone-ring.jpg",
    alt: "Open silver ring with a moonstone and a green accent stone",
    position: "center 60%",
  },
  {
    src: "/images/portfolio/rings/twin-rail-two-stone-ring.jpg",
    alt: "Open silver ring with a moonstone and a green accent stone",
    position: "center 50%",
  },
  {
    src: "/images/portfolio/rings/moonstone-open-ring.jpg",
    alt: "Open silver ring with a moonstone and a green accent stone",
    position: "center 55%",
  },
  {
    src: "/images/portfolio/rings/ruby-pave-ring.jpg",
    alt: "Oval ruby ring with pavé-set shoulders",
    position: "center 38%",
  },
  {
    src: "/images/portfolio/pendants/aquamarine-pendant.jpg",
    alt: "Emerald-cut aquamarine pendant in a fluid silver frame",
    position: "center 50%",
  },
  {
    src: "/images/portfolio/rings/nawagraha-rahu-ring.jpg",
    alt: "Sculptural silver ring set with dark oval stones",
    position: "center 52%",
  },
];

/**
 * Crossfading hero background. The first photo paints immediately; the rest
 * load, and the slides start advancing, only once `active` is true so they
 * don't compete with the 3D landing gate for bandwidth.
 */
export function HeroSlider({
  active,
  className,
}: {
  active: boolean;
  className?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (
      !active ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const timer = setTimeout(
      () => setIndex((index + 1) % SLIDES.length),
      SLIDE_DURATION,
    );
    return () => clearTimeout(timer);
  }, [active, index]);

  return (
    <div className={className}>
      {SLIDES.map((slide, i) =>
        i === 0 || active ? (
          <img
            key={slide.src}
            src={slide.src}
            alt={i === index ? slide.alt : ""}
            fetchPriority={i === 0 ? "high" : "auto"}
            style={{ objectPosition: slide.position }}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : null,
      )}

      <div className="absolute inset-x-0 bottom-6 z-20 flex justify-center gap-1">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show slide ${i + 1} of ${SLIDES.length}`}
            aria-current={i === index}
            className="group flex h-8 w-10 items-center justify-center"
          >
            <span
              className={`h-0.5 w-full transition-colors duration-300 ${
                i === index
                  ? "bg-ivory-50"
                  : "bg-ivory-50/40 group-hover:bg-ivory-50/70"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
