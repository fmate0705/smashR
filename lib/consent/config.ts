/**
 * The consent window's purposes and copy.
 *
 * `version` is tied to the purposes below. Change what is asked, raise the version: a decision
 * recorded against older purposes was an answer to a different question, and is treated as absent.
 */

export const CONSENT_VERSION = 1;
export const CONSENT_STORAGE_KEY = 'cef-consent';
export const CONSENT_MAX_AGE_DAYS = 180;
export const CONSENT_STORAGE_MEDIUM = 'cookie' as 'cookie' | 'local';
export const CONSENT_POLICY_PATH = '/jogi-informaciok/suti-tajekoztato';
export const CONSENT_PLACEMENT = 'bottom-right-card';
export const CONSENT_BLOCKING = false;
export const CONSENT_SHOW_PURPOSES_UP_FRONT = false;
export const CONSENT_GOOGLE_MODE = true;

export interface ConsentCategory {
  readonly id: string;
  /** Essential purposes are always on and are never presented as a choice. */
  readonly essential: boolean;
  readonly label: string;
  readonly description: string;
  readonly signals: readonly string[];
}

export const CONSENT_CATEGORIES: readonly ConsentCategory[] = [
  {
    id: 'necessary',
    essential: true,
    label: 'Feltétlenül szükséges',
    description:
      'A működéshez szükséges — biztonság, munkamenet és maga a hozzájárulási döntés. Ezek nem kapcsolhatók ki.',
    signals: ['security_storage'],
  },
  {
    id: 'functional',
    essential: false,
    label: 'Funkcionális',
    description:
      'Megjegyzi a beállításokat, például a nyelvet és a témát. Elutasítás esetén az alapértelmezések maradnak.',
    signals: ['functionality_storage', 'personalization_storage'],
  },
  {
    id: 'analytics',
    essential: false,
    label: 'Analitika',
    description:
      'Méri az oldalak használatát a fejlesztés érdekében. Hozzájárulás nélkül semmi nem töltődik be.',
    signals: ['analytics_storage'],
  },
];

export const CONSENT_COPY = {
  title: 'Válassza ki, mit tárolunk',
  body: 'Amíg Ön másként nem dönt, csak a működéshez szükséges adatokat tároljuk. A beágyazott térkép és az analitika kikapcsolva marad, amíg nem engedélyezi.',
  acceptAll: 'Mindet engedélyezem',
  rejectAll: 'Mindet elutasítom',
  customize: 'Célok kiválasztása',
  save: 'Választás mentése',
  preferencesTitle: 'Tárolási célok',
  preferencesBody:
    'Minden célt külön engedélyezhet. Ezt bármikor módosíthatja a lábléc Süti beállítások pontjában.',
  policyLink: 'Süti tájékoztató megtekintése',
  reopen: 'Süti beállítások',
  alwaysOn: 'Mindig aktív',
} as const;

/** The purposes the visitor decides. Essential storage is disclosed, never toggled. */
export const OPTIONAL_CATEGORIES = CONSENT_CATEGORIES.filter((category) => !category.essential);

/** The starting state: nothing non-essential is granted before an answer exists. */
export function defaultGrants(): Record<string, boolean> {
  return Object.fromEntries(
    CONSENT_CATEGORIES.map((category) => [category.id, category.essential]),
  );
}

/** Every purpose granted — the shape `Allow all` writes. */
export function allGranted(): Record<string, boolean> {
  return Object.fromEntries(CONSENT_CATEGORIES.map((category) => [category.id, true]));
}
