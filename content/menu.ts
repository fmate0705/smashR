/**
 * The menu.
 *
 * Sourced from SmashR's own foodora and Wolt listings — names, descriptions, prices and product
 * photography are the venue's, not this site's. Photography is only ever referenced, never
 * generated: a burger the kitchen does not make must not appear on its menu.
 *
 * Prices are the listed delivery prices in HUF and move with the platforms, so the page states
 * where they come from rather than presenting them as fixed in-store prices.
 */

export type MenuCategoryId = 'menuk' | 'burgerek' | 'big' | 'koretek' | 'szoszok' | 'italok';

export interface MenuItem {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  /** HUF. `priceFrom` marks a configurable item whose listed price is a starting price. */
  readonly price: number;
  readonly priceFrom?: boolean;
  /** Deposit added at checkout for returnable packaging, in HUF. */
  readonly deposit?: number;
  /** Public path of the venue's own product photo, or undefined for a type-only card. */
  readonly image?: string;
  readonly imageAlt?: string;
  readonly category: MenuCategoryId;
  /** Where this item can actually be ordered. Some sizes exist on one platform only. */
  readonly channels: readonly ('foodora' | 'wolt')[];
  readonly highlight?: boolean;
}

export interface MenuCategory {
  readonly id: MenuCategoryId;
  readonly name: string;
  readonly lead: string;
}

export const menuCategories: readonly MenuCategory[] = [
  {
    id: 'burgerek',
    name: 'Burgerek',
    lead: 'Dupla smashelt marhahús, forró lapon, ropogósra sütött szélekkel. Ez a magja mindennek.',
  },
  {
    id: 'big',
    name: 'Big Smash',
    lead: 'Ugyanaz, három húspogácsával. Ezt a méretet Wolton tudod megrendelni.',
  },
  {
    id: 'menuk',
    name: 'Menük',
    lead: 'Burger, hasábburgonya és egy fél literes Coca-Cola termék, egy áron.',
  },
  {
    id: 'koretek',
    name: 'Köretek',
    lead: 'Amit a burger mellé kérni fogsz. Külön is megállja a helyét.',
  },
  { id: 'szoszok', name: 'Szószok', lead: 'Mártogatáshoz.' },
  { id: 'italok', name: 'Italok', lead: 'Hideg, egyszerű, kéznél.' },
];

