import { PaperSection, Container } from '@/components/sections/surface';
import { SocialCards } from '@/components/sections/social-cards';
import { Reveal } from '@/components/motion';

interface SocialSectionProps {
  readonly heading?: string;
  readonly lead?: string;
  /** Off when this block follows a page header, which meets its neighbour with a straight edge. */
  readonly waveTop?: boolean;
  /** A closing note under the cards. The contact page uses it for the delivery footnote. */
  readonly footer?: React.ReactNode;
}

/**
 * The venue's accounts, given a section of their own.
 *
 * One component for both pages that carry it. The home page ends on the same three facts the
 * contact page does — where we are, when we are open, where to follow — and two copies of this
 * markup is how two pages start drifting into two different brands. The same reasoning already
 * put `LocationSection` in one place.
 *
 * It sits above the map on the home page: the map is the last thing on the page because it is the
 * end of the journey, and an invitation to follow reads better before that than after it.
 */
export function SocialSection({
  heading = 'Kövess minket',
  lead = 'Ami a lapra kerül, az többnyire itt is megjelenik. Új tételek, nyitvatartás-változás, és amit a pult mögött épp csinálunk.',
  waveTop = true,
  footer,
}: SocialSectionProps) {
  return (
    <PaperSection ariaLabelledBy="kozosseg-cim" waveTop={waveTop}>
      <Container>
        <Reveal className="max-w-[52ch]">
          <h2
            id="kozosseg-cim"
            className="smashr-display text-balance text-[clamp(1.9rem,4.4vw,3rem)]"
          >
            {heading}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-black/60 sm:text-lg">{lead}</p>
        </Reveal>

        <Reveal className="mt-10">
          <SocialCards />
        </Reveal>

        {footer === undefined ? null : <Reveal className="mt-12">{footer}</Reveal>}
      </Container>
    </PaperSection>
  );
}
