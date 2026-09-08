'use client';

import React from 'react';
import Image from 'next/image';
import ImageReveal from './ImageReveal';

interface ProductArtifactProps {
  src?: string;
  alt: string;
  caption?: string;
  index?: string;
  category?: string;
  annotation?: {
    title: string;
    description: string;
  };
  priority?: boolean;
  className?: string;
  aspectRatio?: string;
}

export default function ProductArtifact({
  src,
  alt,
  caption,
  index,
  category,
  annotation,
  priority = false,
  className = '',
  aspectRatio = 'aspect-video'
}: ProductArtifactProps) {
  return (
    <div className={`flex flex-col gap-6 w-full ${className}`}>
      {/* Editorial Header */}
      {(index || category || caption) && (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 text-[10px] md:text-xs uppercase tracking-widest text-[#f0ece4]/40 font-mono">
          <div className="flex items-center gap-4">
            {index && <span className="text-[#9b1c1c]">{index}</span>}
            {(index && category) && <span>—</span>}
            {category && <span>{category}</span>}
          </div>
          {caption && <span className="text-right">{caption}</span>}
        </div>
      )}

      {/* The Visual Artifact */}
      <ImageReveal>
        <div className={`relative w-full ${aspectRatio} bg-[#0A0A0A] border border-[#f0ece4]/5 overflow-hidden flex items-center justify-center`}>
          {src ? (
            <Image
              src={src}
              alt={alt}
              fill
              priority={priority}
              sizes="(max-width: 768px) 100vw, 80vw"
              className="object-cover md:object-contain object-center"
            />
          ) : (
            <div className="text-center flex flex-col gap-2">
              <span className="text-[#9b1c1c] text-xs tracking-widest uppercase">Visual Asset</span>
              <span className="text-[#f0ece4]/20 text-xs tracking-widest uppercase">To Be Replaced</span>
            </div>
          )}
        </div>
      </ImageReveal>

      {/* Optional Editorial Annotation */}
      {annotation && (
        <div className="mt-2 md:mt-4 max-w-sm border-l border-[#9b1c1c]/30 pl-4 py-1">
          <h4 className="text-xs uppercase tracking-widest text-[#f0ece4]/80 mb-2">{annotation.title}</h4>
          <p className="text-sm font-light leading-relaxed text-[#f0ece4]/50">{annotation.description}</p>
        </div>
      )}
    </div>
  );
}
