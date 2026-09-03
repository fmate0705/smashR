import { cn } from '@/lib/cn';

const TONE_SRC = {
  red: '/brand/smashr-logo.svg',
  white: '/brand/smashr-logo-white.svg',
} as const;

/** The mark's own proportions, from the tightened viewBox. Used to reserve its box exactly. */
const RATIO = { width: 1038, height: 389 } as const;

interface LogoProps {
  readonly tone?: keyof typeof TONE_SRC;
  readonly className?: string;
  /**
   * The logo carries the brand name, so it is normally the accessible name of whatever wraps it.
   * Pass `decorative` when the name is already in the surrounding text and would be read twice.
   */
  readonly decorative?: boolean;
  readonly priority?: boolean;
}

/**
 * The SmashR wordmark.
 *
 * The source artwork arrived as a JPEG on a white plate; the shipped mark is the vector, whose
 * paths carry no background at all — so it sits directly on tile, on beige, on paper, and never
 * needs a white card behind it. It stays an SVG at every size because the script's thin joins
 * break up badly under raster scaling at hero scale.
 */
export function Logo({ tone = 'red', className, decorative = false, priority = false }: LogoProps) {
  return (
    <img
      src={TONE_SRC[tone]}
      width={RATIO.width}
      height={RATIO.height}
      alt={decorative ? '' : 'SmashR'}
      aria-hidden={decorative ? true : undefined}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding={priority ? 'sync' : 'async'}
      className={cn('block h-auto w-full', className)}
    />
  );
}
