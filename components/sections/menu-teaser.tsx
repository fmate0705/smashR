import Link from 'next/link';
import { PaperSection, Container } from '@/components/sections/surface';
import { ProductCard } from '@/components/sections/product-card';
import { Reveal } from '@/components/motion';
import { getFeaturedItems } from '@/lib/store/content';

/**
 * The four items the kitchen leads with, on the way to the full menu.
 *
 * A landing page that lists seventeen products has stopped being a landing page. This shows the
 * shortlist and then gets out of the way — the link to `/etlap` is the point of the section, not
 * an afterthought at the bottom of it.
 */
export async function MenuTeaser() {
  const featured = await getFeaturedItems();

  return (
    <PaperSection ariaLabelledBy="kiemelt-cim">
      <Container>
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="kiemelt-cim"
              className="smashr-display text-balance text-[clamp(2.25rem,5.5vw,4.25rem)]"
            >
              Amit a legtöbben visznek
            </h2>
            <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-black/60 sm:text-lg">
              Négy burger, néhány köret, két szósz. Rövid étlap, mert így marad idő mindegyikre.
            </p>
          </div>
          <Link
            href="/etlap"
            className="smashr-display group inline-flex shrink-0 items-center gap-3 border-b-2 border-black pb-2 text-sm tracking-[0.12em] transition-colors duration-fast hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:text-primary"
          >
            Teljes étlap
            <span
              aria-hidden="true"
              className="transition-transform duration-normal ease-emphasized group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
            >
              →
            </span>
          </Link>
        </Reveal>

        <Reveal as="ul" mode="item" className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </Reveal>
      </Container>
    </PaperSection>
  );
}
