'use client';

import { useRef, createElement } from 'react';
import { gsap, useGSAP, MOTION_QUERY } from '@/lib/motion/gsap';
import { cn } from '@/lib/cn';

interface AnimatedHeadingProps {
  /** One entry per line. Lines are authored, not measured — the break is a design decision. */
  readonly lines: readonly string[];
  readonly as?: 'h1' | 'h2' | 'h3';
  readonly className?: string;
  readonly id?: string;
}

/**
 * A heading whose lines rise into place one after another.
 *
 * Each line sits in its own overflow-hidden box, so the line does not fade in from nowhere — it
 * arrives from behind the line above it, which is what makes a stack of display type read as a
 * single movement rather than three separate fades.
 *
 * The lines are in the DOM as ordinary text at their final position. The animation is what hides
 * them, and only inside the motion branch — so with reduced motion, a failed script, or no
 * JavaScript at all, the heading is simply there.
 */
export function AnimatedHeading({ lines, as = 'h2', className, id }: AnimatedHeadingProps) {
  const root = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(MOTION_QUERY, () => {
        const tween = gsap.from('[data-line]', {
          yPercent: 108,
          duration: 0.72,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: { trigger: root.current, start: 'top 82%', once: true },
        });
        return () => tween.kill();
      });
      return () => media.revert();
    },
    { scope: root },
  );

  return createElement(
    as,
    { ref: root, id, className: cn('smashr-display', className) },
    lines.map((line) => (
      <span key={line} className="block overflow-hidden pb-[0.06em]">
        <span data-line className="block will-change-transform">
          {line}
        </span>
      </span>
    )),
  );
}
