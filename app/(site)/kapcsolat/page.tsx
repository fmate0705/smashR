/**
 * Page: Kapcsolat
 * Purpose: Adja meg az elérhetőségeket, a nyitvatartást és a rendelés útjait.
 * Sections: header, location, social
 * SEO: importance medium, schema ContactPage + Breadcrumb
 * Performance goals: LCP <= 2500ms, CLS <= 0.1, INP <= 200ms
 */
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/metadata';
import { PageHeader } from '@/components/sections/page-header';
import { LocationSection } from '@/components/sections/location-section';
import { SocialSection } from '@/components/sections/social-section';
import { breadcrumbJsonLd } from '@/lib/seo/jsonld';
import { orderLinks, site } from '@/content/site';
import { absoluteUrl } from '@/lib/site-url';
import { getContact } from '@/lib/store/content';

/**
 * Generated rather than declared, because the phone number in the share card comes from the
 * content store: a number the restaurant corrects in the admin has to change everywhere it is
 * printed, and a link preview that still advertises the old one is exactly the copy nobody thinks
 * to check.
 */
export async function generateMetadata(): Promise<Metadata> {
  const { phone } = await getContact();

  return pageMetadata({
    title: 'Kapcsolat — cím, nyitvatartás, rendelés',
    description: `A SmashR címe: ${site.address.full}. Nyitvatartás, telefonszám, útvonaltervezés és rendelés foodorán vagy Wolton.`,
    canonical: '/kapcsolat',
    shareTitle: 'Kapcsolat — SmashR',
    shareDescription: `${site.address.full} · ${phone.display}`,
  });
}

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
        lead="Nincs foglalás és nincs várólista. Van cím, van telefonszám, és van két platform, ahonnan bármikor rendelhetsz."
      />

      {/* The same block the home page ends on. The contact page had its own arrangement of the
          same four facts, which meant two layouts to keep in step; there is now one. */}
      <LocationSection heading="Itt találsz minket" waveTop={false} />

      <SocialSection
        footer={
          <p className="max-w-[70ch] text-sm leading-relaxed text-black/55">
            A pult a bevásárlóközpont oldalánál található. Ha rendelnél, a{' '}
            <a
              href={orderLinks.foodora.href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 transition-colors duration-fast hover:text-primary"
            >
              foodora
            </a>{' '}
            és a{' '}
            <a
              href={orderLinks.wolt.href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 transition-colors duration-fast hover:text-primary"
            >
              Wolt
            </a>{' '}
            is kiszállít a környékre — a mindenkori kiszállítási díj és idő a platformok oldalán
            látható.
          </p>
        }
      />
    </>
  );
}
