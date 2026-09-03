import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { site } from '@/content/site';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'SmashR — WE SMASH. YOU EAT.';

/**
 * The share card.
 *
 * Composed from the real assets rather than approximated in CSS: the actual tile wall as the
 * ground, the actual wordmark on top. A share card that does not look like the site it links to
 * is a broken promise made at the exact moment someone decides whether to click.
 *
 * Both images are PNG and both are inlined as data URIs. PNG because the renderer behind this
 * route rasterizes SVG and WebP unreliably, and inline because at render time there may be no
 * network and no deployed origin to fetch a relative `src` from.
 */
export default async function OpengraphImage() {
  const publicDir = path.join(process.cwd(), 'public');
  const [wall, logo] = await Promise.all([
    readFile(path.join(publicDir, 'images/og/wall.png')),
    readFile(path.join(publicDir, 'brand/smashr-logo.png')),
  ]);

  const wallSrc = `data:image/png;base64,${wall.toString('base64')}`;
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`;

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000000',
        position: 'relative',
      }}
    >
      <img
        src={wallSrc}
        width={1200}
        height={630}
        style={{ position: 'absolute', top: 0, left: 0, opacity: 0.5 }}
        alt=""
      />
      <img
        src={logoSrc}
        width={620}
        height={232}
        style={{ position: 'relative', marginTop: -20 }}
        alt=""
      />
      <div
        style={{
          position: 'relative',
          marginTop: 40,
          fontSize: 32,
          letterSpacing: 6,
          color: '#ffffff',
        }}
      >
        {site.tagline}
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 46,
          fontSize: 21,
          letterSpacing: 3,
          color: 'rgba(255,255,255,0.5)',
        }}
      >
        {site.address.full.toUpperCase()}
      </div>
    </div>,
    size,
  );
}
