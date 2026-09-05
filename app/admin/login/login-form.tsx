'use client';

import { useActionState } from 'react';
import { signIn, type ActionState } from '@/app/admin/actions';
import { Field, FormMessage, SubmitButton } from '@/app/admin/ui';

/**
 * The sign-in form.
 *
 * A client component only because it shows the action's result; the action itself is what checks
 * the password, so the form works submitted from anywhere and the browser is never trusted with
 * anything more than the two strings the user typed.
 */
export function LoginForm() {
  const [state, action] = useActionState<ActionState, FormData>(signIn, {});

  return (
    <form action={action} className="mt-8 flex flex-col gap-5">
      <Field label="Felhasználónév" name="user" autoComplete="username" required />
      <Field
        label="Jelszó"
        name="password"
        type="password"
        autoComplete="current-password"
        required
      />
      <FormMessage state={state} />
      <SubmitButton className="mt-1">Belépés</SubmitButton>
    </form>
  );
}
