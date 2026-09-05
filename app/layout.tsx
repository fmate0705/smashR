import type { Metadata, Viewport } from 'next';
import { Archivo, Archivo_Black } from 'next/font/google';
import './globals.css';
import '@/styles/brand.css';
import { site } from '@/content/site';
import { siteUrl } from '@/lib/site-url';

/**
 * The document shell: type, tokens and the metadata every route shares.
 *
 * Deliberately holds no chrome. The public site's navigation, footer and consent window live in
 * `(site)/layout.tsx`, because the admin is served from the same app and a tool page with a
 * restaurant's navbar and a cookie banner across it is a tool that is harder to use.
 *
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
      <body className="min-h-screen bg-black font-[family-name:var(--font-body)] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
