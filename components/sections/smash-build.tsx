'use client';

import { useRef } from 'react';
import { gsap, useGSAP, MOTION_QUERY } from '@/lib/motion/gsap';
import { type ImageKey } from '@/lib/images/manifest';
import { responsiveImage, WIDTHS } from '@/lib/images/responsive';
import { cn } from '@/lib/cn';

/**
 * The scroll-built burger.
 *
 * Each component of the burger is its own cut-out photograph, shot from one camera against one
 * light so the stack reads as a single object. The build is assembled in the DOM rather than
 * played back as a video: a video cannot be scrubbed frame-accurately across browsers, costs
 * megabytes, and cannot be pinned to a layout that reflows. Five transformed images can.
 *
 * `assembled` is where a layer sits in the finished burger, as a percentage of the stage. That is
 * the only position declared: where each part *starts* is measured from the finished layout at
 * runtime, so the fall is always exactly as long as it needs to be. Every value is a transform —
 * nothing here animates a layout property, so the whole build runs on the compositor.
 */
interface BurgerLayer {
  readonly src: ImageKey;
  readonly alt: string;
  /** Layer width as a percentage of the stage width. Real burgers are not all one width. */
  readonly width: number;
  /** Top edge of the layer in the finished burger, as a percentage of the stage height. */
  readonly assembled: number;
}

/**
 * Top of the burger first in the array, bottom last — the order the finished stack reads in.
 * The timeline plays it backwards, so the bottom bun is laid down first and the crown lands last.
 */
const LAYERS: readonly BurgerLayer[] = [
  { src: '/images/burger/layer-bun-top', alt: '', width: 84, assembled: 12 },
  { src: '/images/burger/layer-patty-a', alt: '', width: 88, assembled: 26 },
  { src: '/images/burger/layer-patty-b', alt: '', width: 90, assembled: 33 },
  // Narrower than the patties it sits under, which also makes it shorter: the cut-out's ink box is
  // as tall as the lettuce hangs, and that height is what was holding the base away from the stack.
  { src: '/images/burger/layer-veg', alt: '', width: 88, assembled: 42 },
  // The one gap that stays open. The base is the first part down and therefore the bottom layer,
  // and the lettuce above it hangs far enough to hide it entirely if it sits any closer.
  { src: '/images/burger/layer-bun-bottom', alt: '', width: 84, assembled: 70 },
];

/**
 * What the stage actually measures, breakpoint by breakpoint — the container's max width times the
 * tilt scale times the widest layer. Written out rather than approximated in `vw` because the
 * stage is a fixed measure at every breakpoint, not a fraction of the viewport, and a `vw` guess
 * here is how a phone ends up downloading the desktop file.
 */
const LAYER_SIZES =
  '(min-width: 1024px) 30rem, (min-width: 768px) 22rem, (min-width: 640px) 18rem, 13rem';

/** How far above its landing spot a layer starts, as a multiple of its own height. */
const DROP_CLEARANCE = 1.25;

/** The headline, revealed one line at a time as the burger comes together. */
const LINES = [
  { text: 'Nem formázzuk.', tone: 'ink' },
  { text: 'Lenyomjuk.', tone: 'ink' },
  { text: 'A széle ropog.', tone: 'ink' },
  { text: 'A közepe szaftos.', tone: 'red' },
] as const;

