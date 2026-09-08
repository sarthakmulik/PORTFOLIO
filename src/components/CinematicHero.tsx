'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const FRAME_COUNT = 152;

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface ScrollState {
  progress: number;        // 0–1 through entire hero
  frameIndex: number;      // 0–51
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function CinematicHero() {
  const containerRef   = useRef<HTMLDivElement>(null);
  const canvasRef      = useRef<HTMLCanvasElement>(null);
  const imagesRef      = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef         = useRef<number | null>(null);

  // ── UI parallax refs (avoid React re-renders on scroll) ──
  const nameTopRef        = useRef<HTMLDivElement>(null);
  const nameBottomRef     = useRef<HTMLDivElement>(null);
  const metaLeftRef       = useRef<HTMLDivElement>(null);
  const metaRightRef      = useRef<HTMLDivElement>(null);
  const accentLineRef     = useRef<HTMLDivElement>(null);
  const frameCounterRef   = useRef<HTMLSpanElement>(null);
  const frameTrackRef     = useRef<HTMLDivElement>(null);
  const ctaRef            = useRef<HTMLDivElement>(null);
  const navRef            = useRef<HTMLElement>(null);
  const aboutPreviewRef   = useRef<HTMLDivElement>(null);
  const redGlowRef        = useRef<HTMLDivElement>(null);
  const uiOverlayRef      = useRef<HTMLDivElement>(null);

  const [loaded, setLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);


  // ── Reduced motion ──────────────────────────────────────────────────────
  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER FRAME TO CANVAS
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

    // Object-cover math
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

    ctx.imageSmoothingEnabled  = true;
    ctx.imageSmoothingQuality  = 'high';
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);

    currentFrameRef.current = index;
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // SCROLL-DRIVEN UI MOTION  (NO React state — pure DOM mutations)
  // ─────────────────────────────────────────────────────────────────────────
  const updateUI = useCallback(({ progress, frameIndex }: ScrollState) => {
    const p = progress; // 0–1

    // Frame counter text
    if (frameCounterRef.current) {
      frameCounterRef.current.textContent = String(frameIndex + 1).padStart(3, '0');
    }

    // Frame track progress bar
    if (frameTrackRef.current) {
      frameTrackRef.current.style.transform = `scaleY(${p})`;
    }

    if (prefersReducedMotion) return;

    // Very subtle parallax — name slides up as we scroll
    const nameOffset = p * -28;   // px, gentle drift
    if (nameTopRef.current)    nameTopRef.current.style.transform    = `translateY(${nameOffset * 0.6}px)`;
    if (nameBottomRef.current) nameBottomRef.current.style.transform = `translateY(${nameOffset * 0.9}px)`;

    // Meta annotations shift slightly
    if (metaLeftRef.current)  metaLeftRef.current.style.transform  = `translateY(${p * -12}px)`;
    if (metaRightRef.current) metaRightRef.current.style.transform = `translateY(${p * -8}px)`;

    // CTA drifts gently
    if (ctaRef.current) ctaRef.current.style.transform = `translateY(${p * -16}px)`;

    // Navigation fades slightly as user scrolls deep (they know the UI)
    if (navRef.current) {
      const navOpacity = p > 0.7 ? 1 - ((p - 0.7) / 0.3) * 0.5 : 1;
      navRef.current.style.opacity = String(navOpacity);
    }

    // Red accent line extends as the sequence advances
    if (accentLineRef.current) {
      accentLineRef.current.style.transform = `scaleX(${0.08 + p * 0.92})`;
    }

    // Crimson ambient glow intensifies at mid-scroll then fades
    if (redGlowRef.current) {
      const glowOpacity = Math.sin(p * Math.PI) * 0.08;
      redGlowRef.current.style.opacity = String(glowOpacity);
    }

    // About preview fades in near the end
    if (aboutPreviewRef.current) {
      const preview = p > 0.8 ? (p - 0.8) / 0.2 : 0;
      aboutPreviewRef.current.style.opacity = String(preview);
      aboutPreviewRef.current.style.transform = `translateY(${(1 - preview) * 12}px)`;
    }

    // UI overlay darkens at the very end (transition to About)
    if (uiOverlayRef.current && p > 0.88) {
      const fade = (p - 0.88) / 0.12;
      uiOverlayRef.current.style.opacity = String(1 - fade * 0.7);
    } else if (uiOverlayRef.current) {
      uiOverlayRef.current.style.opacity = '1';
    }
  }, [prefersReducedMotion]);

  // ─────────────────────────────────────────────────────────────────────────
  // IMAGE LOADING
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    let isMounted   = true;
    let loadedCount = 0;

    const images: HTMLImageElement[] = Array.from(
      { length: FRAME_COUNT },
      () => new Image()
    );
    imagesRef.current = images;

    // Priority load order
    const priority: number[] = prefersReducedMotion
      ? [FRAME_COUNT - 1, ...Array.from({ length: FRAME_COUNT - 1 }, (_, i) => i)]
      : [0, 1, 2, 3, 4, 5, 6, 7, ...Array.from({ length: FRAME_COUNT - 8 }, (_, i) => i + 8)];

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
          img.src = `/assets/main/frame-${(i + 1).toString().padStart(4, '0')}.webp`;
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
  // SCROLL + RESIZE LISTENERS
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

      // Render canvas only when frame changes
      if (targetFrame !== currentFrameRef.current) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => renderFrame(targetFrame));
      }

      // Always update UI for smooth parallax
      updateUI({ progress, frameIndex: targetFrame });
    };

    const handleResize = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => renderFrame(currentFrameRef.current));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    handleScroll(); // initial

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
      className="relative w-full bg-[#050505]"
      style={{ height: '500vh' }}
      aria-label="Cinematic hero introduction"
    >
      {/* ── Loading Screen ─────────────────────────────────────────────── */}
      {!loaded && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] gap-6">
          {/* Wordmark */}
          <span className="text-meta text-[#f0ece4]/20 tracking-[0.3em]">SM / SARTHAK MULIK</span>

          {/* Crimson progress bar */}
          <div className="w-32 h-[1px] bg-white/10 relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-[#9b1c1c] transition-all duration-150"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>

          <span className="text-meta text-[#f0ece4]/25">{loadingProgress < 100 ? loadingProgress : ''}%</span>
        </div>
      )}

      {/* ── Sticky Viewport ────────────────────────────────────────────── */}
      <div className="sticky top-0 w-full overflow-hidden" style={{ height: '100vh' }}>

        {/* LAYER 1: Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          aria-hidden="true"
        />

        {/* LAYER 2: Atmospheric overlays */}

        {/* Vignette — darkens corners for cinematic feel */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background: `radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(5,5,5,0.72) 100%)`,
          }}
        />

        {/* Bottom gradient — eases text readability without obscuring the portrait */}
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          aria-hidden="true"
          style={{ height: '45%', background: 'linear-gradient(to top, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.4) 55%, transparent 100%)' }}
        />

        {/* Top gradient — header legibility */}
        <div
          className="absolute inset-x-0 top-0 pointer-events-none"
          aria-hidden="true"
          style={{ height: '22%', background: 'linear-gradient(to bottom, rgba(5,5,5,0.75) 0%, transparent 100%)' }}
        />

        {/* Red ambient glow — subtle chromatic atmosphere, hidden initially */}
        <div
          ref={redGlowRef}
          className="absolute inset-0 pointer-events-none opacity-0"
          aria-hidden="true"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 30% 65%, rgba(155,28,28,0.35) 0%, transparent 70%)' }}
        />

        {/* Film grain */}
        <div className="grain-overlay" aria-hidden="true" />

        {/* LAYER 3: Interactive UI */}
        <div
          ref={uiOverlayRef}
          className={`absolute inset-0 z-10 transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* ── 12-col editorial grid container ──────────────────────── */}
          <div className="absolute inset-0 grid grid-cols-12 px-6 md:px-10 lg:px-14" style={{ pointerEvents: 'none' }}>
            {/* Extremely subtle column guides — editorial skeleton */}
            {Array.from({ length: 11 }).map((_, i) => (
              <div
                key={i}
                className="col-span-1 border-r border-white/[0.025]"
                aria-hidden="true"
              />
            ))}
          </div>

          {/* ── HEADER ─────────────────────────────────────────────────── */}
          <header
            ref={navRef}
            className="absolute top-0 inset-x-0 flex justify-between items-start px-6 md:px-10 lg:px-14 pt-8 md:pt-10"
            style={{ pointerEvents: 'auto', zIndex: 20 }}
          >
            {/* Identity mark — TOP LEFT */}
            <div
              className="animate-[fade-in_0.9s_ease_both] delay-100"
              style={{ animationFillMode: 'both' }}
            >
              <div className="text-meta text-[#f0ece4]/50 leading-snug">SM</div>
              <div className="text-meta text-[#f0ece4]/25 mt-0.5">SARTHAK MULIK</div>
            </div>

            {/* Desktop Navigation — TOP RIGHT */}
            <nav
              className="hidden md:flex flex-col items-end gap-4 animate-[fade-in_0.9s_ease_both] delay-200"
              style={{ animationFillMode: 'both' }}
              aria-label="Primary navigation"
            >
              {[
                { label: 'INDEX',   href: '#'        },
                { label: 'WORK',    href: '#work'    },
                { label: 'ABOUT',   href: '#about'   },
                { label: 'CONTACT', href: '#contact' },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="nav-link text-nav text-[#f0ece4]/45 hover:text-[#f0ece4] transition-colors duration-200"
                >
                  {label}
                </a>
              ))}
            </nav>

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex flex-col justify-center gap-[6px] p-2 -mr-2"
              aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileNavOpen}
              onClick={() => setMobileNavOpen(v => !v)}
            >
              <span
                className="block h-[1px] bg-[#f0ece4]/70 origin-center transition-all duration-300"
                style={{
                  width: '22px',
                  transform: mobileNavOpen ? 'translateY(7px) rotate(45deg)' : 'none',
                }}
              />
              <span
                className="block h-[1px] bg-[#f0ece4]/70 transition-all duration-300"
                style={{
                  width: '14px',
                  opacity: mobileNavOpen ? 0 : 1,
                  transform: mobileNavOpen ? 'scaleX(0)' : 'none',
                }}
              />
              <span
                className="block h-[1px] bg-[#f0ece4]/70 origin-center transition-all duration-300"
                style={{
                  width: '22px',
                  transform: mobileNavOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
                }}
              />
            </button>
          </header>

          {/* ── MOBILE NAV OVERLAY ──────────────────────────────────────── */}
          <div
            className="md:hidden fixed inset-0 z-30 flex flex-col justify-end"
            style={{
              background: 'rgba(5,5,5,0.97)',
              backdropFilter: 'blur(12px)',
              pointerEvents: mobileNavOpen ? 'auto' : 'none',
              opacity: mobileNavOpen ? 1 : 0,
              transition: 'opacity 0.35s cubic-bezier(0.16,1,0.3,1)',
            }}
            aria-hidden={!mobileNavOpen}
          >
            {/* Crimson accent line */}
            <div
              className="absolute top-0 inset-x-0 h-[1px]"
              style={{ background: 'rgba(155,28,28,0.3)' }}
              aria-hidden="true"
            />

            <nav
              className="px-8 pb-20 pt-8 flex flex-col gap-2"
              aria-label="Mobile navigation"
            >
              {[
                { label: 'INDEX',   href: '#',        num: '00' },
                { label: 'ABOUT',   href: '#about',   num: '01' },
                { label: 'WORK',    href: '#work',    num: '02' },
                { label: 'STACK',   href: '#stack',   num: '03' },
                { label: 'CONTACT', href: '#contact', num: '05' },
              ].map(({ label, href, num }, idx) => (
                <a
                  key={label}
                  href={href}
                  className="group flex items-baseline gap-5 py-5 border-b"
                  style={{
                    borderColor: 'rgba(240,236,228,0.06)',
                    transitionDelay: `${idx * 50}ms`,
                    transform: mobileNavOpen ? 'translateY(0)' : 'translateY(16px)',
                    opacity: mobileNavOpen ? 1 : 0,
                    transition: `transform 0.5s cubic-bezier(0.16,1,0.3,1) ${idx * 60}ms, opacity 0.4s ease ${idx * 60}ms`,
                    textDecoration: 'none',
                  }}
                  onClick={() => setMobileNavOpen(false)}
                >
                  <span className="text-meta" style={{ color: 'rgba(155,28,28,0.55)', minWidth: '1.5rem' }}>
                    {num}
                  </span>
                  <span
                    className="font-extrabold tracking-tight leading-none"
                    style={{ fontSize: 'clamp(2.2rem, 10vw, 3.5rem)', color: 'rgba(240,236,228,0.85)' }}
                  >
                    {label}
                  </span>
                  <span className="ml-auto text-[#9b1c1c] text-xl" aria-hidden="true">→</span>
                </a>
              ))}

              {/* Bottom meta */}
              <div className="mt-10 flex items-center justify-between">
                <span className="text-meta" style={{ color: 'rgba(240,236,228,0.18)' }}>PUNE / INDIA · 2026</span>
                <span className="text-meta" style={{ color: 'rgba(240,236,228,0.1)' }}>SM</span>
              </div>
            </nav>
          </div>


          {/* ── MAIN TYPOGRAPHIC COMPOSITION ─────────────────────────── */}
          {/*
              SPATIAL STRATEGY:
              Name is positioned in the lower-left quadrant.
              This leaves the centre-right clear for the subject's face.
              Metadata annotates without obstructing.
          */}
          <div
            className="absolute inset-x-0 bottom-0 px-6 md:px-10 lg:px-14 pb-16 md:pb-24"
            style={{ pointerEvents: 'auto' }}
          >
            {/* Accent line — extends with scroll */}
            <div className="mb-4 md:mb-8 overflow-hidden" aria-hidden="true">
              <div
                ref={accentLineRef}
                className="h-[1px] bg-[#9b1c1c] origin-left"
                style={{ transform: 'scaleX(0.08)', width: '120px' }}
              />
            </div>

            <div className="flex items-end justify-between gap-4 md:gap-8">

              {/* ─ Left: Name + discipline ─ */}
              <div className="flex flex-col min-w-0">

                {/* Discipline tag */}
                <div
                  className="text-meta text-[#9b1c1c] mb-3 md:mb-5 animate-[fade-up_0.9s_cubic-bezier(0.16,1,0.3,1)_both] delay-400 truncate"
                  style={{ animationFillMode: 'both' }}
                >
                  DESIGN. SYSTEMS. EXECUTION.
                </div>

                {/* Primary name — editorial split */}
                <div ref={nameTopRef} className="overflow-hidden">
                  <h1
                    className="block font-extrabold leading-[0.88] tracking-tight text-[#f0ece4] animate-[fade-up_1s_cubic-bezier(0.16,1,0.3,1)_both] delay-500"
                    style={{
                      fontSize: 'clamp(2.8rem, 8.5vw, 9.5rem)',
                      animationFillMode: 'both',
                    }}
                  >
                    SARTHAK
                  </h1>
                </div>

                <div ref={nameBottomRef} className="overflow-hidden">
                  <h1
                    className="block font-extrabold leading-[0.88] tracking-tight animate-[fade-up_1s_cubic-bezier(0.16,1,0.3,1)_both] delay-600"
                    style={{
                      fontSize: 'clamp(2.8rem, 8.5vw, 9.5rem)',
                      animationFillMode: 'both',
                      color: 'transparent',
                      WebkitTextStroke: '1px rgba(240,236,228,0.35)',
                      paddingLeft: 'clamp(0.8rem, 4vw, 5rem)',
                    }}
                  >
                    MULIK
                  </h1>
                </div>

                {/* Slash + role */}
                <div
                  className="flex items-center gap-3 mt-3 md:mt-5 animate-[fade-up_0.9s_cubic-bezier(0.16,1,0.3,1)_both] delay-700"
                  style={{ animationFillMode: 'both' }}
                >
                  <span className="text-[#9b1c1c] text-label" aria-hidden="true">/</span>
                  <span className="text-label text-[#f0ece4]/50">SOFTWARE DEVELOPER / PRODUCT BUILDER</span>
                </div>

                {/* CTA editorial links */}
                <div
                  ref={ctaRef}
                  className="flex flex-col sm:flex-row gap-4 sm:gap-5 mt-5 md:mt-8 animate-[fade-up_0.9s_cubic-bezier(0.16,1,0.3,1)_both] delay-800"
                  style={{ animationFillMode: 'both' }}
                >
                  <a href="#work" className="editorial-link text-label text-[#f0ece4]/80">
                    <span>VIEW WORK</span>
                    <span className="arrow text-[#9b1c1c]" aria-hidden="true">→</span>
                  </a>
                  <a href="#contact" className="editorial-link text-label text-[#f0ece4]/40">
                    <span>CONTACT ME</span>
                    <span className="arrow text-[#f0ece4]/30" aria-hidden="true">→</span>
                  </a>
                </div>
              </div>

              {/* ─ Right column: meta + scroll indicator (desktop only) ─ */}
              <div className="hidden lg:flex flex-col items-end gap-8 flex-shrink-0 pb-1">

                {/* Location + availability metadata */}
                <div
                  ref={metaRightRef}
                  className="flex flex-col items-end gap-3 animate-[fade-in_1s_ease_both] delay-700"
                  style={{ animationFillMode: 'both' }}
                >
                  <div className="text-meta text-[#f0ece4]/30">PUNE / INDIA</div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#9b1c1c]" aria-hidden="true" />
                    <span className="text-meta text-[#f0ece4]/30">AVAILABLE FOR SELECT PROJECTS</span>
                  </div>
                  <div className="text-meta text-[#f0ece4]/15">2026</div>
                </div>

                <div
                  className="flex flex-col items-end gap-2 animate-[fade-in_1s_ease_both] delay-900"
                  style={{ animationFillMode: 'both' }}
                  aria-label="Scroll progress"
                >
                  <span
                    ref={frameCounterRef}
                    className="font-bold tabular-nums"
                    style={{ fontSize: '10px', letterSpacing: '0.15em', color: 'rgba(240,236,228,0.6)' }}
                  >
                    001
                  </span>
                  {/* Track bar */}
                  <div className="relative w-[1px] bg-white/10 overflow-hidden" style={{ height: '56px' }}>
                    <div
                      ref={frameTrackRef}
                      className="absolute top-0 inset-x-0 bg-[#9b1c1c] origin-top"
                      style={{ height: '100%', transform: 'scaleY(0)' }}
                    />
                  </div>
                  <span className="text-meta" style={{ color: 'rgba(240,236,228,0.2)' }}>
                    152
                  </span>
                </div>
              </div>

            </div>

            {/* ─ Bottom strip: location (mobile) + about preview ─ */}
            <div className="mt-4 md:mt-6 flex items-center justify-between">

              {/* Left metadata */}
              <div
                ref={metaLeftRef}
                className="animate-[fade-in_1s_ease_both] delay-900"
                style={{ animationFillMode: 'both' }}
              >
                <span className="text-meta text-[#f0ece4]/20">PUNE / INDIA · 2026</span>
              </div>

              {/* About preview — fades in near end of sequence */}
              <div
                ref={aboutPreviewRef}
                className="flex items-center gap-3 opacity-0"
                aria-hidden="true"
              >
                <span className="text-meta text-[#9b1c1c]">01</span>
                <div className="w-12 h-[1px] bg-[#9b1c1c]/40" />
                <span className="text-meta text-[#f0ece4]/30">ABOUT</span>
              </div>

            </div>
          </div>


        </div>{/* /uiOverlay */}
      </div>{/* /sticky */}
    </section>
  );
}
