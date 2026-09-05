import { orderLinks, site, socialLinks } from '@/content/site';
import { menuCategories } from '@/content/menu';
import { absoluteUrl } from '@/lib/site-url';
import { getContact, getMenuItems } from '@/lib/store/content';

/**
 * Structured data.
 *
 * Every value here is read from the same content modules the pages render, so the machine-readable
 * copy of the business can never drift from the one a visitor sees. Nothing is asserted that the
 * site does not also show: no invented ratings, no awards, no second location.
 */

/** schema.org day names, keyed by the two-letter codes `content/site` stores. */
const DAY_NAMES: Record<string, string> = {
  Mo: 'Monday',
  Tu: 'Tuesday',
  We: 'Wednesday',
  Th: 'Thursday',
  Fr: 'Friday',
  Sa: 'Saturday',
  Su: 'Sunday',
};

/**
 * The venue. Emitted once, in the root layout.
 *
 * Built per render rather than exported as a constant: the hours are editable, and a constant
 * would publish whatever they were when the module was first evaluated.
 */
export async function restaurantJsonLd() {
  const { phone, openingHours } = await getContact();

  const openingHoursSpecification = openingHours.map((slot) => {
    const [opens, closes] = slot.hours.split(' – ');
    return {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: slot.days.map((day) => DAY_NAMES[day]),
      opens,
      closes,
    };
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': `${site.url}/#restaurant`,
    name: site.name,
    legalName: site.legalName,
    description: site.description,
    url: site.url,
    telephone: phone.display,
    priceRange: site.priceRange,
    servesCuisine: [...site.servesCuisine],
    image: absoluteUrl('/images/burger/complete-1200.webp'),
    logo: absoluteUrl('/brand/smashr-logo.png'),
    slogan: site.tagline,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      postalCode: site.address.postalCode,
      addressLocality: site.address.city,
      addressCountry: site.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    },
    openingHoursSpecification,
    hasMenu: absoluteUrl('/etlap'),
    acceptsReservations: false,
    sameAs: [
      ...socialLinks.map((link) => link.href),
      ...Object.values(orderLinks).map((l) => l.href),
    ],
    potentialAction: {
      '@type': 'OrderAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: orderLinks.foodora.href,
        inLanguage: 'hu',
      },
      deliveryMethod: ['http://purl.org/goodrelations/v1#DeliveryModeOwnFleet'],
    },
  } as const;
}

/** The menu, as sections of offers. Rendered on `/etlap` only. */
export async function menuJsonLd() {
  const menuItems = await getMenuItems();

  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    '@id': `${site.url}/etlap#menu`,
    name: `${site.name} étlap`,
    inLanguage: 'hu',
    hasMenuSection: menuCategories.map((category) => ({
      '@type': 'MenuSection',
      name: category.name,
      description: category.lead,
      hasMenuItem: menuItems
        .filter((item) => item.category === category.id)
        .map((item) => ({
          '@type': 'MenuItem',
          name: item.name,
          ...(item.description === undefined ? {} : { description: item.description }),
          ...(item.image === undefined ? {} : { image: absoluteUrl(`${item.image}-800.webp`) }),
          offers: {
            '@type': 'Offer',
            price: item.price,
            priceCurrency: 'HUF',
            availability: 'https://schema.org/InStock',
          },
        })),
    })),
  } as const;
}

/** A breadcrumb trail for an inner page. */
export function breadcrumbJsonLd(trail: readonly { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Főoldal', item: absoluteUrl('/') },
      ...trail.map((step, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: step.name,
        item: absoluteUrl(step.path),
      })),
    ],
  };
}

/** The site itself — what answer engines attribute a quoted passage to. */
export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${site.url}/#website`,
  url: site.url,
  name: site.name,
  inLanguage: 'hu-HU',
  publisher: { '@id': `${site.url}/#restaurant` },
} as const;
