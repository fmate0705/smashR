'use client';

import type { ReactNode } from 'react';
import { useScrollAnimation } from '@/lib/motion/use-scroll-animation';

interface PinnedSectionProps {
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * Pins a section for one viewport of scrolling while its content settles into place.
 *
 * Pinning is the most intrusive scroll effect the framework admits, so it carries the most
 * conditions: level 3 or above, presentational content only (a pinned region that holds focusable
 * controls fights the browser's own focus scrolling, GS-15), and `invalidateOnRefresh` so the
 * release point survives font loading and resize.
 */
export function PinnedSection({ children, className }: PinnedSectionProps) {
  const container = useScrollAnimation<HTMLElement>('pin-section', ':scope > *');

  return (
    <section ref={container} className={className}>
      <div>{children}</div>
    </section>
  );
}
