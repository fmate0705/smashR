import type { Metadata } from 'next';

/**
 * The admin shell.
 *
 * Deliberately plain. This is a tool, not a brand surface: the restaurant opens it to change a
 * price, and every flourish between them and the field they came for is a cost. It borrows the
 * site's type and colour tokens so it does not look like a different product, and nothing else.
 *
 * `noindex, nofollow` and no sitemap entry — the admin is reachable, never findable.
 */
export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[rgb(var(--smashr-paper))] text-black">{children}</div>;
}
