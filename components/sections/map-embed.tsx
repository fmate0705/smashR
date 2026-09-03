'use client';

import { useConsent } from '@/components/consent/consent-provider';
import { Button, ButtonLink } from '@/components/ui/button';
import { directionsUrl, mapEmbedUrl, site } from '@/content/site';

/**
 * The Google Maps embed, behind consent.
 *
 * An embedded map is a third-party frame that stores identifiers the moment it loads, so it is
 * not rendered until the functional purpose is allowed. Refusing is not a dead end: the address
 * and a route-planning link are shown in the map's place, which is the part a visitor actually
 * came for. The placeholder occupies the same box as the frame, so allowing it swaps content in
 * without moving anything below.
 */
export function MapEmbed() {
  const { allows, openWindow } = useConsent();

  return (
    // The frame always sits on a black plate, whatever the section around it is, so it carries the
    // dark ink pair itself — which is what keeps the refusal state's outlined button visible when
    // the surrounding surface is beige.
    <div className="relative aspect-[4/3] w-full overflow-hidden border border-white/[0.12] bg-white/[0.03] [--smashr-ground:0_0_0] [--smashr-ink:255_255_255] sm:aspect-[16/9] lg:aspect-[16/10]">
      {allows('functional') ? (
        <iframe
          src={mapEmbedUrl}
          title={`Térkép: ${site.name}, ${site.address.full}`}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-start justify-end gap-5 p-7 sm:p-9">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 opacity-25"
            style={{
              backgroundImage: 'url(/images/texture/tile-strip.webp)',
              backgroundSize: 'auto 55%',
            }}
          />
          <div>
            <p className="smashr-display text-xl text-white sm:text-2xl">{site.address.full}</p>
            <p className="mt-3 max-w-[42ch] text-sm leading-relaxed text-white/60">
              A beágyazott Google-térkép betöltése adatokat küld a Google felé, ezért csak a
              hozzájárulásod után jelenik meg. Útvonalat enélkül is tudsz tervezni.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={directionsUrl} external size="sm">
              Útvonaltervezés
            </ButtonLink>
            <Button type="button" variant="secondary" size="sm" onClick={openWindow}>
              Térkép engedélyezése
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
