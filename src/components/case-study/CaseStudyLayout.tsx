'use client';

import React from 'react';
import Link from 'next/link';
import { CaseStudyData } from '@/data/projects';
import RevealText from '@/components/RevealText';
import { useRevealAnimation } from '@/hooks/useRevealAnimation';

function SectionHeader({ num, label }: { num: string; label: string }) {
  const { containerRef } = useRevealAnimation(() => {}, { threshold: 0.1 });
  return (
    <div
      ref={el => { (containerRef as React.MutableRefObject<HTMLElement | null>).current = el; }}
      className="flex items-center gap-3 mb-12 md:mb-16"
    >
      <span className="text-meta reveal-drift" style={{ color: 'rgba(155,28,28,0.8)' }}>{num}</span>
      <span className="text-meta reveal-drift" style={{ color: 'rgba(155,28,28,0.5)', transitionDelay: '50ms' }}>/</span>
      <span className="tracking-widest uppercase reveal-drift" style={{ fontSize: '0.8rem', color: 'rgba(240,236,228,0.8)', transitionDelay: '100ms' }}>
        {label}
      </span>
      <div className="reveal-rule ml-2" style={{ width: '40px', height: '1px', background: 'rgba(155,28,28,0.3)', transitionDelay: '150ms' }} />
    </div>
  );
}

