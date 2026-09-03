import { menuJsonLd, restaurantJsonLd, websiteJsonLd } from '@/lib/seo/jsonld';

/**
 * The site's structured data as a single machine-readable graph at `/schema.json`.
 *
 * It is a route rather than a file in `public/` on purpose: a static copy would be a second
 * source of truth for the address, the hours and every price, and it would be wrong the first
 * time one of them changed. This is built from the same modules the pages render, so it cannot
 * drift from what a visitor sees.
 */
export const dynamic = 'force-static';

export function GET() {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [restaurantJsonLd, websiteJsonLd, menuJsonLd],
  };

  return new Response(`${JSON.stringify(graph, null, 2)}\n`, {
    headers: {
      'content-type': 'application/ld+json; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
}
