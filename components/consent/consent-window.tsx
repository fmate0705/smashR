'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useConsent } from '@/components/consent/consent-provider';
import {
  CONSENT_COPY,
  CONSENT_POLICY_PATH,
  CONSENT_SHOW_PURPOSES_UP_FRONT,
  OPTIONAL_CATEGORIES,
  allGranted,
  defaultGrants,
} from '@/lib/consent/config';

/**
 * The consent window.
 *
 * It renders only when no current decision exists, or when the visitor reopens it. Accept and
 * reject are the same control size and sit side by side, because a reject button that is quieter
 * than accept is a dark pattern rather than a style choice.
 */
export function ConsentWindow() {
  const { decided, open, grants, save, close } = useConsent();
  const [purposesVisible, setPurposesVisible] = useState(CONSENT_SHOW_PURPOSES_UP_FRONT);
  const [draft, setDraft] = useState<Record<string, boolean>>(defaultGrants);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const titleId = useId();
  const bodyId = useId();

  const visible = open || !decided;

  // The draft mirrors the stored decision each time the window opens, so reopening shows what is
  // currently allowed rather than a fresh set of defaults.
  useEffect(() => {
    if (visible) setDraft({ ...grants });
  }, [visible, grants]);

  // Escape closes without granting anything. Closing an undecided window leaves consent absent,
  // which is the correct state: silence is not agreement.
  useEffect(() => {
    if (!visible) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [visible, close]);

  // Focus enters the window when it appears, so keyboard and screen-reader users reach the choice
  // rather than tabbing through the page to find it.
  useEffect(() => {
    if (visible) dialogRef.current?.focus();
  }, [visible]);

  if (!visible) return null;

  return (
    <>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal={false}
        aria-labelledby={titleId}
        aria-describedby={bodyId}
        tabIndex={-1}
        className="fixed inset-x-0 bottom-0 z-50 border-t border-white/25 bg-black/95 p-6 backdrop-blur-md motion-safe:animate-[fade-in_200ms_ease-out] sm:inset-x-auto sm:bottom-5 sm:right-5 sm:max-w-md sm:border"
      >
        <h2 id={titleId} className="smashr-display text-base text-white">
          {CONSENT_COPY.title}
        </h2>
        <p id={bodyId} className="mt-3 max-w-prose text-sm leading-relaxed text-white/60">
          {CONSENT_COPY.body}
        </p>

        {purposesVisible ? (
          <fieldset className="mt-5 space-y-4">
            <legend className="text-sm font-medium text-white">
              {CONSENT_COPY.preferencesTitle}
            </legend>
            <p className="text-sm leading-relaxed text-white/60">{CONSENT_COPY.preferencesBody}</p>
            {OPTIONAL_CATEGORIES.map((category) => (
              <label key={category.id} className="flex gap-3 text-sm text-white">
                <input
                  type="checkbox"
                  className="mt-1 size-4 accent-primary"
                  checked={draft[category.id] === true}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, [category.id]: event.target.checked }))
                  }
                />
                <span>
                  <span className="font-medium">{category.label}</span>
                  <span className="mt-1 block text-white/55">{category.description}</span>
                </span>
              </label>
            ))}
          </fieldset>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button type="button" variant="primary" size="sm" onClick={() => save(allGranted())}>
            {CONSENT_COPY.acceptAll}
          </Button>
          <Button type="button" variant="primary" size="sm" onClick={() => save(defaultGrants())}>
            {CONSENT_COPY.rejectAll}
          </Button>
          {purposesVisible ? (
            <Button type="button" variant="secondary" size="sm" onClick={() => save(draft)}>
              {CONSENT_COPY.save}
            </Button>
          ) : (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setPurposesVisible(true)}
            >
              {CONSENT_COPY.customize}
            </Button>
          )}
          <Link
            href={CONSENT_POLICY_PATH}
            className="w-full text-sm text-white/60 underline underline-offset-4 transition-colors duration-fast hover:text-white focus-visible:outline-none focus-visible:text-primary"
          >
            {CONSENT_COPY.policyLink}
          </Link>
        </div>
      </div>
    </>
  );
}
