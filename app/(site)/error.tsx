'use client';

import { useEffect } from 'react';
import { TileSection, Container } from '@/components/sections/surface';
import { Button, ButtonLink } from '@/components/ui/button';
import { orderLinks } from '@/content/site';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the failure; replace with your monitoring client.
    console.error(error);
  }, [error]);

  return (
    <TileSection
      spacing="flush"
      className="flex min-h-[100svh] items-center pb-[var(--smashr-section-y)] pt-[calc(var(--smashr-nav-h)+var(--smashr-section-y))]"
      ariaLabel="Hiba történt"
    >
      <Container>
        <h1 className="smashr-display max-w-[20ch] text-[clamp(2rem,6vw,4rem)] text-white">
          Valami félrement.
        </h1>
        <p className="mt-6 max-w-[46ch] text-base leading-relaxed text-white/60 sm:text-lg">
          Az oldal betöltése közben hiba történt. Próbáld újra — ha rendelnél, a foodora közben is
          nyitva van.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button type="button" size="md" onClick={reset}>
            Újrapróbálkozás
          </Button>
          <ButtonLink href={orderLinks.foodora.href} external variant="secondary" size="md">
            Rendelés — foodora
          </ButtonLink>
        </div>
      </Container>
    </TileSection>
  );
}