export default function CaseStudyLayout({ project }: { project: CaseStudyData }) {
  const { containerRef: metaRef } = useRevealAnimation(() => {}, { threshold: 0.1 });
  const { containerRef: nextRef } = useRevealAnimation(() => {}, { threshold: 0.1 });

  const [activeSection, setActiveSection] = React.useState(1);
  const sectionRefs = React.useRef<(HTMLElement | null)[]>([]);

  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = sectionRefs.current.findIndex(el => el === entry.target);
          if (index !== -1) setActiveSection(index + 1);
        }
      });
    }, { threshold: 0.2, rootMargin: '-20% 0px -20% 0px' });

    sectionRefs.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main
      className="min-h-screen bg-[#050505] text-[#f0ece4] pb-24 relative"
      style={{ fontFamily: 'var(--font-manrope), system-ui, sans-serif' }}
    >
      {/* ── SUBTLE PROGRESS INDICATOR (Desktop Only) ── */}
      <div className="hidden xl:flex fixed right-8 top-1/2 -translate-y-1/2 flex-col gap-6 z-50 pointer-events-none mix-blend-difference">
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <div key={num} className="flex items-center gap-3">
            <span className="text-[10px] tracking-widest font-mono" style={{ color: activeSection === num ? 'rgba(155,28,28,0.9)' : 'rgba(240,236,228,0.3)', transition: 'color 0.4s ease' }}>
              0{num}
            </span>
            <div className="h-[1px]" style={{ width: activeSection === num ? '16px' : '8px', background: activeSection === num ? 'rgba(155,28,28,0.9)' : 'rgba(240,236,228,0.2)', transition: 'all 0.4s ease' }} />
          </div>
        ))}
      </div>
      {/* ── GLOBAL NAV PLACEHOLDER (Static for case study) ── */}
      <div className="px-6 md:px-10 lg:px-14 py-8 flex justify-between items-center sticky top-0 bg-[#050505]/90 backdrop-blur-md z-50">
        <Link href="/" className="editorial-link text-meta" style={{ color: 'rgba(240,236,228,0.6)' }}>
          <span className="arrow rotate-180 inline-block mr-2" aria-hidden="true">←</span>
          <span>BACK TO PORTFOLIO</span>
        </Link>
      </div>

      {/* ── OPENING ── */}
      <section className="px-6 md:px-10 lg:px-14 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4 mb-16 md:mb-24 items-start">
          <div className="md:col-span-3 flex flex-col justify-start">
            <RevealText as="span" type="drift" delay={0} className="text-meta mb-2" style={{ color: 'rgba(155,28,28,0.8)' }}>
              {project.number}
            </RevealText>
            <RevealText as="h1" type="words" delay={100} className="font-extrabold leading-[0.9] tracking-tight" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
              {project.title}
            </RevealText>
          </div>
          <div className="md:col-start-7 md:col-span-6 flex flex-col justify-start md:pt-1">
            <RevealText as="h2" type="words" delay={300} className="font-light leading-[1.1] tracking-tight uppercase" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 3.5rem)', color: 'rgba(240,236,228,0.7)' }}>
              {project.category.replace(' / ', '\n')}
            </RevealText>
          </div>
        </div>

        {/* MASSIVE PROJECT VISUAL placeholder */}
        <div className="w-full h-[60vh] md:h-[80vh] bg-[#0A0A0A] relative overflow-hidden flex items-center justify-center reveal-drift" style={{ transitionDuration: '1.2s' }}>
          <span className="text-meta" style={{ color: 'rgba(240,236,228,0.2)' }}>[ MASSIVE HERO VISUAL ]</span>
          
          {/* Subtle noise/texture overlay to make it feel physical */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("/noise.png")', backgroundSize: '100px' }} />
        </div>
      </section>

      {/* ── METADATA ── */}
      <section 
        className="px-6 md:px-10 lg:px-14 py-20 md:py-32"
        ref={el => { (metaRef as React.MutableRefObject<HTMLElement | null>).current = el; }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-6">
          <div className="flex flex-col gap-4 reveal-drift" style={{ transitionDelay: '0ms' }}>
            <span className="text-meta" style={{ color: 'rgba(155,28,28,0.6)' }}>ROLE</span>
            <div className="flex flex-col gap-1">
              {project.role.map(r => (
                <span key={r} className="text-label" style={{ color: 'rgba(240,236,228,0.7)' }}>{r}</span>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4 reveal-drift" style={{ transitionDelay: '100ms' }}>
            <span className="text-meta" style={{ color: 'rgba(155,28,28,0.6)' }}>YEAR</span>
            <span className="text-label" style={{ color: 'rgba(240,236,228,0.7)' }}>{project.year}</span>
          </div>
          <div className="flex flex-col gap-4 reveal-drift" style={{ transitionDelay: '200ms' }}>
            <span className="text-meta" style={{ color: 'rgba(155,28,28,0.6)' }}>TYPE</span>
            <span className="text-label" style={{ color: 'rgba(240,236,228,0.7)' }}>{project.type}</span>
          </div>
          <div className="flex flex-col gap-4 reveal-drift" style={{ transitionDelay: '300ms' }}>
            <span className="text-meta" style={{ color: 'rgba(155,28,28,0.6)' }}>STACK</span>
            <div className="flex flex-col gap-1">
              {project.stack.map(s => (
                <span key={s} className="text-label" style={{ color: 'rgba(240,236,228,0.7)' }}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 01 / THE PROBLEM ── */}
      <section ref={el => { sectionRefs.current[0] = el; }} className="px-6 md:px-10 lg:px-14 py-24 md:py-40" style={{ borderTop: '1px solid rgba(240,236,228,0.04)' }}>
        <SectionHeader num="01" label="THE PROBLEM" />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-4 mt-16 md:mt-32">
          <div className="md:col-span-8">
            <RevealText as="h3" type="words" className="font-extrabold leading-[0.95] tracking-tight mb-8" style={{ fontSize: 'clamp(2.5rem, 5vw, 5.5rem)' }}>
              {project.problem.statement}
            </RevealText>
          </div>
          <div className="md:col-start-9 md:col-span-4 flex items-end">
            <RevealText as="p" type="drift" delay={200} className="font-light leading-[1.8]" style={{ fontSize: 'clamp(0.95rem, 1.2vw, 1.05rem)', color: 'rgba(240,236,228,0.5)', maxWidth: '32ch' }}>
              {project.problem.description}
            </RevealText>
          </div>
        </div>
      </section>

      {/* ── 02 / THE APPROACH ── */}
      <section ref={el => { sectionRefs.current[1] = el; }} className="px-6 md:px-10 lg:px-14 py-24 md:py-40" style={{ borderTop: '1px solid rgba(240,236,228,0.04)' }}>
        <SectionHeader num="02" label="THE APPROACH" />
        <div className="flex flex-col gap-12 mt-20 md:mt-32 max-w-4xl">
          {project.approach.map((step, idx) => (
            <div key={step} className="flex items-center gap-8 md:gap-16">
              <RevealText as="span" type="drift" delay={idx * 100} className="text-meta" style={{ color: 'rgba(155,28,28,0.6)' }}>
                0{idx + 1}
              </RevealText>
              <RevealText as="span" type="drift" delay={idx * 100 + 50} className="font-extrabold tracking-tight" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3.5rem)', color: 'rgba(240,236,228,0.85)' }}>
                {step}
              </RevealText>
            </div>
          ))}
        </div>
      </section>

      {/* ── 03 / DESIGN ── */}
      <section ref={el => { sectionRefs.current[2] = el; }} className="px-6 md:px-10 lg:px-14 py-24 md:py-40" style={{ borderTop: '1px solid rgba(240,236,228,0.04)' }}>
        <SectionHeader num="03" label="DESIGN" />
        
        <div className="flex flex-col gap-32 md:gap-48 mt-20 md:mt-32">
          {project.design.images.map((img, idx) => (
            <div key={idx} className="flex flex-col gap-8 w-full" style={{ alignItems: img.width === '50%' ? 'flex-end' : img.width === '75%' ? 'center' : 'flex-start' }}>
              <div 
                className="w-full aspect-[16/10] md:aspect-[21/9] bg-[#0A0A0A] relative flex items-center justify-center reveal-mask" 
                style={{ width: img.width, maxWidth: '100%', transitionDuration: '1s' }}
              >
                <span className="text-meta" style={{ color: 'rgba(240,236,228,0.2)' }}>[ UI VISUAL — {img.width} ]</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-12 w-full gap-8">
                {img.caption && (
                  <div className="md:col-span-4 flex flex-col justify-start">
                    <RevealText as="span" type="drift" className="text-meta tracking-widest uppercase" style={{ color: 'rgba(240,236,228,0.4)' }}>
                      {img.caption}
                    </RevealText>
                  </div>
                )}
                
                {/* We map a decision to this image if it exists to create interleaved flow */}
                {project.design.decisions[idx] && (
                  <div className="md:col-start-8 md:col-span-5 flex flex-col gap-4 border-l border-[#9b1c1c]/30 pl-6 py-2">
                    <RevealText as="span" type="drift" delay={100} className="text-meta" style={{ color: 'rgba(155,28,28,0.8)' }}>
                      {project.design.decisions[idx].num}
                    </RevealText>
                    <RevealText as="span" type="drift" delay={150} className="text-label tracking-widest uppercase" style={{ color: 'rgba(240,236,228,0.9)' }}>
                      {project.design.decisions[idx].title}
                    </RevealText>
                    <RevealText as="p" type="drift" delay={200} className="font-light" style={{ fontSize: 'clamp(0.95rem, 1.1vw, 1.05rem)', color: 'rgba(240,236,228,0.5)', lineHeight: 1.6, maxWidth: '40ch' }}>
                      {project.design.decisions[idx].description}
                    </RevealText>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 04 / SYSTEM ── */}
      <section ref={el => { sectionRefs.current[3] = el; }} className="px-6 md:px-10 lg:px-14 py-24 md:py-40" style={{ borderTop: '1px solid rgba(240,236,228,0.04)' }}>
        <SectionHeader num="04" label="SYSTEM" />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 mt-20 md:mt-32 items-start">
          
          <div className="md:col-span-4 flex flex-col gap-12">
            <span className="text-meta" style={{ color: 'rgba(155,28,28,0.6)' }}>TYPOGRAPHY</span>
            {project.system.typography.map((type) => (
              <div key={type.type} className="flex justify-between items-end border-b border-[#f0ece4]/10 pb-6 reveal-drift">
                <span className="text-label" style={{ color: 'rgba(240,236,228,0.5)' }}>{type.type}</span>
                <span className="font-extrabold leading-none" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', color: 'rgba(240,236,228,0.9)' }}>{type.example}</span>
              </div>
            ))}
          </div>

          <div className="md:col-start-6 md:col-span-3 flex flex-col gap-12">
            <span className="text-meta" style={{ color: 'rgba(155,28,28,0.6)' }}>COLOR</span>
            {project.system.colors.map((color) => (
              <div key={color.name} className="flex justify-between items-center border-b border-[#f0ece4]/10 pb-6 reveal-drift">
                <span className="text-label" style={{ color: 'rgba(240,236,228,0.5)' }}>{color.name}</span>
                <div className="flex items-center gap-4">
                  <span className="text-meta" style={{ color: 'rgba(240,236,228,0.2)' }}>{color.hex}</span>
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.hex }} />
                </div>
              </div>
            ))}
          </div>

          <div className="md:col-start-10 md:col-span-3 flex flex-col gap-12">
            <span className="text-meta" style={{ color: 'rgba(155,28,28,0.6)' }}>COMPONENTS</span>
            {project.system.components.map((comp) => (
              <div key={comp} className="flex justify-between items-center border-b border-[#f0ece4]/10 pb-6 reveal-drift">
                <span className="text-label" style={{ color: 'rgba(240,236,228,0.5)' }}>{comp}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 05 / ENGINEERING ── */}
      <section ref={el => { sectionRefs.current[4] = el; }} className="px-6 md:px-10 lg:px-14 py-24 md:py-40" style={{ borderTop: '1px solid rgba(240,236,228,0.04)' }}>
        <SectionHeader num="05" label="ENGINEERING" />
        <div className="mt-16 md:mt-32 grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-4">
          
          <div className="md:col-span-6 flex items-center">
            <RevealText as="h3" type="words" className="font-extrabold leading-[1] tracking-tight" style={{ fontSize: 'clamp(3.5rem, 6vw, 6rem)' }}>
              {project.engineering.statement.split('+').map((word, i, arr) => (
                <React.Fragment key={word}>
                  <span style={{ color: i === arr.length - 1 ? 'rgba(240,236,228,0.9)' : 'transparent', WebkitTextStroke: i === arr.length - 1 ? 'none' : '1px rgba(240,236,228,0.3)' }}>
                    {word.trim()}
                  </span>
                  {i < arr.length - 1 && <br />}
                </React.Fragment>
              ))}
            </RevealText>
          </div>
          
          <div className="md:col-start-9 md:col-span-4 flex flex-col justify-center gap-12">
            {project.engineering.architecture.map((layer, idx) => (
              <React.Fragment key={layer}>
                <RevealText as="div" type="drift" delay={idx * 100} className="w-full pb-4 border-b border-[#9b1c1c]/20 flex justify-between items-end">
                  <span className="text-label tracking-widest uppercase" style={{ color: 'rgba(240,236,228,0.8)' }}>{layer}</span>
                  <span className="text-meta" style={{ color: 'rgba(155,28,28,0.6)' }}>0{idx + 1}</span>
                </RevealText>
                {idx < project.engineering.architecture.length - 1 && (
                  <div className="h-8 w-[1px] bg-[#9b1c1c]/40 ml-2" />
                )}
              </React.Fragment>
            ))}
          </div>

        </div>
      </section>

      {/* ── 06 / THE RESULT ── */}
      <section ref={el => { sectionRefs.current[5] = el; }} className="px-6 md:px-10 lg:px-14 py-24 md:py-40" style={{ borderTop: '1px solid rgba(240,236,228,0.04)' }}>
        <SectionHeader num="06" label="THE RESULT" />
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mt-16 md:mt-32 mb-20 md:mb-40">
          <div className="md:col-span-10">
            <RevealText as="h3" type="words" className="font-extrabold leading-[0.95] tracking-tight" style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}>
              {project.result.statement}
            </RevealText>
          </div>
          <div className="md:col-span-6 md:col-start-7 pt-8 md:pt-16">
            <RevealText as="p" type="drift" delay={200} className="font-light leading-[1.8]" style={{ fontSize: 'clamp(1rem, 1.2vw, 1.1rem)', color: 'rgba(240,236,228,0.5)', maxWidth: '40ch' }}>
              {project.result.description}
            </RevealText>
          </div>
        </div>

        <div className="w-full aspect-[21/9] bg-[#0A0A0A] border border-[#f0ece4]/5 relative overflow-hidden flex items-center justify-center reveal-mask">
          <span className="text-meta" style={{ color: 'rgba(240,236,228,0.2)' }}>[ FINAL PROJECT VISUAL ]</span>
        </div>
      </section>

      {/* ── FINAL CINEMATIC FRAME ── */}
      <section className="px-6 md:px-10 lg:px-14 py-40 md:py-64 flex flex-col items-center justify-center text-center relative">
        <RevealText as="h2" type="words" className="font-extrabold leading-[0.8] tracking-tight mb-12" style={{ fontSize: 'clamp(4rem, 12vw, 12rem)' }}>
          {project.title}
        </RevealText>
        <RevealText as="p" type="drift" delay={300} className="font-light tracking-widest uppercase" style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)', color: 'rgba(240,236,228,0.5)' }}>
          BUILT FROM IDEA <br className="md:hidden" /> TO PRODUCTION.
        </RevealText>
      </section>

      {/* ── NEXT PROJECT ── */}
      <section 
        className="px-6 md:px-10 lg:px-14 pt-32 pb-24 flex flex-col items-center text-center relative overflow-hidden" 
        style={{ borderTop: '1px solid rgba(240,236,228,0.04)' }}
        ref={el => { (nextRef as React.MutableRefObject<HTMLElement | null>).current = el; }}
      >
        <span className="text-meta reveal-drift mb-8" style={{ color: 'rgba(155,28,28,0.8)' }}>NEXT PROJECT</span>
        <Link href={`/work/${project.nextProject.slug}`} className="group editorial-link flex flex-col items-center gap-6 reveal-drift" style={{ textDecoration: 'none' }}>
          <h2 className="font-extrabold tracking-tight transition-colors duration-700 group-hover:text-white" style={{ fontSize: 'clamp(3rem, 8vw, 8rem)', color: 'transparent', WebkitTextStroke: '1.5px rgba(240,236,228,0.3)' }}>
            {project.nextProject.title}
          </h2>
          <div className="flex items-center gap-4 mt-2 text-meta transition-colors duration-700 group-hover:text-[#9b1c1c]" style={{ color: 'rgba(240,236,228,0.4)' }}>
            <span>{project.nextProject.number}</span>
            <span className="arrow" aria-hidden="true">→</span>
          </div>
          
          {/* Subtle Image Reveal on Hover */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg aspect-video bg-[#0A0A0A] opacity-0 group-hover:opacity-10 transition-opacity duration-1000 pointer-events-none -z-10 flex items-center justify-center">
             <span className="text-meta text-white/20">[ PREVIEW ]</span>
          </div>
        </Link>
      </section>
    </main>
  );
}
