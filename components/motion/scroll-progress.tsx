'use client';

import { useScrollAnimation } from '@/lib/motion/use-scroll-animation';

/**
 * A reading-progress indicator for long-form pages. It answers "how much is left", which makes it
 * information rather than decoration — so unlike the other scroll effects it stays useful at motion
 * level 1, and its reduced-motion fallback is the bar itself, not its absence.
 */
export function ScrollProgress({ className }: { readonly className?: string }) {
  // The page is the trigger here, not the bar: a two-pixel fixed element has no scroll range of
  // its own, so its progress is the document's progress.
  const container = useScrollAnimation<HTMLDivElement>('progress-bar', ':scope > *', {
    trigger: 'page',
  });

  return (
    <div
      ref={container}
      aria-hidden="true"
      className={className ?? 'fixed inset-x-0 top-0 z-50 h-0.5 overflow-hidden'}
    >
      <div className="h-full w-full bg-primary" />
    </div>
  );
}
