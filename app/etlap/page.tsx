/**
 * Page: Étlap
 * Purpose: Mutassa be a teljes kínálatot, és vezesse a látogatót a rendelésig.
 * Sections: header, category grids, ordering
 * SEO: importance high, schema Menu + Breadcrumb
 * Performance goals: LCP <= 2500ms, CLS <= 0.1, INP <= 200ms
 */
import type { Metadata } from 'next';
import { PageHeader } from '@/components/sections/page-header';
import { PaperSection, Container } from '@/components/sections/surface';
import { ProductGrid } from '@/components/sections/product-grid';
import { OrderButtons } from '@/components/sections/order-buttons';
import { LocationSection } from '@/components/sections/location-section';
import { menuCategories } from '@/content/menu';
import { breadcrumbJsonLd, menuJsonLd } from '@/lib/seo/jsonld';
import { orderLinks } from '@/content/site';

export const metadata: Metadata = {
  title: 'Étlap — smash burgerek, köretek, italok',
  description:
    'A SmashR teljes étlapja: Classic Smash, House Smash, Crispy Bacon Smash és Crispy Chicken, Big méretben is, mellé loaded fries és mozzarella rudak. Árak és rendelés foodorán vagy Wolton.',
  alternates: { canonical: '/etlap' },
  openGraph: {
    url: '/etlap',
    title: 'SmashR étlap',
    description: 'Smash burgerek, köretek, szószok és italok — árakkal, rendelési lehetőséggel.',
  },
};

const breadcrumb = breadcrumbJsonLd([{ name: 'Étlap', path: '/etlap' }]);

export default function MenuPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(menuJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <PageHeader
        title="Étlap"
        watermark="SMASH"
        lead="Négy burger, néhány köret, két szósz. Rövid lista, mert így marad idő mindegyikre — és mert amit a lapra teszünk, azt aznap tesszük rá."
      >
        <OrderButtons size="md" />
      </PageHeader>

      <PaperSection ariaLabel="Étlap kategóriák">
        <Container>
          <nav aria-label="Ugrás kategóriához" className="mb-16">
            <ul className="flex flex-wrap gap-2">
              {menuCategories.map((category) => (
                <li key={category.id}>
                  <a
                    href={`#${category.id}`}
                    className="smashr-display inline-flex items-center border border-black/20 px-5 py-2.5 text-[0.7rem] tracking-[0.12em] transition-colors duration-fast hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {category.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-24">
            {menuCategories.map((category, index) => (
              <ProductGrid key={category.id} category={category} eager={index === 0} />
            ))}
          </div>

          <p className="mt-20 max-w-[70ch] border-t border-black/[0.12] pt-8 text-sm leading-relaxed text-black/50">
            Az árak és a kínálat a SmashR{' '}
            <a
              href={orderLinks.foodora.href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 transition-colors duration-fast hover:text-primary"
            >
              foodora
            </a>{' '}
            és{' '}
            <a
              href={orderLinks.wolt.href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 transition-colors duration-fast hover:text-primary"
            >
              Wolt
            </a>{' '}
            oldalán közzétett adatokból származnak, a termékfotók az étterem sajátjai. A
            kiszállítási árak platformonként eltérhetnek, és a rendelési oldalon frissülnek — a
            mindenkor érvényes ár ott olvasható.
          </p>
        </Container>
      </PaperSection>

      <LocationSection heading="Kiválasztottad? Vidd." tearInto="tile" />
    </>
  );
}
