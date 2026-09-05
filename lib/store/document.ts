import { menuCategories, type MenuCategoryId } from '@/content/menu';
import { defaultDocument } from './defaults';
import { FEATURED_LIMIT, type ContentDocument, type StoredMenuItem } from './types';

/**
 * Validation and normalisation for the stored document.
 *
 * Everything that reaches the store comes from either a form or a file on disk, and neither is
 * trustworthy: a form can be posted by hand and a file can be edited, half-written or left over
 * from an older shape. Rather than throwing on bad input, this coerces each field to something
 * the site can render and drops what it cannot — a menu that renders with one item's price reset
 * to the default is a smaller failure than a page that will not render at all.
 *
 * Pure, so it is testable without touching the filesystem.
 */

const CATEGORY_IDS = new Set<string>(menuCategories.map((category) => category.id));

/** Prices are forint, whole, and bounded well above any real one — a typo cannot become a million. */
const MAX_PRICE = 1_000_000;

function text(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value.trim() : fallback;
}

function money(value: unknown, fallback = 0): number {
  // Nothing at all is not zero. `Number(null)` and `Number('')` are both 0, so without this a
  // cleared price field would quietly publish a burger at 0 Ft rather than keep the last one.
  if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
    return fallback;
  }
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n) || n < 0 || n > MAX_PRICE) {
    return fallback;
  }
  return Math.round(n);
}

function channels(value: unknown): readonly ('foodora' | 'wolt')[] {
  const list = Array.isArray(value) ? value : [];
  const kept = list.filter(
    (entry): entry is 'foodora' | 'wolt' => entry === 'foodora' || entry === 'wolt',
  );
  // An item orderable nowhere has a card that links nowhere, so it falls back to the primary.
  return kept.length === 0 ? ['foodora'] : [...new Set(kept)];
}

function category(value: unknown, fallback: MenuCategoryId): MenuCategoryId {
  return typeof value === 'string' && CATEGORY_IDS.has(value)
    ? (value as MenuCategoryId)
    : fallback;
}

/**
 * Normalises one item against the shipped copy of it.
 *
 * The image never comes from input. Photography is the venue's own, keyed to the item it shows,
 * and letting an editor repoint it is how a card ends up promising a burger the kitchen will not
 * send. The shipped item is the only source for it.
 */
function normaliseItem(input: unknown, shipped: StoredMenuItem | undefined): StoredMenuItem | null {
  if (typeof input !== 'object' || input === null) {
    return null;
  }
  const raw = input as Record<string, unknown>;
  const id = text(raw.id);
  if (id === '') {
    return null;
  }
  const base = shipped ?? {
    id,
    name: id,
    description: '',
    price: 0,
    priceFrom: false,
    deposit: 0,
    category: 'burgerek' as MenuCategoryId,
    channels: ['foodora'] as const,
    visible: true,
  };

  return {
    id,
    name: text(raw.name, base.name) || base.name,
    description: text(raw.description, base.description),
    price: money(raw.price, base.price),
    priceFrom: raw.priceFrom === true,
    deposit: money(raw.deposit, 0),
    category: category(raw.category, base.category),
    channels: channels(raw.channels),
    ...(shipped?.image === undefined ? {} : { image: shipped.image }),
    ...(shipped?.imageAlt === undefined ? {} : { imageAlt: shipped.imageAlt }),
    visible: raw.visible !== false,
  };
}

/**
 * Turns anything at all into a document the site can render.
 *
 * Items are keyed by the shipped menu: an id the build does not know about is dropped, because it
 * would have no photograph and no place in the structured data, and an id the store has not heard
 * of is added from the shipped copy, so a deploy that introduces a new item does not require the
 * restaurant to re-enter it.
 */
export function normaliseDocument(input: unknown): ContentDocument {
  const fallback = defaultDocument();
  const raw = (typeof input === 'object' && input !== null ? input : {}) as Record<string, unknown>;

  const shipped = new Map(fallback.menu.map((item) => [item.id, item]));
  const storedList = Array.isArray(raw.menu) ? raw.menu : [];

  const stored = new Map<string, StoredMenuItem>();
  for (const entry of storedList) {
    const id = text((entry as Record<string, unknown>)?.id);
    const item = normaliseItem(entry, shipped.get(id));
    if (item !== null && shipped.has(item.id)) {
      stored.set(item.id, item);
    }
  }

  // Shipped order is the menu's order. The store supplies the values, never the sequence — an
  // item's place on the page is a design decision, not an editorial one.
  const menu = fallback.menu.map((item) => stored.get(item.id) ?? item);

  const rawContact = (
    typeof raw.contact === 'object' && raw.contact !== null ? raw.contact : {}
  ) as Record<string, unknown>;

  const hoursInput = Array.isArray(rawContact.openingHours) ? rawContact.openingHours : [];
  const openingHours = hoursInput
    .map((entry, index) => {
      const row = (typeof entry === 'object' && entry !== null ? entry : {}) as Record<
        string,
        unknown
      >;
      const seed = fallback.contact.openingHours[index];
      const days = Array.isArray(row.days)
        ? row.days.filter((day): day is string => typeof day === 'string')
        : [];
      return {
        label: text(row.label, seed?.label ?? ''),
        hours: text(row.hours, seed?.hours ?? ''),
        // Day codes drive the structured data, not the page, so they are never taken from a form.
        days: seed === undefined ? days : [...seed.days],
      };
    })
    .filter((slot) => slot.label !== '' && slot.hours !== '');

  const visible = new Set(menu.filter((item) => item.visible).map((item) => item.id));
  const featuredInput = Array.isArray(raw.featured) ? raw.featured : [];
  const featured = [
    ...new Set(
      featuredInput
        .filter((id): id is string => typeof id === 'string')
        .filter((id) => visible.has(id)),
    ),
  ].slice(0, FEATURED_LIMIT);

  return {
    version: 1,
    updatedAt: text(raw.updatedAt, fallback.updatedAt) || fallback.updatedAt,
    contact: {
      phoneDisplay: text(rawContact.phoneDisplay, fallback.contact.phoneDisplay),
      phoneHref: telHref(rawContact.phoneHref, rawContact.phoneDisplay, fallback.contact.phoneHref),
      openingHours: openingHours.length === 0 ? fallback.contact.openingHours : openingHours,
    },
    menu,
    // A shortlist nobody has chosen falls back to the shipped one rather than to nothing: an empty
    // section on the home page is a worse default than a slightly stale one.
    featured: featured.length === 0 ? fallback.featured.filter((id) => visible.has(id)) : featured,
  };
}

/**
 * Derives the `tel:` target from the displayed number when one is not supplied.
 *
 * A phone link that does not dial is the kind of thing nobody tests, so the href is never taken on
 * trust: anything that is not a `tel:` URI is rebuilt from the digits of the displayed number.
 */
function telHref(href: unknown, display: unknown, fallback: string): string {
  const given = text(href);
  if (/^tel:\+?[0-9]+$/.test(given)) {
    return given;
  }
  const digits = text(display).replace(/[^\d+]/g, '');
  return digits.length >= 6 ? `tel:${digits}` : fallback;
}
