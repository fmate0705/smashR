'use client';

import type { ReactNode } from 'react';
import { useScrollAnimation } from '@/lib/motion/use-scroll-animation';

interface ParallaxProps {
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * Drifts a media layer slower than the page across its own scroll range, separating a background
 * from the content in front of it. The displacement stays within a quarter of the element by
 * construction — the preset owns the range, not the caller — and the whole effect is skipped
 * below motion level 3 and under reduced motion.
 */
export function Parallax({ children, className }: ParallaxProps) {
  const container = useScrollAnimation<HTMLDivElement>('parallax-media', ':scope > *');

  return (
    <div ref={container} className={className}>
      <div>{children}</div>
    </div>
  );
}
