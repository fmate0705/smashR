import { describe, expect, it } from 'vitest';
import { legalNavigation, navigation, orderLinks, socialLinks } from '@/content/site';
import { legalDocuments } from '@/content/legal';
import { restaurantJsonLd, menuJsonLd } from '@/lib/seo/jsonld';

/**
 * Navigation and structured data are both promises made to someone who is not in the room — a
 * visitor following a link, or a search engine reading a claim it will show to one. These check
 * that the promises resolve.
 */
describe('navigation', () => {
  it('links only to routes that exist in the app', () => {
    const routes = new Set([
      '/',
      '/etlap',
      '/smashr-experience',
      '/rolunk',
      '/kapcsolat',
      '/jogi-informaciok',
      ...legalDocuments.map((document) => `/jogi-informaciok/${document.slug}`),
    ]);
    const broken = [...navigation, ...legalNavigation]
      .map((item) => item.href)
      .filter((href) => !routes.has(href));
    expect(broken).toEqual([]);
  });

  it('lists a legal page for every legal document, and no more', () => {
    const linked = legalNavigation.map((item) => item.href).sort();
    const documents = legalDocuments.map((document) => `/jogi-informaciok/${document.slug}`).sort();
    expect(linked).toEqual(documents);
  });
});

describe('outbound links', () => {
  it('sends ordering to the venue’s own platform listings over https', () => {
    for (const link of Object.values(orderLinks)) {
      expect(link.href).toMatch(/^https:\/\//);
    }
    expect(orderLinks.foodora.href).toContain('foodora.hu');
    expect(orderLinks.wolt.href).toContain('wolt.com');
  });

  it('claims exactly one primary ordering platform', () => {
    const primary = Object.values(orderLinks).filter((link) => link.primary);
    expect(primary).toHaveLength(1);
  });

  it('carries no social profile without a URL', () => {
    for (const link of socialLinks) {
      expect(link.href).toMatch(/^https:\/\//);
      expect(link.label.trim()).not.toBe('');
    }
  });
});

describe('structured data', () => {
  it('describes the venue with the address and hours the pages show', () => {
    expect(restaurantJsonLd['@type']).toBe('Restaurant');
    expect(restaurantJsonLd.address.streetAddress).toBe('Bevásárló u. 2.');
    expect(restaurantJsonLd.address.postalCode).toBe('1239');
    expect(restaurantJsonLd.openingHoursSpecification).toHaveLength(2);
    // Seven days, each named exactly once across the two specifications.
    const days = restaurantJsonLd.openingHoursSpecification.flatMap((slot) => slot.dayOfWeek);
    expect(new Set(days).size).toBe(7);
  });

  it('states that no reservation is possible, because none is', () => {
    expect(restaurantJsonLd.acceptsReservations).toBe(false);
  });

  it('offers every menu item in HUF', () => {
    const offers = menuJsonLd.hasMenuSection.flatMap((section) =>
      section.hasMenuItem.map((item) => item.offers),
    );
    expect(offers.length).toBeGreaterThan(0);
    expect(offers.every((offer) => offer.priceCurrency === 'HUF')).toBe(true);
    expect(offers.every((offer) => offer.price > 0)).toBe(true);
  });

  it('serializes to valid JSON, since it is injected as a script body', () => {
    expect(() => JSON.parse(JSON.stringify(restaurantJsonLd))).not.toThrow();
    expect(() => JSON.parse(JSON.stringify(menuJsonLd))).not.toThrow();
  });
});

describe('legal documents', () => {
  it('keeps every draft flagged for review until a professional signs it off', () => {
    const unflagged = legalDocuments.filter((document) => !document.review).map((d) => d.slug);
    expect(unflagged).toEqual([]);
  });

  it('gives every document a title, a description and at least one section', () => {
    for (const document of legalDocuments) {
      expect(document.title.trim()).not.toBe('');
      expect(document.description.trim()).not.toBe('');
      expect(document.sections.length).toBeGreaterThan(0);
    }
  });
});
