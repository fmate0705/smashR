'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Logo } from '@/components/ui/logo';
import { HomeLink } from '@/components/site/home-link';
import { ButtonLink } from '@/components/ui/button';
import { PinMark } from '@/components/ui/platform-mark';
import { Container } from '@/components/sections/surface';
import { directionsUrl, navigation, orderLinks } from '@/content/site';
import { cn } from '@/lib/cn';

/** How far the page must move before the header commits to its solid state. */
const SOLID_AFTER_PX = 40;

/**
 * The site header.
 *
 * Two states. Over the hero it is invisible furniture — no bar, no edge, just the mark and the
 * links sitting on the wall. Once the page moves it collects into a bar of its own: an inset
 * black container with a defined edge, floating over whatever section is passing underneath.
 * That is what keeps it legible over beige, paper and tile without a colour for each.
 *
 * Only the container's background, blur, border and inset change between the states — the links
 * themselves never move, because a nav whose items shift as you scroll past them is a nav you
 * cannot click.
 */
export function Navbar() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > SOLID_AFTER_PX);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // A route change closes the panel: the destination has rendered, so leaving the menu covering
  // it would hide the thing the visitor just asked for.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // While the panel covers the page, the page behind it must not scroll and Escape must close it.
  useEffect(() => {
    if (!open) {
      return;
    }
    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    panelRef.current?.querySelector<HTMLElement>('a, button')?.focus();

    return () => {
      body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const isCurrent = useCallback(
    (href: string) => pathname === href || pathname.startsWith(`${href}/`),
    [pathname],
  );

  const contained = solid || open;

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[padding] duration-normal ease-emphasized',
        contained ? 'pt-3 sm:pt-4' : 'pt-0',
      )}
    >
      <Container width="wide">
        <div
          className={cn(
            'transition-[background-color,border-color,padding]',
            'duration-normal ease-emphasized',
            contained
              ? 'border border-white/[0.14] bg-black px-4 sm:px-5'
              : 'border border-transparent bg-transparent px-0',
          )}
        >
          <div className="flex h-[var(--smashr-nav-h)] items-center justify-between gap-6">
            <HomeLink className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-black">
              <Logo tone="red" priority className="w-[7.5rem] sm:w-[8.5rem]" decorative />
            </HomeLink>

            <nav aria-label="Főmenü" className="hidden lg:block">
              <ul className="flex items-center gap-8">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isCurrent(item.href) ? 'page' : undefined}
                      className={cn(
                        'smashr-display relative py-2 text-[0.76rem] tracking-[0.1em]',
                        'transition-colors duration-fast hover:text-primary',
                        'focus-visible:outline-none focus-visible:text-primary',
                        'after:absolute after:inset-x-0 after:bottom-0 after:h-[2px]',
                        'after:origin-left after:scale-x-0 after:bg-primary',
                        'after:transition-transform after:duration-normal after:ease-emphasized',
                        'hover:after:scale-x-100 motion-reduce:after:transition-none',
                        isCurrent(item.href) ? 'text-primary after:scale-x-100' : 'text-white',
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-2">
              {/* Route planning is the primary action in the header: someone who has scrolled this
                  far is usually deciding whether to come in, not what to order. */}
              <ButtonLink
                href={directionsUrl}
                external
                size="sm"
                className="hidden sm:inline-flex"
                ariaLabel="Útvonaltervezés a Google Térképen, új lapon nyílik meg"
              >
                <PinMark />
                <span className="hidden xl:inline">Útvonal</span>
              </ButtonLink>

              <ButtonLink
                href={orderLinks.foodora.href}
                external
                variant="secondary"
                size="sm"
                className="hidden sm:inline-flex"
                ariaLabel="Rendelés a foodorán, új lapon nyílik meg"
              >
                foodora
              </ButtonLink>

              <ButtonLink
                href={orderLinks.wolt.href}
                external
                variant="secondary"
                size="sm"
                className="hidden sm:inline-flex"
                ariaLabel="Rendelés a Wolton, új lapon nyílik meg"
              >
                Wolt
              </ButtonLink>

              <button
                ref={toggleRef}
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                className={cn(
                  'ml-1 flex h-11 w-11 items-center justify-center border border-white/25',
                  'text-white transition-colors duration-fast hover:border-primary',
                  'hover:text-primary focus-visible:outline-none focus-visible:ring-2',
                  'focus-visible:ring-primary lg:hidden',
                )}
              >
                <span className="sr-only">{open ? 'Menü bezárása' : 'Menü megnyitása'}</span>
                <MenuIcon open={open} />
              </button>
            </div>
          </div>

          <MobileMenu ref={panelRef} open={open} isCurrent={isCurrent} />
        </div>
      </Container>
    </header>
  );
}

/** Two bars that cross into an X. Drawn, not swapped, so the state change reads as one motion. */
function MenuIcon({ open }: { open: boolean }) {
  const bar =
    'absolute h-[2px] w-5 bg-current transition-transform duration-normal ease-emphasized motion-reduce:transition-none';
  return (
    <span aria-hidden="true" className="relative flex h-5 w-5 items-center justify-center">
      <span className={cn(bar, open ? 'translate-y-0 rotate-45' : '-translate-y-[5px]')} />
      <span className={cn(bar, open ? 'translate-y-0 -rotate-45' : 'translate-y-[5px]')} />
    </span>
  );
}

interface MobileMenuProps {
  readonly open: boolean;
  readonly isCurrent: (href: string) => boolean;
  readonly ref: React.Ref<HTMLDivElement>;
}

/**
 * The mobile panel.
 *
 * Always in the DOM and collapsed with `grid-template-rows`, which animates smoothly from zero to
 * content height without needing a measured pixel value — and `invisible` plus `pointer-events-none`
 * keep the collapsed panel out of the tab order rather than leaving offscreen links focusable.
 */
function MobileMenu({ open, isCurrent, ref }: MobileMenuProps) {
  return (
    <div
      id="mobile-menu"
      ref={ref}
      className={cn(
        'grid overflow-hidden lg:hidden',
        'transition-[grid-template-rows,opacity] duration-normal ease-emphasized',
        'motion-reduce:transition-none',
        open
          ? 'grid-rows-[1fr] border-t border-white/10 opacity-100'
          : 'pointer-events-none invisible grid-rows-[0fr] opacity-0',
      )}
    >
      <div className="min-h-0">
        <nav aria-label="Mobil menü" className="py-7">
          <ul className="flex flex-col">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isCurrent(item.href) ? 'page' : undefined}
                  className={cn(
                    'smashr-display block border-b border-white/10 py-4 text-2xl',
                    'transition-colors duration-fast focus-visible:outline-none',
                    'focus-visible:text-primary sm:text-3xl',
                    isCurrent(item.href) ? 'text-primary' : 'text-white hover:text-primary',
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-col gap-2.5">
            <ButtonLink href={directionsUrl} external size="md">
              <PinMark />
              Útvonal
            </ButtonLink>
            <ButtonLink href={orderLinks.foodora.href} external variant="secondary" size="md">
              foodora
            </ButtonLink>
            <ButtonLink href={orderLinks.wolt.href} external variant="secondary" size="md">
              Wolt
            </ButtonLink>
          </div>
        </nav>
      </div>
    </div>
  );
}
