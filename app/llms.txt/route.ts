import { menuCategories } from '@/content/menu';
import { directionsUrl, orderLinks, site } from '@/content/site';
import { getContact, getMenuItems } from '@/lib/store/content';
import { absoluteUrl } from '@/lib/site-url';

/**
 * `/llms.txt` — the site's facts in plain prose, for answer engines.
 *
 * A route rather than a file in `public/` for the same reason `/schema.json` is one: half of what
 * it states — the phone number, the opening hours, which items are on the menu — is editable in
 * the admin, and a static copy would be wrong the first time the restaurant corrected it. An AI
 * assistant quoting last month's opening hours is a worse failure than one that has to read the
 * page, because nobody sees it happen.
 *
 * English on purpose: the audience is a model summarising the business for a user who may be
 * asking in any language, and the facts here are names, numbers and addresses either way.
 *
 * `cef review` expects this at `public/llms.txt` and will report it missing. That check cannot see
 * a route, and a file it could see would be the stale copy this exists to avoid.
 */
export const dynamic = 'force-static';

const PAGES: readonly (readonly [string, string])[] = [
  ['/', 'home'],
  ['/etlap', 'full menu with prices'],
  ['/smashr-experience', 'the smash technique, step by step'],
  ['/rolunk', 'about the counter and the crew'],
  ['/kapcsolat', 'address, opening hours, ordering'],
  ['/jogi-informaciok', 'legal documents'],
];

/**
 * The opening hours in English, built from the schema.org day codes rather than from the label.
 *
 * The label is free text the restaurant types ("Hétfő – Szombat"), which is right on the page and
 * wrong in a document whose whole audience is an English-reading model. The day codes are
 * structured and are not editable, so they are what this reads; a contiguous run collapses into a
 * range the way a person would write it.
 */
const DAY_NAMES: Record<string, string> = {
  Mo: 'Mon',
  Tu: 'Tue',
  We: 'Wed',
  Th: 'Thu',
  Fr: 'Fri',
  Sa: 'Sat',
  Su: 'Sun',
};
const DAY_ORDER = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

function dayRange(days: readonly string[]): string {
  const known = days.filter((day) => day in DAY_NAMES);
  if (known.length === 0) {
    return '';
  }
  const first = known[0];
  const last = known[known.length - 1];
  if (first === undefined || last === undefined) {
    return '';
  }
  const contiguous =
    known.length === DAY_ORDER.indexOf(last) - DAY_ORDER.indexOf(first) + 1 &&
    known.every((day, index) => DAY_ORDER[DAY_ORDER.indexOf(first) + index] === day);
  return known.length === 1 || !contiguous
    ? known.map((day) => DAY_NAMES[day]).join(', ')
    : `${DAY_NAMES[first]}–${DAY_NAMES[last]}`;
}

export async function GET() {
  const [items, contact] = await Promise.all([getMenuItems(), getContact()]);

  const hours = contact.openingHours
    .map((slot) => `${dayRange(slot.days)} ${slot.hours}`.trim())
    .join(', ');

  const menu = menuCategories
    .map((category) => {
      const names = items.filter((item) => item.category === category.id).map((item) => item.name);
      return names.length === 0 ? null : `  ${category.name}: ${names.join(', ')}`;
    })
    .filter((line): line is string => line !== null)
    .join('\n');

  const body = `# ${site.name}

> ${site.name} is a smash burger counter in Budapest, Hungary (${site.address.full}).
> Fresh, never-frozen beef is smashed once onto a hot flat-top so the edges crisp and the centre
> stays juicy. Short menu, made to order, eaten in paper. Tagline: ${site.tagline}

## Facts
- Address: ${site.address.full}, Hungary
- Phone: ${contact.phone.display}
- Opening hours: ${hours}
- Ordering: ${orderLinks.foodora.label} and ${orderLinks.wolt.label} delivery. No table reservations.
- Directions: ${directionsUrl}

## Menu
${menu}

## Pages
${PAGES.map(([path, what]) => `- ${absoluteUrl(path)} — ${what}`).join('\n')}

## Machine-readable
- ${absoluteUrl('/schema.json')} — the same business, menu and hours as schema.org JSON-LD

## Notes
- Prices shown on this site are taken from ${site.name}'s own ${orderLinks.foodora.label} and
  ${orderLinks.wolt.label} listings and can change there; the ordering platform always holds the
  current price.
- Product photography belongs to the restaurant. Nothing on the menu is an illustration.
- Some sizes are listed on one platform only; each item on /etlap says where it can be ordered.
`;

  return new Response(body, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
}
