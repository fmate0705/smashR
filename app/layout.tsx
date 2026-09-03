import type { Metadata, Viewport } from 'next';
import { Archivo, Archivo_Black } from 'next/font/google';
import './globals.css';
import '@/styles/brand.css';
import { Navbar } from '@/components/site/navbar';
import { Footer } from '@/components/site/footer';
import { ConsentProvider } from '@/components/consent/consent-provider';
import { ConsentWindow } from '@/components/consent/consent-window';
import { restaurantJsonLd, websiteJsonLd } from '@/lib/seo/jsonld';
import { responsiveImage, WIDTHS } from '@/lib/images/responsive';
import { site } from '@/content/site';
import { siteUrl } from '@/lib/site-url';

/**
 * One superfamily, two roles. Archivo Black is the display voice — it has a single weight and is
 * only ever used large and uppercase; Archivo carries running text at the sizes where Black would
 * be unreadable. Same skeleton, same metrics, so the page reads as one typeface rather than a
 * pairing.
 *
 * `display: 'swap'` with the fallback stack declared here means the first paint has text in it,
 * and the swap shifts nothing because the metric overrides Next generates keep the fallback's
 * line box the same height.
 */
const display = Archivo_Black({
  subsets: ['latin', 'latin-ext'],
  weight: '400',
  display: 'swap',
  variable: '--font-display',
  fallback: ['Impact', 'Haettenschweiler', 'system-ui', 'sans-serif'],
});

const body = Archivo({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-body',
  fallback: ['system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
});

const hero = responsiveImage('/images/hero/tile-base', WIDTHS.hero);

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'SmashR — smash burger Budapesten | WE SMASH. YOU EAT.',
    template: '%s | SmashR',
  },
  description: site.description,
  applicationName: site.name,
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '48x48', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/icon-192.png',
  },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: site.name,
    locale: 'hu_HU',
    url: siteUrl,
    title: 'SmashR — smash burger Budapesten',
    description: site.description,
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
  formatDetection: { telephone: true, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hu" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        {/* The hero wall is the largest paint on the landing page, and it is a background rather
            than markup the preload scanner would find on its own. Preloading the exact srcSet the
            hero renders means the browser starts the right file, at the right width, immediately. */}
        <link
          rel="preload"
          as="image"
          href={hero.src}
          imageSrcSet={hero.srcSet}
          imageSizes="100vw"
          fetchPriority="high"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-black font-[family-name:var(--font-body)] text-white antialiased">
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
      </body>
    </html>
  );
}
