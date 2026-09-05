'use client';

import { useActionState } from 'react';
import { saveContact, type ActionState } from '@/app/admin/actions';
import { Field, FormMessage, SubmitButton } from '@/app/admin/ui';
import type { StoredContact } from '@/lib/store/types';

/**
 * The phone number and the opening hours.
 *
 * The rows of the opening-hours table are fixed: each one carries the schema.org day codes that
 * the structured data is built from, and those are not something to type into a form. The label
 * and the hours are free text, which is what actually changes — a holiday, a shorter Sunday.
 */
export function ContactForm({ contact }: { contact: StoredContact }) {
  const [state, action] = useActionState<ActionState, FormData>(saveContact, {});

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="max-w-sm">
        <Field
          label="Telefonszám"
          name="phoneDisplay"
          defaultValue={contact.phoneDisplay}
          inputMode="tel"
          required
          hint="A hívható link ebből a számból készül, így a kettő nem tud eltérni."
        />
      </div>

      <fieldset className="flex flex-col gap-4 border border-black/15 bg-white p-5">
        <legend className="px-2 text-xs font-medium uppercase tracking-[0.08em] text-black/60">
          Nyitvatartás
        </legend>
        {contact.openingHours.map((slot, index) => (
          <div key={slot.days.join('-')} className="grid gap-4 sm:grid-cols-2">
            <Field label="Napok" name={`hours-${index}-label`} defaultValue={slot.label} required />
            <Field
              label="Időpont"
              name={`hours-${index}-value`}
              defaultValue={slot.hours}
              required
            />
          </div>
        ))}
      </fieldset>

      <FormMessage state={state} />
      <SubmitButton className="self-start">Elérhetőség mentése</SubmitButton>
    </form>
  );
}
