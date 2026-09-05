import { BeigeSection, Container } from '@/components/sections/surface';
import { MapEmbed } from '@/components/sections/map-embed';
import { OrderButtons } from '@/components/sections/order-buttons';
import { Reveal } from '@/components/motion';
import { site } from '@/content/site';
import { getContact } from '@/lib/store/content';

interface LocationSectionProps {
  readonly id?: string;
  readonly heading?: string;
  /** Off when this block follows a page header, which meets its neighbour with a straight edge. */
  readonly waveTop?: boolean;
}

/**
 * Where SmashR is, when it is open, and the two ways to order.
 *
 * The map is the point of the block, so it takes the larger half of the row and everything else
 * sits beside it in one narrow column — heading, address, hours, phone, in that order, with no
 * labels competing with the values.
 *
 * The heading is sized against its column rather than against the viewport. At the section scale
 * it would be wider than the column at every desktop width and would run over the map; capped
 * where it is, the longest of the headings this block carries wraps to two lines instead.
 *
 * The 2.25rem ceiling is measured, not chosen. The column is capped at 26rem, and above roughly
 * 1770px the type stops growing with the viewport while the column keeps pace with the root size —
 * so the ratio between them freezes. At the previous 2.6rem the étlap's "Kiválasztottad?" came out
 * wider than the column it sits in, and `overflow-wrap` did what it is there for and split the word
 * down the middle: KIVÁLASZTOTTA / D? VIDD. Every heading this block carries now fits its column
 * with room to spare at every width from 390px to 2560px, the tightest by 7%. `overflow-wrap`
 * stays as the last resort — a future heading running into the map would be worse than a break.
 */
export async function LocationSection({
  id,
  heading = 'Itt vagyunk',
  waveTop = true,
}: LocationSectionProps) {
  const { phone, openingHours } = await getContact();

  return (
    <BeigeSection id={id} ariaLabelledBy="hol-cim" waveTop={waveTop}>
      <Container>
        <Reveal className="grid gap-10 lg:grid-cols-[minmax(0,26rem)_1fr] lg:items-start lg:gap-14">
          <div className="flex flex-col gap-7">
            <h2
              id="hol-cim"
              className="smashr-display smashr-display-xl max-w-full text-balance [overflow-wrap:break-word] text-[clamp(1.75rem,2.6vw,2.25rem)]"
            >
              {heading}
            </h2>

            <address className="not-italic">
              <span className="smashr-display block text-lg leading-tight sm:text-xl">
                {site.address.full}
              </span>
            </address>

            <dl className="flex flex-col gap-2 text-base">
              {openingHours.map((slot) => (
                <div key={slot.label} className="flex flex-wrap gap-x-3">
                  <dt className="min-w-[9.5rem] text-black/55">{slot.label}</dt>
                  <dd className="tabular-nums">{slot.hours}</dd>
                </div>
              ))}
            </dl>

            <a
              href={phone.href}
              className="smashr-display w-fit whitespace-nowrap text-lg transition-colors duration-fast hover:text-primary focus-visible:text-primary focus-visible:outline-none sm:text-xl"
            >
              {phone.display}
            </a>

            {/* Three actions on one line from the small breakpoint up — they are peers, and a
                stacked column made the third one look like an afterthought. */}
            <OrderButtons className="mt-1" size="md" withDirections tight lead="directions" />
          </div>

          <MapEmbed />
        </Reveal>
      </Container>
    </BeigeSection>
  );
}
