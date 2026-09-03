'use client';

import { useRef } from 'react';
import { gsap, useGSAP, MOTION_QUERY } from '@/lib/motion/gsap';
import { Logo } from '@/components/ui/logo';
import { ButtonLink } from '@/components/ui/button';
import { ScrollCue } from '@/components/ui/scroll-cue';
import { PinMark, PlatformMark } from '@/components/ui/platform-mark';
import { responsiveImage, WIDTHS } from '@/lib/images/responsive';
import { directionsUrl, orderLinks, site } from '@/content/site';

const BASE = responsiveImage('/images/hero/tile-base', WIDTHS.hero);
const HIGHLIGHT = responsiveImage('/images/hero/tile-highlight', WIDTHS.hero);

/** Diameter of the lit area, in pixels. Wide enough to light several tiles, not the wall. */
const SPOT_SIZE = 760;

/** Per-frame easing toward the pointer. Lower is heavier; this lands around 0.35s of lag. */
const FOLLOW = 0.11;

/**
 * The home hero.
 *
 * The wall is two photographs of the same tiles — one matte, one wet-gloss — shot from the same
 * camera so they superimpose exactly. The gloss layer is not masked to the pointer; a full-screen
 * mask that moves every frame repaints the whole layer and drops frames on a large display.
 * Instead a circular window is *translated* over a counter-translated copy of the gloss image, so
 * the picture appears to stay nailed to the wall while only two transforms change per frame — both
 * of which the compositor can do without touching layout or paint.
 *
 * The window's soft edge is a static radial mask that never recomputes.
 *
 * Without a fine pointer the effect does not disappear, it changes hands: the light drifts across
 * the wall on its own so a phone still sees a living surface. Under reduced motion it parks.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const spot = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      const window_ = spot.current;
      const layer = inner.current;
      if (section === null || window_ === null || layer === null) {
        return;
      }

      // The gloss copy has to be exactly the size of the section for `cover` to frame it the same
      // way the base layer is framed. Measured rather than assumed: `100vw` includes the
      // scrollbar and would shift the two layers apart by its width.
      const measure = () => {
        const rect = section.getBoundingClientRect();
        section.style.setProperty('--hero-w', `${rect.width}px`);
        section.style.setProperty('--hero-h', `${rect.height}px`);
        return rect;
      };
      let bounds = measure();
      const observer = new ResizeObserver(() => {
        bounds = measure();
      });
      observer.observe(section);

      const media = gsap.matchMedia();

      media.add(
        {
          pointer: `${MOTION_QUERY} and (hover: hover) and (pointer: fine)`,
          drift: `${MOTION_QUERY} and (hover: none), ${MOTION_QUERY} and (pointer: coarse)`,
        },
        (context) => {
          const conditions = context.conditions as { pointer: boolean; drift: boolean };

          // Both branches write the same two numbers; only what moves them differs.
          const target = { x: bounds.width * 0.5, y: bounds.height * 0.42 };
          const current = { x: target.x, y: target.y };

          const setSpot = gsap.quickSetter(window_, 'css') as (vars: gsap.TweenVars) => void;
          const setLayer = gsap.quickSetter(layer, 'css') as (vars: gsap.TweenVars) => void;

          const paint = () => {
            setSpot({ x: current.x, y: current.y });
            // The counter-translation that pins the gloss image to the wall.
            setLayer({ x: SPOT_SIZE / 2 - current.x, y: SPOT_SIZE / 2 - current.y });
          };

          gsap.set(window_, { autoAlpha: 1 });
          paint();

          if (conditions.pointer) {
            const onMove = (event: PointerEvent) => {
              const rect = section.getBoundingClientRect();
              target.x = event.clientX - rect.left;
              target.y = event.clientY - rect.top;
            };
            section.addEventListener('pointermove', onMove);

            // Exponential smoothing scaled by the frame's own delta, so the lag feels the same at
            // 60Hz and at 144Hz rather than becoming twice as fast on a fast display.
            const follow = () => {
              const ratio = gsap.ticker.deltaRatio(60);
              const amount = 1 - (1 - FOLLOW) ** ratio;
              current.x += (target.x - current.x) * amount;
              current.y += (target.y - current.y) * amount;
              paint();
            };
            gsap.ticker.add(follow);

            return () => {
              section.removeEventListener('pointermove', onMove);
              gsap.ticker.remove(follow);
            };
          }

          // Touch: a slow figure that crosses the wall and comes back. Long enough that it reads
          // as light moving through the room, not as a loading animation.
          const drift = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: 'sine.inOut' } });
          drift
            .to(current, {
              x: () => bounds.width * 0.78,
              y: () => bounds.height * 0.3,
              duration: 6,
            })
            .to(current, {
              x: () => bounds.width * 0.24,
              y: () => bounds.height * 0.58,
              duration: 7,
            });
          gsap.ticker.add(paint);

          return () => {
            drift.kill();
            gsap.ticker.remove(paint);
          };
        },
      );

      // Reduced motion: the gloss is still there, parked and dimmer, so the wall keeps its depth
      // without anything on screen moving.
      media.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(window_, { autoAlpha: 0.55, x: bounds.width * 0.62, y: bounds.height * 0.34 });
        gsap.set(layer, {
          x: SPOT_SIZE / 2 - bounds.width * 0.62,
          y: SPOT_SIZE / 2 - bounds.height * 0.34,
        });
      });

      return () => {
        observer.disconnect();
        media.revert();
      };
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-label="SmashR"
      className="relative isolate flex h-full min-h-[100svh] flex-col overflow-hidden bg-black"
    >
      {/* The matte wall. Eager and high priority: it is the largest paint on the page. */}
      <img
        src={BASE.src}
        srcSet={BASE.srcSet}
        sizes="100vw"
        width={BASE.width}
        height={BASE.height}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        decoding="sync"
        className="absolute inset-0 -z-30 h-full w-full object-cover"
      />

      {/* The lit window. Hidden until the script positions it, so it never flashes centre-screen. */}
      <div
        ref={spot}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 -z-20 invisible opacity-0"
        style={{
          width: SPOT_SIZE,
          height: SPOT_SIZE,
          marginLeft: -SPOT_SIZE / 2,
          marginTop: -SPOT_SIZE / 2,
          WebkitMaskImage:
            'radial-gradient(circle at 50% 50%, #000 0%, #000 30%, rgb(0 0 0 / 0.55) 52%, transparent 74%)',
          maskImage:
            'radial-gradient(circle at 50% 50%, #000 0%, #000 30%, rgb(0 0 0 / 0.55) 52%, transparent 74%)',
        }}
      >
        <div
          ref={inner}
          className="absolute left-0 top-0"
          style={{
            width: 'var(--hero-w, 100vw)',
            height: 'var(--hero-h, 100svh)',
            backgroundImage: `image-set(url(${HIGHLIGHT.src}) 1x)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </div>

      {/* Legibility scrims. Two linear washes at the top and bottom edges, where the navigation,
          the buttons and the scroll cue actually sit — rather than one wash centred on the
          wordmark, which would dim the only part of the wall that needs no help. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-[38%] bg-gradient-to-b from-black/85 via-black/35 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-[48%] bg-gradient-to-t from-black/90 via-black/45 to-transparent"
      />

      <div className="relative flex flex-1 flex-col items-center justify-center px-[var(--smashr-gutter)] pb-28 pt-[calc(var(--smashr-nav-h)+6rem)] sm:pb-32 sm:pt-[calc(var(--smashr-nav-h)+8rem)]">
        <h1 className="w-full max-w-[min(50vw,54rem)] max-sm:max-w-[82vw]">
          <span className="sr-only">SmashR — {site.tagline} — smash burger Budapesten</span>
          <Logo tone="red" priority decorative className="w-full" />
        </h1>

        <p className="smashr-display mt-12 text-center text-[clamp(0.95rem,2.4vw,1.75rem)] tracking-[0.22em] text-white sm:mt-16">
          {site.tagline}
        </p>
      </div>

      <div className="relative flex flex-col items-center gap-8 pb-10 sm:gap-9 sm:pb-12">
        {/* Route planning first, then the two platforms in the order the venue prefers them. Each
            carries its own mark, so the destination is recognised before the word is read. */}
        <div className="flex flex-col items-center gap-3 px-[var(--smashr-gutter)] sm:flex-row sm:gap-4">
          <ButtonLink
            href={directionsUrl}
            external
            size="lg"
            className="w-full sm:w-auto"
            ariaLabel="Útvonaltervezés a SmashR-hez a Google Térképen, új lapon nyílik meg"
          >
            <PinMark />
            Útvonal
          </ButtonLink>
          <ButtonLink
            href={orderLinks.foodora.href}
            external
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto"
            ariaLabel="Rendelés a foodorán, új lapon nyílik meg"
          >
            <PlatformMark platform="foodora" />
            foodora
          </ButtonLink>
          <ButtonLink
            href={orderLinks.wolt.href}
            external
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto"
            ariaLabel="Rendelés a Wolton, új lapon nyílik meg"
          >
            <PlatformMark platform="wolt" />
            Wolt
          </ButtonLink>
        </div>

        <ScrollCue />
      </div>
    </section>
  );
}
