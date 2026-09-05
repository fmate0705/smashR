'use client';

import { useActionState } from 'react';
import { saveMenu, type ActionState } from '@/app/admin/actions';
import { Check, Field, FormMessage, Select, SubmitButton, TextArea } from '@/app/admin/ui';
import { menuCategories } from '@/content/menu';
import type { StoredMenuItem } from '@/lib/store/types';

/**
 * The menu editor.
 *
 * One form for the whole menu rather than one per item: a price round touches five rows, and five
 * saves is five chances to leave the site half-updated. The items are grouped by their category
 * the way the page groups them, so what is being edited looks like what will be published.
 *
 * The product photograph is not editable and is not shown as a field. It is the venue's own,
 * taken from its platform listings and keyed to the item it shows; an editor that could repoint it
 * would be a way to promise a burger the kitchen does not send.
 */
export function MenuForm({ items }: { readonly items: readonly StoredMenuItem[] }) {
  const [state, action] = useActionState<ActionState, FormData>(saveMenu, {});

  return (
    <form action={action} className="flex flex-col gap-8">
      {menuCategories.map((category) => {
        const rows = items.filter((item) => item.category === category.id);
        if (rows.length === 0) {
          return null;
        }
        return (
          <section key={category.id} className="flex flex-col gap-4">
            <h3 className="text-sm font-medium uppercase tracking-[0.08em] text-black/60">
              {category.name}
            </h3>
            {rows.map((item) => (
              <MenuRow key={item.id} item={item} />
            ))}
          </section>
        );
      })}

      <FormMessage state={state} />
      <SubmitButton className="sticky bottom-6 self-start shadow-lg">Étlap mentése</SubmitButton>
    </form>
  );
}

function MenuRow({ item }: { readonly item: StoredMenuItem }) {
  const field = (name: string) => `${item.id}-${name}`;

  return (
    <article className="border border-black/15 bg-white p-5">
      <h4 className="text-base font-medium">{item.name}</h4>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Név" name={field('name')} defaultValue={item.name} required />
        <Select label="Kategória" name={field('category')} defaultValue={item.category}>
          {menuCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="mt-4">
        <TextArea
          label="Leírás"
          name={field('description')}
          defaultValue={item.description}
          rows={3}
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field
          label="Ár (Ft)"
          name={field('price')}
          type="number"
          min={0}
          step={10}
          defaultValue={item.price}
          required
        />
        <Field
          label="Betétdíj (Ft)"
          name={field('deposit')}
          type="number"
          min={0}
          step={5}
          defaultValue={item.deposit}
          hint="Visszaváltható csomagolás díja. Nulla, ha nincs."
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
        <Check
          label="„-tól” ár"
          name={field('priceFrom')}
          defaultChecked={item.priceFrom}
          value="1"
        />
        <Check
          label="foodora"
          name={field('channels')}
          value="foodora"
          defaultChecked={item.channels.includes('foodora')}
        />
        <Check
          label="Wolt"
          name={field('channels')}
          value="wolt"
          defaultChecked={item.channels.includes('wolt')}
        />
        <Check
          label="Látható az oldalon"
          name={field('visible')}
          defaultChecked={item.visible}
          value="1"
        />
      </div>
    </article>
  );
}
