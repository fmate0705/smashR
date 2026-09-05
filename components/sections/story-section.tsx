import { Surface, Container, type SurfaceTone } from '@/components/sections/surface';
import { SmashImage } from '@/components/ui/smash-image';
import { Logo } from '@/components/ui/logo';
import { Reveal } from '@/components/motion';
import type { ImageKey } from '@/lib/images/manifest';
import { cn } from '@/lib/cn';

interface StorySectionProps {
  readonly id?: string;
  readonly heading: string;
  readonly paragraphs: readonly string[];
  readonly image: {
    readonly base: ImageKey;
    readonly alt: string;
    readonly widths: readonly number[];
    /**
     * Set when this section opens a page. Everything here is lazy by default, which is right for
     * a section three screens down and wrong for the one the visitor is already looking at — a
     * lazy, low-priority image above the fold arrives after everything else on the page.
     */
    readonly priority?: boolean;
  };
  /** `mark` puts the wordmark above the heading — the home page's story block. */
  readonly variant?: 'mark' | 'plain';
  /** Which side the photograph sits on at desktop widths. */
  readonly media?: 'left' | 'right';
  /** The surface it is told on. The block reads its colours from the surface, not from the tone. */
  readonly tone?: SurfaceTone;
  /** Off when this block follows a page header. */
  readonly waveTop?: boolean;
  readonly footer?: React.ReactNode;
}

/**
 * A story block: one photograph, one heading, a short run of paragraphs.
 *
 * One component with a few configurations rather than several components, because the home page
 * and the about page tell the same story at different lengths — and a second copy of this markup
 * is how two pages start drifting into two different brands. Its type is set in the surface's own
 * ink rather than in white, so the same block works on the tile wall and on the beige.
 *
 * The photograph is real: SmashR's own counter, its own wall, its own crew. Nothing on this
 * surface is generated.
 */
export function StorySection({
  id,
  heading,
  paragraphs,
  image,
  variant = 'plain',
  media = 'right',
  tone = 'tile',
  waveTop = true,
  footer,
}: StorySectionProps) {
  return (
    <Surface id={id} tone={tone} spacing="loose" waveTop={waveTop}>
      <Container>
        <Reveal
          className={cn(
            'grid items-center gap-12 lg:grid-cols-2 lg:gap-20',
            media === 'left' && 'lg:[&>*:first-child]:order-2',
          )}
        >
          <div>
            {variant === 'mark' ? (
              <Logo tone="red" className="mb-8 w-44 sm:w-56" decorative />
            ) : null}
            <h2 className="smashr-display smashr-display-xl text-balance text-[clamp(2.25rem,5.5vw,4.5rem)]">
              {heading}
            </h2>
            <div className="mt-8 flex max-w-[54ch] flex-col gap-5 text-base leading-relaxed text-[rgb(var(--smashr-ink)/0.72)] sm:text-lg">
              {paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
            {footer === undefined ? null : <div className="mt-10">{footer}</div>}
          </div>

          <figure className="relative">
            {/* An offset frame rather than a plate behind the picture: the brand touches the
                photograph at a distance instead of containing it. */}
            <div
              aria-hidden="true"
              className="absolute -bottom-4 -right-4 h-full w-full border-2 border-primary sm:-bottom-6 sm:-right-6"
            />
            <SmashImage
              base={image.base}
              widths={image.widths}
              priority={image.priority === true}
              sizes="(min-width: 1024px) 44vw, 92vw"
              alt={image.alt}
              className="relative"
            />
          </figure>
        </Reveal>
      </Container>
    </Surface>
  );
}
