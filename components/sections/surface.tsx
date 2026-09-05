import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * The three surfaces the whole site is built from.
 *
 * A page is a sequence of these and nothing else, which is what stops fifteen slightly different
 * background treatments accumulating across five pages. Each one owns its ground, its text colour
 * and its vertical rhythm; a section only decides which of the three it is.
 *
 *   tile  — black, edged top and bottom with the same glazed tile as the hero
 *   paper — near-white with a barely-there newsprint grain, for product and information
 *   beige — the flat brand beige, for storytelling and scroll-driven set pieces
 */
export type SurfaceTone = 'tile' | 'paper' | 'beige';

interface SurfaceProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly id?: string;
  /** Vertical rhythm. `flush` removes it entirely for sections that own their own spacing. */
  readonly spacing?: 'default' | 'tight' | 'loose' | 'flush';
  readonly as?: 'section' | 'div' | 'footer';
  readonly ariaLabelledBy?: string;
  readonly ariaLabel?: string;
  /**
   * Cuts the section's own top edge into a wave, revealing whatever sits behind it. On by default:
   * every join between two sections is a torn one. Turn it off for a section that opens a page,
   * where there is nothing above to reveal, and for any section that pins a child — a mask makes
   * a fixed-position descendant clip to it, which would break the pin.
   */
  readonly waveTop?: boolean;
}

const SPACING = {
  default: 'py-[var(--smashr-section-y)]',
  tight: 'py-[calc(var(--smashr-section-y)*0.6)]',
  loose: 'py-[calc(var(--smashr-section-y)*1.45)]',
  flush: '',
} as const;

/**
 * Centres content at the editorial measure.
 *
 * `--smashr-gutter` scales with the viewport instead of stepping at breakpoints, so the margin
 * never collapses to a hard 16px on a 700px-wide tablet the way a fixed `px-4 md:px-8` does.
 */
export function Container({
  className,
  children,
  width = 'default',
}: {
  className?: string;
  children: ReactNode;
  width?: 'default' | 'wide' | 'narrow';
}) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-[var(--smashr-gutter)]',
        width === 'default' && 'max-w-[82rem]',
        width === 'wide' && 'max-w-[100rem]',
        width === 'narrow' && 'max-w-[60rem]',
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * The tile edge.
 *
 * One strip of the hero's own wall, repeated horizontally and masked to nothing before it reaches
 * the content. It is what visually stitches the black sections into one continuous room rather
 * than leaving them as unrelated black bands — and because it is a mask, the centre of a section
 * stays pure black and the text on it keeps full contrast.
 */
function TileEdge({ side }: { side: 'top' | 'bottom' }) {
  // One fade for both edges: opaque at the strip's own top, clear at its bottom. The bottom edge
  // then mirrors the whole element on the Y axis, which flips the wall *and* its fade together —
  // so the tiles are densest against the outer edge of the section at both ends. Rotating instead
  // of mirroring was the earlier bug: it turned the fade over twice and left the bottom edge
  // strongest in the middle of the section.
  const fade = 'linear-gradient(to bottom, rgb(0 0 0 / 0.85), transparent)';

  return (
    <span
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-x-0 h-40 opacity-70 sm:h-56',
        side === 'top' ? 'top-0' : 'bottom-0 [transform:scaleY(-1)]',
      )}
      style={
        {
          backgroundImage: 'url(/images/texture/tile-strip.webp)',
          backgroundRepeat: 'repeat-x',
          backgroundSize: 'auto 100%',
          WebkitMaskImage: fade,
          maskImage: fade,
        } as CSSProperties
      }
    />
  );
}

/**
 * Each surface publishes its own ink and ground as channel triplets. A control dropped onto any of
 * them — the secondary button above all — reads those instead of being told a colour, which is why
 * the same button is legible on the black tile and on the beige without a variant for each.
 */
const TONE_CLASS: Record<SurfaceTone, string> = {
  tile: 'bg-black text-white [--smashr-ground:0_0_0] [--smashr-ink:255_255_255]',
  paper:
    'bg-[rgb(var(--smashr-paper))] text-black [--smashr-ground:var(--smashr-paper)] [--smashr-ink:0_0_0]',
  beige:
    'bg-[rgb(var(--smashr-beige))] text-black [--smashr-ground:var(--smashr-beige)] [--smashr-ink:0_0_0]',
};

/**
 * A page section on one of the three surfaces.
 *
 * `isolate` gives each section its own stacking context so a decorative layer inside one can
 * never paint over the sticky header or the section after it.
 */
export function Surface({
  children,
  className,
  id,
  tone,
  spacing = 'default',
  as: Tag = 'section',
  ariaLabelledBy,
  ariaLabel,
  waveTop = true,
}: SurfaceProps & { readonly tone: SurfaceTone }) {
  return (
    <Tag
      id={id}
      aria-labelledby={ariaLabelledBy}
      aria-label={ariaLabel}
      className={cn(
        'relative isolate overflow-hidden',
        TONE_CLASS[tone],
        SPACING[spacing],
        // The wave eats into the section's own top padding, so the first line of content keeps its
        // full rhythm instead of ending up crowded against the torn edge.
        waveTop && 'smashr-wave-top',
        waveTop && spacing !== 'flush' && 'pt-[calc(var(--smashr-section-y)+var(--smashr-wave-h))]',
        className,
      )}
    >
      {tone === 'tile' ? (
        <>
          <TileEdge side="top" />
          <TileEdge side="bottom" />
        </>
      ) : null}
      {tone === 'paper' ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.2] mix-blend-multiply"
          style={{
            backgroundImage: 'url(/images/texture/paper.webp)',
            backgroundSize: '340px auto',
          }}
        />
      ) : null}
      {/* `w-full` matters only when the section itself is laid out as a row flex container — the
          full-height 404 and error pages are — where this wrapper would otherwise shrink to its
          content and take the container's own centring with it. Everywhere else it is what a
          block-level div already does. */}
      <div className="relative w-full">{children}</div>
    </Tag>
  );
}

export function TileSection(props: SurfaceProps) {
  return <Surface {...props} tone="tile" />;
}

export function PaperSection(props: SurfaceProps) {
  return <Surface {...props} tone="paper" />;
}

export function BeigeSection(props: SurfaceProps) {
  return <Surface {...props} tone="beige" />;
}