export const menuItems: readonly MenuItem[] = [
  // Burgerek
  {
    id: 'classic-smash',
    name: 'Classic Smash',
    description:
      'Friss, dupla smashelt marhahúspogácsa ketchuppal, mustárral, uborkával, hagymával és olvadó cheddar sajttal.',
    price: 2990,
    priceFrom: true,
    image: '/images/menu/classic-smash',
    imageAlt: 'Classic Smash burger dupla marhahúspogácsával és olvadt cheddar sajttal',
    category: 'burgerek',
    channels: ['foodora', 'wolt'],
    highlight: true,
  },
  {
    id: 'house-smash',
    name: 'House Smash',
    description:
      'Friss, dupla smashelt marhahúspogácsa házi szósszal, ropogós uborkával és hagymával, olvadó cheddar sajttal.',
    price: 2990,
    priceFrom: true,
    image: '/images/menu/house-smash',
    imageAlt: 'House Smash burger házi szósszal és olvadt cheddar sajttal',
    category: 'burgerek',
    channels: ['foodora', 'wolt'],
    highlight: true,
  },
  {
    id: 'crispy-bacon-smash',
    name: 'Crispy Bacon Smash',
    description:
      'Friss, dupla smashelt marhahúspogácsa, baconos majonéz, uborka, hagyma, pirított hagyma, cheddar sajt.',
    price: 3290,
    priceFrom: true,
    image: '/images/menu/crispy-bacon-smash',
    imageAlt: 'Crispy Bacon Smash burger ropogós baconnel és pirított hagymával',
    category: 'burgerek',
    channels: ['foodora', 'wolt'],
    highlight: true,
  },
  {
    id: 'crispy-chicken',
    name: 'Crispy Chicken',
    description:
      'Ropogósra panírozott csirkemellfilé majonézzel, jégsalátával, cheddar sajttal és savanyú uborkával.',
    price: 3290,
    priceFrom: true,
    image: '/images/menu/crispy-chicken',
    imageAlt: 'Crispy Chicken burger ropogós panírozott csirkemellfilével',
    category: 'burgerek',
    channels: ['foodora', 'wolt'],
  },

  // Big Smash — a Wolt-only size, photographed by the venue on its own Wolt listing. Each card
  // shows that burger, never the smaller one wearing its name.
  {
    id: 'classic-smash-big',
    name: 'Classic Smash Big',
    description: 'Tripla smashelt marhahúspogácsa, ketchup, mustár, uborka, hagyma, cheddar sajt.',
    price: 3790,
    image: '/images/menu/classic-smash-big',
    imageAlt: 'Classic Smash Big burger tripla marhahúspogácsával',
    category: 'big',
    channels: ['wolt'],
  },
  {
    id: 'house-smash-big',
    name: 'House Smash Big',
    description: 'Tripla smashelt marhahúspogácsa, házi szósz, uborka, hagyma, cheddar sajt.',
    price: 3790,
    image: '/images/menu/house-smash-big',
    imageAlt: 'House Smash Big burger tripla marhahúspogácsával és házi szósszal',
    category: 'big',
    channels: ['wolt'],
  },
  {
    id: 'crispy-bacon-big-smash',
    name: 'Crispy Bacon Big Smash',
    description:
      'Tripla smashelt marhahúspogácsa, baconos majonéz, uborka, hagyma, pirított hagyma, cheddar sajt.',
    price: 4090,
    image: '/images/menu/crispy-bacon-big-smash',
    imageAlt: 'Crispy Bacon Big Smash burger tripla marhahúspogácsával és ropogós baconnel',
    category: 'big',
    channels: ['wolt'],
  },

  // Menük
  {
    id: 'classic-smash-menu',
    name: 'Classic Smash menü',
    description: 'Classic Smash + hasábburgonya + választható Coca-Cola termék (500 ml).',
    price: 4870,
    priceFrom: true,
    deposit: 50,
    image: '/images/menu/menu-classic-smash',
    imageAlt: 'Classic Smash menü burgerrel, hasábburgonyával és üdítővel',
    category: 'menuk',
    channels: ['foodora', 'wolt'],
  },
  {
    id: 'crispy-bacon-smash-menu',
    name: 'Crispy Bacon Smash menü',
    description: 'Crispy Bacon Smash + hasábburgonya + választható Coca-Cola termék (500 ml).',
    price: 5170,
    priceFrom: true,
    deposit: 50,
    image: '/images/menu/menu-crispy-bacon-smash',
    imageAlt: 'Crispy Bacon Smash menü burgerrel, hasábburgonyával és üdítővel',
    category: 'menuk',
    channels: ['foodora', 'wolt'],
  },
  {
    id: 'house-smash-big-menu',
    name: 'House Smash Big menü',
    description: 'House Smash Big + hasábburgonya + választható Coca-Cola termék (500 ml).',
    price: 5670,
    priceFrom: true,
    deposit: 50,
    image: '/images/menu/menu-house-smash-big',
    imageAlt: 'House Smash Big menü tripla húsos burgerrel, hasábburgonyával és üdítővel',
    category: 'menuk',
    channels: ['foodora', 'wolt'],
  },

  // Köretek
  {
    id: 'hasabburgonya',
    name: 'Hasábburgonya',
    description: 'Aranybarnára sütött, ropogós hasábburgonya.',
    price: 1090,
    image: '/images/menu/hasabburgonya',
    imageAlt: 'Ropogós hasábburgonya',
    category: 'koretek',
    channels: ['foodora', 'wolt'],
  },
  {
    id: 'loaded-fries',
    name: 'Loaded Fries',
    description: 'Ropogós hasábburgonya sajtszósszal és pirított hagymával gazdagon megpakolva.',
    price: 1590,
    image: '/images/menu/loaded-fries',
    imageAlt: 'Loaded Fries sajtszósszal és pirított hagymával',
    category: 'koretek',
    channels: ['foodora', 'wolt'],
    highlight: true,
  },
  {
    id: 'mozzarella-rudak',
    name: 'Mozzarella rudak',
    description: 'Panírozott, ropogós mozzarella rudak olvadó sajtos belsővel.',
    price: 1490,
    image: '/images/menu/mozzarella-rudak',
    imageAlt: 'Panírozott mozzarella rudak',
    category: 'koretek',
    channels: ['foodora'],
  },

  // Szószok
  {
    id: 'ketchup',
    name: 'Ketchup',
    price: 400,
    image: '/images/menu/ketchup',
    imageAlt: 'Ketchup adag',
    category: 'szoszok',
    channels: ['foodora', 'wolt'],
  },
  {
    id: 'majonez',
    name: 'Majonéz',
    price: 400,
    image: '/images/menu/majonez',
    imageAlt: 'Majonéz adag',
    category: 'szoszok',
    channels: ['foodora', 'wolt'],
  },

  // Italok
  {
    id: 'naturaqua-mentes',
    name: 'NaturAqua szénsavmentes ásványvíz',
    description: 'Szénsavmentes természetes ásványvíz, 500 ml.',
    price: 790,
    deposit: 50,
    image: '/images/menu/naturaqua-mentes',
    imageAlt: 'NaturAqua szénsavmentes ásványvíz 500 ml',
    category: 'italok',
    channels: ['foodora', 'wolt'],
  },
  {
    id: 'naturaqua-dus',
    name: 'NaturAqua szénsavas ásványvíz',
    description: 'Szén-dioxiddal dúsított természetes ásványvíz, 500 ml.',
    price: 790,
    deposit: 50,
    image: '/images/menu/naturaqua-dus',
    imageAlt: 'NaturAqua szénsavas ásványvíz 500 ml',
    category: 'italok',
    channels: ['foodora', 'wolt'],
  },
];

/** Items of one category, in menu order. */
export function itemsInCategory(category: MenuCategoryId): readonly MenuItem[] {
  return menuItems.filter((item) => item.category === category);
}

/**
 * HUF, grouped the Hungarian way. Both spaces are non-breaking on purpose --
 * a price that wraps between its thousands group, or before its currency, reads as two
 * numbers, and the cards are narrow.
 */
export function formatPrice(huf: number): string {
  return `${huf.toLocaleString('hu-HU')} Ft`.replace(/\s/g, ' ');
}
