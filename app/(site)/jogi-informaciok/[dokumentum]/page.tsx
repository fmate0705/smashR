/**
 * Page: Jogi dokumentum
 * Purpose: Egy-egy jogi tájékoztató megjelenítése.
 *
 * A route rather than four near-identical pages: the documents share a layout exactly, and four
 * copies of it would be four places for it to drift apart.
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '@/components/sections/page-header';
import { PaperSection, Container } from '@/components/sections/surface';
import { legalDocument, legalDocuments, legalSlugs } from '@/content/legal';
import { pageMetadata } from '@/lib/seo/metadata';

interface RouteParams {
  readonly params: Promise<{ readonly dokumentum: string }>;
}

/**
 * The four slugs are fixed; only what fills them comes from the environment.
 *
 * Kept even though the route renders dynamically: it is the list the build knows about, and it is
 * what `legalDocument` is checked against below.
 */
export function generateStaticParams() {
  return legalSlugs.map((slug) => ({ dokumentum: slug }));
}

/**
 * Rendered per request rather than frozen at build.
 *
 * The operator's details arrive in the container's environment, which is set after the image is
 * built — a prerendered copy of this page would show the placeholders for ever, and revalidating
 * on a timer only fixes that for the *second* visitor after each deploy, which on pages this quiet
 * could be days. These four are the lowest-traffic pages on the site and carry no images, so
 * rendering them live costs nothing next to publishing an impressum that is out of date.
 *
 * The cost of that choice is the status code on an invented slug. Next has already begun streaming
 * a 200 by the time `notFound()` throws here, so a made-up URL comes back as HTTP 200 with the 404
 * page drawn inside it. What actually matters about a soft 404 is that a crawler indexes it, so
 * the metadata for an unknown slug says `noindex, nofollow` — the visitor sees the 404, and no
 * search engine keeps it. `dynamicParams = false` would give the real status, but only for a
 * prerendered route, which is the thing this page cannot be.
 */
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { dokumentum } = await params;
  const document = legalDocument(dokumentum);
  if (document === undefined) {
    return { title: 'Az oldal nem található', robots: { index: false, follow: false } };
  }
  return pageMetadata({
    title: document.title,
    description: document.description,
    canonical: `/jogi-informaciok/${document.slug}`,
    // Obligatory text, not a search target: it should not compete with the pages that sell the
    // food. Followed, though — the links out of it are real.
    noindex: true,
  });
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

      <PaperSection waveTop={false}>
        <Container width="narrow">
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
              {legalDocuments()
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
