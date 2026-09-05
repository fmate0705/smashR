/**
 * Page: Jogi információk
 * Purpose: A kötelező jogi és adatkezelési tájékoztatók gyűjtője.
 * SEO: importance low, indexálható, de nem kiemelt
 */
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/metadata';
import Link from 'next/link';
import { PageHeader } from '@/components/sections/page-header';
import { PaperSection, Container } from '@/components/sections/surface';
import { Reveal } from '@/components/motion';
import { legalDocuments } from '@/content/legal';

export const metadata: Metadata = pageMetadata({
  title: 'Jogi információk',
  description:
    'Impresszum, adatkezelési tájékoztató, általános szerződési feltételek és süti tájékoztató a SmashR weboldalához.',
  canonical: '/jogi-informaciok',
});

/** Live for the same reason the documents are: the descriptions name the operator. */
export const dynamic = 'force-dynamic';

export default function LegalIndexPage() {
  return (
    <>
      <PageHeader
        title="Jogi információk"
        lead="A weboldal üzemeltetésével, az adatkezeléssel és a rendeléssel kapcsolatos tájékoztatók."
      />

      <PaperSection waveTop={false}>
        <Container width="narrow">
          <Reveal
            as="ul"
            mode="item"
            className="flex flex-col divide-y divide-black/[0.12] border-y border-black/[0.12]"
          >
            {legalDocuments().map((document) => (
              <li key={document.slug}>
                <Link
                  href={`/jogi-informaciok/${document.slug}`}
                  className="group flex flex-col gap-2 py-8 transition-colors duration-fast focus-visible:outline-none"
                >
                  <span className="smashr-display flex items-center gap-3 text-2xl transition-colors duration-fast group-hover:text-primary group-focus-visible:text-primary sm:text-3xl">
                    {document.title}
                    <span
                      aria-hidden="true"
                      className="text-lg transition-transform duration-normal ease-emphasized group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
                    >
                      →
                    </span>
                  </span>
                  <span className="max-w-[62ch] text-sm leading-relaxed text-black/55">
                    {document.description}
                  </span>
                </Link>
              </li>
            ))}
          </Reveal>
        </Container>
      </PaperSection>
    </>
  );
}
