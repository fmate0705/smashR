'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { adminCredentials } from '@/lib/env';
import { verifyPassword } from '@/lib/auth/password';
import { adminAvailability, createSession, destroySession, readSession } from '@/lib/auth/session';
import { readContent, writeContent } from '@/lib/store/store';
import { FEATURED_LIMIT, type StoredMenuItem } from '@/lib/store/types';
import type { MenuCategoryId } from '@/content/menu';

/**
 * The admin's write path.
 *
 * Server actions rather than route handlers: the form posts to the same module that renders it, so
 * there is no client-side fetch to get wrong, no JSON contract to keep in step, and the whole
 * thing keeps working with JavaScript switched off.
 *
 * Every action re-checks the session. A server action is a public HTTP endpoint whatever the page
 * around it does, so "the form is behind a login" is not a control — the check in the action is.
 */

export interface ActionState {
  readonly ok?: string;
  readonly error?: string;
}

/**
 * Every path whose content comes out of the store. Refreshed together after any save.
 *
 * `/schema.json` and `/llms.txt` are in here for the same reason the pages are: both are built
 * from the menu and the opening hours, and a machine-readable copy that still quotes last week's
 * price is worse than none at all — nobody sees it go wrong.
 */
const CONTENT_PATHS = [
  '/',
  '/etlap',
  '/rolunk',
  '/kapcsolat',
  '/smashr-experience',
  '/schema.json',
  '/llms.txt',
];

function publish(): void {
  for (const path of CONTENT_PATHS) {
    revalidatePath(path);
  }
}

async function requireSession(): Promise<void> {
  if ((await readSession()) === null) {
    redirect('/admin/login');
  }
}

export async function signIn(_state: ActionState, formData: FormData): Promise<ActionState> {
  const availability = adminAvailability();
  if (availability !== 'ready') {
    return { error: 'Az admin nincs beállítva a szerveren.' };
  }

  const credentials = adminCredentials();
  const user = String(formData.get('user') ?? '');
  const password = String(formData.get('password') ?? '');

  // The username is compared too, but a wrong username and a wrong password give the same answer
  // and take the same work: telling them apart is how an attacker learns which half to keep.
  const passwordOk = await verifyPassword(password, credentials?.hash ?? '');
  if (credentials === null || user !== credentials.user || !passwordOk) {
    return { error: 'Hibás felhasználónév vagy jelszó.' };
  }

  await createSession(credentials.user);
  redirect('/admin');
}

export async function signOut(): Promise<void> {
  await destroySession();
  redirect('/admin/login');
}

export async function saveContact(_state: ActionState, formData: FormData): Promise<ActionState> {
  await requireSession();

  const content = await readContent();
  const openingHours = content.contact.openingHours.map((slot, index) => ({
    ...slot,
    label: String(formData.get(`hours-${index}-label`) ?? slot.label),
    hours: String(formData.get(`hours-${index}-value`) ?? slot.hours),
  }));

  await writeContent({
    ...content,
    contact: {
      phoneDisplay: String(formData.get('phoneDisplay') ?? content.contact.phoneDisplay),
      // Left to the store to derive from the digits of the displayed number, so the two can never
      // disagree — a dialled number that is not the printed one is the worst kind of small bug.
      phoneHref: '',
      openingHours,
    },
  });

  publish();
  return { ok: 'Elérhetőség mentve.' };
}

export async function saveMenu(_state: ActionState, formData: FormData): Promise<ActionState> {
  await requireSession();

  const content = await readContent();
  const menu: StoredMenuItem[] = content.menu.map((item) => {
    const field = (name: string) => formData.get(`${item.id}-${name}`);
    return {
      ...item,
      name: String(field('name') ?? item.name),
      description: String(field('description') ?? item.description),
      price: Number(field('price') ?? item.price),
      priceFrom: field('priceFrom') !== null,
      deposit: Number(field('deposit') ?? item.deposit),
      category: String(field('category') ?? item.category) as MenuCategoryId,
      channels: ['foodora', 'wolt'].filter((channel) =>
        formData.getAll(`${item.id}-channels`).includes(channel),
      ) as ('foodora' | 'wolt')[],
      visible: field('visible') !== null,
    };
  });

  await writeContent({ ...content, menu });
  publish();
  return { ok: 'Étlap mentve.' };
}

export async function saveFeatured(_state: ActionState, formData: FormData): Promise<ActionState> {
  await requireSession();

  const content = await readContent();
  const chosen = formData.getAll('featured').map(String);

  if (chosen.length > FEATURED_LIMIT) {
    return { error: `Legfeljebb ${FEATURED_LIMIT} terméket lehet kiemelni.` };
  }
  // An empty shortlist is rejected rather than saved: the store falls back to the shipped
  // selection when it finds none, so saving nothing would silently bring back what was removed.
  if (chosen.length === 0) {
    return { error: 'Legalább egy terméket ki kell emelni.' };
  }

  await writeContent({ ...content, featured: chosen });
  publish();
  return { ok: 'Kiemelt termékek mentve.' };
}
