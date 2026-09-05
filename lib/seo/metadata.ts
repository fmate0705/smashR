import type { Metadata } from 'next';
import { site } from '@/content/site';

/**
 * One page's metadata, built rather than written out.
 *
 * Next merges metadata shallowly: a page that declares its own `openGraph` replaces the layout's
 * entirely — type, locale, site name and, critically, the file-based share image go with it. That
 * is how five of this site's six pages ended up with no picture on a shared link while the two
 * nobody shares kept theirs. Building the whole object in one place makes that failure impossible
 * to reintroduce one page at a time.
 *
 * The share card is the route in `app/opengraph-image.tsx` — the real tile wall with the real
 * wordmark on it, composed at request time.
 */

const SHARE_IMAGE = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: 'SmashR — WE SMASH. YOU EAT.',
} as const;

export interface PageMetadataInput {
  /** The browser-tab title. The site name is appended by the root template unless `ownTitle`. */
  readonly title: string;
  readonly description: string;
  /** Path from the site root, e.g. `/etlap`. Becomes both the canonical URL and `og:url`. */
  readonly canonical: string;
  /** Shorter title for the share card, where a long line is cut off mid-word. */
  readonly shareTitle?: string;
  readonly shareDescription?: string;
  /**
   * Set on the home page, whose title already carries the brand: without it the root template
   * appends the site name a second time and the tab reads "… | SmashR | SmashR".
   */
  readonly ownTitle?: boolean;
  /** Left out of the index. The document itself still links onward, hence `follow`. */
  readonly noindex?: boolean;
}

export function pageMetadata(input: PageMetadataInput): Metadata {
  const shareTitle = input.shareTitle ?? input.title;
  const shareDescription = input.shareDescription ?? input.description;

  return {
    title: input.ownTitle === true ? { absolute: input.title } : input.title,
    description: input.description,
    alternates: { canonical: input.canonical },
    ...(input.noindex === true ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: 'website',
      siteName: site.name,
      locale: 'hu_HU',
      url: input.canonical,
      title: shareTitle,
      description: shareDescription,
      images: [SHARE_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: shareTitle,
      description: shareDescription,
      images: [SHARE_IMAGE.url],
    },
  };
}
