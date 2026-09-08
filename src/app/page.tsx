'use client';

import React, { useRef, useEffect } from 'react';
import CinematicHero  from '@/components/CinematicHero';
import AboutSection   from '@/components/AboutSection';
import SelectedWork   from '@/components/SelectedWork';
import RevealText     from '@/components/RevealText';
import { useRevealAnimation } from '@/hooks/useRevealAnimation';

// ─────────────────────────────────────────────────────────────────────────────
// SECTION LABEL — shared editorial header (03 ── TECHNOLOGY)
// ─────────────────────────────────────────────────────────────────────────────
function SectionLabel({ num, label }: { num: string; label: string }) {
  const ruleRef = useRef<HTMLDivElement>(null);
  const { containerRef } = useRevealAnimation(() => {
    if (ruleRef.current) {
      ruleRef.current.style.animationDelay = '120ms';
      ruleRef.current.classList.add('is-revealed');
    }
  });

  return (
    <div
      ref={el => { (containerRef as React.MutableRefObject<HTMLElement | null>).current = el; }}
      className="flex items-center gap-4"
      aria-hidden="true"
    >
      <div className="flex items-center gap-3">
        <RevealText
          as="span"
          type="mask"
          delay={0}
          className="text-meta"
          style={{ color: 'rgba(155,28,28,0.8)' }}
        >
          {num}
        </RevealText>
        <RevealText
          as="span"
          type="mask"
          delay={100}
          className="text-meta"
          style={{ color: 'rgba(155,28,28,0.5)' }}
        >
          /
        </RevealText>
        <RevealText
          as="span"
          type="mask"
          delay={200}
          className="tracking-widest uppercase"
          style={{ fontSize: '0.8rem', color: 'rgba(240,236,228,0.8)' }}
        >
          {label}
        </RevealText>
      </div>

      <div
        ref={ruleRef}
        className="reveal-rule ml-2"
        style={{ width: '40px', height: '1px', background: 'rgba(155,28,28,0.3)' }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TECHNOLOGY SECTION
// ─────────────────────────────────────────────────────────────────────────────
const TECH_CATEGORIES = [
  {
    title: 'DESIGN',
    items: [
      { name: 'Figma', desc: 'INTERFACE / PROTOTYPING' },
      { name: 'Framer', desc: 'MOTION / INTERACTION' },
      { name: 'Motion', desc: 'CINEMATIC SEQUENCING' },
    ]
  },
  {
    title: 'ENGINEERING',
    items: [
      { name: 'React', desc: 'COMPONENT ARCHITECTURE' },
      { name: 'Next.js', desc: 'FULL-STACK DELIVERY' },
      { name: 'TypeScript', desc: 'TYPE-SAFE SYSTEMS' },
    ]
  },
  {
    title: 'SYSTEMS',
    items: [
      { name: 'Supabase', desc: 'DATA / AUTHENTICATION' },
      { name: 'PostgreSQL', desc: 'RELATIONAL MODELING' },
      { name: 'APIs', desc: 'SERVICE INTEGRATION' },
    ]
  }
];

function TechSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { containerRef: revealRef } = useRevealAnimation(() => {
    if (!containerRef.current) return;
    const elements = containerRef.current.querySelectorAll<HTMLElement>('.reveal-drift');
    elements.forEach((el, i) => {
      el.style.animationDelay = `${i * 80}ms`;
      el.classList.add('is-revealed');
    });
  }, { threshold: 0.1 });

  return (
    <section
      id="stack"
      className="relative px-6 md:px-10 lg:px-14 py-28 md:py-40"
      style={{ borderTop: '1px solid rgba(240,236,228,0.04)' }}
    >
      <div className="mb-20 md:mb-32">
        <SectionLabel num="03" label="STACK" />
      </div>

      <div
        ref={(el) => {
          (revealRef as React.MutableRefObject<HTMLElement | null>).current = el;
          containerRef.current = el as HTMLDivElement;
        }}
        className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8"
      >
        {TECH_CATEGORIES.map((category, catIdx) => (
          <div key={category.title} className="flex flex-col gap-8 reveal-drift">
            <span className="text-meta" style={{ color: 'rgba(155,28,28,0.6)' }}>
              {category.title}
            </span>
            <div className="flex flex-col gap-6">
              {category.items.map((item) => (
                <div
                  key={item.name}
                  className="group flex flex-col cursor-default"
                >
                  <span
                    className="font-light tracking-tight transition-transform duration-300 group-hover:translate-x-2"
                    style={{
                      fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                      color: 'rgba(240,236,228,0.9)',
                    }}
                  >
                    {item.name}
                  </span>
                  <div
                    className="overflow-hidden transition-all duration-300 max-h-0 opacity-0 group-hover:max-h-[20px] group-hover:opacity-100 group-hover:mt-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[#9b1c1c] text-[10px]">→</span>
                      <span className="text-meta text-[#f0ece4]/40">{item.desc}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROCESS SECTION
// ─────────────────────────────────────────────────────────────────────────────
function ProcessSection() {
  return (
    <section
      id="process"
      className="relative px-6 md:px-10 lg:px-14 py-28"
      style={{ borderTop: '1px solid rgba(240,236,228,0.04)' }}
    >
      <div className="mb-16">
        <SectionLabel num="04" label="PROCESS" />
      </div>

      {/* Large editorial statement — word-by-word build */}
      <div className="max-w-3xl">
        <RevealText
          as="p"
          type="words"
          delay={0}
          wordDelay={48}
          className="font-light leading-[1.85]"
          style={{ fontSize: 'clamp(1rem, 1.6vw, 1.25rem)', color: 'rgba(240,236,228,0.55)' }}
        >
          Every project begins with a single question: what does this need to feel like? Engineering and design are not separate disciplines. The best products are those where the boundary between the two is invisible.
        </RevealText>
      </div>

      {/* Closing statement — mask reveal */}
      <div className="mt-12 flex items-center gap-6">
        <RevealText
          as="span"
          type="mask"
          delay={600}
          className="text-meta"
          style={{ color: 'rgba(155,28,28,0.6)' }}
        >
          CONCEPT → DESIGN → BUILD → SHIP
        </RevealText>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTACT SECTION — full redesign
// ─────────────────────────────────────────────────────────────────────────────
function ContactSection() {
  const ruleRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  const { containerRef: ruleContainer } = useRevealAnimation(() => {
    if (ruleRef.current) {
      ruleRef.current.style.animationDelay = '400ms';
      ruleRef.current.classList.add('is-revealed');
    }
    if (linksRef.current) {
      const links = linksRef.current.querySelectorAll<HTMLElement>('[data-social]');
      links.forEach((l, i) => {
        l.style.animationDelay = `${700 + i * 80}ms`;
        l.classList.add('is-revealed');
      });
    }
  }, { threshold: 0.1 });

  return (
    <section
      id="contact"
      ref={el => { (ruleContainer as React.MutableRefObject<HTMLElement | null>).current = el; }}
      className="relative min-h-screen flex flex-col justify-center px-6 md:px-10 lg:px-14 py-28 md:py-40 overflow-hidden"
      style={{ borderTop: '1px solid rgba(240,236,228,0.04)' }}
    >
      {/* Section label */}
      <div className="mb-24 md:mb-32">
        <SectionLabel num="05" label="CONTACT" />
      </div>

      {/* Massive display heading — character stagger */}
      <div className="mb-12 md:mb-16">
        <RevealText
          as="h2"
          type="chars"
          delay={100}
          charDelay={28}
          className="font-extrabold leading-[0.92] tracking-tight block"
          style={{
            fontSize: 'clamp(2.5rem, 8vw, 8.5rem)',
            color: 'rgba(240,236,228,0.92)',
          }}
        >
          LET&apos;S BUILD
        </RevealText>

        <RevealText
          as="h2"
          type="chars"
          delay={300}
          charDelay={28}
          className="font-extrabold leading-[0.92] tracking-tight block"
          style={{
            fontSize: 'clamp(2.5rem, 8vw, 8.5rem)',
            color: 'rgba(240,236,228,0.92)',
            paddingLeft: 'clamp(1rem, 5vw, 6rem)',
          }}
        >
          SOMETHING
        </RevealText>

        <RevealText
          as="h2"
          type="chars"
          delay={500}
          charDelay={28}
          className="font-extrabold leading-[0.92] tracking-tight block"
          style={{
            fontSize: 'clamp(2.5rem, 8vw, 8.5rem)',
            color: 'transparent',
            WebkitTextStroke: '1.5px rgba(240,236,228,0.30)',
          }}
        >
          WORTH REMEMBERING.
        </RevealText>
      </div>

      {/* Crimson extending rule */}
      <div
        ref={ruleRef}
        className="reveal-rule mb-12"
        style={{
          height: '1px',
          background: 'linear-gradient(to right, #9b1c1c, rgba(155,28,28,0.15))',
          width: '100%',
          maxWidth: '800px',
        }}
      />

      {/* Social links */}
      <div ref={linksRef} className="flex flex-col gap-6 w-fit">
        {[
          { label: 'EMAIL', href: 'mailto:hello@sarthak.dev' },
          { label: 'LINKEDIN', href: '#' },
          { label: 'GITHUB',   href: '#' },
        ].map(({ label, href }) => (
          <a
            key={label}
            href={href}
            data-social
            className="editorial-link font-light text-label reveal-drift w-fit"
            style={{
              fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
              color: 'rgba(240,236,228,0.65)',
              letterSpacing: '0.08em',
              textDecoration: 'none',
            }}
          >
            <span>{label}</span>
            <span className="arrow" style={{ color: '#9b1c1c', fontSize: '0.9em' }} aria-hidden="true">→</span>
          </a>
        ))}
      </div>

      {/* Very subtle background texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 80% 50%, rgba(155,28,28,0.03) 0%, transparent 70%)',
        }}
      />
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <main
      className="min-h-screen bg-[#050505] text-[#f0ece4]"
      style={{ fontFamily: 'var(--font-manrope), system-ui, sans-serif' }}
    >
      {/* ════════════════════════════════════════════════════════════
          01 / HERO — 152-frame cinematic identity sequence
          !! DO NOT MODIFY !!
      ════════════════════════════════════════════════════════════ */}
      <CinematicHero />

      {/* ════════════════════════════════════════════════════════════
          02 / ABOUT — 102-frame cinematic about sequence
          !! DO NOT MODIFY !!
      ════════════════════════════════════════════════════════════ */}
      <AboutSection />

      {/* ════════════════════════════════════════════════════════════
          03 / SELECTED WORK
      ════════════════════════════════════════════════════════════ */}
      <SelectedWork />

      {/* ════════════════════════════════════════════════════════════
          EDITORIAL SECTIONS
      ════════════════════════════════════════════════════════════ */}
      <div className="relative bg-[#050505]">
        <TechSection />
        <ProcessSection />
        <ContactSection />

        {/* ── FOOTER ──────────────────────────────────────────────── */}
        <footer
          className="px-6 md:px-10 lg:px-14 py-16 md:py-24 flex flex-col md:flex-row justify-between items-start md:items-end gap-12 md:gap-0"
          style={{ borderTop: '1px solid rgba(240,236,228,0.04)' }}
        >
          <div className="flex flex-col gap-8">
            <RevealText
              as="div"
              type="drift"
              delay={0}
              className="flex flex-col gap-1"
            >
              <span className="text-meta" style={{ color: 'rgba(240,236,228,0.6)' }}>SARTHAK MULIK</span>
              <span className="text-meta" style={{ color: 'rgba(240,236,228,0.3)' }}>SOFTWARE DEVELOPER / PRODUCT BUILDER</span>
            </RevealText>

            <RevealText
              as="div"
              type="drift"
              delay={100}
              className="text-meta"
              style={{ color: 'rgba(240,236,228,0.3)' }}
            >
              PUNE / INDIA
            </RevealText>
          </div>

          <div className="flex flex-col md:items-end gap-8">
            <RevealText
              as="div"
              type="drift"
              delay={200}
              className="flex gap-6"
            >
              <a href="#" className="editorial-link text-meta" style={{ color: 'rgba(240,236,228,0.4)' }}>
                <span>LINKEDIN</span>
              </a>
              <a href="#" className="editorial-link text-meta" style={{ color: 'rgba(240,236,228,0.4)' }}>
                <span>GITHUB</span>
              </a>
            </RevealText>

            <RevealText
              as="div"
              type="drift"
              delay={300}
              className="text-meta"
              style={{ color: 'rgba(240,236,228,0.2)' }}
            >
              © {new Date().getFullYear()}
            </RevealText>
          </div>
        </footer>
      </div>
    </main>
  );
}
