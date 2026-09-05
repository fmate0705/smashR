'use client';

import { useActionState, useState } from 'react';
import { saveFeatured, type ActionState } from '@/app/admin/actions';
import { FormMessage, SubmitButton } from '@/app/admin/ui';
import { FEATURED_LIMIT } from '@/lib/store/types';
import { cn } from '@/lib/cn';

export interface FeaturedOption {
  readonly id: string;
  readonly name: string;
  readonly category: string;
}

/**
 * The home page's shortlist.
 *
 * Selection order is display order, so the control has to remember a sequence rather than a set —
 * hence the hidden inputs, rendered in the chosen order, with the checkboxes acting only as the
 * UI. The limit is enforced here by disabling what cannot be added, and again in the action,
 * because a form can be posted without ever loading this page.
 */
export function FeaturedForm({
  options,
  featured,
}: {
  readonly options: readonly FeaturedOption[];
  readonly featured: readonly string[];
}) {
  const [state, action] = useActionState<ActionState, FormData>(saveFeatured, {});
  const [chosen, setChosen] = useState<readonly string[]>(featured);

  const toggle = (id: string) =>
    setChosen((current) => {
      if (current.includes(id)) {
        return current.filter((entry) => entry !== id);
      }
      return current.length >= FEATURED_LIMIT ? current : [...current, id];
    });

  const move = (id: string, by: number) =>
    setChosen((current) => {
      const from = current.indexOf(id);
      const to = from + by;
      if (from < 0 || to < 0 || to >= current.length) {
        return current;
      }
      const next = [...current];
      const [moved] = next.splice(from, 1);
      if (moved === undefined) {
        return current;
      }
      next.splice(to, 0, moved);
      return next;
    });

  return (
    <form action={action} className="flex flex-col gap-5">
      {chosen.map((id) => (
        <input key={id} type="hidden" name="featured" value={id} />
      ))}

      <p className="text-sm text-black/60">
        {chosen.length} / {FEATURED_LIMIT} kiválasztva. A sorrend a főoldalon ugyanez lesz.
      </p>

      <ul className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const position = chosen.indexOf(option.id);
          const active = position >= 0;
          return (
            <li
              key={option.id}
              className={cn(
                'flex items-center gap-3 border bg-white p-3',
                active ? 'border-primary' : 'border-black/15',
              )}
            >
              <input
                type="checkbox"
                id={`featured-${option.id}`}
                checked={active}
                disabled={!active && chosen.length >= FEATURED_LIMIT}
                onChange={() => toggle(option.id)}
                className="size-4 shrink-0 accent-[rgb(var(--smashr-red))] disabled:opacity-40"
              />
              <label htmlFor={`featured-${option.id}`} className="min-w-0 flex-1 text-sm">
                <span className="block truncate font-medium">{option.name}</span>
                <span className="block text-xs text-black/50">{option.category}</span>
              </label>

              {active ? (
                <span className="flex shrink-0 items-center gap-1">
                  <span className="mr-1 text-sm font-medium text-primary">{position + 1}.</span>
                  <MoveButton
                    label={`${option.name} előrébb`}
                    disabled={position === 0}
                    onClick={() => move(option.id, -1)}
                  >
                    ↑
                  </MoveButton>
                  <MoveButton
                    label={`${option.name} hátrébb`}
                    disabled={position === chosen.length - 1}
                    onClick={() => move(option.id, 1)}
                  >
                    ↓
                  </MoveButton>
                </span>
              ) : null}
            </li>
          );
        })}
      </ul>

      <FormMessage state={state} />
      <SubmitButton className="self-start">Kiemeltek mentése</SubmitButton>
    </form>
  );
}

function MoveButton({
  label,
  disabled,
  onClick,
  children,
}: {
  readonly label: string;
  readonly disabled: boolean;
  readonly onClick: () => void;
  readonly children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="size-7 border border-black/20 text-sm leading-none transition-colors duration-fast hover:border-primary disabled:opacity-30"
    >
      {children}
    </button>
  );
}
