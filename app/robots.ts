import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site-url';

/**
 * `/admin` is disallowed rather than hidden. It is reachable by anyone who types it — the login is
 * what protects it — but there is nothing there for a crawler, and a login form in an index is
 * only an invitation. The pages themselves also carry `noindex`, which is the control; this is the
 * courtesy.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin'],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
