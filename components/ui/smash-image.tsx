import { responsiveImage } from '@/lib/images/responsive';
import type { ImageKey } from '@/lib/images/manifest';
import { cn } from '@/lib/cn';

interface SmashImageProps {
  /** Public path without the width suffix, e.g. `/images/story/tortenetunk`. */
  readonly base: ImageKey;
  readonly widths: readonly number[];
  /** The `sizes` attribute. Required: without it the browser assumes 100vw and over-downloads. */
  readonly sizes: string;
  /** Empty string marks the image as decorative and hides it from assistive technology. */
  readonly alt: string;
  readonly className?: string;
  /** Set on the one image that is the largest paint of its page. Everything else stays lazy. */
  readonly priority?: boolean;
}

/**
 * The project's only image element.
 *
 * Every image ships pre-built at known widths (see `scripts/prepare-assets.mjs`), so this renders
 * a plain element with a real `srcSet` rather than routing through a runtime optimizer. Three
 * things are non-negotiable here and are therefore not props: intrinsic `width`/`height` always
 * come from the manifest, so the box is reserved and nothing below it moves when the bytes land;
 * `decoding="async"` keeps decode off the main thread; and anything not marked `priority` is
 * lazy with low fetch priority.
 */
export function SmashImage({
  base,
  widths,
  sizes,
  alt,
  className,
  priority = false,
}: SmashImageProps) {
  const image = responsiveImage(base, widths);

  return (
    <img
      src={image.src}
      srcSet={image.srcSet}
      sizes={sizes}
      width={image.width}
      height={image.height}
      alt={alt}
      aria-hidden={alt === '' ? true : undefined}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'low'}
      decoding="async"
      className={cn('block h-auto w-full', className)}
    />
  );
}
