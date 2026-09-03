import { IMAGE_SIZES, type ImageKey } from './manifest';

/**
 * Builds the attributes for one pre-built responsive image set.
 *
 * `scripts/prepare-assets.mjs` has already written every width as WebP, so nothing is resized at
 * request time: the browser picks a file that exists. That is deliberate — a runtime image
 * optimizer puts a cold cache miss in front of the largest paint on a first visit, and this site
 * is judged on that first visit.
 *
 * `width`/`height` come from the manifest rather than from a guess, which is what reserves the
 * box before a single byte of the image arrives.
 */
export interface ResponsiveImage {
  readonly src: string;
  readonly srcSet: string;
  readonly width: number;
  readonly height: number;
}

/**
 * @param base   Public path without the width suffix, e.g. `/images/story/tortenetunk`.
 * @param widths The widths written for that base, ascending.
 * @param sizes  Ignored here; pass it to the element. Kept out so callers own layout.
 */
export function responsiveImage(base: ImageKey, widths: readonly number[]): ResponsiveImage {
  const intrinsic = IMAGE_SIZES[base];
  const candidates = widths.map((width) => {
    const key = `${base}-${width}.webp` as ImageKey;
    const size = IMAGE_SIZES[key];
    // A width the pipeline refused to upscale to lands on disk at the source width. Advertising
    // the requested width instead of the real one would make the browser pick a file that is
    // smaller than it thinks, so the descriptor always comes from the file itself.
    return { path: key, width: size === undefined ? width : size.width };
  });

  const largest = candidates[candidates.length - 1];

  return {
    src: largest === undefined ? base : largest.path,
    srcSet: candidates.map((candidate) => `${candidate.path} ${candidate.width}w`).join(', '),
    width: intrinsic.width,
    height: intrinsic.height,
  };
}

/** The widths the pipeline writes, by asset family. Kept beside the pipeline's own list. */
export const WIDTHS = {
  hero: [1280, 1920, 2560],
  story: [960, 1600, 2200],
  storySmall: [960, 1600],
  burger: [720, 1200],
  menu: [400, 800],
} as const;
