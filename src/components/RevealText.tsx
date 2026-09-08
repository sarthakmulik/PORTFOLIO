'use client';

/**
 * RevealText
 *
 * A polymorphic animated text primitive. Three animation modes:
 *
 *  'mask'  — text slides up through an overflow:hidden clip (best for headings)
 *  'chars' — headline split into individual chars, each staggered (display text)
 *  'drift' — soft opacity + translateY (body copy, labels, metadata)
 *  'words' — paragraph split into words, each staggered (process statements)
 *  'rule'  — for horizontal crimson rules that extend left → right
 *
 * All animations triggered by IntersectionObserver. Zero React state on scroll.
 * Respects prefers-reduced-motion (shows element immediately, no animation).
 */

import React, { useRef, useEffect, ElementType, ReactNode } from 'react';
import { useRevealAnimation } from '@/hooks/useRevealAnimation';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
type AnimationType = 'mask' | 'chars' | 'drift' | 'words' | 'rule';

interface RevealTextProps {
  as?: ElementType;
  type?: AnimationType;
  delay?: number;            // base delay in ms
  charDelay?: number;        // inter-char delay in ms (chars mode only)
  wordDelay?: number;        // inter-word delay in ms (words mode only)
  className?: string;
  style?: React.CSSProperties;
  children: ReactNode;
  threshold?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function RevealText({
  as: Tag = 'div',
  type = 'drift',
  delay = 0,
  charDelay = 32,
  wordDelay = 55,
  className = '',
  style = {},
  children,
  threshold = 0.15,
}: RevealTextProps) {
  const innerRef = useRef<HTMLElement | null>(null);
  const wrapperRef = useRef<HTMLElement | null>(null);

  const prefersReduced =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  // ── DRIFT mode ─────────────────────────────────────────────────────────────
  const onRevealDrift = () => {
    const el = innerRef.current;
    if (!el) return;
    el.style.animationDelay = `${delay}ms`;
    el.classList.add('is-revealed');
  };

  // ── MASK mode ──────────────────────────────────────────────────────────────
  const onRevealMask = () => {
    const el = innerRef.current;
    if (!el) return;
    el.style.animationDelay = `${delay}ms`;
    el.classList.add('is-revealed');
  };

  // ── CHARS mode ─────────────────────────────────────────────────────────────
  const onRevealChars = () => {
    const el = innerRef.current;
    if (!el) return;
    const chars = el.querySelectorAll<HTMLElement>('.reveal-char');
    chars.forEach((ch, i) => {
      ch.style.animationDelay = `${delay + i * charDelay}ms`;
      ch.classList.add('is-revealed');
    });
  };

  // ── WORDS mode ─────────────────────────────────────────────────────────────
  const onRevealWords = () => {
    const el = innerRef.current;
    if (!el) return;
    const words = el.querySelectorAll<HTMLElement>('.reveal-word');
    words.forEach((w, i) => {
      w.style.animationDelay = `${delay + i * wordDelay}ms`;
      w.classList.add('is-revealed');
    });
  };

  // ── RULE mode ──────────────────────────────────────────────────────────────
  const onRevealRule = () => {
    const el = innerRef.current;
    if (!el) return;
    el.style.animationDelay = `${delay}ms`;
    el.classList.add('is-revealed');
  };

  const onRevealMap: Record<AnimationType, () => void> = {
    drift: onRevealDrift,
    mask:  onRevealMask,
    chars: onRevealChars,
    words: onRevealWords,
    rule:  onRevealRule,
  };

  const { containerRef } = useRevealAnimation(
    onRevealMap[type],
    { threshold }
  );

  // Attach both refs to the wrapper element
  const setWrapperRef = (el: HTMLElement | null) => {
    wrapperRef.current = el;
    (containerRef as React.MutableRefObject<HTMLElement | null>).current = el;
  };

  // ── Immediate reveal for reduced motion ───────────────────────────────────
  useEffect(() => {
    if (!prefersReduced) return;
    const el = innerRef.current;
    if (!el) return;

    if (type === 'mask') {
      el.style.transform = 'translateY(0)';
      el.style.opacity   = '1';
    } else if (type === 'chars') {
      const chars = el.querySelectorAll<HTMLElement>('.reveal-char');
      chars.forEach(c => {
        c.style.opacity   = '1';
        c.style.transform = 'none';
      });
    } else if (type === 'words') {
      const words = el.querySelectorAll<HTMLElement>('.reveal-word');
      words.forEach(w => {
        w.style.opacity   = '1';
        w.style.transform = 'none';
      });
    } else if (type === 'drift' || type === 'rule') {
      el.style.opacity   = '1';
      el.style.transform = 'none';
    }
  }, [prefersReduced, type]);

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────

  // RULE — simple single element
  if (type === 'rule') {
    return (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      <Tag
        ref={(el: HTMLElement | null) => {
          setWrapperRef(el);
          (innerRef as React.MutableRefObject<HTMLElement | null>).current = el;
        }}
        className={`reveal-rule ${className}`}
        style={style}
        aria-hidden="true"
      />
    );
  }

  // DRIFT — wrapper is the observer target, inner is the animated element
  if (type === 'drift') {
    return (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      <Tag
        ref={setWrapperRef}
        className={className}
        style={style}
      >
        <span
          ref={el => { (innerRef as React.MutableRefObject<HTMLElement | null>).current = el; }}
          className="reveal-drift block"
        >
          {children}
        </span>
      </Tag>
    );
  }

  // MASK — overflow hidden wrapper clips the inner sliding text
  if (type === 'mask') {
    return (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      <Tag
        ref={setWrapperRef}
        className={`reveal-mask ${className}`}
        style={style}
      >
        <span
          ref={el => { (innerRef as React.MutableRefObject<HTMLElement | null>).current = el; }}
          className="reveal-mask-inner"
        >
          {children}
        </span>
      </Tag>
    );
  }

  // CHARS — split children string into individual character spans
  if (type === 'chars') {
    const text = typeof children === 'string' ? children : String(children);
    const chars = text.split('').map((ch, i) => (
      <span
        key={i}
        className="reveal-char"
        aria-hidden="true"
        style={{ whiteSpace: ch === ' ' ? 'pre' : 'normal' }}
      >
        {ch}
      </span>
    ));

    return (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      <Tag
        ref={setWrapperRef}
        className={`reveal-chars ${className}`}
        style={style}
        aria-label={text}
      >
        <span
          ref={el => { (innerRef as React.MutableRefObject<HTMLElement | null>).current = el; }}
        >
          {chars}
        </span>
      </Tag>
    );
  }

  // WORDS — split children string into individual word spans
  if (type === 'words') {
    const text = typeof children === 'string' ? children : String(children);
    const wordList = text.split(' ');
    const words = wordList.map((word, i) => (
      <React.Fragment key={i}>
        <span className="reveal-word">{word}</span>
        {i < wordList.length - 1 && ' '}
      </React.Fragment>
    ));

    return (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      <Tag
        ref={setWrapperRef}
        className={className}
        style={style}
      >
        <span
          ref={el => { (innerRef as React.MutableRefObject<HTMLElement | null>).current = el; }}
        >
          {words}
        </span>
      </Tag>
    );
  }

  return null;
}

