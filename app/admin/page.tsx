import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { readSession } from '@/lib/auth/session';
import { operator, operatorFields } from '@/lib/env';
import { readContent } from '@/lib/store/store';
import { menuCategories } from '@/content/menu';
import { signOut } from './actions';
import { ContactForm } from './contact-form';
import { FeaturedForm } from './featured-form';
import { MenuForm } from './menu-form';
import { SubmitButton } from './ui';

/**
 * The admin.
 *
 * Rendered live and guarded here *and* in every action it submits to: this check decides what is
 * drawn, the checks in the actions decide what is allowed, and only the second kind is a control.
 *
 * Everything on this page is content the kitchen changes — prices, hours, what leads the home
 * page. The operator's own details are shown but not editable: they come from the environment,
 * they are set once at handover, and the panel's job is only to say which variable is still empty.
 */
export const dynamic = 'force-dynamic';

/**
 * A title but no canonical: the layout's `noindex` already says this page is not part of the
 * site's index, and a canonical URL on a page you have asked search engines to ignore is a
 * contradiction, not a completeness.
 */
export const metadata: Metadata = { title: 'Vezérlőpult' };

const SECTIONS = [
  { id: 'elerhetoseg', title: 'Elérhetőség' },
  { id: 'kiemelt', title: 'Kiemelt termékek' },
  { id: 'etlap', title: 'Étlap' },
  { id: 'uzemelteto', title: 'Üzemeltetői adatok' },
];

export default async function AdminPage() {
  const session = await readSession();
  if (session === null) {
    redirect('/admin/login');
  }

  const content = await readContent();
  const categoryName = new Map(menuCategories.map((category) => [category.id, category.name]));
  const operatorValues = operator();

  const options = content.menu
    .filter((item) => item.visible)
    .map((item) => ({
      id: item.id,
      name: item.name,
      category: categoryName.get(item.category) ?? item.category,
    }));

  return (
    <div className="mx-auto w-full max-w-[70rem] px-6 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-black/15 pb-6">
        <div>
          <h1 className="smashr-display text-3xl">SmashR admin</h1>
          <p className="mt-1 text-sm text-black/55">
            Belépve: {session.user} · Utolsó mentés:{' '}
            <time dateTime={content.updatedAt}>{formatSaved(content.updatedAt)}</time>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm underline underline-offset-4 transition-colors duration-fast hover:text-primary"
          >
            Oldal megnyitása
          </Link>
          <form action={signOut}>
            <SubmitButton
              className="h-9 bg-black px-4 text-xs hover:bg-black/80"
              pendingLabel="Kilépés…"
            >
              Kilépés
            </SubmitButton>
          </form>
        </div>
      </header>

      <nav aria-label="Admin szakaszok" className="flex flex-wrap gap-x-5 gap-y-2 py-5 text-sm">
        {SECTIONS.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="underline underline-offset-4 transition-colors duration-fast hover:text-primary"
          >
            {section.title}
          </a>
        ))}
      </nav>

      <Section
        id="elerhetoseg"
        title="Elérhetőség"
        lead="A telefonszám és a nyitvatartás minden oldalon és a keresők strukturált adataiban is ebből jön."
      >
        <ContactForm contact={content.contact} />
      </Section>

      <Section
        id="kiemelt"
        title="Kiemelt termékek"
        lead="Ezek jelennek meg a főoldal ajánlójában, ebben a sorrendben. Csak látható termék választható."
      >
        <FeaturedForm options={options} featured={content.featured} />
      </Section>

      <Section
        id="etlap"
        title="Étlap"
        lead="Név, leírás, ár és rendelési felület termékenként. A termékfotók az étterem saját képei, ezért nem szerkeszthetők."
      >
        <MenuForm items={content.menu} />
      </Section>

      <Section
        id="uzemelteto"
        title="Üzemeltetői adatok"
        lead="A jogi oldalak ezekből az értékekből épülnek. Környezeti változóból jönnek, itt nem szerkeszthetők."
      >
        <dl className="grid gap-3 sm:grid-cols-2">
          {operatorFields.map((field) => {
            const value = operatorValues[field.key];
            const missing = value.startsWith('[');
            return (
              <div key={field.key} className="border border-black/15 bg-white p-4">
                <dt className="text-xs font-medium uppercase tracking-[0.08em] text-black/55">
                  {field.label}
                </dt>
                <dd className={missing ? 'mt-1 text-sm text-primary' : 'mt-1 text-sm'}>
                  {missing ? 'Nincs kitöltve' : value}
                </dd>
                <dd className="mt-1 font-mono text-xs text-black/40">{field.variable}</dd>
              </div>
            );
          })}
        </dl>
      </Section>
    </div>
  );
}

function Section({
  id,
  title,
  lead,
  children,
}: {
  readonly id: string;
  readonly title: string;
  readonly lead: string;
  readonly children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-6 border-t border-black/15 py-10">
      <h2 className="smashr-display text-2xl">{title}</h2>
      <p className="mt-2 max-w-[46rem] text-sm leading-relaxed text-black/60">{lead}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}

/** The stored timestamp, or a plain note when nothing has been saved through the admin yet. */
function formatSaved(iso: string): string {
  const at = new Date(iso);
  if (Number.isNaN(at.getTime()) || at.getTime() === 0) {
    return 'még nem volt mentés';
  }
  return new Intl.DateTimeFormat('hu-HU', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Europe/Budapest',
  }).format(at);
}
