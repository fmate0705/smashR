import type { MenuCategoryId } from '@/content/menu';

/**
 * The shape of everything the restaurant can change without a deploy.
 *
 * Deliberately narrow. The menu, the hours and the phone move week to week and belong to the
 * kitchen; the brand, the routes, the copy and the legal text do not, and putting them behind an
 * editor would only add a way to break them. Anything an operator sets once — company details for
 * the impressum — is environment, not content.
 */

export interface StoredMenuItem {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  /** HUF. */
  readonly price: number;
  /** Marks a configurable item whose listed price is a starting price. */
  readonly priceFrom: boolean;
  /** Deposit added at checkout for returnable packaging, in HUF. Zero means none. */
  readonly deposit: number;
  readonly category: MenuCategoryId;
  readonly channels: readonly ('foodora' | 'wolt')[];
  /**
   * Public path of the venue's own product photo, without the width suffix. Not editable in the
   * admin: photography is the venue's, taken from its platform listings, and an editor that let
   * someone point an item at another item's picture would be a way to publish a wrong promise.
   */
  readonly image?: string;
  readonly imageAlt?: string;
  /** Hidden items stay in the store so a seasonal item can come back with its text intact. */
  readonly visible: boolean;
}

export interface StoredOpeningHours {
  readonly label: string;
  readonly hours: string;
  /** schema.org two-letter day codes, for the structured data. */
  readonly days: readonly string[];
}

export interface StoredContact {
  readonly phoneDisplay: string;
  readonly phoneHref: string;
  readonly openingHours: readonly StoredOpeningHours[];
}

export interface ContentDocument {
  /** Bumped whenever the shape changes, so a stored copy from an older shape can be rejected. */
  readonly version: 1;
  readonly updatedAt: string;
  readonly contact: StoredContact;
  readonly menu: readonly StoredMenuItem[];
  /** Item ids shown in the home page's shortlist, in the order they appear. */
  readonly featured: readonly string[];
}

/** How many items the home page shortlist shows. More than four breaks its four-column grid. */
export const FEATURED_LIMIT = 4;
