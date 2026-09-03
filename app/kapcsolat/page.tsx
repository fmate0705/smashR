/**
 * Page: Kapcsolat
 * Purpose: Adja meg az elérhetőségeket, a nyitvatartást és a rendelés útjait.
 * Sections: header, contact details, map, ordering
 * SEO: importance medium, schema ContactPage + Breadcrumb
 * Performance goals: LCP <= 2500ms, CLS <= 0.1, INP <= 200ms
 */
import type { Metadata } from 'next';
import { PageHeader } from '@/components/sections/page-header';
import { PaperSection, Container } from '@/components/sections/surface';
import { MapEmbed } from '@/components/sections/map-embed';
import { OrderButtons } from '@/components/sections/order-buttons';
import { SocialLinks } from '@/components/ui/social-links';
import { Reveal } from '@/components/motion';
import { breadcrumbJsonLd } from '@/lib/seo/jsonld';
import { directionsUrl, openingHours, orderLinks, site } from '@/content/site';
import { absoluteUrl } from '@/lib/site-url';

export const metadata: Metadata = {
  title: 'Kapcsolat — cím, nyitvatartás, rendelés',
  description: `A SmashR címe: ${site.address.full}. Nyitvatartás, telefonszám, útvonaltervezés és rendelés foodorán vagy Wolton.`,
  alternates: { canonical: '/kapcsolat' },
  openGraph: {
    url: '/kapcsolat',
    title: 'Kapcsolat — SmashR',
    description: `${site.address.full} · ${site.phone.display}`,
  },
};

const breadcrumb = breadcrumbJsonLd([{ name: 'Kapcsolat', path: '/kapcsolat' }]);

const contactPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  '@id': `${site.url}/kapcsolat#page`,
  url: absoluteUrl('/kapcsolat'),
  name: 'Kapcsolat — SmashR',
  inLanguage: 'hu-HU',
  about: { '@id': `${site.url}/#restaurant` },
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <PageHeader
        title="Kapcsolat"
        watermark="ITT"
        lead="Nincs foglalás és nincs várólista. Van cím, van telefonszám, és van két platform, ahonnan bármikor rendelhetsz."
      >
        <OrderButtons size="md" withDirections />
      </PageHeader>

      <PaperSection ariaLabel="Elérhetőségek">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <Reveal>
              <dl className="flex flex-col divide-y divide-black/[0.12] border-y border-black/[0.12]">
                <div className="py-7">
                  <dt className="smashr-display text-[0.68rem] tracking-[0.2em] text-black/40">
                    Cím
                  </dt>
                  <dd className="mt-3">
                    <address className="smashr-display text-xl not-italic leading-tight sm:text-2xl">
                      {site.address.full}
                    </address>
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block text-sm text-black/60 underline underline-offset-4 transition-colors duration-fast hover:text-primary focus-visible:outline-none focus-visible:text-primary"
                    >
                      Útvonaltervezés a Google Térképen
                    </a>
                  </dd>
                </div>

                <div className="py-7">
                  <dt className="smashr-display text-[0.68rem] tracking-[0.2em] text-black/40">
                    Telefon
                  </dt>
                  <dd className="mt-3">
                    <a
                      href={site.phone.href}
                      className="smashr-display text-xl transition-colors duration-fast hover:text-primary focus-visible:outline-none focus-visible:text-primary sm:text-2xl"
                    >
                      {site.phone.display}
                    </a>
                  </dd>
                </div>

                <div className="py-7">
                  <dt className="smashr-display text-[0.68rem] tracking-[0.2em] text-black/40">
                    Nyitvatartás
                  </dt>
                  <dd className="mt-3 flex flex-col gap-2">
                    {openingHours.map((slot) => (
                      <span key={slot.label} className="flex flex-wrap gap-x-4 text-base">
                        <span className="min-w-[10.5rem] text-black/55">{slot.label}</span>
                        <span className="tabular-nums">{slot.hours}</span>
                      </span>
                    ))}
                  </dd>
                </div>

                <div className="py-7">
                  <dt className="smashr-display text-[0.68rem] tracking-[0.2em] text-black/40">
                    Rendelés
                  </dt>
                  <dd className="mt-3 flex flex-col gap-2">
                    {Object.values(orderLinks).map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-fit text-base underline underline-offset-4 transition-colors duration-fast hover:text-primary focus-visible:outline-none focus-visible:text-primary"
                      >
                        {link.label}
                      </a>
                    ))}
                  </dd>
                </div>

                <div className="py-7">
                  <dt className="smashr-display text-[0.68rem] tracking-[0.2em] text-black/40">
                    Közösségi média
                  </dt>
                  <dd className="mt-3">
                    <SocialLinks size="sm" className="text-black/70" />
                  </dd>
                </div>
              </dl>
            </Reveal>

            <Reveal className="flex flex-col gap-8">
              {/* The map is a dark object on a light page on purpose: it is the one element here
                  that is a picture rather than text, and the contrast is what makes it read as one. */}
              <div className="bg-black p-3 sm:p-4">
                <MapEmbed />
              </div>
              <p className="max-w-[58ch] text-sm leading-relaxed text-black/55">
                A pult a bevásárlóközpont oldalánál található. Ha rendelnél, a foodora és a Wolt is
                kiszállít a környékre — a mindenkori kiszállítási díj és idő a platformok oldalán
                látható.
              </p>
            </Reveal>
          </div>
        </Container>
      </PaperSection>
    </>
  );
}
