/**
 * useRevealAnimation
 *
 * Attach `containerRef` to any element. When it enters the viewport,
 * the hook fires `onReveal` once and disconnects the observer.
 *
 * Returns the ref to attach + a manual `trigger()` for imperative use.
 */
import { useEffect, useRef, useCallback } from 'react';

interface UseRevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export function useRevealAnimation(
  onReveal: () => void,
  options: UseRevealOptions = {}
) {
  const { threshold = 0.15, rootMargin = '0px', once = true } = options;
  const containerRef = useRef<HTMLElement | null>(null);
  const observerRef  = useRef<IntersectionObserver | null>(null);
  const firedRef     = useRef(false);

  const trigger = useCallback(() => {
    if (!firedRef.current) {
      firedRef.current = true;
      onReveal();
    }
  }, [onReveal]);

  useEffect(() => {
    // Respect prefers-reduced-motion globally
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      trigger();
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            trigger();
            if (once && observerRef.current) {
              observerRef.current.disconnect();
            }
          }
        });
      },
      { threshold, rootMargin }
    );

    observerRef.current.observe(el);

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [trigger, threshold, rootMargin, once]);

  return { containerRef, trigger };
}
