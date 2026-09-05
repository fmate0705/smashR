import 'server-only';

import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { cache } from 'react';
import { dataDir } from '@/lib/env';
import { defaultDocument } from './defaults';
import { normaliseDocument } from './document';
import type { ContentDocument } from './types';

/**
 * The content store: one JSON document on disk.
 *
 * A file rather than a database because there is one restaurant, one editor and a few dozen rows.
 * A database would add a service to run, a connection to fail and a migration to forget, and would
 * buy nothing a file cannot do at this size. It lives outside `.next` — the build output is
 * replaced on every deploy, and text the restaurant typed has to survive that — so in the
 * container it is a mounted volume.
 *
 * Reads are wrapped in React's request cache: a page that renders the menu, the shortlist and the
 * structured data reads the document three times and hits the disk once.
 */

function filePath(): string {
  return path.join(dataDir(), 'content.json');
}

/**
 * The current document, or the shipped default when nothing has been saved yet.
 *
 * A missing file is the normal first-run state, not an error. An unreadable or malformed one is an
 * error, but not one worth taking the site down for: it is logged and the shipped content renders,
 * which is a known-good version of the site rather than a stack trace.
 */
export const readContent = cache(async (): Promise<ContentDocument> => {
  try {
    const raw = await readFile(filePath(), 'utf8');
    return normaliseDocument(JSON.parse(raw));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.error('content store: falling back to the shipped content —', error);
    }
    return defaultDocument();
  }
});

/**
 * Writes the document.
 *
 * Written to a temporary file and renamed into place, because `rename` is atomic on the same
 * filesystem: a reader either sees the whole previous document or the whole new one, never the
 * half of a new one that had been flushed when the process was killed mid-save.
 */
export async function writeContent(next: ContentDocument): Promise<ContentDocument> {
  const document = normaliseDocument({ ...next, updatedAt: new Date().toISOString() });
  const target = filePath();
  const temporary = `${target}.${process.pid}.tmp`;

  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(temporary, `${JSON.stringify(document, null, 2)}\n`, 'utf8');
  await rename(temporary, target);

  return document;
}
