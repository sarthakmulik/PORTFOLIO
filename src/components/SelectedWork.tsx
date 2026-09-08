'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import RevealText from '@/components/RevealText';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { projects as DATA_PROJECTS } from '@/data/projects';

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const PROJECTS = DATA_PROJECTS.filter(p => p.featured).slice(0, 4).map((p, idx) => ({
  slug:     p.slug,
  num:      p.number,
  name:     p.shortTitle || p.title,
  tag:      p.category.replace('\n', ' '),
  year:     p.year,
  desc:     p.description,
  src:      p.previewAsset || null,
  color:    ['rgba(155,28,28,0.12)', 'rgba(30,30,40,0.6)', 'rgba(20,20,20,0.8)', 'rgba(15,10,10,0.9)'][idx % 4],
}));

const TOTAL    = PROJECTS.length;             // 4
const SECTION_VH = 800;

// Scroll timeline: each project occupies a window.
// 0–0.12  = section intro
// 0.12–0.88 = four project windows, each 19%
// 0.88–1.00 = grid overview + outro
const INTRO_END    = 0.12;
const OUTRO_START  = 0.88;
const WORK_RANGE   = OUTRO_START - INTRO_END;   // 0.76
const PER_PROJECT  = WORK_RANGE / TOTAL;         // 0.19

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function SelectedWork() {
  const router = useRouter();
  const sectionRef   = useRef<HTMLDivElement>(null);
  const rafRef       = useRef<number | null>(null);
  const progressRef  = useRef(0);

  // Card element refs
  const cardRefs     = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);
  // Expanded preview refs
  const previewRefs  = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);
  // Image clip-path refs
  const imgRefs      = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);
  // Grid wrapper
  const gridRef      = useRef<HTMLDivElement>(null);
  // Project index dots
  const dotRefs      = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);
  // Custom cursor
  const cursorRef    = useRef<HTMLDivElement>(null);
  // Intro header ref
  const headerRef    = useRef<HTMLDivElement>(null);
  // Outro/section-handoff ref
  const outroRef     = useRef<HTMLDivElement>(null);

  const cursorX = useRef(0);
  const cursorY = useRef(0);
  const cursorTargetX = useRef(0);
  const cursorTargetY = useRef(0);
  const cursorRaf = useRef<number | null>(null);

  // ─── reduced motion ────────────────────────────────────────────────────────
  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  // ─── mobile detection (< 768px = md breakpoint) ───────────────────────────
  const isMobileRef = useRef(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  // ─── CURSOR TRAIL ─────────────────────────────────────────────────────────
  const animateCursor = useCallback(() => {
    const ease = 0.12;
    cursorX.current += (cursorTargetX.current - cursorX.current) * ease;
    cursorY.current += (cursorTargetY.current - cursorY.current) * ease;
    if (cursorRef.current) {
      cursorRef.current.style.transform =
        `translate(${cursorX.current}px, ${cursorY.current}px)`;
    }
    cursorRaf.current = requestAnimationFrame(animateCursor);
  }, []);

  // ─── MAIN SCROLL HANDLER ──────────────────────────────────────────────────
  const updateScene = useCallback((progress: number) => {
    if (prefersReducedMotion) return;

    const p = progress; // 0–1 through the Work section

    // ── project focus windows ──────────────────────────────────────────────
    // For each project i, its "expansion window" occupies:
    //   in  = INTRO_END + i * PER_PROJECT
    //   out = in + PER_PROJECT
    // Focus peak sits at the first 60% of the window.

    for (let i = 0; i < TOTAL; i++) {
      const win_in    = INTRO_END + i * PER_PROJECT;
      const win_peak  = win_in + PER_PROJECT * 0.40;
      const win_hold  = win_in + PER_PROJECT * 0.65;
      const win_out   = win_in + PER_PROJECT;

      // focusT: 0 before window, rises to 1 at peak, holds, falls to 0 at end
      let focusT = 0;
      if (p >= win_in && p <= win_peak) {
        focusT = smoothstep(win_in, win_peak, p);
      } else if (p > win_peak && p <= win_hold) {
        focusT = 1;
      } else if (p > win_hold && p <= win_out) {
        focusT = 1 - smoothstep(win_hold, win_out, p);
      }

      // expandT: only rises in the middle third of the window
      const exp_in  = win_in + PER_PROJECT * 0.15;
      const exp_peak = win_in + PER_PROJECT * 0.45;
      const exp_hold = win_in + PER_PROJECT * 0.60;
      const exp_out  = win_in + PER_PROJECT * 0.85;
      let expandT = 0;
      if (p >= exp_in && p <= exp_peak) {
        expandT = smoothstep(exp_in, exp_peak, p);
      } else if (p > exp_peak && p <= exp_hold) {
        expandT = 1;
      } else if (p > exp_hold && p <= exp_out) {
        expandT = 1 - smoothstep(exp_hold, exp_out, p);
      }

      const card    = cardRefs.current[i];
      const preview = previewRefs.current[i];
      const imgDiv  = imgRefs.current[i];
      const dot     = dotRefs.current[i];

      // ── Card transforms ──────────────────────────────────────────────────
      if (card) {
        const isActive = focusT > 0.05;
        // Active: scale up + opacity 1; inactive: scale down + dimmed
        const cardScale   = isActive
          ? 1 + focusT * 0.03             // 1 → 1.03
          : 1 - (1 - focusT) * 0.04;     // ~0.96 when fully inactive
        const cardOpacity = isActive
          ? 0.35 + focusT * 0.65          // 0.35 → 1.0
          : Math.max(0.25, 1 - (p > win_out ? 1 : (1 - focusT)) * 0.65);
        const zIndex = isActive ? 10 : 1;

        card.style.transform = `scale(${cardScale.toFixed(4)})`;
        card.style.opacity   = String(cardOpacity.toFixed(4));
        card.style.zIndex    = String(zIndex);

        // Border accent on active
        card.style.borderColor = isActive
          ? `rgba(155,28,28,${(focusT * 0.6).toFixed(3)})`
          : 'rgba(240,236,228,0.05)';
      }

      // ── Expanded preview ─────────────────────────────────────────────────
      if (preview) {
        preview.style.opacity   = String(expandT.toFixed(4));
        preview.style.pointerEvents = expandT > 0.5 ? 'auto' : 'none';
        preview.style.transform = `translateY(${((1 - expandT) * 24).toFixed(2)}px)`;
      }

      // ── Image clip-path reveal ───────────────────────────────────────────
      if (imgDiv) {
        const clip = (1 - expandT) * 100;
        imgDiv.style.clipPath = `inset(${clip.toFixed(2)}% 0 0 0)`;
        // Subtle scale: 1.04 when collapsed → 1.00 when revealed
        const imgScale = 1.04 - expandT * 0.04;
        imgDiv.style.transform = `scale(${imgScale.toFixed(4)})`;
      }

      // ── Progress dots ────────────────────────────────────────────────────
      if (dot) {
        const isActiveDot = focusT > 0.3;
        dot.style.background    = isActiveDot ? '#9b1c1c' : 'rgba(240,236,228,0.15)';
        dot.style.transform     = `scale(${isActiveDot ? '1' : '0.7'})`;
      }
    }

    // ── Header (section intro) fades in then out ───────────────────────────
    if (headerRef.current) {
      const h = smoothstep(0, 0.08, p);
      const hOut = p > 0.18 ? smoothstep(0.18, 0.26, p) : 0;
      headerRef.current.style.opacity = String((h * (1 - hOut)).toFixed(4));
    }

    // ── Outro / next section preview ──────────────────────────────────────
    if (outroRef.current) {
      const o = p > OUTRO_START ? smoothstep(OUTRO_START, 1, p) : 0;
      outroRef.current.style.opacity   = String(o.toFixed(4));
      outroRef.current.style.transform = `translateY(${((1 - o) * 16).toFixed(2)}px)`;
    }

    // ── Overall grid dims during project expansion ─────────────────────────
    if (gridRef.current) {
      const inOutro = p > OUTRO_START;
      const gridOpacity = inOutro
        ? 1 - smoothstep(OUTRO_START, 1, p) * 0.3
        : 1;
      gridRef.current.style.opacity = String(gridOpacity.toFixed(4));
    }

  }, [prefersReducedMotion]);

  // ─── SCROLL LISTENER ──────────────────────────────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      isMobileRef.current = window.innerWidth < 768;
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobileRef.current) return; // mobile: no scroll-driven transforms

    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrollable = height - vh;
      const scrolled   = -top;
      const progress   = Math.max(0, Math.min(1, scrolled / scrollable));
      progressRef.current = progress;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => updateScene(progress));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [updateScene]);

  // ─── ENTRY STAGGER ANIMATION (IntersectionObserver) ──────────────────────
  useEffect(() => {
    if (prefersReducedMotion) {
      cardRefs.current.forEach(c => {
        if (c) { c.style.opacity = '1'; c.style.transform = 'none'; }
      });
      return;
    }

    const isMobile = isMobileRef.current;

    if (isMobile) {
      // Mobile: simple drift-up stagger, no directional translate
      cardRefs.current.forEach(c => {
        if (!c) return;
        c.style.opacity   = '0';
        c.style.transform = 'translateY(24px)';
        c.style.transition = 'none';
      });

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              cardRefs.current.forEach((c, i) => {
                if (!c) return;
                c.style.transition = `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.12}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.12}s`;
                c.style.opacity   = '1';
                c.style.transform = 'translateY(0)';
              });
              observer.disconnect();
            }
          });
        },
        { threshold: 0.08 }
      );

      if (gridRef.current) observer.observe(gridRef.current);
      return () => observer.disconnect();
    }

    // Desktop: directional entry stagger
    const deltas = [
      { tx: -60, ty: 0 },
      { tx: 60,  ty: 0 },
      { tx: 0,   ty: 40 },
      { tx: 0,   ty: 40 },
    ];
    cardRefs.current.forEach((c, i) => {
      if (!c) return;
      c.style.opacity   = '0';
      c.style.transform = `translate(${deltas[i].tx}px, ${deltas[i].ty}px)`;
      c.style.transition = 'none';
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            cardRefs.current.forEach((c, i) => {
              if (!c) return;
              c.style.transition = `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${i * 0.10}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${i * 0.10}s`;
              c.style.opacity   = '1';
              c.style.transform = 'translate(0,0) scale(1)';
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    if (gridRef.current) observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  // ─── CUSTOM CURSOR ────────────────────────────────────────────────────────
  useEffect(() => {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice || prefersReducedMotion) return;

    const onMove = (e: MouseEvent) => {
      cursorTargetX.current = e.clientX;
      cursorTargetY.current = e.clientY;
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    cursorRaf.current = requestAnimationFrame(animateCursor);

    return () => {
      window.removeEventListener('mousemove', onMove);
      if (cursorRaf.current) cancelAnimationFrame(cursorRaf.current);
    };
  }, [animateCursor, prefersReducedMotion]);

  // Cursor show/hide on card hover
  const showCursor = () => {
    if (cursorRef.current) cursorRef.current.style.opacity = '1';
  };
  const hideCursor = () => {
    if (cursorRef.current) cursorRef.current.style.opacity = '0';
  };

  // ─── MOUSE PARALLAX on hovered card ──────────────────────────────────────
  const handleCardMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    imgEl: HTMLDivElement | null
  ) => {
    if (!imgEl || prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const cx   = (e.clientX - rect.left) / rect.width  - 0.5;   // -0.5 → 0.5
    const cy   = (e.clientY - rect.top)  / rect.height - 0.5;
    const mx   = cx * 4;   // max 4px shift
    const my   = cy * 4;
    imgEl.style.transform = `translate(${mx.toFixed(2)}px, ${my.toFixed(2)}px)`;
  };
  const resetCardParallax = (imgEl: HTMLDivElement | null) => {
    if (!imgEl) return;
    imgEl.style.transform = 'translate(0,0)';
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Custom cursor ──────────────────────────────────────────────── */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] opacity-0"
        style={{
          willChange: 'transform',
          transition: 'opacity 0.25s ease',
        }}
        aria-hidden="true"
      >
        <div
          style={{
            transform: 'translate(-50%, -50%)',
            padding: '10px 16px',
            background: 'rgba(5,5,5,0.88)',
            border: '1px solid rgba(155,28,28,0.5)',
            backdropFilter: 'blur(6px)',
          }}
        >
          <span
            className="text-label"
            style={{ color: 'rgba(240,236,228,0.85)', letterSpacing: '0.12em', whiteSpace: 'nowrap' }}
          >
            VIEW PROJECT →
          </span>
        </div>
      </div>

      {/* ── Main section ───────────────────────────────────────────────── */}
      <section
        ref={sectionRef}
        id="work"
        className="relative w-full bg-[#050505]"
        style={{
          // Mobile: normal document flow. Desktop: long scroll section
          height: typeof window !== 'undefined' && window.innerWidth < 768
            ? 'auto'
            : `${SECTION_VH}vh`,
        }}
        aria-label="Selected Work — Chapter 03"
      >
        {/* Sticky viewport — desktop only */}
        <div
          className="md:sticky top-0 w-full overflow-hidden"
          style={{ height: typeof window !== 'undefined' && window.innerWidth < 768 ? 'auto' : '100vh' }}
        >

          {/* ── Subtle project progress index (right side) — desktop only ── */}
          <div
            className="hidden md:flex absolute right-6 md:right-10 lg:right-14 top-1/2 -translate-y-1/2
                       flex-col items-center gap-3 z-30"

            style={{ pointerEvents: 'none' }}
            aria-label="Project index"
          >
            {PROJECTS.map((p, i) => (
              <React.Fragment key={p.num}>
                <span
                  className="text-meta tabular-nums"
                  style={{ color: 'rgba(240,236,228,0.3)', letterSpacing: '0.15em' }}
                >
                  {p.num}
                </span>
                <div
                  ref={el => { dotRefs.current[i] = el; }}
                  style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: 'rgba(240,236,228,0.15)',
                    transition: 'background 0.4s ease, transform 0.4s ease',
                  }}
                />
              </React.Fragment>
            ))}
          </div>

          {/* ── Section header scroll-driven (desktop only) ─────────────── */}
          <div
            ref={headerRef}
            className="hidden md:flex absolute top-8 md:top-10 left-6 md:left-10 lg:left-14 z-20
                       items-center gap-4"
            style={{ opacity: 0, pointerEvents: 'none' }}
          >
            <div className="flex items-center gap-3">
              <span className="text-meta" style={{ color: 'rgba(155,28,28,0.8)' }}>02</span>
              <span className="text-meta" style={{ color: 'rgba(155,28,28,0.5)' }}>/</span>
              <span className="tracking-widest uppercase" style={{ fontSize: '0.8rem', color: 'rgba(240,236,228,0.8)' }}>WORK</span>
            </div>
            <div className="ml-2" style={{ width: '40px', height: '1px', background: 'rgba(155,28,28,0.35)' }} />
          </div>

          {/* ── Mobile section header (static, always visible on mobile) ─── */}
          <div
            className="md:hidden px-6 pt-16 pb-0 flex items-center gap-4"
            style={{ borderTop: '1px solid rgba(240,236,228,0.04)' }}
          >
            <div className="flex items-center gap-3">
              <span className="text-meta" style={{ color: 'rgba(155,28,28,0.8)' }}>02</span>
              <span className="text-meta" style={{ color: 'rgba(155,28,28,0.5)' }}>/</span>
              <span className="tracking-widest uppercase" style={{ fontSize: '0.8rem', color: 'rgba(240,236,228,0.8)' }}>WORK</span>
            </div>
            <div className="ml-2" style={{ width: '40px', height: '1px', background: 'rgba(155,28,28,0.3)' }} />
          </div>

          {/* ── Grid + cards ───────────────────────────────────────────── */}
          <div
            ref={gridRef}
            className="md:absolute md:inset-0 flex items-center justify-center px-6 md:px-10 lg:px-14 py-10 md:py-0"
            style={{ paddingTop: undefined, paddingBottom: undefined }}
          >
            <div
              className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 relative"
              style={{ maxWidth: '1200px' }}
            >
              {PROJECTS.map((proj, i) => (
                <div
                  key={proj.num}
                  className="relative"
                  style={{ willChange: 'transform, opacity' }}
                >
                  {/* ── Project card ─────────────────────────────────── */}
                  <div
                    ref={el => { cardRefs.current[i] = el; }}
                    className="relative flex flex-col justify-between cursor-pointer overflow-hidden group"
                    style={{
                      background:   '#080808',
                      border:       '1px solid rgba(240,236,228,0.05)',
                      minHeight:    'clamp(160px, 28vw, 300px)',
                      padding:      'clamp(1.25rem, 3vw, 2.5rem)',
                      willChange:   'transform, opacity',
                      transition:   'border-color 0.4s ease',
                    }}
                    onMouseEnter={showCursor}
                    onMouseLeave={() => { hideCursor(); resetCardParallax(imgRefs.current[i]); }}
                    onMouseMove={e => handleCardMouseMove(e, imgRefs.current[i])}
                    onClick={() => router.push(`/work/${proj.slug}`)}
                  >
                    {/* Faint image placeholder (or real image if src provided) */}
                    <div
                      ref={el => { imgRefs.current[i] = el; }}
                      className="absolute inset-0"
                      style={{
                        background: proj.src ? undefined : proj.color,
                        backgroundImage: proj.src ? `url(${proj.src})` : undefined,
                        backgroundSize:  'cover',
                        backgroundPosition: 'center',
                        clipPath:   'inset(100% 0 0 0)',
                        willChange: 'clip-path, transform',
                        transition: 'clip-path 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.4s ease',
                      }}
                      aria-hidden="true"
                    />

                    {/* Overlay so text always reads cleanly over image */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(160deg, rgba(5,5,5,0.7) 30%, rgba(5,5,5,0.3) 100%)',
                      }}
                      aria-hidden="true"
                    />

                    {/* Card content */}
                    <div className="relative z-10">
                      <span
                        className="text-meta block mb-1"
                        style={{ color: 'rgba(155,28,28,0.7)' }}
                      >
                        {proj.num}
                      </span>
                    </div>

                    <div className="relative z-10">
                      <h3
                        className="font-extrabold tracking-tight leading-tight"
                        style={{
                          fontSize: 'clamp(1.2rem, 2.2vw, 1.8rem)',
                          color: 'rgba(240,236,228,0.88)',
                          marginBottom: '0.4rem',
                        }}
                      >
                        {proj.name}
                      </h3>
                      <span className="text-label" style={{ color: 'rgba(240,236,228,0.3)' }}>
                        {proj.tag}
                      </span>
                    </div>

                    {/* Arrow */}
                    <span
                      className="absolute bottom-5 right-5"
                      style={{ color: 'rgba(155,28,28,0.55)', fontSize: '1.1rem' }}
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </div>

                  {/* ── Expanded preview overlay (appears during expansion beat) */}
                  <div
                    ref={el => { previewRefs.current[i] = el; }}
                    className="absolute inset-0 z-20 flex flex-col justify-end overflow-hidden pointer-events-none"
                    style={{
                      opacity: 0,
                      willChange: 'opacity, transform',
                      padding: 'clamp(1.5rem, 3vw, 2.5rem)',
                      background: 'linear-gradient(to top, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.2) 60%, transparent 100%)',
                    }}
                  >
                    {/* Expanded metadata */}
                    <div className="text-left">
                      <span className="text-meta block mb-3" style={{ color: 'rgba(155,28,28,0.7)' }}>
                        {proj.num}
                      </span>
                      <h3
                        className="font-extrabold tracking-tight leading-tight mb-2"
                        style={{
                          fontSize: 'clamp(1.5rem, 3.5vw, 2.8rem)',
                          color: 'rgba(240,236,228,0.95)',
                        }}
                      >
                        {proj.name}
                      </h3>
                      <span className="text-label block mb-1" style={{ color: 'rgba(240,236,228,0.45)' }}>
                        {proj.tag}
                      </span>
                      <span className="text-meta block mb-4" style={{ color: 'rgba(240,236,228,0.2)' }}>
                        {proj.year}
                      </span>
                      <p
                        className="font-light mb-6"
                        style={{
                          fontSize: 'clamp(0.9rem, 1.4vw, 1.1rem)',
                          color: 'rgba(240,236,228,0.6)',
                          maxWidth: '30ch',
                          lineHeight: 1.6,
                        }}
                      >
                        {proj.desc}
                      </p>
                      <Link
                        href={`/work/${proj.slug}`}
                        className="editorial-link text-label"
                        style={{ color: 'rgba(240,236,228,0.75)' }}
                      >
                        <span>VIEW PROJECT</span>
                        <span className="arrow" style={{ color: '#9b1c1c' }} aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Outro / handoff to next section ─────────────────────────── */}
          <div
            ref={outroRef}
            className="absolute bottom-10 left-6 md:left-10 lg:left-14 z-20
                       flex items-center gap-4"
            style={{ opacity: 0, pointerEvents: 'none', willChange: 'opacity, transform' }}
            aria-hidden="true"
          >
            <span className="text-meta" style={{ color: 'rgba(155,28,28,0.7)' }}>04</span>
            <div style={{ width: '28px', height: '1px', background: 'rgba(155,28,28,0.3)' }} />
            <span className="text-meta" style={{ color: 'rgba(240,236,228,0.2)' }}>TECHNOLOGY</span>
          </div>

          {/* Film grain overlay for atmospheric consistency */}
          <div className="grain-overlay" aria-hidden="true" />

        </div>{/* /sticky */}
      </section>
    </>
  );
}
