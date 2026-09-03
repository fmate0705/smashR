import { TileSection, Container } from '@/components/sections/surface';
import { Reveal } from '@/components/motion';
import { cn } from '@/lib/cn';

interface PageHeaderProps {
  readonly title: string;
  readonly lead?: string;
  readonly children?: React.ReactNode;
  /** A single word set very large behind the title, as furniture rather than a label. */
  readonly watermark?: string;
}

/**
 * The opening block of every inner page.
 *
 * It clears the fixed header itself rather than asking each page to remember the offset, and it
 * carries the page's `h1` — so there is exactly one per document and it is always the first thing
 * in the main landmark.
 *
 * The oversized word is drawn as an outline rather than filled at a few percent opacity. Filled
 * and faint, it read as a smudge behind the copy and neither the word nor the paragraph over it
 * was legible; as a hairline outline it is unmistakably a word, unmistakably decorative, and adds
 * no weight underneath the text. It sits along the bottom edge, cropped, so it never runs behind
 * the heading or the lead at all. Decorative and `aria-hidden` in both treatments.
 */
export function PageHeader({ title, lead, children, watermark }: PageHeaderProps) {
  return (
    <TileSection
      spacing="flush"
      className="pb-[calc(var(--smashr-section-y)*0.9)] pt-[calc(var(--smashr-nav-h)+var(--smashr-section-y)*0.85)]"
    >
      {watermark === undefined ? null : (
        <span
          aria-hidden="true"
          className={cn(
            'smashr-display pointer-events-none absolute -bottom-[0.3em] right-[-0.06em]',
            'select-none whitespace-nowrap text-[17vw] leading-none text-transparent',
            '[-webkit-text-stroke:1px_rgb(255_255_255/0.22)]',
          )}
        >
          {watermark}
        </span>
      )}
      <Container>
        <Reveal className="max-w-[26ch]">
          <h1 className="smashr-display smashr-display-xl text-balance text-[clamp(2.75rem,8vw,7rem)] text-white">
            {title}
          </h1>
        </Reveal>
        {lead === undefined ? null : (
          <Reveal>
            <p className="mt-8 max-w-[54ch] text-lg leading-relaxed text-white/70 sm:text-xl">
              {lead}
            </p>
          </Reveal>
        )}
        {children === undefined ? null : <div className="mt-10">{children}</div>}
      </Container>
    </TileSection>
  );
}
