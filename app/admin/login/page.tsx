import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { adminAvailability, readSession } from '@/lib/auth/session';
import { LoginForm } from './login-form';

/**
 * The login page.
 *
 * Rendered live, because whether the admin can be used at all depends on environment variables
 * that arrive at run time. When it cannot, the page says which variable is missing rather than
 * showing a form that will never accept anything — the person seeing this is the operator, and
 * that is the one audience for whom naming the variable is help rather than a leak.
 */
export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Belépés' };

const UNAVAILABLE: Record<string, string> = {
  'no-credentials':
    'Nincs beállítva adminfiók. Állítsd be a SMASHR_ADMIN_USER és a SMASHR_ADMIN_PASSWORD_HASH környezeti változót.',
  'no-secret':
    'Nincs beállítva munkamenet-kulcs. Állítsd be a SMASHR_SESSION_SECRET változót, legalább 32 karakterrel.',
};

export default async function AdminLoginPage() {
  if ((await readSession()) !== null) {
    redirect('/admin');
  }

  const availability = adminAvailability();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[26rem] flex-col justify-center px-6 py-16">
      <h1 className="smashr-display text-3xl">SmashR admin</h1>

      {availability === 'ready' ? (
        <LoginForm />
      ) : (
        <p
          role="alert"
          className="mt-8 border border-primary/40 bg-primary/5 p-5 text-sm leading-relaxed text-black/75"
        >
          {UNAVAILABLE[availability]}
        </p>
      )}
    </main>
  );
}
