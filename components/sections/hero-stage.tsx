'use client';

import { useRef, type ReactNode } from 'react';
import { gsap, useGSAP, MOTION_QUERY } from '@/lib/motion/gsap';

/**
 * Holds the hero still while the next section climbs over it.
 *
 * The hero is sticky inside a viewport-tall track, so the section that follows does not start
 * *after* it — it slides across it, the way a card is dealt over another. As it is covered the
 * hero drops back and darkens, which is what turns a flat cut into depth: two planes at different
 * distances rather than two blocks in a column.
 *
 * Only scale, translate and opacity are touched, so the whole transition stays on the compositor.
 * With reduced motion the hero simply sits there and the next section covers it, unanimated —
 * the depth is a flourish, and the reading order does not depend on it.
 */
export function HeroStage({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add(MOTION_QUERY, () => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.4,
            invalidateOnRefresh: true,
          },
        });

        timeline
          .to('[data-hero-inner]', { scale: 0.9, yPercent: -3, ease: 'none' }, 0)
          .to('[data-hero-dim]', { opacity: 0.72, ease: 'none' }, 0);

        return () => timeline.kill();
      });

      return () => media.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative h-[100svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div data-hero-inner className="h-full origin-top will-change-transform">
          {children}
        </div>
        <div
          data-hero-dim
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-black opacity-0"
        />
      </div>
    </div>
  );
}
