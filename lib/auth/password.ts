import 'server-only';

import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: Buffer,
  keylen: number,
) => Promise<Buffer>;

/**
 * Password hashing for the single admin account.
 *
 * scrypt rather than a fast hash: the whole point is to be slow enough that a leaked hash is not a
 * leaked password. Node ships it, so there is no dependency and no native build.
 *
 * The stored form is `scrypt:<salt-hex>:<key-hex>`. Salt and parameters travel with the hash so a
 * future change of cost does not invalidate what is already stored.
 *
 * Colons rather than the dollar signs the format usually uses, because this value has to survive a
 * `.env` file: dotenv expands a dollar reference inside a value, and docker compose expands one
 * again, so a dollar-separated hash arrives at the server with its salt and key replaced by empty
 * strings — a login that fails with nothing in any log to say why. A separator that no layer
 * treats as syntax removes the whole class of that.
 */

const KEY_LENGTH = 64;
const SALT_LENGTH = 16;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH);
  const key = await scryptAsync(password, salt, KEY_LENGTH);
  return `scrypt:${salt.toString('hex')}:${key.toString('hex')}`;
}

/**
 * Checks a password against a stored hash.
 *
 * Compared with `timingSafeEqual`, so the time taken says nothing about how much of the key
 * matched. A malformed stored hash returns false rather than throwing: a broken environment
 * variable should lock the admin, not crash the login route.
 */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split(':');
  if (parts.length !== 3 || parts[0] !== 'scrypt') {
    return false;
  }
  const [, saltHex, keyHex] = parts;
  if (saltHex === undefined || keyHex === undefined) {
    return false;
  }

  try {
    const salt = Buffer.from(saltHex, 'hex');
    const expected = Buffer.from(keyHex, 'hex');
    if (salt.length === 0 || expected.length !== KEY_LENGTH) {
      return false;
    }
    const actual = await scryptAsync(password, salt, KEY_LENGTH);
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}
