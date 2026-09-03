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
   * Tears the bottom edge open into the named surface. Only the paper-stock tones carry it — a
   * torn edge on the tile wall would be a torn wall, which is a different and worse idea.
   */
  readonly tearInto?: SurfaceTone;
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

/** The fill each tone's divider is drawn in, so a divider matches the section it tears into. */
const TONE_FILL: Record<SurfaceTone, string> = {
  tile: 'rgb(0 0 0)',
  paper: 'rgb(var(--smashr-paper))',
  beige: 'rgb(var(--smashr-beige))',
};

/**
 * A torn paper edge between two surfaces.
 *
 * Drawn in the colour of the section that comes *next*, so the beige appears to have been torn
 * away to reveal it. It is one hand-drawn path rather than a repeating wave: a mathematical curve
 * reads as a shape tool, and the point of this edge is that the surface is paper.
 *
 * `preserveAspectRatio="none"` lets one path stretch to any viewport width; the vertical scale is
 * fixed by the wrapper's height, so the tear never grows into a hill on a wide display.
 */
function TornDivider({ into }: { into: SurfaceTone }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-[-1px] z-[1] block h-10 sm:h-14"
    >
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        className="h-full w-full"
        focusable="false"
      >
        <path
          d="M0 34 C 62 22, 104 41, 168 36 C 232 31, 268 15, 336 21 C 404 27, 430 46, 500 43 C 570 40, 604 24, 672 27 C 740 30, 772 47, 842 45 C 912 43, 948 26, 1016 29 C 1084 32, 1114 48, 1182 44 C 1250 40, 1284 23, 1348 28 C 1392 31, 1416 39, 1440 33 L 1440 60 L 0 60 Z"
          fill={TONE_FILL[into]}
        />
      </svg>
    </span>
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
  tearInto,
}: SurfaceProps & { readonly tone: SurfaceTone }) {
  // A torn edge is a paper idea. Asking for one on the tile wall is asking for a torn wall.
  const tear = tone === 'tile' ? undefined : tearInto;

  return (
    <Tag
      id={id}
      aria-labelledby={ariaLabelledBy}
      aria-label={ariaLabel}
      className={cn(
        'relative isolate overflow-hidden',
        TONE_CLASS[tone],
        SPACING[spacing],
        // The tear eats into the section's own bottom padding, so the content above it keeps its
        // full rhythm instead of ending up crowded against the torn line.
        tear !== undefined && spacing !== 'flush' && 'pb-[calc(var(--smashr-section-y)+2.5rem)]',
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
          className="pointer-events-none absolute inset-0 opacity-[0.55] mix-blend-multiply"
          style={{
            backgroundImage: 'url(/images/texture/paper.webp)',
            backgroundSize: '820px auto',
          }}
        />
      ) : null}
      <div className="relative">{children}</div>
      {tear === undefined ? null : <TornDivider into={tear} />}
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
