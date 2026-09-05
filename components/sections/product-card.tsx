import { SmashImage } from '@/components/ui/smash-image';
import { WIDTHS } from '@/lib/images/responsive';
import type { ImageKey } from '@/lib/images/manifest';
import { formatPrice, type MenuItem } from '@/content/menu';
import { orderLinks } from '@/content/site';
import { cn } from '@/lib/cn';

/**
 * One item on the menu.
 *
 * Two shapes, decided by whether the venue actually has a photograph of the item. Where it does,
 * the photo leads. Where it does not — the Wolt-only triple-patty sizes — the card becomes
 * typographic rather than borrowing a picture of the smaller burger, because a menu photo that
 * is not the dish is a promise the kitchen cannot keep.
 *
 * The whole card is a link to the platform that sells it, and the accessible name carries the
 * item, the price and the destination so it is unambiguous out of context.
 */
export function ProductCard({
  item,
  priority = false,
}: {
  readonly item: MenuItem;
  /** Set on the cards that are already on screen at load. Everything else stays lazy. */
  readonly priority?: boolean;
}) {
  const woltOnly = !item.channels.includes('foodora');
  const href = woltOnly ? orderLinks.wolt.href : orderLinks.foodora.href;
  const platform = woltOnly ? 'Wolton' : 'a foodorán';

  return (
    <li className="group relative flex">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${item.name}, ${formatPrice(item.price)} — megrendelés ${platform}, új lapon nyílik meg`}
        className={cn(
          'flex w-full flex-col border border-black/[0.12] bg-white/70 transition-[transform,border-color,box-shadow]',
          'duration-normal ease-emphasized hover:-translate-y-1 hover:border-primary/60',
          'hover:shadow-[0_18px_40px_-24px_rgb(0_0_0/0.55)] focus-visible:outline-none',
          'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          'focus-visible:ring-offset-[rgb(var(--smashr-paper))] motion-reduce:hover:translate-y-0',
        )}
      >
        {item.image === undefined ? (
          <TypeFace name={item.name} />
        ) : (
          <div className="relative overflow-hidden bg-black/5">
            <SmashImage
              base={item.image as ImageKey}
              widths={WIDTHS.menu}
              sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 88vw"
              alt={item.imageAlt ?? item.name}
              priority={priority}
              className={cn(
                'aspect-square object-cover object-center transition-transform duration-slow',
                'ease-emphasized group-hover:scale-[1.04] motion-reduce:group-hover:scale-100',
              )}
            />
          </div>
        )}

        {/* Name, then description, then a rule and the price. Setting the price on its own line
            rather than beside the name is what keeps a four-word product from crushing it into a
            column two characters wide — every card's price now lands on the same baseline. */}
        <div className="flex flex-1 flex-col gap-3 p-6">
          <h3 className="smashr-display text-balance text-base leading-tight sm:text-lg">
            {item.name}
          </h3>

          {item.description === undefined ? null : (
            <p className="text-sm leading-relaxed text-black/60">{item.description}</p>
          )}

          <div className="mt-auto flex items-end justify-between gap-4 border-t border-black/[0.12] pt-4">
            <p className="smashr-display whitespace-nowrap text-base text-primary sm:text-lg">
              {formatPrice(item.price)}
              {item.priceFrom ? (
                <span className="ml-1 text-[0.68rem] tracking-[0.1em] text-black/40">-tól</span>
              ) : null}
            </p>
            <p className="whitespace-nowrap text-right text-[0.6rem] uppercase leading-snug tracking-[0.05em] text-black/40">
              {woltOnly ? 'Csak Wolton' : 'foodora · Wolt'}
              {item.deposit === undefined ? null : (
                <span className="block">{formatPrice(item.deposit)} betét</span>
              )}
            </p>
          </div>
        </div>
      </a>
    </li>
  );
}

/**
 * The stand-in for an item with no photograph: the name set large on black, which is the brand's
 * own furniture rather than an apology for a missing image.
 */
function TypeFace({ name }: { name: string }) {
  return (
    <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-black p-8">
      <span
        aria-hidden="true"
        className="absolute inset-0 opacity-45"
        style={{
          backgroundImage: 'url(/images/texture/tile-strip.webp)',
          backgroundSize: 'auto 34%',
        }}
      />
      <span className="smashr-display relative text-center text-2xl leading-[0.95] text-white sm:text-3xl">
        {name}
      </span>
    </div>
  );
}
