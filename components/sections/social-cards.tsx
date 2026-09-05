import { SOCIAL_GLYPHS } from '@/components/ui/social-links';
import { socialLinks } from '@/content/site';

/**
 * The venue's accounts, as cards rather than as a row of icons.
 *
 * A bare icon row is what the footer does, and repeating it in the middle of a page made the two
 * read as the same furniture twice. Given a card each, the accounts become a destination on the
 * page: the mark identifies the platform, the handle says which account, and the whole tile is the
 * target — which is also a far larger hit area than a 24px glyph.
 *
 * Same glyph table as the footer's row, so the two can never drift apart.
 */
export function SocialCards() {
  const links: readonly {
    id: string;
    name: string;
    handle: string;
    label: string;
    href: string;
  }[] = socialLinks;

  if (links.length === 0) {
    return null;
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {links.map((link) => (
        <li key={link.id} className="flex">
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer me"
            aria-label={`${link.label}, új lapon nyílik meg`}
            className="group flex w-full items-center gap-5 border border-black/15 bg-white/60 p-6 transition-[transform,border-color,box-shadow] duration-normal ease-emphasized hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_18px_40px_-24px_rgb(0_0_0/0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--smashr-paper))] motion-reduce:hover:translate-y-0"
          >
            <span
              aria-hidden="true"
              className="flex h-12 w-12 shrink-0 items-center justify-center bg-black text-white transition-colors duration-fast group-hover:bg-primary"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                {SOCIAL_GLYPHS[link.id]}
              </svg>
            </span>

            <span className="min-w-0">
              <span className="smashr-display block text-lg leading-tight">{link.name}</span>
              <span className="mt-1 block truncate text-sm text-black/55">{link.handle}</span>
            </span>

            <span
              aria-hidden="true"
              className="ml-auto shrink-0 text-black/30 transition-[color,transform] duration-normal ease-emphasized group-hover:translate-x-0.5 group-hover:text-primary motion-reduce:group-hover:translate-x-0"
            >
              →
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
