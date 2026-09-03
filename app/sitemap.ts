import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site-url';

/**
 * The sitemap.
 *
 * Priorities are not guesses — they follow the blueprint: the menu and the brand page are what
 * SmashR is searched for, the legal documents are not. The individual legal documents are left
 * out entirely, because they carry `robots: noindex` and listing a page you have asked not to be
 * indexed is a contradictory signal.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: absoluteUrl('/'), lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: absoluteUrl('/etlap'), lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    {
      url: absoluteUrl('/smashr-experience'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    { url: absoluteUrl('/rolunk'), lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    {
      url: absoluteUrl('/kapcsolat'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: absoluteUrl('/jogi-informaciok'),
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];
}
