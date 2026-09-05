import { Navbar } from '@/components/site/navbar';
import { Footer } from '@/components/site/footer';
import { ConsentProvider } from '@/components/consent/consent-provider';
import { ConsentWindow } from '@/components/consent/consent-window';

/**
 * The public site's frame: skip link, navigation, footer and the consent window.
 *
 * A component rather than only a layout because the global 404 needs it too. Next resolves an
 * unmatched URL against the *root* `not-found.tsx`, which is rendered by the root layout alone —
 * so a 404 that lived only in the site's route group would come back as Next's own grey
 * "This page could not be found", with no way back to the menu. Both call this instead.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only rounded-full bg-primary px-5 py-3 text-sm font-medium text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100]"
      >
        Ugrás a tartalomra
      </a>
      {/* Consent wraps the app so no non-essential embed can load before a decision exists. */}
      <ConsentProvider>
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        <ConsentWindow />
      </ConsentProvider>
    </>
  );
}
