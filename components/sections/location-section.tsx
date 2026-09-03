import { BeigeSection, Container } from '@/components/sections/surface';
import { MapEmbed } from '@/components/sections/map-embed';
import { OrderButtons } from '@/components/sections/order-buttons';
import { Reveal } from '@/components/motion';
import { openingHours, site } from '@/content/site';
import type { SurfaceTone } from '@/components/sections/surface';

interface LocationSectionProps {
  readonly id?: string;
  readonly heading?: string;
  readonly tearInto?: SurfaceTone;
}

/**
 * Where SmashR is, when it is open, and the two ways to order.
 *
 * The map is the point of this block, so it gets the room: two thirds of the row at desktop and a
 * full-bleed panel below it on a phone. What sits beside it is only what someone standing on the
 * street needs — the address, the hours, the phone — set large enough to read at a glance and
 * stacked in one column with no labels competing with the values. The previous version had a
 * heading, a lead, three labelled groups and three buttons in a narrow column; almost all of it
 * was furniture around four facts.
 */
export function LocationSection({ id, heading = 'Itt vagyunk', tearInto }: LocationSectionProps) {
  return (
    <BeigeSection id={id} ariaLabelledBy="hol-cim" tearInto={tearInto}>
      <Container>
        <Reveal className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:items-center lg:gap-16">
          <div className="flex flex-col gap-8">
            <h2
              id="hol-cim"
              className="smashr-display smashr-display-xl text-balance text-[clamp(2.25rem,5.5vw,4rem)]"
            >
              {heading}
            </h2>

            <div className="flex flex-col gap-6">
              <address className="not-italic">
                <span className="smashr-display block text-xl leading-tight sm:text-2xl">
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
                href={site.phone.href}
                className="smashr-display w-fit text-xl transition-colors duration-fast hover:text-primary focus-visible:text-primary focus-visible:outline-none sm:text-2xl"
              >
                {site.phone.display}
              </a>
            </div>

            <OrderButtons size="md" withDirections />
          </div>

          {/* A black plate under the map: it is the only picture on a flat surface, and the frame
              is what makes it read as one object rather than a hole in the section. */}
          <div className="bg-black p-2.5 sm:p-3.5">
            <MapEmbed />
          </div>
        </Reveal>
      </Container>
    </BeigeSection>
  );
}
