import 'server-only';

import type { MenuCategoryId, MenuItem } from '@/content/menu';
import { readContent } from './store';
import type { StoredMenuItem } from './types';

/**
 * The store, in the shapes the pages already speak.
 *
 * The components were written against `MenuItem` and against the opening-hours record, and they
 * are the right shapes — narrow, and about the page rather than about storage. Rather than
 * rewriting every call site around the stored document, this adapts one to the other in one place,
 * which is also the only place that has to change if the storage shape moves again.
 */

function toMenuItem(item: StoredMenuItem, featured: ReadonlySet<string>): MenuItem {
  return {
    id: item.id,
    name: item.name,
    ...(item.description === '' ? {} : { description: item.description }),
    price: item.price,
    ...(item.priceFrom ? { priceFrom: true } : {}),
    ...(item.deposit > 0 ? { deposit: item.deposit } : {}),
    ...(item.image === undefined ? {} : { image: item.image }),
    ...(item.imageAlt === undefined ? {} : { imageAlt: item.imageAlt }),
    category: item.category,
    channels: item.channels,
    ...(featured.has(item.id) ? { highlight: true } : {}),
  };
}

/** Every item a visitor should see, in menu order. Hidden items never leave the store. */
export async function getMenuItems(): Promise<readonly MenuItem[]> {
  const content = await readContent();
  const featured = new Set(content.featured);
  return content.menu.filter((item) => item.visible).map((item) => toMenuItem(item, featured));
}

/** One category's items, in menu order. */
export async function getItemsInCategory(category: MenuCategoryId): Promise<readonly MenuItem[]> {
  const items = await getMenuItems();
  return items.filter((item) => item.category === category);
}

/**
 * The home page's shortlist, in the order the editor put them in.
 *
 * Ordered by the stored list rather than by menu order, because choosing what leads is the point
 * of the feature — an editor who drags an item to the front means it to be first.
 */
export async function getFeaturedItems(): Promise<readonly MenuItem[]> {
  const content = await readContent();
  const featured = new Set(content.featured);
  const byId = new Map(
    content.menu
      .filter((item) => item.visible)
      .map((item) => [item.id, toMenuItem(item, featured)]),
  );
  return content.featured
    .map((id) => byId.get(id))
    .filter((item): item is MenuItem => item !== undefined);
}

/** The phone number and opening hours, as the pages and the structured data read them. */
export async function getContact() {
  const content = await readContent();
  return {
    phone: { display: content.contact.phoneDisplay, href: content.contact.phoneHref },
    openingHours: content.contact.openingHours,
  };
}
