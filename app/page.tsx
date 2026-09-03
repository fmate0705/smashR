/**
 * Page: Főoldal
 * Purpose: Mutassa be a márkát, és vezesse a látogatót a rendelésig vagy a helyszínig.
 * Sections: hero, smash-build, menu teaser, story, location
 * SEO: importance high, schema Restaurant (root layout) + Breadcrumb
 * Performance goals: LCP <= 2500ms, CLS <= 0.1, INP <= 200ms
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { Hero } from '@/components/sections/hero';
import { HeroStage } from '@/components/sections/hero-stage';
import { SmashBuild } from '@/components/sections/smash-build';
import { MenuTeaser } from '@/components/sections/menu-teaser';
import { StorySection } from '@/components/sections/story-section';
import { LocationSection } from '@/components/sections/location-section';
import { BeigeSection } from '@/components/sections/surface';
import { WIDTHS } from '@/lib/images/responsive';
import { storyShort } from '@/content/story';

export const metadata: Metadata = {
  title: 'SmashR — smash burger Budapesten | WE SMASH. YOU EAT.',
  description:
    'Friss marhahús, forró lap, ropogós szélek. A SmashR smash burgerei Budapest XXIII. kerületében készülnek. Rendelj foodorán vagy Wolton, vagy gyere be a pulthoz.',
  alternates: { canonical: '/' },
  openGraph: {
    url: '/',
    title: 'SmashR — smash burger Budapesten',
    description:
      'Friss marhahús, forró lap, ropogós szélek. Smash burger Budapest XXIII. kerületében.',
  },
};

export default function HomePage() {
  return (
    <>
      <HeroStage>
        <Hero />
      </HeroStage>

      {/* Everything below rides over the pinned hero. The stacking is explicit rather than left
          to paint order, so a later change to a section's own z-index cannot punch a hole in it. */}
      <div className="relative z-10">
        <BeigeSection spacing="flush" className="border-t-2 border-primary" tearInto="paper">
          <SmashBuild />
        </BeigeSection>

        <MenuTeaser />

        <StorySection
          heading={storyShort.heading}
          paragraphs={[...storyShort.paragraphs]}
          variant="mark"
          media="right"
          image={{
            base: '/images/story/tortenetunk',
            widths: WIDTHS.story,
            alt: 'A SmashR pultja mögött, a fekete csempefal előtt, kezében egy frissen készült shake-kel',
          }}
          footer={
            <Link
              href="/rolunk"
              className="smashr-display group inline-flex items-center gap-3 border-b-2 border-white pb-2 text-sm tracking-[0.12em] text-white transition-colors duration-fast hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:text-primary"
            >
              A történetünk
              <span
                aria-hidden="true"
                className="transition-transform duration-normal ease-emphasized group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
              >
                →
              </span>
            </Link>
          }
        />

        <LocationSection tearInto="tile" />
      </div>
    </>
  );
}
