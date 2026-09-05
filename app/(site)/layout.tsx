import { SiteChrome } from '@/components/site/site-chrome';
import { restaurantJsonLd, websiteJsonLd } from '@/lib/seo/jsonld';

/**
 * The public site: everything a visitor sees, and nothing the admin needs.
 *
 * A route group rather than a second root layout, so there is still one html element and one
 * place that loads the fonts. What is grouped here is the chrome — navigation, footer, the consent
 * window — plus the structured data, which belongs on a real page of the site and neither on the
 * admin nor on a 404, and so sits here rather than in `SiteChrome`.
 */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const restaurant = await restaurantJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurant) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

      <SiteChrome>{children}</SiteChrome>
    </>
  );
}
