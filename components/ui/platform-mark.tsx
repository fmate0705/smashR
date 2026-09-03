import { cn } from '@/lib/cn';

/**
 * The ordering platforms' own app icons, and the route-planning pin.
 *
 * A customer recognises foodora's magenta and Wolt's blue before they read a word, so the icon
 * does the identifying and the label only confirms it. The two platform marks are raster because
 * they are the platforms' artwork, not ours to redraw; the pin is drawn here because it is a
 * generic symbol and inherits `currentColor` so it works on both button variants.
 */
export type PlatformId = 'foodora' | 'wolt';

const PLATFORM_SRC: Record<PlatformId, string> = {
  foodora: '/images/platform/foodora.webp',
  wolt: '/images/platform/wolt.webp',
};

export function PlatformMark({
  platform,
  className,
}: {
  readonly platform: PlatformId;
  readonly className?: string;
}) {
  return (
    <img
      src={PLATFORM_SRC[platform]}
      width={96}
      height={96}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      className={cn('h-[1.15em] w-[1.15em] shrink-0 rounded-[3px] object-contain', className)}
    />
  );
}

/** A map pin, for the route-planning action. */
export function PinMark({ className }: { readonly className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn('h-[1.15em] w-[1.15em] shrink-0', className)}
    >
      <path
        d="M12 21.5s7-6.02 7-11.06A7 7 0 0 0 5 10.44C5 15.48 12 21.5 12 21.5Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10.2" r="2.5" stroke="currentColor" strokeWidth="1.9" />
    </svg>
  );
}
