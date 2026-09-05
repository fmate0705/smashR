import { describe, expect, it } from 'vitest';
import { normaliseDocument } from '@/lib/store/document';
import { defaultDocument } from '@/lib/store/defaults';
import { FEATURED_LIMIT } from '@/lib/store/types';
import { hashPassword, verifyPassword } from '@/lib/auth/password';

/**
 * The admin's two trust boundaries.
 *
 * `normaliseDocument` is everything that reaches the store — a form anyone can post by hand, or a
 * file anyone with the volume can edit — and `verifyPassword` is the login. Both are pure enough
 * to test without a server, which is the point of having written them that way.
 */

const shipped = defaultDocument();
const firstItem = shipped.menu[0]!;

describe('normaliseDocument', () => {
  it('renders something usable out of nothing at all', () => {
    for (const input of [undefined, null, 42, 'menu', [], {}]) {
      const document = normaliseDocument(input);
      expect(document.menu.length).toBe(shipped.menu.length);
      expect(document.contact.phoneDisplay).toBe(shipped.contact.phoneDisplay);
    }
  });

  it('keeps the shipped menu order, whatever order the store hands back', () => {
    const reversed = normaliseDocument({ menu: [...shipped.menu].reverse() });
    expect(reversed.menu.map((item) => item.id)).toEqual(shipped.menu.map((item) => item.id));
  });

  it('drops items the build has never heard of', () => {
    const document = normaliseDocument({
      menu: [...shipped.menu, { id: 'nem-letezik', name: 'Nem létező', price: 100 }],
    });
    expect(document.menu.some((item) => item.id === 'nem-letezik')).toBe(false);
  });

  it('adds items the store has never heard of, so a deploy can introduce one', () => {
    const document = normaliseDocument({ menu: [{ ...firstItem, price: 3490 }] });
    expect(document.menu.length).toBe(shipped.menu.length);
    expect(document.menu[0]!.price).toBe(3490);
  });

  it('never takes the photograph from input', () => {
    const withImage = shipped.menu.find((item) => item.image !== undefined)!;
    const document = normaliseDocument({
      menu: [{ ...withImage, image: '/images/menu/masik', imageAlt: 'más' }],
    });
    const item = document.menu.find((entry) => entry.id === withImage.id)!;
    expect(item.image).toBe(withImage.image);
    expect(item.imageAlt).toBe(withImage.imageAlt);
  });

  it('falls back on a price that is not a price', () => {
    for (const price of ['sok', -1, 10_000_000, Number.NaN, null]) {
      const document = normaliseDocument({ menu: [{ ...firstItem, price }] });
      expect(document.menu[0]!.price).toBe(firstItem.price);
    }
  });

  it('rounds a price to whole forint', () => {
    const document = normaliseDocument({ menu: [{ ...firstItem, price: 2990.6 }] });
    expect(document.menu[0]!.price).toBe(2991);
  });

  it('keeps an item orderable somewhere', () => {
    const document = normaliseDocument({ menu: [{ ...firstItem, channels: ['glovo'] }] });
    expect(document.menu[0]!.channels).toEqual(['foodora']);
  });

  it('rejects a category that is not one of the menu’s', () => {
    const document = normaliseDocument({ menu: [{ ...firstItem, category: 'desszertek' }] });
    expect(document.menu[0]!.category).toBe(firstItem.category);
  });

  it('caps the shortlist and drops anything hidden from it', () => {
    const ids = shipped.menu.map((item) => item.id);
    const document = normaliseDocument({
      menu: shipped.menu.map((item, index) => ({ ...item, visible: index !== 1 })),
      featured: ids,
    });
    expect(document.featured.length).toBe(FEATURED_LIMIT);
    expect(document.featured).not.toContain(ids[1]);
  });

  it('keeps the shortlist in the order it was given, and without duplicates', () => {
    const [a, b] = [shipped.menu[2]!.id, shipped.menu[0]!.id];
    const document = normaliseDocument({ menu: shipped.menu, featured: [a, b, a] });
    expect(document.featured).toEqual([a, b]);
  });

  it('rebuilds the dialled number from the printed one, so the two cannot disagree', () => {
    const document = normaliseDocument({
      contact: { phoneDisplay: '+36 30 111 2233', phoneHref: 'https://example.com/hivj' },
    });
    expect(document.contact.phoneHref).toBe('tel:+36301112233');
  });

  it('keeps the schema.org day codes out of the editor’s hands', () => {
    const document = normaliseDocument({
      contact: {
        openingHours: [{ label: 'Minden nap', hours: '11:00 – 22:00', days: ['Xx'] }],
      },
    });
    expect(document.contact.openingHours[0]!.label).toBe('Minden nap');
    expect(document.contact.openingHours[0]!.days).toEqual(shipped.contact.openingHours[0]!.days);
  });

  it('ignores an opening-hours row with nothing in it', () => {
    const document = normaliseDocument({
      contact: { openingHours: [{ label: '  ', hours: '' }] },
    });
    expect(document.contact.openingHours).toEqual(shipped.contact.openingHours);
  });
});

describe('verifyPassword', () => {
  it('accepts the password it hashed', async () => {
    const stored = await hashPassword('smash-a-jelszót-2026');
    expect(await verifyPassword('smash-a-jelszót-2026', stored)).toBe(true);
  });

  it('rejects everything else', async () => {
    const stored = await hashPassword('smash-a-jelszót-2026');
    expect(await verifyPassword('smash-a-jelszot-2026', stored)).toBe(false);
    expect(await verifyPassword('', stored)).toBe(false);
  });

  it('salts, so the same password never stores the same bytes twice', async () => {
    expect(await hashPassword('ugyanaz')).not.toBe(await hashPassword('ugyanaz'));
  });

  it('locks rather than crashes on a broken environment variable', async () => {
    for (const stored of ['', 'nem-hash', 'scrypt:deadbeef', 'bcrypt:aa:bb', 'scrypt::', 'a:b:c']) {
      expect(await verifyPassword('bármi', stored)).toBe(false);
    }
  });
});
