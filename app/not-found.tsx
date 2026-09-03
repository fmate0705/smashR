import Link from 'next/link';
import { TileSection, Container } from '@/components/sections/surface';
import { ButtonLink } from '@/components/ui/button';
import { navigation } from '@/content/site';

export default function NotFound() {
  return (
    <TileSection
      spacing="flush"
      className="flex min-h-[100svh] items-center pb-[var(--smashr-section-y)] pt-[calc(var(--smashr-nav-h)+var(--smashr-section-y))]"
      ariaLabel="Az oldal nem található"
    >
      <Container>
        <p className="smashr-display text-[clamp(5rem,20vw,14rem)] leading-[0.8] text-primary">
          404
        </p>
        <h1 className="smashr-display mt-6 max-w-[18ch] text-[clamp(1.75rem,5vw,3.25rem)] text-white">
          Ez a lap üresen maradt.
        </h1>
        <p className="mt-6 max-w-[46ch] text-base leading-relaxed text-white/60 sm:text-lg">
          A keresett oldal nem létezik, vagy áthelyeztük. Az étlap viszont a helyén van.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/etlap" size="md">
            Étlap
          </ButtonLink>
          <ButtonLink href="/" variant="secondary" size="md">
            Vissza a főoldalra
          </ButtonLink>
        </div>

        <nav aria-label="Oldalak" className="mt-14 border-t border-white/[0.12] pt-8">
          <ul className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
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
