#!/usr/bin/env node
import { randomBytes, scrypt } from 'node:crypto';
import { promisify } from 'node:util';

/**
 * Prints the value for `SMASHR_ADMIN_PASSWORD_HASH`.
 *
 *   node scripts/hash-password.mjs 'a jelszó'
 *
 * Deliberately a script rather than an admin screen: there is one account, it is created once at
 * handover, and a "create the first user" page that is reachable before anyone has logged in is
 * the oldest way to hand a site to a stranger.
 *
 * The password is read from the argument or, when none is given, from stdin — so it can be piped
 * in without ever reaching the shell history.
 *
 * It also prints a session secret, because the two are always set together and an operator who has
 * to go and find a 32-character random string somewhere else tends to type one instead.
 */

const KEY_LENGTH = 64;
const SALT_LENGTH = 16;
const scryptAsync = promisify(scrypt);

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

const password = (process.argv[2] ?? (process.stdin.isTTY ? '' : await readStdin())).trim();

if (password.length < 12) {
  console.error('Adj meg egy legalább 12 karakteres jelszót:');
  console.error("  node scripts/hash-password.mjs 'a jelszó'");
  process.exit(1);
}

const salt = randomBytes(SALT_LENGTH);
const key = await scryptAsync(password, salt, KEY_LENGTH);

console.log(`SMASHR_ADMIN_PASSWORD_HASH=scrypt:${salt.toString('hex')}:${key.toString('hex')}`);
console.log(`SMASHR_SESSION_SECRET=${randomBytes(32).toString('base64url')}`);
