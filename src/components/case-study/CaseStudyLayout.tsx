'use client';

import React from 'react';
import Link from 'next/link';
import { CaseStudyData } from '@/data/projects';
import RevealText from '@/components/RevealText';
import { useRevealAnimation } from '@/hooks/useRevealAnimation';
import ProductArtifact from './ProductArtifact';

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

  const [activeSection, setActiveSection] = React.useState(0);
  const sectionRefs = React.useRef<(HTMLElement | null)[]>([]);

  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = sectionRefs.current.findIndex(el => el === entry.target);
          if (index !== -1) setActiveSection(index);
        }
      });
    }, { threshold: 0.2, rootMargin: '-20% 0px -20% 0px' });

    sectionRefs.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, [project]);

  const trackerSections = [
    { num: '01', exists: !!project.problem },
    { num: '02', exists: !!project.approach },
    { num: '03', exists: !!project.design },
    { num: '03B', exists: !!project.productFlow },
    { num: '03C', exists: !!project.mobile },
    { num: '04', exists: !!project.system },
    { num: '05', exists: !!project.engineering },
    { num: '06', exists: !!project.result }
  ].filter(s => s.exists);

  const getRef = (num: string) => {
    const idx = trackerSections.findIndex(s => s.num === num);
    return (el: HTMLElement | null) => {
      if (idx !== -1) sectionRefs.current[idx] = el;
    };
  };

  return (
    <main
      className="min-h-screen bg-[#050505] text-[#f0ece4] pb-24 relative"
      style={{ fontFamily: 'var(--font-manrope), system-ui, sans-serif' }}
    >
      {/* ── SUBTLE PROGRESS INDICATOR (Desktop Only) ── */}
      <div className="hidden xl:flex fixed right-8 top-1/2 -translate-y-1/2 flex-col gap-6 z-50 pointer-events-none mix-blend-difference">
        {trackerSections.map((section, idx) => (
          <div key={section.num} className="flex items-center gap-3">
            <span className="text-[10px] tracking-widest font-mono" style={{ color: activeSection === idx ? 'rgba(155,28,28,0.9)' : 'rgba(240,236,228,0.3)', transition: 'color 0.4s ease' }}>
              {section.num}
            </span>
            <div className="h-[1px]" style={{ width: activeSection === idx ? '16px' : '8px', background: activeSection === idx ? 'rgba(155,28,28,0.9)' : 'rgba(240,236,228,0.2)', transition: 'all 0.4s ease' }} />
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
          <div className="md:col-span-4 flex flex-col justify-start">
            <RevealText as="span" type="drift" delay={0} className="text-meta mb-2" style={{ color: 'rgba(155,28,28,0.8)' }}>
              {project.number}
            </RevealText>
            <RevealText as="h1" type="words" delay={100} className="font-extrabold leading-[0.9] tracking-tight" style={{ fontSize: 'clamp(3rem, 6vw, 6rem)' }}>
              {project.title}
            </RevealText>
          </div>
          <div className="md:col-start-7 md:col-span-6 flex flex-col justify-start md:pt-1">
            <RevealText as="h2" type="words" delay={300} className="font-light leading-[1.1] tracking-tight uppercase" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 3.5rem)', color: 'rgba(240,236,228,0.7)' }}>
              {project.category.replace(' / ', '\n')}
            </RevealText>
          </div>
        </div>

        {/* MASSIVE PROJECT VISUAL */}
        <ProductArtifact 
          alt={`${project.title} Hero Artifact`} 
          priority 
          aspectRatio="aspect-[4/3] md:aspect-[21/9]"
        />
      </section>

      {/* ── METADATA ── */}
      <section 
        className="px-6 md:px-10 lg:px-14 py-20 md:py-32"
        ref={el => { (metaRef as React.MutableRefObject<HTMLElement | null>).current = el; }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-6">
          {project.role && (
            <div className="flex flex-col gap-4 reveal-drift" style={{ transitionDelay: '0ms' }}>
              <span className="text-meta" style={{ color: 'rgba(155,28,28,0.6)' }}>ROLE</span>
              <div className="flex flex-col gap-1">
                {project.role.map(r => (
                  <span key={r} className="text-label" style={{ color: 'rgba(240,236,228,0.7)' }}>{r}</span>
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-col gap-4 reveal-drift" style={{ transitionDelay: '100ms' }}>
            <span className="text-meta" style={{ color: 'rgba(155,28,28,0.6)' }}>YEAR</span>
            <span className="text-label" style={{ color: 'rgba(240,236,228,0.7)' }}>{project.year}</span>
          </div>
          {project.type && (
            <div className="flex flex-col gap-4 reveal-drift" style={{ transitionDelay: '200ms' }}>
              <span className="text-meta" style={{ color: 'rgba(155,28,28,0.6)' }}>TYPE</span>
              <span className="text-label" style={{ color: 'rgba(240,236,228,0.7)' }}>{project.type}</span>
            </div>
          )}
          {project.stack && (
            <div className="flex flex-col gap-4 reveal-drift" style={{ transitionDelay: '300ms' }}>
              <span className="text-meta" style={{ color: 'rgba(155,28,28,0.6)' }}>STACK</span>
              <div className="flex flex-col gap-1">
                {project.stack.map(s => (
                  <span key={s} className="text-label" style={{ color: 'rgba(240,236,228,0.7)' }}>{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── 01 / THE PROBLEM ── */}
      {project.problem && (
        <section ref={getRef('01')} className="px-6 md:px-10 lg:px-14 py-24 md:py-40" style={{ borderTop: '1px solid rgba(240,236,228,0.04)' }}>
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
      )}

      {/* ── 02 / THE APPROACH ── */}
      {project.approach && (
        <section ref={getRef('02')} className="px-6 md:px-10 lg:px-14 py-24 md:py-40" style={{ borderTop: '1px solid rgba(240,236,228,0.04)' }}>
          <SectionHeader num="02" label="THE APPROACH" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mt-16 md:mt-32">
            {project.approach.map((step, idx) => (
              <div key={idx} className="flex flex-col gap-6 reveal-drift" style={{ transitionDelay: `${idx * 100}ms` }}>
                <span className="text-meta" style={{ color: 'rgba(155,28,28,0.6)' }}>0{idx + 1}</span>
                <span className="text-label tracking-widest uppercase" style={{ color: 'rgba(240,236,228,0.9)' }}>{step}</span>
                <div className="h-[1px] bg-[#f0ece4]/10 w-full mt-2 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#9b1c1c] w-0 transition-all duration-1000 delay-300" style={{ width: '100%' }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 03 / DESIGN ── */}
      {project.design && (
        <section ref={getRef('03')} className="px-6 md:px-10 lg:px-14 py-24 md:py-40" style={{ borderTop: '1px solid rgba(240,236,228,0.04)' }}>
          <SectionHeader num="03" label="DESIGN" />
          
          <div className="flex flex-col gap-32 md:gap-48 mt-20 md:mt-32">
            {project.design.images.map((img, idx) => (
              <div key={idx} className="flex flex-col w-full" style={{ alignItems: img.width === '50%' ? 'flex-end' : img.width === '75%' ? 'center' : 'flex-start' }}>
                <div style={{ width: img.width, maxWidth: '100%' }}>
                  <ProductArtifact
                    src={img.src}
                    alt={`Design artifact ${idx + 1}`}
                    caption={img.caption}
                    annotation={img.annotation}
                    aspectRatio={img.width === '50%' ? 'aspect-[3/4] md:aspect-square' : 'aspect-[4/3] md:aspect-[16/10]'}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 03B / PRODUCT FLOW ── */}
      {project.productFlow && (
        <section ref={getRef('03B')} className="px-6 md:px-10 lg:px-14 py-24 md:py-32" style={{ borderTop: '1px solid rgba(240,236,228,0.04)' }}>
          <SectionHeader num="03B" label="PRODUCT FLOW" />
          <div className="flex flex-col gap-32 mt-16 md:mt-24">
            {project.productFlow.map((flow, idx) => (
              <div key={flow.step} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-3 flex flex-col gap-4">
                  <RevealText as="span" type="drift" className="text-meta" style={{ color: 'rgba(155,28,28,0.8)' }}>
                    {flow.step}
                  </RevealText>
                  <RevealText as="h3" type="words" delay={100} className="font-extrabold tracking-widest uppercase" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', color: 'rgba(240,236,228,0.9)' }}>
                    {flow.title}
                  </RevealText>
                </div>
                <div className="md:col-start-5 md:col-span-8">
                  <ProductArtifact
                    src={flow.src}
                    alt={`${flow.title} Flow`}
                    aspectRatio="aspect-video md:aspect-[16/9]"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 03C / MOBILE ── */}
      {project.mobile && (
        <section ref={getRef('03C')} className="px-6 md:px-10 lg:px-14 py-24 md:py-32" style={{ borderTop: '1px solid rgba(240,236,228,0.04)' }}>
          <SectionHeader num="03C" label="MOBILE" />
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mt-16 md:mt-24 items-center">
            <div className="md:col-span-5 flex flex-col justify-center">
              <RevealText as="h3" type="words" className="font-extrabold leading-[1] tracking-tight mb-8" style={{ fontSize: 'clamp(2.5rem, 4vw, 4.5rem)' }}>
                {project.mobile.statement}
              </RevealText>
              <RevealText as="p" type="drift" delay={200} className="font-light leading-[1.8]" style={{ fontSize: 'clamp(0.95rem, 1.2vw, 1.05rem)', color: 'rgba(240,236,228,0.5)', maxWidth: '32ch' }}>
                {project.mobile.description}
              </RevealText>
            </div>
            <div className="md:col-start-8 md:col-span-4">
              <ProductArtifact
                src={project.mobile.src}
                alt="Mobile Experience"
                aspectRatio="aspect-[9/19] md:aspect-[9/21]"
              />
            </div>
          </div>
        </section>
      )}

      {/* ── 04 / SYSTEM ── */}
      {project.system && (
        <section ref={getRef('04')} className="px-6 md:px-10 lg:px-14 py-24 md:py-40" style={{ borderTop: '1px solid rgba(240,236,228,0.04)' }}>
          <SectionHeader num="04" label="SYSTEM" />
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 mt-20 md:mt-32 items-start">
            
            <div className="md:col-span-4 flex flex-col gap-12">
              <span className="text-meta" style={{ color: 'rgba(155,28,28,0.6)' }}>TYPOGRAPHY</span>
              {project.system.typography.map((type) => (
                <div key={type.type} className="flex flex-col gap-6 border-b border-[#f0ece4]/10 pb-6 reveal-drift">
                  <div className="flex justify-between items-end">
                    <span className="text-label" style={{ color: 'rgba(240,236,228,0.5)' }}>{type.type}</span>
                    <span className="font-extrabold leading-none" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', color: 'rgba(240,236,228,0.9)' }}>{type.example}</span>
                  </div>
                  <ProductArtifact src={type.productExampleSrc} alt={`Typography ${type.type}`} aspectRatio="aspect-[21/9]" />
                </div>
              ))}
            </div>

            <div className="md:col-start-6 md:col-span-3 flex flex-col gap-12">
              <span className="text-meta" style={{ color: 'rgba(155,28,28,0.6)' }}>COLOR</span>
              {project.system.colors.map((color) => (
                <div key={color.name} className="flex flex-col gap-6 border-b border-[#f0ece4]/10 pb-6 reveal-drift">
                  <div className="flex justify-between items-center">
                    <span className="text-label" style={{ color: 'rgba(240,236,228,0.5)' }}>{color.name}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-meta" style={{ color: 'rgba(240,236,228,0.2)' }}>{color.hex}</span>
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.hex }} />
                    </div>
                  </div>
                  <ProductArtifact src={color.productExampleSrc} alt={`Color ${color.name}`} aspectRatio="aspect-[21/9]" />
                </div>
              ))}
            </div>

            <div className="md:col-start-10 md:col-span-3 flex flex-col gap-12">
              <span className="text-meta" style={{ color: 'rgba(155,28,28,0.6)' }}>COMPONENTS</span>
              {project.system.components.map((comp) => (
                <div key={comp.name} className="flex flex-col gap-6 border-b border-[#f0ece4]/10 pb-6 reveal-drift">
                  <span className="text-label" style={{ color: 'rgba(240,236,228,0.5)' }}>{comp.name}</span>
                  <ProductArtifact src={comp.src} alt={`Component ${comp.name}`} aspectRatio="aspect-[4/3]" />
                </div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* ── 05 / ENGINEERING ── */}
      {project.engineering && (
        <section ref={getRef('05')} className="px-6 md:px-10 lg:px-14 py-24 md:py-40" style={{ borderTop: '1px solid rgba(240,236,228,0.04)' }}>
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
                <React.Fragment key={layer.layer}>
                  <RevealText as="div" type="drift" delay={idx * 100} className="w-full pb-4 border-b border-[#9b1c1c]/20 flex justify-between items-end">
                    <div className="flex flex-col gap-2">
                      <span className="text-meta" style={{ color: 'rgba(155,28,28,0.6)' }}>0{idx + 1}</span>
                      <span className="text-label tracking-widest uppercase" style={{ color: 'rgba(240,236,228,0.8)' }}>{layer.layer}</span>
                    </div>
                    <span className="text-meta text-right" style={{ color: 'rgba(240,236,228,0.4)', maxWidth: '200px' }}>{layer.tech}</span>
                  </RevealText>
                  {idx < project.engineering!.architecture.length - 1 && (
                    <div className="h-8 w-[1px] bg-[#9b1c1c]/40 ml-2" />
                  )}
                </React.Fragment>
              ))}
            </div>

          </div>

          {/* DESIGN + CODE CONNECTION */}
          {project.implementation && (
            <div className="mt-32 md:mt-48 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-3 flex flex-col gap-4 border-l border-[#9b1c1c]/30 pl-4 py-2">
                <span className="text-meta" style={{ color: 'rgba(155,28,28,0.8)' }}>DESIGN DECISION</span>
                <p className="text-sm font-light text-[#f0ece4]/70">{project.implementation.decision}</p>
              </div>
              <div className="md:col-span-1 flex justify-center py-2">
                <span className="text-meta" style={{ color: 'rgba(155,28,28,0.4)' }}>→</span>
              </div>
              <div className="md:col-span-3 flex flex-col gap-4 border-l border-[#9b1c1c]/30 pl-4 py-2">
                <span className="text-meta" style={{ color: 'rgba(155,28,28,0.8)' }}>SYSTEM RULE</span>
                <p className="text-sm font-light text-[#f0ece4]/70">{project.implementation.rule}</p>
              </div>
              <div className="md:col-span-1 flex justify-center py-2">
                <span className="text-meta" style={{ color: 'rgba(155,28,28,0.4)' }}>→</span>
              </div>
              <div className="md:col-span-4 flex flex-col gap-4 border-l border-[#9b1c1c]/30 pl-4 py-2">
                <span className="text-meta" style={{ color: 'rgba(155,28,28,0.8)' }}>IMPLEMENTATION</span>
                <p className="text-sm font-light text-[#f0ece4]/70">{project.implementation.detail}</p>
              </div>
            </div>
          )}

          {/* MY ROLE */}
          {project.myRole && (
            <div className="mt-32 md:mt-48 max-w-4xl">
              <span className="text-meta block mb-8" style={{ color: 'rgba(155,28,28,0.8)' }}>MY ROLE</span>
              <RevealText as="h3" type="words" className="font-extrabold leading-[1.2] tracking-tight" style={{ fontSize: 'clamp(1.5rem, 3vw, 3rem)' }}>
                {project.myRole.join(' + ')}
              </RevealText>
            </div>
          )}
        </section>
      )}

      {/* ── 06 / THE RESULT ── */}
      {project.result && (
        <section ref={getRef('06')} className="px-6 md:px-10 lg:px-14 py-24 md:py-40" style={{ borderTop: '1px solid rgba(240,236,228,0.04)' }}>
          <SectionHeader num="06" label="THE RESULT" />
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mt-16 md:mt-32 mb-20 md:mb-40">
            <div className="md:col-span-10">
              <RevealText as="h3" type="words" className="font-extrabold leading-[0.95] tracking-tight" style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)', whiteSpace: 'pre-line' }}>
                {project.result.statement}
              </RevealText>
            </div>
            <div className="md:col-span-6 md:col-start-7 pt-8 md:pt-16">
              <RevealText as="p" type="drift" delay={200} className="font-light leading-[1.8]" style={{ fontSize: 'clamp(1rem, 1.2vw, 1.1rem)', color: 'rgba(240,236,228,0.5)', maxWidth: '40ch' }}>
                {project.result.description}
              </RevealText>
            </div>
          </div>

          <ProductArtifact 
            alt={`${project.title} Final Result`}
            aspectRatio="aspect-[4/3] md:aspect-[21/9]"
          />
        </section>
      )}

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
      {project.nextProject && (
        <section 
          className="px-6 md:px-10 lg:px-14 pt-32 pb-24 flex flex-col items-center text-center relative overflow-hidden" 
          style={{ borderTop: '1px solid rgba(240,236,228,0.04)' }}
          ref={el => { (nextRef as React.MutableRefObject<HTMLElement | null>).current = el; }}
        >
          <span className="text-meta reveal-drift mb-8" style={{ color: 'rgba(155,28,28,0.8)' }}>NEXT PROJECT</span>
          <Link href={`/work/${project.nextProject.slug}`} className="group flex flex-col items-center gap-6 reveal-drift" style={{ textDecoration: 'none' }}>
            <h2 className="font-extrabold tracking-tight transition-colors duration-700 group-hover:text-white" style={{ fontSize: 'clamp(3rem, 8vw, 8rem)', color: 'transparent', WebkitTextStroke: '1.5px rgba(240,236,228,0.3)' }}>
              {project.nextProject.title}
            </h2>
            <div className="flex items-center gap-4 mt-2 text-meta transition-colors duration-700 group-hover:text-[#9b1c1c]" style={{ color: 'rgba(240,236,228,0.4)' }}>
              <span>{project.nextProject.number}</span>
              <span className="arrow transform transition-transform duration-300 group-hover:translate-x-2" aria-hidden="true">→</span>
            </div>
            
            {/* Subtle Image Reveal on Hover */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[60vh] md:h-full max-w-7xl bg-[#0A0A0A]/50 opacity-0 group-hover:opacity-10 transition-opacity duration-1000 pointer-events-none -z-10 flex items-center justify-center overflow-hidden">
              {project.nextProject.previewAsset ? (
                <img src={project.nextProject.previewAsset} alt={project.nextProject.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#111]" />
              )}
            </div>
          </Link>
        </section>
      )}
    </main>
  );
}
