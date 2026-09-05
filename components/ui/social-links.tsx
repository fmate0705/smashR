import { socialLinks } from '@/content/site';
import { cn } from '@/lib/cn';

/**
 * The brand glyphs, drawn rather than pulled from an icon set: three marks do not justify a
 * dependency, and hand-placed paths let every glyph fill the same 24-unit box so none of them
 * sits high, low or small next to the others — which is what an off-the-shelf mix usually does.
 *
 * They are set directly rather than inside a bordered circle: two of these marks are round
 * already, and a circle inside a circle reads as a mistake.
 */
export const SOCIAL_GLYPHS: Record<string, React.ReactNode> = {
  instagram: (
    <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.42.56.21.96.47 1.38.9.42.41.68.81.9 1.37.16.43.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.43.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.43-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.37.42-.43.82-.69 1.38-.9.43-.17 1.06-.37 2.23-.42C8.42 2.17 8.8 2.16 12 2.16Zm0 3.68a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0ZM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.13 1.38A5.9 5.9 0 0 0 .63 4.14c-.3.77-.5 1.64-.56 2.91C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.28.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13a5.9 5.9 0 0 0 2.13 1.38c.77.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.28-.06 2.15-.26 2.91-.56a5.9 5.9 0 0 0 2.13-1.38 5.9 5.9 0 0 0 1.38-2.13c.3-.76.5-1.63.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.14-.56-2.91a5.9 5.9 0 0 0-1.38-2.13A5.9 5.9 0 0 0 19.86.63c-.76-.3-1.63-.5-2.91-.56C15.67.01 15.26 0 12 0Z" />
  ),
  tiktok: (
    <path d="M12.53.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97a10.2 10.2 0 0 1-1.62-.93c-.01 2.92.01 5.84-.02 8.75a7.66 7.66 0 0 1-1.35 3.94 7.5 7.5 0 0 1-5.91 3.21 7.34 7.34 0 0 1-4.08-1.03A7.6 7.6 0 0 1 1.6 17.25c-.02-.5-.03-1-.01-1.49a7.6 7.6 0 0 1 2.58-4.96 7.36 7.36 0 0 1 6.15-1.72c.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87a3.35 3.35 0 0 0 2.77-1.61c.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07Z" />
  ),
  facebook: (
    <path d="M9.39 23.5V13H5.86V9.03h3.53V6.2C9.39 2.7 11.52.8 14.65.8c1.5 0 2.79.11 3.16.16v3.66h-2.17c-1.7 0-2.03.81-2.03 2v2.41h4.06L17.14 13h-3.53v10.5H9.39Z" />
  ),
};

interface SocialLinksProps {
  readonly className?: string;
  readonly size?: 'sm' | 'md';
}

/**
 * Only channels this project could verify are actually SmashR's. An invented profile link is
 * worse than a missing one: it sends a customer to a stranger.
 */
export function SocialLinks({ className, size = 'md' }: SocialLinksProps) {
  // Read as a plain array: the literal tuple in `content/site` would otherwise let TypeScript
  // decide the length can never change, and this list is expected to grow.
  const links: readonly { id: string; label: string; href: string }[] = socialLinks;
  if (links.length === 0) {
    return null;
  }

  return (
    <ul className={cn('flex items-center gap-5', className)}>
      {links.map((link) => (
        <li key={link.id}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer me"
            className={cn(
              'block text-current opacity-60 transition-[color,opacity,transform]',
              'duration-fast ease-emphasized hover:-translate-y-0.5 hover:text-primary',
              'hover:opacity-100 focus-visible:text-primary focus-visible:opacity-100',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
              'focus-visible:ring-offset-4 focus-visible:ring-offset-[rgb(var(--smashr-ground))]',
              'motion-reduce:hover:translate-y-0',
            )}
          >
            <span className="sr-only">{link.label}</span>
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className={size === 'sm' ? 'h-[1.15rem] w-[1.15rem]' : 'h-6 w-6'}
            >
              {SOCIAL_GLYPHS[link.id]}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
