"use client";

import { useEffect, useRef, useState } from "react";

/**
 * LandingGate — the entry experience for Patak Mundi.
 *
 * Full-bleed hero photograph (statue + pendant) that:
 *   1. Arrives in focus — starts soft/blurred/desaturated like an out-of-focus
 *      lens, then sharpens and settles, evoking a jeweler examining a piece.
 *   2. Tilts gently toward the cursor — a pivoted 3D tilt anchored near the
 *      neck, plus a soft gleam of light that follows the pointer across the
 *      marble. This is a parallax/tilt illusion, not a literal head turn —
 *      a flat photo can't actually re-angle the face, but this is the
 *      closest a static image gets to feeling alive under the cursor.
 *   3. Waits for the visitor — no auto-redirect. A "Visit the Store" button
 *      fades in after the reveal; clicking it unmounts this overlay and
 *      calls onEnter().
 *
 * Wiring it in (same pattern as before — same "/" route, no navigation):
 *   <LandingGate />
 *   <HomePage />
 *
 * Shows once per browser session (sessionStorage) — repeat visits within
 * the same session go straight through with no overlay.
 */

const SESSION_KEY = "patak-mundi-landing-seen";

export function LandingGate({ onEnter }: { onEnter?: () => void }) {
  const [done, setDone] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef({ rx: 0, ry: 0, tx: 0, ty: 0 });

  // Entry: skip if already seen this session, else schedule the reveal.
  useEffect(() => {
    const alreadySeen =
      typeof window !== "undefined" &&
      window.sessionStorage.getItem(SESSION_KEY) === "1";

    if (alreadySeen) {
      setDone(true);
      onEnter?.();
      return;
    }

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(reduced);

    const t = setTimeout(() => setRevealed(true), reduced ? 0 : 120);
    return () => clearTimeout(t);
  }, [onEnter]);

  // Cursor tilt + gleam. Skipped for touch devices and reduced motion.
  useEffect(() => {
    if (reducedMotion || !heroRef.current) return;
    const canHover =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!canHover) return;

    const el = heroRef.current;
    const MAX_TILT = 5; // degrees — kept subtle for a premium, not gimmicky, feel
    const MAX_SHIFT = 6; // px

    function handleMove(e: MouseEvent) {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const nx = px * 2 - 1;
      const ny = py * 2 - 1;

      targetRef.current = {
        rx: -ny * (MAX_TILT * 0.6),
        ry: nx * MAX_TILT,
        tx: nx * MAX_SHIFT,
        ty: ny * MAX_SHIFT,
      };

      if (imgRef.current) {
        imgRef.current.style.setProperty("--gleam-x", `${px * 100}%`);
        imgRef.current.style.setProperty("--gleam-y", `${py * 100}%`);
      }
    }

    function handleLeave() {
      targetRef.current = { rx: 0, ry: 0, tx: 0, ty: 0 };
    }

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);

    // Smooth spring-like follow via lerp, independent of mousemove event rate.
    let curRx = 0,
      curRy = 0,
      curTx = 0,
      curTy = 0;
    function loop() {
      const t = targetRef.current;
      const ease = 0.08;
      curRx += (t.rx - curRx) * ease;
      curRy += (t.ry - curRy) * ease;
      curTx += (t.tx - curTx) * ease;
      curTy += (t.ty - curTy) * ease;
      if (imgRef.current) {
        imgRef.current.style.transform = `translate3d(${curTx}px, ${curTy}px, 0) rotateX(${curRx}deg) rotateY(${curRy}deg) scale(1.03)`;
      }
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion]);

  function handleEnter() {
    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore storage errors (private browsing, etc.) */
    }
    onEnter?.();
    setDone(true);
  }

  if (done) return null;

  return (
    <div
      ref={heroRef}
      className="fixed inset-0 z-[999] overflow-hidden bg-ivory-100"
    >
      <div style={{ perspective: "1400px" }} className="absolute inset-0">
        <div
          ref={imgRef}
          className={`absolute inset-0 will-change-transform transition-all ease-[cubic-bezier(0.22,1,0.36,1)] ${
            revealed
              ? "scale-100 opacity-100 blur-none saturate-100"
              : "scale-[1.08] opacity-0 blur-md saturate-[0.5]"
          }`}
          style={{
            transitionDuration: reducedMotion ? "400ms" : "1700ms",
          }}
        >
          <img
            src="/images/brand/hero-statue.jpg"
            alt="Patak Mundi — a hand-finished emerald pendant in sterling silver, worn on a classical marble bust"
            className="h-full w-full object-cover"
            style={{ objectPosition: "72% center" }}
          />

          {/* Gleam that tracks the cursor, like light catching polished stone */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at var(--gleam-x, 68%) var(--gleam-y, 30%), rgba(255,255,255,0.30), transparent 38%)",
              mixBlendMode: "overlay",
            }}
          />
        </div>
      </div>

      {/* Scrim for legibility under the CTA */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-charcoal-900/55 to-transparent" />

      <div
        className={`absolute inset-x-0 bottom-14 flex flex-col items-center gap-5 px-6 text-center transition-all duration-700 ${
          revealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
        style={{ transitionDelay: revealed ? "900ms" : "0ms" }}
      >
        <p className="text-[11px] uppercase tracking-ultra text-ivory-50/85">
          Hand-finished. Ethically sourced. Made to last.
        </p>
        <button
          type="button"
          onClick={handleEnter}
          className="group flex items-center gap-2 bg-ivory-50 px-9 py-4 text-xs font-medium uppercase tracking-widest text-charcoal-900 transition-all hover:bg-champagne-300"
        >
          Visit the Store
        </button>
      </div>
    </div>
  );
}
