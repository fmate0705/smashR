import Link from 'next/link';
import { TileSection, Container } from '@/components/sections/surface';
import { ButtonLink } from '@/components/ui/button';
import { navigation } from '@/content/site';

/**
 * The body of the 404, without any chrome around it.
 *
 * Two routes render this. `app/not-found.tsx` catches a URL that matches nothing at all and is
 * wrapped by the root layout alone, so it draws the site's chrome itself; `app/(site)/not-found.tsx`
 * catches a `notFound()` thrown inside the site and is already inside the chrome. Both are needed:
 * without the second, a `notFound()` from a page in the group unwinds to the root boundary and the
 * response comes back HTTP 200 with the 404 drawn inside it — a soft 404, which a crawler indexes.
 *
 * Centred, unlike every other page on the site, which sets its type against the left edge. Nothing
 * here competes for the space — no photograph, no second column — so the left-aligned version left
 * the whole right half of a desktop window empty and read as a page that had failed to load rather
 * than one that meant it.
 */
export function NotFoundContent() {
  return (
    <TileSection
      spacing="flush"
      className="flex min-h-[100svh] items-center pb-[var(--smashr-section-y)] pt-[calc(var(--smashr-nav-h)+var(--smashr-section-y))]"
      ariaLabel="Az oldal nem található"
    >
      <Container className="flex max-w-[46rem] flex-col items-center text-center">
        <p className="smashr-display text-[clamp(5rem,20vw,14rem)] leading-[0.8] text-primary">
          404
        </p>
        <h1 className="smashr-display mt-6 max-w-[18ch] text-balance text-[clamp(1.75rem,5vw,3.25rem)] text-white">
          Ez a lap üresen maradt.
        </h1>
        <p className="mt-6 max-w-[46ch] text-balance text-base leading-relaxed text-white/60 sm:text-lg">
          A keresett oldal nem létezik, vagy áthelyeztük. Az étlap viszont a helyén van.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <ButtonLink href="/etlap" size="md">
            Étlap
          </ButtonLink>
          <ButtonLink href="/" variant="secondary" size="md">
            Vissza a főoldalra
          </ButtonLink>
        </div>

        <nav aria-label="Oldalak" className="mt-14 w-full border-t border-white/[0.12] pt-8">
          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-white/55 underline underline-offset-4 transition-colors duration-fast hover:text-white focus-visible:outline-none focus-visible:text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </TileSection>
  );
}
