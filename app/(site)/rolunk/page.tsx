/**
 * Page: Rólunk
 * Purpose: Építsen bizalmat a hely, a módszer és a csapat bemutatásával.
 * Sections: header, story, crew, principles, location
 * SEO: importance medium, schema AboutPage + Breadcrumb
 * Performance goals: LCP <= 2500ms, CLS <= 0.1, INP <= 200ms
 */
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/metadata';
import { PageHeader } from '@/components/sections/page-header';
import { StorySection } from '@/components/sections/story-section';
import { LocationSection } from '@/components/sections/location-section';
import { PaperSection, TileSection, Container } from '@/components/sections/surface';
import { SmashImage } from '@/components/ui/smash-image';
import { OrderButtons } from '@/components/sections/order-buttons';
import { AnimatedHeading, Reveal } from '@/components/motion';
import { WIDTHS } from '@/lib/images/responsive';
import { philosophy, storyLong } from '@/content/story';
import { breadcrumbJsonLd } from '@/lib/seo/jsonld';

export const metadata: Metadata = pageMetadata({
  title: 'Rólunk — a pult, a lap és a csapat',
  description:
    'A SmashR egy pult, egy forró lap és egy rövid étlap Budapest XXIII. kerületében. Friss marhahús, aznap vágott zöldség, saját szósz.',
  canonical: '/rolunk',
  shareTitle: 'Rólunk — SmashR',
  shareDescription: 'Egy pult, egy forró lap, egy rövid étlap. Ez a SmashR.',
});

const breadcrumb = breadcrumbJsonLd([{ name: 'Rólunk', path: '/rolunk' }]);

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <PageHeader
        title="Rólunk"
        lead="Nem gasztroforradalmat csinálunk. Egy burgert csinálunk, minden nap ugyanúgy."
      />

      <StorySection
        heading={storyLong.heading}
        paragraphs={[storyLong.paragraphs[0], storyLong.paragraphs[1]]}
        media="right"
        tone="beige"
        waveTop={false}
        image={{
          base: '/images/story/rolunk',
          widths: WIDTHS.storySmall,
          priority: true,
          alt: 'A SmashR pultja a fekete csempefallal, a piros SmashR felirattal és a WE SMASH. YOU EAT. felirattal',
        }}
      />

      <PaperSection spacing="loose" ariaLabelledBy="csapat-cim">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <Reveal>
              <figure className="relative">
                <div
                  aria-hidden="true"
                  className="absolute -bottom-5 -left-5 h-full w-full border-2 border-primary"
                />
                <SmashImage
                  base="/images/story/csapat"
                  widths={WIDTHS.story}
                  sizes="(min-width: 1024px) 50vw, 92vw"
                  alt="A SmashR csapata a pult mögött, fekete SmashR kötényben"
                  className="relative"
                />
              </figure>
            </Reveal>

            <div>
              <AnimatedHeading
                id="csapat-cim"
                lines={['Ugyanaz a', 'csapat áll', 'a lap mögött.']}
                className="smashr-display-xl text-[clamp(2.25rem,5.2vw,4.25rem)]"
              />
              <div className="mt-8 flex max-w-[52ch] flex-col gap-5 text-base leading-relaxed text-black/70 sm:text-lg">
                <p>{storyLong.paragraphs[2]}</p>
                <p>{storyLong.paragraphs[3]}</p>
              </div>
              <OrderButtons className="mt-10" size="md" platforms="both" />
            </div>
          </div>
        </Container>
      </PaperSection>

      <TileSection ariaLabelledBy="elvek-cim">
        <Container>
          <AnimatedHeading
            id="elvek-cim"
            lines={['Négy szabály.', 'Nincs ötödik.']}
            className="smashr-display-xl max-w-[16ch] text-[clamp(2.25rem,5.5vw,4.25rem)]"
          />

          <Reveal
            as="ol"
            mode="item"
            className="mt-14 grid gap-px bg-[rgb(var(--smashr-ink)/0.16)] sm:grid-cols-2"
          >
            {philosophy.map((rule, index) => (
              <li
                key={rule.title}
                className="flex flex-col gap-4 bg-[rgb(var(--smashr-ground))] p-8 sm:p-10"
              >
                <span className="smashr-display text-sm text-primary" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="smashr-display text-xl sm:text-2xl">{rule.title}</h3>
                <p className="max-w-[44ch] text-sm leading-relaxed text-[rgb(var(--smashr-ink)/0.62)] sm:text-base">
                  {rule.body}
                </p>
              </li>
            ))}
          </Reveal>
        </Container>
      </TileSection>

      <LocationSection heading="Itt találsz minket." />
    </>
  );
}
