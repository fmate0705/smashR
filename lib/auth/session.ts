import 'server-only';

import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { adminCredentials, sessionSecret } from '@/lib/env';

/**
 * The admin session: a signed JWT in an httpOnly cookie.
 *
 * A JWT here is not about scale — there is one account — it is about the server holding no session
 * state, which matters when the only writable directory is a content volume. The token carries the
 * subject and an expiry and nothing else; there is nothing in it worth reading and nothing that
 * would be dangerous if it were.
 *
 * `httpOnly` keeps it away from scripts, `sameSite=lax` keeps it off cross-site form posts, and
 * `secure` is set whenever the site is served over https. Eight hours is a working day: long
 * enough not to interrupt a shift, short enough that a forgotten browser is not a standing door.
 */

const COOKIE = 'smashr_admin';
const MAX_AGE_SECONDS = 8 * 60 * 60;

export interface AdminSession {
  readonly user: string;
}

/** Why the admin cannot be used, or null when it can. Drives what the login page explains. */
export type AdminAvailability = 'ready' | 'no-credentials' | 'no-secret';

export function adminAvailability(): AdminAvailability {
  if (adminCredentials() === null) {
    return 'no-credentials';
  }
  if (sessionSecret() === null) {
    return 'no-secret';
  }
  return 'ready';
}

export async function createSession(user: string): Promise<void> {
  const secret = sessionSecret();
  if (secret === null) {
    throw new Error('SMASHR_SESSION_SECRET is not set');
  }

  const token = await new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secret);

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}

/**
 * The signed-in admin, or null.
 *
 * Every failure path — no cookie, no key, bad signature, expired, a subject that no longer matches
 * the configured account — returns null rather than throwing. Changing `SMASHR_ADMIN_USER` should
 * sign the old one out, not produce a 500 on every page of the admin.
 */
export async function readSession(): Promise<AdminSession | null> {
  const secret = sessionSecret();
  const credentials = adminCredentials();
  if (secret === null || credentials === null) {
    return null;
  }

  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token === undefined || token === '') {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: ['HS256'] });
    if (typeof payload.sub !== 'string' || payload.sub !== credentials.user) {
      return null;
    }
    return { user: payload.sub };
  } catch {
    return null;
  }
}
