'use client';

import { useFormStatus } from 'react-dom';
import type { ActionState } from '@/app/admin/actions';
import { cn } from '@/lib/cn';

/**
 * The admin's form furniture.
 *
 * Four small components rather than a component library: every field in here is a label, an input
 * and a border, and the value of writing them once is that the label is never forgotten and the
 * focus ring is never missing.
 */

const INPUT =
  'w-full border border-black/25 bg-white px-3 py-2.5 text-sm text-black outline-none ' +
  'transition-colors duration-fast focus-visible:border-primary focus-visible:ring-2 ' +
  'focus-visible:ring-primary/30 disabled:opacity-60';

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  readonly label: string;
  readonly name: string;
  readonly hint?: string;
}

export function Field({ label, name, hint, className, ...props }: FieldProps) {
  return (
    <label htmlFor={name} className="flex flex-col gap-1.5">
      <span className="text-xs font-medium uppercase tracking-[0.08em] text-black/60">{label}</span>
      <input id={name} name={name} className={cn(INPUT, className)} {...props} />
      {hint === undefined ? null : <span className="text-xs text-black/45">{hint}</span>}
    </label>
  );
}

export function TextArea({
  label,
  name,
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; name: string }) {
  return (
    <label htmlFor={name} className="flex flex-col gap-1.5">
      <span className="text-xs font-medium uppercase tracking-[0.08em] text-black/60">{label}</span>
      <textarea id={name} name={name} className={cn(INPUT, 'resize-y', className)} {...props} />
    </label>
  );
}

export function Select({
  label,
  name,
  children,
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; name: string }) {
  return (
    <label htmlFor={name} className="flex flex-col gap-1.5">
      <span className="text-xs font-medium uppercase tracking-[0.08em] text-black/60">{label}</span>
      <select id={name} name={name} className={cn(INPUT, className)} {...props}>
        {children}
      </select>
    </label>
  );
}

export function Check({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="flex items-center gap-2.5 text-sm text-black/75">
      <input
        type="checkbox"
        className="size-4 accent-[rgb(var(--smashr-red))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        {...props}
      />
      {label}
    </label>
  );
}

/**
 * The submit button, disabled while its own form is in flight.
 *
 * `useFormStatus` reads the status of the enclosing form, which is what makes a double submit — the
 * classic way to save a form twice on a slow connection — impossible without any state of our own.
 */
export function SubmitButton({
  children,
  className,
  pendingLabel = 'Mentés…',
}: {
  children: React.ReactNode;
  className?: string;
  /** What the button says while the form is in flight. Not every form is a save. */
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        'inline-flex h-11 items-center justify-center bg-primary px-6 text-sm font-medium uppercase',
        'tracking-[0.08em] text-white transition-colors duration-fast hover:bg-[rgb(240_20_32)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        'focus-visible:ring-offset-2 disabled:cursor-progress disabled:opacity-60',
        className,
      )}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}

/** The result of the last save. `role="status"` so it is announced rather than only shown. */
export function FormMessage({ state }: { state: ActionState }) {
  if (state.error === undefined && state.ok === undefined) {
    return null;
  }
  const error = state.error !== undefined;
  return (
    <p
      role={error ? 'alert' : 'status'}
      className={cn(
        'border p-3 text-sm',
        error ? 'border-primary/50 bg-primary/5 text-black' : 'border-black/20 bg-black/[0.04]',
      )}
    >
      {error ? state.error : state.ok}
    </p>
  );
}
