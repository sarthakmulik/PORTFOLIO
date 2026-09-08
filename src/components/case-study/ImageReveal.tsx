'use client';

import React from 'react';
import { useRevealAnimation } from '@/hooks/useRevealAnimation';

interface ImageRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function ImageReveal({ children, className = '', delay = 0 }: ImageRevealProps) {
  const { containerRef } = useRevealAnimation(() => {}, { threshold: 0.1 });

  return (
    <div
      ref={el => { (containerRef as React.MutableRefObject<HTMLElement | null>).current = el; }}
      className={`reveal-image-wrapper ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
