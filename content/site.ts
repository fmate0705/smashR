/**
 * The single record of who SmashR is and where to reach them.
 *
 * Every phone number, address, opening hour and external link on the site resolves from here, so
 * a change to the business is one edit rather than a search across pages — and the JSON-LD the
 * search engines read is built from the same values the visitor sees, never a second copy of them.
 *
 * Sources: the venue's own Wolt and foodora listings. Nothing here is invented.
 */

export const site = {
  name: 'SmashR',
  legalName: 'Smash R Burger',
  tagline: 'WE SMASH. YOU EAT.',
  description:
    'Friss marhahús, forró lap, ropogós szélek. A SmashR smash burgerei Budapest XXIII. kerületében készülnek, rendelésre.',
  url: 'https://smashr.hu',
  locale: 'hu-HU',
  address: {
    street: 'Bevásárló u. 2.',
    postalCode: '1239',
    city: 'Budapest',
    country: 'HU',
    full: '1239 Budapest, Bevásárló u. 2.',
  },
  geo: { latitude: 47.4194036, longitude: 19.1577179 },
  phone: { display: '+36 20 447 0900', href: 'tel:+36204470900' },
  priceRange: '$$',
  servesCuisine: ['Smash burger', 'Amerikai', 'Street food'],
} as const;

/** Opening hours as published by the venue. `days` uses schema.org's two-letter day codes. */
export const openingHours = [
  { label: 'Hétfő – Szombat', hours: '10:00 – 20:45', days: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] },
  { label: 'Vasárnap', hours: '10:00 – 19:45', days: ['Su'] },
] as const;

/**
 * Where an order can actually be placed. `primary` is the first call to action everywhere on the
 * site; the rest sit beside it. The order is deliberate, not alphabetical.
 */
export const orderLinks = {
  foodora: {
    label: 'foodora',
    href: 'https://www.foodora.hu/restaurant/w8ff/smash-r-burger-w8ff',
    primary: true,
  },
  wolt: {
    label: 'Wolt',
    href: 'https://wolt.com/hu/hun/budapest/restaurant/smashr',
    primary: false,
  },
} as const;

/** Google Maps route planning, opened from the venue's own place record. */
export const directionsUrl =
  'https://www.google.com/maps/dir/?api=1&destination=Smash+R%2C+Bev%C3%A1s%C3%A1rl%C3%B3+u.+2%2C+1239+Budapest&destination_place_id=ChIJiRPPCQDpQUcRCCSursh4B0U';

/** The embedded map. Kept as the exact `pb` string the venue's own place record produces. */
export const mapEmbedUrl =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4467.765371881519!2d19.1568891!3d47.4189417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4741e90009cf1389%3A0x450778c8e9ae2408!2sSmash%20R!5e1!3m2!1shu!2shu!4v1788362741252!5m2!1shu!2shu';

/**
 * The venue's own channels. Each one was checked against a source before it was added — a social
 * link that goes to a stranger's profile is worse than a missing one.
 */
export const socialLinks = [
  {
    id: 'instagram',
    label: 'SmashR az Instagramon',
    href: 'https://www.instagram.com/smashr.burger/',
  },
  {
    id: 'tiktok',
    label: 'SmashR a TikTokon',
    href: 'https://www.tiktok.com/@smashr.burger',
  },
  {
    id: 'facebook',
    label: 'SmashR a Facebookon',
    href: 'https://www.facebook.com/profile.php?id=61588799159939',
  },
] as const;

/** Primary navigation. One list, read by the desktop nav, the mobile nav and the footer. */
export const navigation = [
  { href: '/etlap', label: 'Étlap' },
  { href: '/smashr-experience', label: 'SmashR Experience' },
  { href: '/rolunk', label: 'Rólunk' },
  { href: '/kapcsolat', label: 'Kapcsolat' },
] as const;

export const legalNavigation = [
  { href: '/jogi-informaciok/impresszum', label: 'Impresszum' },
  { href: '/jogi-informaciok/adatkezelesi-tajekoztato', label: 'Adatkezelési tájékoztató' },
  { href: '/jogi-informaciok/aszf', label: 'ÁSZF' },
  { href: '/jogi-informaciok/suti-tajekoztato', label: 'Süti tájékoztató' },
] as const;

export const credit = { label: 'Klivo.hu', href: 'https://klivo.hu' } as const;
