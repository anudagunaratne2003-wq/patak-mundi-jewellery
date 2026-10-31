"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, useGLTF, useProgress } from "@react-three/drei";
import * as THREE from "three";

/**
 * LandingGate3D — the entry experience for Patak Mundi, now backed by a
 * real 3D model (exported from Meshy, decimated 862k -> 69k triangles and
 * texture-compressed to WebP via gltf-transform, ~2.4MB total).
 *
 * Unlike the earlier CSS-tilt version, the statue genuinely rotates toward
 * the cursor here — this is real geometry turning in a WebGL scene, not an
 * illusion on a flat image.
 *
 * Requires: three, @react-three/fiber, @react-three/drei
 *   npm install three @react-three/fiber @react-three/drei
 *
 * Wiring it in (same pattern as before — same "/" route, no navigation):
 *   <LandingGate3D />
 *   <HomePage />
 *
 * Shows once per browser session — repeat visits within the same session
 * go straight through with no overlay.
 */

const SESSION_KEY = "patak-mundi-landing-seen-3d";
const MODEL_PATH = "/models/hero-statue.glb";

export function LandingGate3D({ onEnter }: { onEnter?: () => void }) {
  const [done, setDone] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const wordmarkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const alreadySeen =
      typeof window !== "undefined" &&
      window.sessionStorage.getItem(SESSION_KEY) === "1";

    if (alreadySeen) {
      setDone(true);
      onEnter?.();
      return;
    }

    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
    setCanHover(
      window.matchMedia("(hover: hover) and (pointer: fine)").matches,
    );
  }, [onEnter]);

  // Wordmark gets a much smaller, opposite-direction parallax shift than the
  // statue's rotation — reinforces that it's sitting further back in depth,
  // rather than just being a flat sticker behind the model.
  useEffect(() => {
    if (!canHover || reducedMotion) return;
    function handleMove(e: PointerEvent) {
      if (!wordmarkRef.current) return;
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      wordmarkRef.current.style.transform = `translate3d(${-nx * 10}px, ${-ny * 6}px, 0)`;
    }
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [canHover, reducedMotion]);

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
    <div className="fixed inset-0 z-[999] overflow-hidden bg-ivory-100">
      {/* Behind the model: the giant wordmark. Canvas below is alpha-transparent,
          so the statue's opaque mesh genuinely occludes these letters where it
          overlaps them — this is real depth compositing, not a mask trick. */}
      <div
        ref={wordmarkRef}
        className={`pointer-events-none absolute inset-x-0 top-[38%] z-0 flex items-center justify-between px-4 transition-opacity duration-[1400ms] sm:px-8 ${
          revealed ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDelay: revealed ? "300ms" : "0ms" }}
        aria-hidden="true"
      >
        <span
          className="font-logo leading-none text-charcoal-900"
          style={{ fontSize: "clamp(3.5rem, 11vw, 10rem)" }}
        >
          PATAK
        </span>
        <span
          className="font-logo leading-none text-charcoal-900"
          style={{ fontSize: "clamp(3.5rem, 11vw, 10rem)" }}
        >
          MUNDI
        </span>
      </div>

      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0.35, 2.6], fov: 28 }}
        gl={{ antialias: true, alpha: true }}
        className="relative z-10"
      >
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[2, 3, 2]}
          intensity={1.15}
          color="#fff7ea"
        />
        <directionalLight
          position={[-3, 1, -2]}
          intensity={0.35}
          color="#dfe6ff"
        />

        <Suspense fallback={null}>
          <Statue
            revealed={revealed}
            canHover={canHover}
            reducedMotion={reducedMotion}
          />
          {/* Requires network access at runtime to fetch the HDRI from
              drei's CDN — fine in production, just noting the dependency. */}
          <Environment preset="studio" environmentIntensity={0.85} />
        </Suspense>

        <LoadWatcher onReady={() => setRevealed(true)} />
      </Canvas>

      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 z-20 h-56 bg-gradient-to-t from-ivory-100 via-ivory-100/70 to-transparent transition-opacity duration-700 ${
          revealed ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className={`absolute inset-x-0 bottom-14 z-30 flex flex-col items-center gap-5 px-6 text-center transition-all duration-700 ${
          revealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
        style={{ transitionDelay: revealed ? "1400ms" : "0ms" }}
      >
        <p className="text-[11px] uppercase tracking-ultra text-charcoal-500">
          Hand-finished. Ethically sourced. Made to last.
        </p>
        <button
          type="button"
          onClick={handleEnter}
          className="group flex items-center gap-2 bg-charcoal-900 px-9 py-4 text-xs font-medium uppercase tracking-widest text-ivory-50 transition-all hover:bg-champagne-500 hover:text-charcoal-900"
        >
          Visit the Store
        </button>
      </div>
    </div>
  );
}

/** Flags revealed=true once the GLTF (and any textures) finish loading. */
function LoadWatcher({ onReady }: { onReady: () => void }) {
  const { active, progress } = useProgress();
  const firedRef = useRef(false);
  useEffect(() => {
    if (!active && progress === 100 && !firedRef.current) {
      firedRef.current = true;
      onReady();
    }
  }, [active, progress, onReady]);
  return null;
}

function Statue({
  revealed,
  canHover,
  reducedMotion,
}: {
  revealed: boolean;
  canHover: boolean;
  reducedMotion: boolean;
}) {
  const { scene } = useGLTF(MODEL_PATH);
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const startClock = useRef<number | null>(null);

  // The exported model's bounding box is already centered near the origin
  // (verified when preparing the asset), so no manual re-centering here.
  const model = useMemo(() => scene, [scene]);

  useEffect(() => {
    if (!canHover || reducedMotion) return;
    function handleMove(e: PointerEvent) {
      pointer.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    }
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [canHover, reducedMotion]);

  useFrame((state, delta) => {
    if (!group.current) return;

    if (revealed && startClock.current === null) {
      startClock.current = state.clock.elapsedTime;
    }
    const t =
      startClock.current !== null
        ? state.clock.elapsedTime - startClock.current
        : 0;

    // Entrance: settle in from a slight turn + slightly smaller scale.
    const introDuration = reducedMotion ? 0.4 : 1.6;
    const introProgress = revealed ? Math.min(1, t / introDuration) : 0;
    const eased = 1 - Math.pow(1 - introProgress, 3);
    const introScale = 0.85 + eased * 0.15;
    const introYaw = THREE.MathUtils.degToRad(-18) * (1 - eased);

    // Ongoing: turn toward the cursor (real rotation, not a CSS illusion),
    // or a slow idle sway when there's no fine pointer to track.
    let targetYaw = 0;
    let targetPitch = 0;
    if (canHover && !reducedMotion) {
      targetYaw = THREE.MathUtils.degToRad(pointer.current.x * 22);
      targetPitch = THREE.MathUtils.degToRad(-pointer.current.y * 8);
    } else if (!reducedMotion) {
      targetYaw = THREE.MathUtils.degToRad(
        Math.sin(state.clock.elapsedTime * 0.25) * 10,
      );
    }

    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      introYaw + targetYaw,
      delta * 3,
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      targetPitch,
      delta * 3,
    );

    const s = THREE.MathUtils.lerp(
      group.current.scale.x || introScale,
      introScale,
      delta * 3,
    );
    group.current.scale.setScalar(s);
  });

  return (
    <group ref={group} scale={0.85}>
      <primitive object={model} />
    </group>
  );
}

useGLTF.preload(MODEL_PATH);
