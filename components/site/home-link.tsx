'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/**
 * The wordmark's link home.
 *
 * On any other page it is an ordinary link. On the home page itself there is nowhere to navigate
 * to, and letting the router run anyway did two things a visitor did not ask for: it left the
 * scroll position exactly where it was — so the click appeared to do nothing — and it moved focus
 * to the top of the document, which surfaced the skip link over the header. This scrolls back to
 * the hero instead, which is what clicking a wordmark is supposed to mean.
 *
 * The scroll is smooth unless the visitor has asked for less motion, in which case it jumps.
 */
export function HomeLink({ className, children }: { className?: string; children: ReactNode }) {
  const pathname = usePathname();

  return (
    <Link
      href="/"
      className={className}
      aria-label="SmashR — vissza a főoldalra"
      onClick={(event) => {
        if (pathname !== '/') {
          return;
        }
        event.preventDefault();
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
      }}
    >
      {children}
    </Link>
  );
}
