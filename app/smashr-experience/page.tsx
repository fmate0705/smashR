/**
 * Page: SmashR Experience
 * Purpose: Magyarázza el a smash technikát és az alapanyagokat — a márkaélmény oldala.
 * Sections: header, anatomy, technique, ingredients, location
 * SEO: importance high, schema Breadcrumb
 * Performance goals: LCP <= 2500ms, CLS <= 0.1, INP <= 200ms
 */
import type { Metadata } from 'next';
import { PageHeader } from '@/components/sections/page-header';
import { LocationSection } from '@/components/sections/location-section';
import { BeigeSection, PaperSection, TileSection, Container } from '@/components/sections/surface';
import { SmashImage } from '@/components/ui/smash-image';
import { OrderButtons } from '@/components/sections/order-buttons';
import { AnimatedHeading, Parallax, Reveal } from '@/components/motion';
import { WIDTHS } from '@/lib/images/responsive';
import { technique } from '@/content/story';
import { breadcrumbJsonLd } from '@/lib/seo/jsonld';

export const metadata: Metadata = {
  title: 'SmashR Experience — mitől smash a smash burger?',
  description:
    'Mi történik a forró lapon? A smash technika lépésről lépésre: friss marhagolyó, egyetlen mozdulat, karamellizálódó kéreg, csipkés ropogós perem. A SmashR márkaélmény oldala.',
  alternates: { canonical: '/smashr-experience' },
  openGraph: {
    url: '/smashr-experience',
    title: 'SmashR Experience — mitől smash a smash burger?',
    description: 'A smash technika lépésről lépésre: hús, lap, mozdulat, perem.',
  },
};

const breadcrumb = breadcrumbJsonLd([{ name: 'SmashR Experience', path: '/smashr-experience' }]);

/** The build, read from the top down — the order a burger is taken apart in. */
const ANATOMY = [
  { name: 'Pirított bucka', note: 'Vajon átforgatva, a lap szélén megpirítva.' },
  { name: 'Smashelt marhahús', note: 'Friss darált marha, egyszer lenyomva, csipkés peremmel.' },
  { name: 'Olvadt cheddar', note: 'Még a lapon kerül a húsra, hogy a saját melege olvassza rá.' },
  { name: 'Uborka és hagyma', note: 'Aznap vágva. A savasság vágja a zsírt.' },
  { name: 'Házi szósz', note: 'Magunknak keverjük, a bucka alsó felére kenve.' },
] as const;

export default function ExperiencePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <PageHeader
        title="SmashR Experience"
        watermark="TECHNIKA"
        lead="A smash burger nem méret kérdése, hanem hőé és nyomásé. Ez történik a lapon, amíg a rendelésed készül."
      >
        <OrderButtons size="md" platforms="primary" />
      </PageHeader>

      <BeigeSection spacing="loose" ariaLabelledBy="anatomia-cim" tearInto="paper">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-20">
            <div>
              <AnimatedHeading
                id="anatomia-cim"
                lines={['Öt réteg.', 'Semmi', 'fölösleges.']}
                className="smashr-display-xl text-[clamp(2.25rem,5.5vw,4.5rem)]"
              />
              <p className="mt-8 max-w-[46ch] text-base leading-relaxed text-black/70 sm:text-lg">
                Minden összetevőnek dolga van. Ami nem tesz hozzá, azt kihagyjuk — nem
                minimalizmusból, hanem mert a fölösleges réteg elveszi a helyet a hústól.
              </p>

              <Reveal as="ol" mode="item" className="mt-10 flex flex-col">
                {ANATOMY.map((layer, index) => (
                  <li
                    key={layer.name}
                    className="flex gap-5 border-t border-black/15 py-5 last:border-b"
                  >
                    <span
                      aria-hidden="true"
                      className="smashr-display w-8 shrink-0 pt-1 text-xs text-primary"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span>
                      <span className="smashr-display block text-lg sm:text-xl">{layer.name}</span>
                      <span className="mt-1.5 block max-w-[42ch] text-sm leading-relaxed text-black/60">
                        {layer.note}
                      </span>
                    </span>
                  </li>
                ))}
              </Reveal>
            </div>

            <Parallax className="mx-auto w-full max-w-[30rem] lg:max-w-none">
              <SmashImage
                base="/images/burger/exploded"
                widths={WIDTHS.burger}
                sizes="(min-width: 1024px) 52vw, 88vw"
                alt="Szétbontott SmashR burger: felül a pirított bucka, alatta két smashelt marhahúspogácsa olvadt sajttal, majd saláta, paradicsom és lilahagyma, legalul a szószos alsó bucka"
              />
            </Parallax>
          </div>
        </Container>
      </BeigeSection>

      <PaperSection ariaLabelledBy="technika-cim">
        <Container>
          <AnimatedHeading
            id="technika-cim"
            lines={['Négy lépés,', 'harminc másodperc.']}
            className="smashr-display-xl max-w-[18ch] text-[clamp(2.25rem,5.5vw,4.25rem)]"
          />
          <p className="mt-8 max-w-[58ch] text-base leading-relaxed text-black/60 sm:text-lg">
            A smash a Maillard-reakcióról szól: a hús felszíne és a forró fém találkozásáról. Minden
            lépés ezt szolgálja, és mindegyiket el lehet rontani.
          </p>

          <Reveal
            as="ol"
            mode="item"
            className="mt-14 grid gap-px bg-[rgb(var(--smashr-ink)/0.16)] lg:grid-cols-4"
          >
            {technique.map((step, index) => (
              <li
                key={step.title}
                className="flex flex-col gap-5 bg-[rgb(var(--smashr-ground))] p-8 sm:p-9"
              >
                <span
                  aria-hidden="true"
                  className="smashr-display text-4xl leading-none text-primary sm:text-5xl"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="smashr-display text-xl sm:text-2xl">{step.title}</h3>
                <p className="text-sm leading-relaxed text-[rgb(var(--smashr-ink)/0.62)]">
                  {step.body}
                </p>
              </li>
            ))}
          </Reveal>
        </Container>
      </PaperSection>

      <TileSection spacing="loose" ariaLabelledBy="allitas-cim">
        <Container width="narrow">
          <AnimatedHeading
            id="allitas-cim"
            lines={['Ha kétszer', 'nyomod le,', 'elrontottad.']}
            className="smashr-display-xl text-center text-[clamp(2.5rem,8vw,6rem)] text-white"
          />
          <Reveal>
            <p className="mx-auto mt-10 max-w-[52ch] text-center text-base leading-relaxed text-white/60 sm:text-lg">
              Az első nyomás préseli a húst a forró fémhez, és ott indul el a kéreg. A második már
              csak a szaftot nyomja ki belőle. Ezért van, hogy a smash burgerhez nem kell trükk —
              csak fegyelem.
            </p>
          </Reveal>
          <Reveal className="mt-12 flex justify-center">
            <OrderButtons size="lg" layout="row" />
          </Reveal>
        </Container>
      </TileSection>

      <LocationSection heading="Nézd meg élőben." tearInto="tile" />
    </>
  );
}
