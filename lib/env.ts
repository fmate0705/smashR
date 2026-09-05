import 'server-only';

/**
 * Server-side configuration.
 *
 * Two kinds of value live here and they are read differently on purpose.
 *
 * The *operator's* details — company name, registration numbers, the data-protection contact —
 * come from the environment. They belong to the business, not to the site: they are set once when
 * the client is created on the hosting platform, they change almost never, and nobody should have
 * to open an editor to correct a VAT number. Everything the kitchen changes week to week — the
 * menu, the hours, the phone — lives in the content store instead, behind the admin.
 *
 * Every value is read through a function rather than captured at module load. A statically
 * rendered page would otherwise bake whatever was set at *build* time, and in this deployment the
 * environment arrives at *run* time from the platform's env file — so the two would never agree.
 *
 * Anything unset returns a visible placeholder rather than an empty string or an invented value.
 * A blank line in an impressum reads as an oversight; `[cégnév — kitöltendő]` reads as a job to do.
 */

/** Marks a value the operator still has to supply. Rendered so it cannot pass for real content. */
function pending(label: string): string {
  return `[${label} — kitöltendő]`;
}

function read(name: string, label: string): string {
  const value = process.env[name]?.trim();
  return value === undefined || value === '' ? pending(label) : value;
}

/**
 * The operator's fields, their environment variables and what to call them in Hungarian.
 *
 * One table rather than three: the legal pages read the values, the admin's status panel names the
 * variable that is still missing, and neither can drift from the other because there is only one
 * list. `label` titles the row in the admin; `pending` fills the placeholder on the page itself.
 */
export const operatorFields = [
  { key: 'companyName', variable: 'SMASHR_COMPANY_NAME', label: 'Cégnév', pending: 'cégnév' },
  {
    key: 'registeredAddress',
    variable: 'SMASHR_COMPANY_ADDRESS',
    label: 'Székhely',
    pending: 'székhely',
  },
  {
    key: 'companyNumber',
    variable: 'SMASHR_COMPANY_NUMBER',
    label: 'Cégjegyzékszám',
    pending: 'cégjegyzékszám',
  },
  { key: 'taxNumber', variable: 'SMASHR_TAX_NUMBER', label: 'Adószám', pending: 'adószám' },
  {
    key: 'registrationCourt',
    variable: 'SMASHR_REGISTRATION_COURT',
    label: 'Nyilvántartó cégbíróság',
    pending: 'nyilvántartó cégbíróság',
  },
  {
    key: 'representative',
    variable: 'SMASHR_REPRESENTATIVE',
    label: 'Képviselő',
    pending: 'képviselő neve',
  },
  { key: 'email', variable: 'SMASHR_CONTACT_EMAIL', label: 'E-mail cím', pending: 'e-mail cím' },
  {
    key: 'privacyEmail',
    variable: 'SMASHR_PRIVACY_EMAIL',
    label: 'Adatvédelmi e-mail cím',
    pending: 'adatvédelmi e-mail cím',
  },
  {
    key: 'hostingName',
    variable: 'SMASHR_HOSTING_NAME',
    label: 'Tárhelyszolgáltató',
    pending: 'tárhelyszolgáltató neve',
  },
  {
    key: 'hostingAddress',
    variable: 'SMASHR_HOSTING_ADDRESS',
    label: 'Tárhelyszolgáltató székhelye',
    pending: 'tárhelyszolgáltató székhelye',
  },
  {
    key: 'hostingContact',
    variable: 'SMASHR_HOSTING_CONTACT',
    label: 'Tárhelyszolgáltató elérhetősége',
    pending: 'tárhelyszolgáltató elérhetősége',
  },
] as const;

export type OperatorKey = (typeof operatorFields)[number]['key'];

/**
 * The operator of the site, as the impressum and the privacy notice have to state it.
 *
 * Read fresh on every call so a running container picks up a corrected value on its next render
 * rather than on its next build.
 */
export function operator(): Record<OperatorKey, string> {
  const entries = operatorFields.map(
    (field) => [field.key, read(field.variable, field.pending)] as const,
  );
  return Object.fromEntries(entries) as Record<OperatorKey, string>;
}

/** True when every field the legal documents need has actually been supplied. */
export function operatorIsConfigured(): boolean {
  return Object.values(operator()).every((value) => !value.startsWith('['));
}

/**
 * Where the editable content is written.
 *
 * Outside `.next` on purpose: the build output is rebuilt on every deploy, and content the
 * restaurant has typed must survive that. In the container this is a mounted volume.
 */
export function dataDir(): string {
  return process.env.SMASHR_DATA_DIR?.trim() || './data';
}

/** The admin account. Both must be set for the admin to be reachable at all. */
export function adminCredentials(): { readonly user: string; readonly hash: string } | null {
  const user = process.env.SMASHR_ADMIN_USER?.trim();
  const hash = process.env.SMASHR_ADMIN_PASSWORD_HASH?.trim();
  if (user === undefined || user === '' || hash === undefined || hash === '') {
    return null;
  }
  return { user, hash };
}

/**
 * The key the session cookie is signed with.
 *
 * No fallback and no generated default: a signing key that the code invents is a signing key an
 * attacker can invent too, and a default that silently works in production is worse than a login
 * page that refuses to work until the key is set.
 */
export function sessionSecret(): Uint8Array | null {
  const secret = process.env.SMASHR_SESSION_SECRET?.trim();
  if (secret === undefined || secret.length < 32) {
    return null;
  }
  return new TextEncoder().encode(secret);
}
