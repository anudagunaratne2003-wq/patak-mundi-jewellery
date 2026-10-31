"use client";

import { useEffect, useRef, useState } from "react";

/**
 * IntroPage — the entry animation for Pátak Mundi.
 *
 * Concept: the brand name means "light." A faceted gem draws itself from
 * thin converging lines, then a sweep of light passes through it and spills
 * onto the wordmark below, revealing each letter as the light crosses it.
 * The whole thing closes like a loupe (aperture wipe), unmounting itself to
 * reveal the homepage that's already mounted underneath.
 *
 * Wiring it in (app router, same URL for both):
 *   - Render <IntroPage /> above <HomePage /> in the same page component
 *     (e.g. app/page.tsx). It's a pure overlay — no navigation involved,
 *     since "home" and this intro live at the same "/" route.
 *   - It shows once per browser session (sessionStorage flag) — return
 *     visitors within the same session get `null` immediately, so
 *     HomePage is visible with no overlay at all.
 *   - Respects prefers-reduced-motion: plays a short 400ms crossfade instead.
 *   - Optional onComplete callback if the parent wants to know when it's done
 *     (e.g. to focus the homepage or fire an analytics event).
 */

const SESSION_KEY = "lumiere-intro-seen";
const WORDMARK = "PÁTAK MUNDI";

type Stage = "draw" | "sweep" | "hold" | "exit";

export function IntroPage({ onComplete }: { onComplete?: () => void }) {
  const [stage, setStage] = useState<Stage>("draw");
  const [done, setDone] = useState(false);
  const [skip, setSkip] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const alreadySeen =
      typeof window !== "undefined" &&
      window.sessionStorage.getItem(SESSION_KEY) === "1";

    if (alreadySeen) {
      setDone(true);
      onComplete?.();
      return;
    }

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      const t = setTimeout(() => finish(), 400);
      timers.current.push(t);
      return () => timers.current.forEach(clearTimeout);
    }

    const schedule: [Stage, number][] = [
      ["sweep", 1250],
      ["hold", 2350],
      ["exit", 3300],
    ];
    schedule.forEach(([s, delay]) => {
      timers.current.push(setTimeout(() => setStage(s), delay));
    });
    // finish() only marks the flag + fires the callback; unmounting itself
    // happens 900ms later once the exit transition (see stage 'exit') ends.
    timers.current.push(setTimeout(() => finish(), 3300));
    timers.current.push(setTimeout(() => setDone(true), 4200));

    return () => timers.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function finish() {
    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore storage errors (private browsing, etc.) */
    }
    onComplete?.();
  }

  function handleSkip() {
    setSkip(true);
    finish();
    setDone(true);
  }

  if (done) return null;

  return (
    <div
      className={`fixed inset-0 z-[999] flex items-center justify-center bg-charcoal-900 transition-opacity duration-500 ${
        stage === "exit" || skip ? "pointer-events-none" : ""
      }`}
      aria-hidden={stage === "exit"}
    >
      {/* Aperture panels — the "loupe closing" exit */}
      <div
        className={`absolute inset-y-0 left-0 w-1/2 bg-charcoal-900 transition-transform duration-[900ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${
          stage === "exit" ? "-translate-x-full" : "translate-x-0"
        }`}
      />
      <div
        className={`absolute inset-y-0 right-0 w-1/2 bg-charcoal-900 transition-transform duration-[900ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${
          stage === "exit" ? "translate-x-full" : "translate-x-0"
        }`}
      />

      <div
        className={`relative z-10 flex flex-col items-center transition-opacity duration-500 ${
          stage === "exit" ? "opacity-0" : "opacity-100"
        }`}
      >
        <GemMark stage={stage} />
        <Wordmark stage={stage} />
        <p
          className={`mt-5 text-[11px] uppercase tracking-ultra text-ivory-200/60 transition-all duration-700 ${
            stage === "hold" || stage === "exit"
              ? "translate-y-0 opacity-100"
              : "translate-y-1 opacity-0"
          }`}
        >
          Timeless Beauty, Made to Shine
        </p>
      </div>

      <button
        type="button"
        onClick={handleSkip}
        className="absolute bottom-8 right-8 z-20 text-[11px] uppercase tracking-widest text-ivory-100/40 underline-offset-4 transition-colors hover:text-ivory-100/90 hover:underline focus:text-ivory-100/90 focus:outline-none"
      >
        Skip
      </button>

      <style>{`
        @keyframes draw-facet {
          to { stroke-dashoffset: 0; }
        }
        @keyframes gem-glow {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 0.85; }
        }
        @keyframes sweep-move {
          from { transform: translateX(-140%) skewX(-12deg); }
          to { transform: translateX(140%) skewX(-12deg); }
        }
        @keyframes sparkle-pop {
          0% { transform: scale(0); opacity: 0; }
          40% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0.6); opacity: 0; }
        }
        .facet-line {
          stroke-dasharray: 60;
          stroke-dashoffset: 60;
          animation: draw-facet 900ms cubic-bezier(0.65, 0, 0.35, 1) forwards;
        }
        .gem-glow {
          animation: gem-glow 2400ms ease-in-out infinite;
        }
        .letter-sweep {
          position: absolute;
          inset: 0;
          transform: translateX(-140%) skewX(-12deg);
          background: linear-gradient(
            100deg,
            transparent 0%,
            rgba(255, 255, 255, 0.9) 45%,
            rgba(226, 187, 122, 0.9) 55%,
            transparent 100%
          );
          mix-blend-mode: screen;
        }
        .letter-sweep.run {
          animation: sweep-move 1100ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .sparkle {
          animation: sparkle-pop 900ms ease-out forwards;
        }
      `}</style>
    </div>
  );
}

