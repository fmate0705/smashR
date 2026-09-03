/**
 * The Content Security Policy.
 *
 * Written as a list because the reasons matter more than the string. This site loads no
 * third-party JavaScript at all, so `script-src` never needs a host allowance — only the
 * `'unsafe-inline'` that Next's own bootstrap and the JSON-LD blocks require.
 *
 * `frame-src` is the one outward allowance: the Google Maps embed, and it only ever renders after
 * the visitor has allowed the functional purpose (see `components/sections/map-embed.tsx`).
 */
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  // Next's inline bootstrap and the JSON-LD script bodies. No external script host is allowed.
  "script-src 'self' 'unsafe-inline'",
  // next/font inlines its faces into a stylesheet; Tailwind emits inline styles for arbitrary values.
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "img-src 'self' data: blob:",
  "connect-src 'self'",
  // The consent-gated Google Maps embed.
  'frame-src https://www.google.com',
  'upgrade-insecure-requests',
].join('; ');

/**
 * Security headers.
 *
 * `Permissions-Policy` denies the three capabilities a restaurant site has no business asking
 * for; nothing here is a placeholder that a later feature is expected to relax.
 */
const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Self-contained server build — required for the deploy Dockerfile.
  output: 'standalone',
  images: { formats: ['image/avif', 'image/webp'] },

  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      {
        // Every file under /images and /brand is content-addressed by the asset pipeline: a
        // change produces a new filename, so the old one can be cached indefinitely.
        source: '/images/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/brand/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

export default nextConfig;