export function SmashBuild() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      // One branch at every width. The drop distance is measured from the layout rather than
      // declared, so a narrow stage produces a proportionally shorter fall on its own — there is
      // nothing left for a breakpoint to correct.
      media.add(MOTION_QUERY, () => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            // Two and a half viewports of scroll for the build. Shorter and the layers snap
            // together before the eye can follow one down; longer and it becomes a chore.
            end: '+=250%',
            scrub: 0.6,
            pin: '[data-pin]',
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // The stack is built the way one is built on the pass: the bottom bun is laid down
        // first and every part after it comes down from above onto the one below. `from: 'end'`
        // plays the array backwards, and the array is ordered top-of-burger first.
        //
        // The drop distance is measured per layer rather than declared, because each part sits
        // at a different height in the stack and has a different thickness — a single offset
        // would leave the crown starting inside the frame and the base starting a screen away.
        // `offsetTop` is read against the tilted wrapper, so a part falls along the burger's own
        // axis rather than straight down past it.
        const dropFrom = (_index: number, target: HTMLElement) =>
          -(target.offsetTop + target.offsetHeight * DROP_CLEARANCE);

        const stagger = { each: 0.2, from: 'end' } as const;

        timeline.fromTo(
          '[data-layer]',
          { y: dropFrom },
          { y: 0, ease: 'power2.out', duration: 1, stagger },
          0,
        );

        // The fade runs as its own tween, a third as long as the fall. A part is solid well before
        // it lands, so the eye follows an object dropping rather than an image resolving — GSAP
        // has no per-property duration, so this is a second tween rather than an option.
        timeline.fromTo(
          '[data-layer]',
          { autoAlpha: 0 },
          { autoAlpha: 1, ease: 'power1.out', duration: 0.32, stagger },
          0,
        );

        // The lines fill across the same range, so the last word lands as the bun does.
        timeline.fromTo(
          '[data-fill]',
          { clipPath: 'inset(0 100% 0 0)' },
          {
            clipPath: 'inset(0 0% 0 0)',
            ease: 'none',
            duration: 0.62,
            stagger: 0.42,
          },
          0.1,
        );

        return () => timeline.kill();
      });

      return () => media.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative">
      <div
        data-pin
        className={cn(
          'flex min-h-[100svh] flex-col justify-center',
          'px-[var(--smashr-gutter)] py-20 lg:py-24',
        )}
      >
        {/* One column below the desktop breakpoint, but narrowed to an editorial measure rather than
            left to sprawl: on a tablet a full-width single column leaves the type stranded on the
            left of an empty 834px row. */}
        <div className="mx-auto grid w-full max-w-[42rem] items-center gap-10 sm:gap-12 lg:max-w-[82rem] lg:grid-cols-[1fr_0.95fr] lg:gap-16">
          <div className="order-2 lg:order-1">
            <h2 className="smashr-display smashr-display-xl text-[clamp(1.85rem,3.7vw,3.5rem)]">
              {LINES.map((line) => (
                <span key={line.text} className="smashr-karaoke-line">
                  {/* The unfilled state is legible on its own — a visitor who never scrolls, or
                      whose script never runs, still reads the whole sentence. */}
                  <span aria-hidden="true" className="text-black/25">
                    {line.text}
                  </span>
                  <span
                    data-fill
                    aria-hidden="true"
                    className={cn(
                      'smashr-karaoke-fill',
                      line.tone === 'red' ? 'text-primary' : 'text-black',
                    )}
                  >
                    {line.text}
                  </span>
                  <span className="sr-only">{line.text} </span>
                </span>
              ))}
            </h2>

            <p className="mt-8 max-w-[46ch] text-base leading-relaxed text-black/70 sm:text-lg">
              A smash nem stílus, hanem módszer. A friss marhagolyó a forró lapra kerül, egyszer
              lenyomjuk, és a hús karamellizálódó kérget kap. Ez adja a ropogós szélt és a szaftos
              közepet — minden egyes burgernél, minden nap.
            </p>
          </div>

          <div className="order-1 lg:order-2">
            <BurgerStage />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * The stage the layers move inside.
 *
 * Square by declaration, so its height is known before any image loads and the pinned section's
 * scroll distance never changes underneath the trigger. Each layer is positioned by percentage of
 * that square, which is what keeps the build identical at every viewport width.
 *
 * The inner frame carries the tilt. Putting the rotation on the parent rather than on each layer
 * means the parts fall along the burger's own axis — they arrive on the stack rather than across
 * it — and it keeps GSAP's transform on the layers to a single translated value.
 */
function BurgerStage() {
  return (
    <div
      // Below the two-column breakpoint the stack sits directly above the headline, so the stage
      // clips: a part on its way in slides out of the square rather than across the type. At
      // desktop widths there is room on both sides and the clip is dropped, so the crown can be
      // seen coming down from outside the frame.
      className="relative mx-auto aspect-square w-full max-w-[17rem] overflow-hidden sm:max-w-[22rem] md:max-w-[26rem] lg:max-w-[34rem] lg:overflow-visible"
      role="img"
      aria-label="Egy SmashR burger rétegei: alsó bucka házi szósszal, saláta, paradicsom és lilahagyma, két smashelt marhahúspogácsa olvadt cheddar sajttal, felül a pirított bucka."
    >
      {/* The tilt, and the scale that keeps a rotated square inside its own box. */}
      <div className="absolute inset-0 rotate-[10deg] scale-[0.78] lg:scale-[0.92]">
        {LAYERS.map((layer, index) => {
          const image = responsiveImage(layer.src, WIDTHS.burgerLayer);
          return (
            <img
              key={layer.src}
              data-layer
              src={image.src}
              srcSet={image.srcSet}
              sizes={LAYER_SIZES}
              width={image.width}
              height={image.height}
              alt={layer.alt}
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              // Centred with a negative margin rather than a translate: GSAP owns the transform on
              // these elements, and a Tailwind `-translate-x-1/2` would be overwritten the moment
              // the timeline sets y.
              className="absolute left-1/2 h-auto will-change-transform"
              style={{
                width: `${layer.width}%`,
                marginLeft: `${-layer.width / 2}%`,
                top: `${layer.assembled}%`,
                // Whatever is laid down last sits on top. The array runs crown-first and the
                // timeline plays it backwards, so reversing the index gives the crown — the last
                // part to arrive — the highest layer, and the base the lowest.
                zIndex: LAYERS.length - index,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
