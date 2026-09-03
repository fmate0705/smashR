import { describe, expect, it } from 'vitest';
import {
  formatPrice,
  itemsInCategory,
  menuCategories,
  menuItems,
  type MenuItem,
} from '@/content/menu';
import { IMAGE_SIZES } from '@/lib/images/manifest';

/** U+00A0. Written as a code point so the intent survives an editor that normalises whitespace. */
const NBSP = String.fromCharCode(160);

/**
 * The menu is the one place on this site where being wrong costs a customer money or a wasted
 * trip, so its invariants are tested rather than trusted: every item reaches a real ordering
 * platform, every photo it claims actually exists, and no photo is attached to an item the
 * kitchen has not published one for.
 */
describe('menu data', () => {
  it('gives every item a unique id', () => {
    const ids = menuItems.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('places every item in a declared category', () => {
    const known = new Set(menuCategories.map((category) => category.id));
    const orphans = menuItems.filter((item) => !known.has(item.category)).map((item) => item.id);
    expect(orphans).toEqual([]);
  });

  it('leaves no category empty, so the page never renders a heading with nothing under it', () => {
    const empty = menuCategories
      .filter((category) => itemsInCategory(category.id).length === 0)
      .map((category) => category.id);
    expect(empty).toEqual([]);
  });

  it('gives every item at least one platform it can actually be ordered from', () => {
    const unreachable = menuItems.filter((item) => item.channels.length === 0).map((i) => i.id);
    expect(unreachable).toEqual([]);
  });

  it('points every product photo at an image the asset pipeline really wrote', () => {
    const missing = menuItems
      .filter((item): item is MenuItem & { image: string } => item.image !== undefined)
      .filter((item) => !(`${item.image}-400.webp` in IMAGE_SIZES))
      .map((item) => item.id);
    expect(missing).toEqual([]);
  });

  it('gives every photographed item alt text', () => {
    const unlabelled = menuItems
      .filter((item) => item.image !== undefined)
      .filter((item) => item.imageAlt === undefined || item.imageAlt.trim() === '')
      .map((item) => item.id);
    expect(unlabelled).toEqual([]);
  });

  it('never shows the same photograph for two different items', () => {
    // The rule this protects: a card shows the dish it names. When the triple-patty sizes had no
    // published photo they were typographic; now that the venue has photographed them on Wolt they
    // have their own — what must never happen is one of them borrowing the smaller burger's shot.
    const images = menuItems
      .map((item) => item.image)
      .filter((image): image is string => image !== undefined);
    expect(new Set(images).size).toBe(images.length);
  });

  it('photographs the Wolt-only sizes with their own shots', () => {
    const woltOnly = menuItems.filter(
      (item) => item.channels.length === 1 && item.channels[0] === 'wolt',
    );
    expect(woltOnly.length).toBeGreaterThan(0);
    expect(woltOnly.every((item) => item.image !== undefined)).toBe(true);
  });

  it('prices every item above zero', () => {
    const free = menuItems.filter((item) => !(item.price > 0)).map((item) => item.id);
    expect(free).toEqual([]);
  });
});

describe('formatPrice', () => {
  it('follows Hungarian grouping, which leaves four-digit prices ungrouped', () => {
    // hu-HU groups only from five digits up (CLDR minimumGroupingDigits: 2), so "2990 Ft" is
    // correct here and a grouped "2 990 Ft" would not be. Every price on this menu is four
    // digits or fewer, so none of them group.
    expect(formatPrice(400)).toBe(`400${NBSP}Ft`);
    expect(formatPrice(2990)).toBe(`2990${NBSP}Ft`);
    expect(formatPrice(10000)).toBe(`10${NBSP}000${NBSP}Ft`);
  });

  it('never lets a price break across lines', () => {
    // Every separator inside a price is U+00A0, so no breaking whitespace survives formatting.
    const breaking = [' ', String.fromCharCode(9), String.fromCharCode(10)];
    for (const price of [400, 5670, 10000]) {
      for (const character of breaking) {
        expect(formatPrice(price)).not.toContain(character);
      }
    }
  });
});
