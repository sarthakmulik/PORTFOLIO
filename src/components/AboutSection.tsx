'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const FRAME_COUNT   = 102;
const SECTION_VH    = 620;   // Total scroll height: ~620vh

// Narrative beat thresholds (progress 0–1 through About section)
// Each beat defines when a text group is visible: [fadeInAt, peakAt, fadeOutAt]
const BEATS = {
  chapter:   { in: 0.00, peak: 0.05, out: 0.18 },   // "02 / ABOUT"
  tagline:   { in: 0.10, peak: 0.18, out: 0.34 },   // "THE BUILDER / BEHIND / THE PRODUCTS."
  code:      { in: 0.28, peak: 0.36, out: 0.50 },   // "I DON'T JUST / WRITE CODE."
  products:  { in: 0.44, peak: 0.52, out: 0.64 },   // "I BUILD / PRODUCTS."
  pipeline:  { in: 0.57, peak: 0.65, out: 0.77 },   // IDEA → DESIGN → SYSTEM → DEPLOY
  details:   { in: 0.70, peak: 0.78, out: 0.90 },   // "I CARE ABOUT / THE DETAILS."
  close:     { in: 0.84, peak: 0.91, out: 1.00 },   // "THAT'S HOW / I BUILD."
  workHint:  { in: 0.87, peak: 0.93, out: 1.00 },   // "03 / SELECTED WORK" preview
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Smooth step: maps x ∈ [edge0, edge1] → [0, 1] with ease */
function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/** Computes opacity for a narrative beat given current progress */
function beatOpacity(p: number, beat: { in: number; peak: number; out: number }): number {
  if (p < beat.in  || p > beat.out) return 0;
  if (p <= beat.peak) return smoothstep(beat.in, beat.peak, p);
  return 1 - smoothstep(beat.peak, beat.out, p);
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function AboutSection() {
  const containerRef    = useRef<HTMLDivElement>(null);
  const canvasRef       = useRef<HTMLCanvasElement>(null);
  const imagesRef       = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef          = useRef<number | null>(null);

  // Narrative beat DOM refs — mutated directly to avoid re-renders
  const beatRefs = {
    chapter:  useRef<HTMLDivElement>(null),
    tagline:  useRef<HTMLDivElement>(null),
    code:     useRef<HTMLDivElement>(null),
    products: useRef<HTMLDivElement>(null),
    pipeline: useRef<HTMLDivElement>(null),
    details:  useRef<HTMLDivElement>(null),
    close:    useRef<HTMLDivElement>(null),
    workHint: useRef<HTMLDivElement>(null),
  };

  // Secondary animated refs
  const frameCounterRef  = useRef<HTMLSpanElement>(null);
  const progressBarRef   = useRef<HTMLDivElement>(null);
  const redGlowRef       = useRef<HTMLDivElement>(null);
  const accentLineRef    = useRef<HTMLDivElement>(null);

  const [loaded, setLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  // ─────────────────────────────────────────────────────────────────────────
  // CANVAS RENDERING
  // ─────────────────────────────────────────────────────────────────────────
  const renderFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[index];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const dpr  = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width  = rect.width  * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    }

    // Object-cover centering
    const cw = rect.width;
    const ch = rect.height;
    const ir = img.naturalWidth / img.naturalHeight;
    const cr = cw / ch;

    let dw = cw, dh = ch, dx = 0, dy = 0;
    if (ir > cr) {
      dw = ch * ir;
      dx = (cw - dw) / 2;
    } else {
      dh = cw / ir;
      dy = (ch - dh) / 2;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);

    currentFrameRef.current = index;
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // SCROLL-DRIVEN UI UPDATES (pure DOM — no React state)
  // ─────────────────────────────────────────────────────────────────────────
  const updateUI = useCallback((progress: number, frameIndex: number) => {
    // Frame counter
    if (frameCounterRef.current) {
      frameCounterRef.current.textContent = String(frameIndex + 1).padStart(3, '0');
    }

    // Progress bar
    if (progressBarRef.current) {
      progressBarRef.current.style.transform = `scaleY(${progress})`;
    }

    // Accent line extends through the sequence
    if (accentLineRef.current) {
      accentLineRef.current.style.transform = `scaleX(${0.05 + progress * 0.95})`;
    }

    // Red ambient glow — gentle sine pulse across the sequence
    if (redGlowRef.current) {
      const g = Math.sin(progress * Math.PI) * 0.06;
      redGlowRef.current.style.opacity = String(g);
    }

    if (prefersReducedMotion) return;

    // Narrative beats — opacity + subtle translateY
    for (const [key, ref] of Object.entries(beatRefs)) {
      if (!ref.current) continue;
      const beat = BEATS[key as keyof typeof BEATS];
      const op   = beatOpacity(progress, beat);
      const ty   = (1 - Math.min(op * 2, 1)) * 14; // slides up as it fades in
      ref.current.style.opacity   = String(op);
      ref.current.style.transform = `translateY(${ty}px)`;
    }
  }, [prefersReducedMotion]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─────────────────────────────────────────────────────────────────────────
  // IMAGE LOADING
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    let isMounted   = true;
    let loadedCount = 0;

    const images: HTMLImageElement[] = Array.from({ length: FRAME_COUNT }, () => new Image());
    imagesRef.current = images;

    // Load first 10 frames immediately, then rest sequentially
    const priority: number[] = prefersReducedMotion
      ? [FRAME_COUNT - 1, ...Array.from({ length: FRAME_COUNT - 1 }, (_, i) => i)]
      : [
          0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
          ...Array.from({ length: FRAME_COUNT - 10 }, (_, i) => i + 10),
        ];

    const loadImages = async () => {
      for (const i of priority) {
        if (!isMounted) return;
        await new Promise<void>((resolve) => {
          const img = images[i];
          img.onload = () => {
            loadedCount++;
            if (isMounted) setLoadingProgress(Math.floor((loadedCount / FRAME_COUNT) * 100));
            if (i === priority[0] && isMounted) {
              setLoaded(true);
              renderFrame(i);
            }
            resolve();
          };
          img.onerror = () => resolve();
          img.src = `/assets/about/frame-${(i + 1).toString().padStart(4, '0')}.webp`;
        });
      }
    };

    loadImages();

    return () => {
      isMounted = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [renderFrame, prefersReducedMotion]);

  // ─────────────────────────────────────────────────────────────────────────
  // SCROLL + RESIZE
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const { top, height } = containerRef.current.getBoundingClientRect();
      const vh = window.innerHeight;

      const scrollable = height - vh;
      const scrolled   = -top;
      let progress     = Math.max(0, Math.min(1, scrolled / scrollable));

      let targetFrame = Math.floor(progress * (FRAME_COUNT - 1));
      if (prefersReducedMotion) targetFrame = FRAME_COUNT - 1;

      if (targetFrame !== currentFrameRef.current) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => renderFrame(targetFrame));
      }

      updateUI(progress, targetFrame);
    };

    const handleResize = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => renderFrame(currentFrameRef.current));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [renderFrame, updateUI, prefersReducedMotion]);

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <section
      ref={containerRef}
      id="about"
      className="relative w-full bg-[#050505]"
      style={{ height: `${SECTION_VH}vh` }}
      aria-label="About — Chapter 02"
    >
      {/* ── In-section loading indicator (subtle, not a blocking screen) ── */}
      {!loaded && (
        <div
          className="sticky top-0 w-full flex flex-col items-end justify-end px-10 lg:px-14 pb-10"
          style={{ height: '100vh', pointerEvents: 'none', zIndex: 40 }}
        >
          <div className="flex flex-col items-end gap-2">
            <span className="text-meta" style={{ color: 'rgba(155,28,28,0.6)', letterSpacing: '0.2em' }}>
              02 / ABOUT
            </span>
            <div className="w-24 h-[1px] bg-white/10 relative overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-[#9b1c1c] transition-all duration-200"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Sticky viewport ──────────────────────────────────────────────── */}
      <div
        className="sticky top-0 w-full overflow-hidden"
        style={{ height: '100vh' }}
      >
        {/* LAYER 1 — Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          aria-hidden="true"
        />

        {/* LAYER 2 — Atmospherics */}

        {/* Strong vignette — the About section is more intimate */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background: 'radial-gradient(ellipse 75% 75% at 50% 50%, transparent 35%, rgba(5,5,5,0.78) 100%)',
          }}
        />

        {/* Left edge dark band — keeps left-side text always legible */}
        <div
          className="absolute inset-y-0 left-0 pointer-events-none"
          aria-hidden="true"
          style={{
            width: '42%',
            background: 'linear-gradient(to right, rgba(5,5,5,0.82) 0%, rgba(5,5,5,0.35) 70%, transparent 100%)',
          }}
        />

        {/* Bottom gradient */}
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          aria-hidden="true"
          style={{
            height: '35%',
            background: 'linear-gradient(to top, rgba(5,5,5,0.90) 0%, rgba(5,5,5,0.3) 60%, transparent 100%)',
          }}
        />

        {/* Top gradient */}
        <div
          className="absolute inset-x-0 top-0 pointer-events-none"
          aria-hidden="true"
          style={{
            height: '18%',
            background: 'linear-gradient(to bottom, rgba(5,5,5,0.70) 0%, transparent 100%)',
          }}
        />

        {/* Red ambient — subtle atmospheric light */}
        <div
          ref={redGlowRef}
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            opacity: 0,
            background: 'radial-gradient(ellipse 55% 55% at 20% 60%, rgba(155,28,28,0.40) 0%, transparent 70%)',
          }}
        />

        {/* Film grain */}
        <div className="grain-overlay" aria-hidden="true" />

        {/* LAYER 3 — UI (only rendered once loaded) */}
        <div
          className="absolute inset-0 z-10"
          style={{ opacity: loaded ? 1 : 0, transition: 'opacity 1s ease' }}
        >
          {/* ── SECTION LABEL (top-left, always visible) ─────────────── */}
          <div
            className="absolute top-0 left-0 px-6 md:px-10 lg:px-14 pt-8 md:pt-10 flex items-center gap-4"
            style={{ pointerEvents: 'none' }}
          >
            <div className="flex items-center gap-3">
              <span className="text-meta" style={{ color: 'rgba(155,28,28,0.8)' }}>01</span>
              <span className="text-meta" style={{ color: 'rgba(155,28,28,0.5)' }}>/</span>
              <span className="tracking-widest uppercase" style={{ fontSize: '0.8rem', color: 'rgba(240,236,228,0.8)' }}>ABOUT</span>
            </div>
            <div
              ref={accentLineRef}
              className="h-[1px] bg-[#9b1c1c]/30 origin-left ml-2"
              style={{ width: '40px', transform: 'scaleX(0.05)' }}
            />
          </div>

          {/* ── PROGRESS INDICATOR (right edge, vertical) — desktop only ── */}
          <div
            className="absolute right-6 md:right-10 lg:right-14 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-2"
            style={{ pointerEvents: 'none' }}
            aria-label="About section progress"
          >
            <span
              ref={frameCounterRef}
              className="tabular-nums font-semibold"
              style={{ fontSize: '9px', letterSpacing: '0.12em', color: 'rgba(240,236,228,0.5)' }}
            >
              001
            </span>
            <div
              className="relative overflow-hidden bg-white/[0.07]"
              style={{ width: '1px', height: '64px' }}
            >
              <div
                ref={progressBarRef}
                className="absolute top-0 inset-x-0 bg-[#9b1c1c] origin-top"
                style={{ height: '100%', transform: 'scaleY(0)' }}
              />
            </div>
            <span
              className="text-meta"
              style={{ color: 'rgba(240,236,228,0.15)' }}
            >
              102
            </span>
          </div>

          {/* ── NARRATIVE BEATS (left column, stacked, scroll-choreographed) */}
          {/*
              All beats occupy the same absolute position on the left.
              They appear and disappear via opacity as scroll progresses.
              No layout shift — pure opacity + subtle translateY.
          */}
          <div
            className="absolute inset-y-0 left-0 flex flex-col justify-center
                        px-6 md:px-10 lg:px-14"
            style={{ width: '100%', maxWidth: '640px', pointerEvents: 'none' }}
          >
            {/* Shared wrapper keeps beats stacked at the same baseline */}
            <div className="relative" style={{ minHeight: 'clamp(180px, 40vw, 280px)' }}>

              {/* Beat 1: Chapter intro */}
              <div
                ref={beatRefs.chapter}
                className="absolute inset-0 flex flex-col justify-center"
                style={{ opacity: 0 }}
              >
                <p className="text-meta mb-4" style={{ color: 'rgba(155,28,28,0.7)' }}>
                  CHAPTER 02
                </p>
                <h2
                  className="font-light leading-[1.1]"
                  style={{
                    fontSize: 'clamp(1.1rem, 2.2vw, 1.7rem)',
                    color: 'rgba(240,236,228,0.35)',
                    letterSpacing: '0.06em',
                  }}
                >
                  ABOUT
                </h2>
              </div>

              {/* Beat 2: Tagline */}
              <div
                ref={beatRefs.tagline}
                className="absolute inset-0 flex flex-col justify-center"
                style={{ opacity: 0 }}
              >
                <p className="text-meta mb-6" style={{ color: 'rgba(155,28,28,0.5)' }}>
                  WHO IS THIS PERSON?
                </p>
                <h2
                  className="font-extrabold leading-[0.92] tracking-tight"
                  style={{
                    fontSize: 'clamp(2.8rem, 6vw, 6.5rem)',
                    color: 'rgba(240,236,228,0.88)',
                  }}
                >
                  I DESIGN
                  <br />
                  <span
                    style={{
                      color: 'transparent',
                      WebkitTextStroke: '1.5px rgba(240,236,228,0.3)',
                      paddingLeft: 'clamp(1rem, 3vw, 3rem)',
                    }}
                  >
                    DIGITAL
                  </span>
                  <br />
                  PRODUCTS
                </h2>
              </div>

              {/* Beat 3: I don't just write code -> Engineered */}
              <div
                ref={beatRefs.code}
                className="absolute inset-0 flex flex-col justify-center"
                style={{ opacity: 0 }}
              >
                <h2
                  className="font-extrabold leading-[0.90] tracking-tight"
                  style={{
                    fontSize: 'clamp(2.4rem, 5vw, 5.5rem)',
                    color: 'rgba(240,236,228,0.88)',
                  }}
                >
                  THAT HAPPEN
                  <br />
                  <span
                    style={{
                      color: 'transparent',
                      WebkitTextStroke: '1px rgba(240,236,228,0.3)',
                    }}
                  >
                    TO BE ENGINEERED
                  </span>
                </h2>
              </div>

              {/* Beat 4: I build products -> Ground up */}
              <div
                ref={beatRefs.products}
                className="absolute inset-0 flex flex-col justify-center"
                style={{ opacity: 0 }}
              >
                <h2
                  className="font-extrabold leading-[0.90] tracking-tight"
                  style={{
                    fontSize: 'clamp(2.8rem, 6vw, 6.5rem)',
                    color: 'rgba(240,236,228,0.90)',
                  }}
                >
                  FROM THE
                  <br />
                  <span style={{ color: 'rgba(240,236,228,0.90)' }}>
                    GROUND UP.
                  </span>
                </h2>
                <p
                  className="mt-6 font-light"
                  style={{
                    fontSize: 'clamp(0.85rem, 1.4vw, 1.05rem)',
                    color: 'rgba(240,236,228,0.45)',
                    letterSpacing: '0.03em',
                    lineHeight: 1.7,
                    maxWidth: '32ch',
                  }}
                >
                  Code is just the material. The goal is always the experience.
                </p>
              </div>

              {/* Beat 5: Pipeline */}
              <div
                ref={beatRefs.pipeline}
                className="absolute inset-0 flex flex-col justify-center gap-3"
                style={{ opacity: 0 }}
              >
                {[
                  { label: 'IDEA',      active: true  },
                  { label: 'DESIGN',    active: false },
                  { label: 'SYSTEM',    active: false },
                  { label: 'DEPLOY',    active: false },
                ].map(({ label }, idx, arr) => (
                  <React.Fragment key={label}>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: 'rgba(155,28,28,0.7)' }}
                        aria-hidden="true"
                      />
                      <span
                        className="font-bold tracking-wide"
                        style={{
                          fontSize: 'clamp(1rem, 1.8vw, 1.5rem)',
                          color: 'rgba(240,236,228,0.80)',
                          letterSpacing: '0.08em',
                        }}
                      >
                        {label}
                      </span>
                    </div>
                    {idx < arr.length - 1 && (
                      <div
                        className="ml-[2px] h-4 w-[1px]"
                        style={{ background: 'rgba(155,28,28,0.25)' }}
                        aria-hidden="true"
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Beat 6: I care about the details */}
              <div
                ref={beatRefs.details}
                className="absolute inset-0 flex flex-col justify-center"
                style={{ opacity: 0 }}
              >
                <p className="text-meta mb-5" style={{ color: 'rgba(155,28,28,0.5)' }}>
                  CRAFT / PRECISION / EXPERIENCE
                </p>
                <h2
                  className="font-extrabold leading-[0.92] tracking-tight"
                  style={{
                    fontSize: 'clamp(2rem, 4vw, 4.2rem)',
                    color: 'rgba(240,236,228,0.88)',
                  }}
                >
                  I CARE ABOUT
                  <br />
                  <span
                    style={{
                      color: 'transparent',
                      WebkitTextStroke: '1px rgba(240,236,228,0.30)',
                    }}
                  >
                    THE DETAILS
                  </span>
                  <br />
                  THAT TURN SOFTWARE
                  <br />
                  <span style={{ color: 'rgba(240,236,228,0.50)', fontWeight: 300 }}>
                    INTO EXPERIENCE.
                  </span>
                </h2>
              </div>

              {/* Beat 7: Closing statement */}
              <div
                ref={beatRefs.close}
                className="absolute inset-0 flex flex-col justify-center"
                style={{ opacity: 0 }}
              >
                <h2
                  className="font-extrabold leading-[0.90] tracking-tight"
                  style={{
                    fontSize: 'clamp(2.4rem, 5vw, 5.5rem)',
                    color: 'rgba(240,236,228,0.88)',
                  }}
                >
                  THAT&apos;S HOW
                  <br />
                  I BUILD.
                </h2>
                <div
                  className="mt-8 flex items-center gap-3"
                  style={{ opacity: 0.6 }}
                >
                  <div
                    className="h-[1px]"
                    style={{ width: '32px', background: 'rgba(155,28,28,0.6)' }}
                    aria-hidden="true"
                  />
                  <span className="text-meta" style={{ color: 'rgba(240,236,228,0.35)' }}>
                    PUNE / INDIA · 2026
                  </span>
                </div>
              </div>

            </div>{/* /relative beat wrapper */}
          </div>

          {/* ── NEXT SECTION PREVIEW ─────────────────────────────────── */}
          <div
            ref={beatRefs.workHint}
            className="absolute bottom-8 right-6 md:right-10 lg:right-14
                       flex items-center gap-3"
            style={{ opacity: 0, pointerEvents: 'none' }}
            aria-hidden="true"
          >
            <span className="text-meta" style={{ color: 'rgba(155,28,28,0.7)' }}>03</span>
            <div style={{ width: '28px', height: '1px', background: 'rgba(155,28,28,0.35)' }} />
            <span className="text-meta" style={{ color: 'rgba(240,236,228,0.25)' }}>SELECTED WORK</span>
          </div>

          {/* ── BOTTOM METADATA STRIP (left, always faint) ────────────── */}
          <div
            className="absolute bottom-8 left-6 md:left-10 lg:left-14 flex items-center gap-6"
            style={{ pointerEvents: 'none' }}
          >
            <span className="text-meta" style={{ color: 'rgba(240,236,228,0.12)' }}>
              SOFTWARE · PRODUCT · SYSTEMS
            </span>
          </div>

        </div>{/* /ui layer */}
      </div>{/* /sticky */}
    </section>
  );
}
