import { ProductCard } from '@/components/sections/product-card';
import { Reveal } from '@/components/motion';
import type { MenuCategory, MenuItem } from '@/content/menu';
import { cn } from '@/lib/cn';

interface ProductGridProps {
  readonly category: MenuCategory;
  /** The category's items. Passed in so one page render performs one store read, not six. */
  readonly items: readonly MenuItem[];
  /**
   * The first grid on a page is already on screen when it loads. Animating it in means the
   * visitor watches their own content arrive, and its photographs are the largest paint — so it
   * renders finished, and its images load eagerly instead of waiting for a scroll that has
   * already happened.
   */
  readonly eager?: boolean;
}

/**
 * One menu category: its name, its one-line lead, and its items.
 *
 * The heading is linked to the list with `aria-labelledby` so a screen reader announces the
 * category when it enters the list, rather than reading seventeen products as one flat run.
 */
export function ProductGrid({ category, items, eager = false }: ProductGridProps) {
  if (items.length === 0) {
    return null;
  }

  const headingId = `kategoria-${category.id}`;
  const gridClass = cn(
    'mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3',
    items.length >= 4 && 'xl:grid-cols-4',
  );
  const cards = items.map((item, index) => (
    <ProductCard key={item.id} item={item} priority={eager && index < 4} />
  ));

  return (
    <section aria-labelledby={headingId} className="scroll-mt-32" id={category.id}>
      <div className="flex flex-col gap-3 border-b-2 border-black pb-5">
        <h2 id={headingId} className="smashr-display text-balance text-[clamp(1.9rem,4.4vw,3rem)]">
          {category.name}
        </h2>
        <p className="max-w-[58ch] text-sm leading-relaxed text-black/60 sm:text-base">
          {category.lead}
        </p>
      </div>

      {eager ? (
        <ul className={gridClass}>{cards}</ul>
      ) : (
        <Reveal as="ul" mode="item" className={gridClass}>
          {cards}
        </Reveal>
      )}
    </section>
  );
}
