import { TileSection, Container } from '@/components/sections/surface';
import { Reveal } from '@/components/motion';

interface PageHeaderProps {
  readonly title: string;
  readonly lead?: string;
}

/**
 * The opening block of every inner page.
 *
 * One fixed height across all of them, set as a minimum rather than as padding, so moving between
 * pages does not shift the masthead up and down under the visitor. The heading is vertically
 * centred inside that box, which means a one-line title and a two-line title both sit correctly
 * without either one being padded to match the other.
 *
 * It clears the fixed header itself rather than asking each page to remember the offset, and it
 * carries the page's `h1` — so there is exactly one per document and it is the first thing inside
 * the main landmark. No ordering buttons: the page below is the answer to why someone opened it,
 * and the header already sits under a navigation bar that carries all three actions.
 */
export function PageHeader({ title, lead }: PageHeaderProps) {
  return (
    <TileSection
      spacing="flush"
      waveTop={false}
      className="flex min-h-[clamp(24rem,46vh,34rem)] flex-col justify-center pb-[calc(var(--smashr-section-y)*0.7)] pt-[calc(var(--smashr-nav-h)+var(--smashr-section-y)*0.7)]"
    >
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
      </Container>
    </TileSection>
  );
}
