import { menuItems } from '@/content/menu';
import { openingHours, site } from '@/content/site';
import type { ContentDocument, StoredMenuItem } from './types';

/**
 * The seed document.
 *
 * Built from the committed content rather than from a fixture, so a fresh deployment starts with
 * the real menu already in it and an empty data volume is never an empty site. It is also the
 * fallback whenever the stored file is missing or unreadable: the site degrades to the version
 * that shipped, which is a known-good state, instead of to nothing.
 */
export function defaultDocument(): ContentDocument {
  const menu: StoredMenuItem[] = menuItems.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description ?? '',
    price: item.price,
    priceFrom: item.priceFrom === true,
    deposit: item.deposit ?? 0,
    category: item.category,
    channels: [...item.channels],
    ...(item.image === undefined ? {} : { image: item.image }),
    ...(item.imageAlt === undefined ? {} : { imageAlt: item.imageAlt }),
    visible: true,
  }));

  return {
    version: 1,
    updatedAt: new Date(0).toISOString(),
    contact: {
      phoneDisplay: site.phone.display,
      phoneHref: site.phone.href,
      openingHours: openingHours.map((slot) => ({
        label: slot.label,
        hours: slot.hours,
        days: [...slot.days],
      })),
    },
    menu,
    featured: menuItems.filter((item) => item.highlight === true).map((item) => item.id),
  };
}