function GemMark({ stage }: { stage: Stage }) {
  const drawing = stage === "draw";
  const litUp = stage !== "draw";

  // Emerald-cut facet lines, each delayed slightly to feel hand-drawn.
  const facets = [
    { d: "M40 8 L64 20", delay: "0ms" },
    { d: "M40 8 L16 20", delay: "80ms" },
    { d: "M16 20 L16 48", delay: "160ms" },
    { d: "M64 20 L64 48", delay: "160ms" },
    { d: "M16 48 L40 68", delay: "260ms" },
    { d: "M64 48 L40 68", delay: "260ms" },
    { d: "M16 20 L64 20", delay: "340ms" },
    { d: "M16 48 L64 48", delay: "340ms" },
    { d: "M40 8 L40 68", delay: "420ms" },
  ];

  return (
    <div className="relative h-24 w-24">
      <svg
        viewBox="0 0 80 76"
        className={`h-full w-full transition-opacity duration-500 ${
          litUp ? "gem-glow" : ""
        }`}
        fill="none"
      >
        {facets.map((f, i) => (
          <path
            key={i}
            d={f.d}
            stroke="#E2BB7A"
            strokeWidth="1"
            strokeLinecap="round"
            className={drawing ? "facet-line" : ""}
            style={
              drawing ? { animationDelay: f.delay } : { strokeDashoffset: 0 }
            }
          />
        ))}
      </svg>

      {/* Sparkles that pop once the gem is lit */}
      {litUp && (
        <>
          <span
            className="sparkle absolute left-1 top-2 h-1 w-1 rounded-full bg-ivory-50"
            style={{ animationDelay: "100ms" }}
          />
          <span
            className="sparkle absolute right-2 top-8 h-[3px] w-[3px] rounded-full bg-champagne-300"
            style={{ animationDelay: "340ms" }}
          />
          <span
            className="sparkle absolute bottom-4 left-4 h-1 w-1 rounded-full bg-ivory-50"
            style={{ animationDelay: "560ms" }}
          />
        </>
      )}
    </div>
  );
}

function Wordmark({ stage }: { stage: Stage }) {
  const letters = WORDMARK.split("");
  const sweeping = stage === "sweep" || stage === "hold" || stage === "exit";

  return (
    <h1 className="mt-7 flex font-logo text-4xl tracking-[0.35em] text-ivory-50 sm:text-5xl">
      {letters.map((ch, i) => (
        <span
          key={i}
          className="relative inline-block overflow-hidden"
          style={{
            opacity: sweeping ? 1 : 0.12,
            transition: `opacity 200ms ease ${i * 55}ms`,
          }}
        >
          {ch === " " ? "\u00A0" : ch}
          {sweeping && (
            <span
              className="letter-sweep run"
              style={{ animationDelay: `${i * 55}ms` }}
            />
          )}
        </span>
      ))}
    </h1>
  );
}
