import { cn } from '@/lib/cn';

/**
 * The scroll hint under the hero.
 *
 * A drawn mouse body with a wheel dot that falls and fades on a loop. It is a CSS animation rather
 * than a GSAP timeline on purpose: it runs forever, it is never scrubbed, and it must survive
 * with the JavaScript bundle still in flight — the one moment a visitor most needs to be told
 * there is more page below.
 *
 * The whole thing is `aria-hidden`; "scroll down" is not information a screen reader user needs,
 * and the content below is already reachable in the document order.
 */
export function ScrollCue({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('flex flex-col items-center gap-3 text-white/45', className)}
    >
      <svg
        viewBox="0 0 24 40"
        fill="none"
        className="h-9 w-[1.35rem]"
        role="presentation"
        focusable="false"
      >
        <rect
          x="1"
          y="1"
          width="22"
          height="38"
          rx="11"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.7"
        />
        <circle cx="12" cy="11" r="2.4" fill="currentColor" className="smashr-scroll-dot" />
      </svg>
      <span className="smashr-display text-[0.6rem] tracking-[0.3em]">Görgess</span>
    </div>
  );
}
