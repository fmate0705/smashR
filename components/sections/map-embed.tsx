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
    // An offset red rule rather than a plate, matching the story photographs — the map is a
    // picture on the surface, not an object sitting on a tray. The frame keeps the dark ink pair
    // so the refusal state's outlined button stays visible over the dark placeholder.
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute -bottom-4 -right-4 h-full w-full border-2 border-primary sm:-bottom-6 sm:-right-6"
      />
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-black [--smashr-ground:0_0_0] [--smashr-ink:255_255_255] sm:aspect-[16/10] lg:aspect-[16/9]">
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
    </div>
  );
}
