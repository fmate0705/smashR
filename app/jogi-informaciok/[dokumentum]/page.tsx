/**
 * Page: Jogi dokumentum
 * Purpose: Egy-egy jogi tájékoztató megjelenítése.
 *
 * A route rather than four near-identical pages: the documents share a layout exactly, and four
 * copies of it would be four places to forget the review notice.
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '@/components/sections/page-header';
import { PaperSection, Container } from '@/components/sections/surface';
import { legalDocument, legalDocuments } from '@/content/legal';

interface RouteParams {
  readonly params: Promise<{ readonly dokumentum: string }>;
}

/** Every document is known at build time, so all four are prerendered as static HTML. */
export function generateStaticParams() {
  return legalDocuments.map((document) => ({ dokumentum: document.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { dokumentum } = await params;
  const document = legalDocument(dokumentum);
  if (document === undefined) {
    return { title: 'Jogi információk' };
  }
  return {
    title: document.title,
    description: document.description,
    alternates: { canonical: `/jogi-informaciok/${document.slug}` },
    // Draft legal text should not compete in search with the pages that sell the food.
    robots: { index: false, follow: true },
  };
}

export default async function LegalDocumentPage({ params }: RouteParams) {
  const { dokumentum } = await params;
  const document = legalDocument(dokumentum);
  if (document === undefined) {
    notFound();
  }

  return (
    <>
      <PageHeader title={document.title} lead={document.lead} />

      <PaperSection>
        <Container width="narrow">
          {document.review ? (
            <p
              role="note"
              className="mb-14 border border-black/20 bg-black/[0.04] p-6 text-sm leading-relaxed text-black/70"
            >
              <strong className="smashr-display text-primary">Munkapéldány.</strong> Ez a dokumentum
              kiindulási szöveg, nem jogi tanácsadás. Közzététel előtt jogi szakértővel át kell
              nézetni, és a szögletes zárójelben jelölt adatokat ki kell tölteni.
            </p>
          ) : null}

          <div className="flex flex-col gap-12">
            {document.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="smashr-display text-xl sm:text-2xl">{section.heading}</h2>
                {section.paragraphs?.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="mt-5 max-w-[68ch] text-base leading-relaxed text-black/70"
                  >
                    {paragraph}
                  </p>
                ))}
                {section.list === undefined ? null : (
                  <ul className="mt-5 flex max-w-[68ch] list-none flex-col gap-3">
                    {section.list.map((entry) => (
                      <li
                        key={entry.slice(0, 40)}
                        className="border-l border-black/15 pl-5 text-base leading-relaxed text-black/70"
                      >
                        {entry}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <nav
            aria-label="További jogi dokumentumok"
            className="mt-20 border-t border-black/[0.12] pt-8"
          >
            <ul className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
              {legalDocuments
                .filter((other) => other.slug !== document.slug)
                .map((other) => (
                  <li key={other.slug}>
                    <Link
                      href={`/jogi-informaciok/${other.slug}`}
                      className="text-black/60 underline underline-offset-4 transition-colors duration-fast hover:text-primary focus-visible:outline-none focus-visible:text-primary"
                    >
                      {other.title}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>
        </Container>
      </PaperSection>
    </>
  );
}
