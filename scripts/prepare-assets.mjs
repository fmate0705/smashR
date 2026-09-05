/**
 * Turns the source photography in `assets/source` and the Higgsfield output in
 * `assets/generated` into the optimized files the app actually ships.
 *
 * It exists because image weight and layout shift are decided long before a component renders:
 * every asset leaves here as WebP at a known intrinsic size, and the sizes are written back out
 * as `lib/images/manifest.ts` so a component can set width/height (and therefore reserve space)
 * without guessing. Re-runnable and deterministic — same inputs, same files.
 *
 *   node scripts/prepare-assets.mjs
 */
import { mkdir, writeFile, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'assets/source');
const GEN = path.join(ROOT, 'assets/generated');
const OUT = path.join(ROOT, 'public/images');

/** Intrinsic sizes of everything written, keyed by public path. */
const manifest = {};

const record = (publicPath, info) => {
  manifest[publicPath] = { width: info.width, height: info.height };
};

async function ensure(dir) {
  await mkdir(dir, { recursive: true });
}

/**
 * How much larger the hero's tiles appear than in the generated frame.
 *
 * The wall was generated about twenty tiles across, which reads as texture at hero scale. Cropping
 * to the centre 1/1.75 of the frame enlarges the tile without touching the photograph, and leaves
 * 1573px of width — enough that a 1440-wide viewport is still scaling the image down, not up.
 * A 2x crop was tried and left the wall visibly soft on a large display.
 */
const HERO_ZOOM = 1.75;

/**
 * Reads one of the brand layer's channel-triplet colour tokens, e.g. `--smashr-red: 209 0 15`.
 *
 * The design tokens are the single source of truth for colour, including for the files this script
 * writes — an icon whose red was typed in here would drift the first time the brand changed.
 */
async function readBrandToken(name) {
  const css = await readFile(path.join(ROOT, 'styles/brand.css'), 'utf8');
  const match = new RegExp(`${name}:\\s*(\\d+)\\s+(\\d+)\\s+(\\d+)\\s*;`).exec(css);
  if (match === null) {
    throw new Error(`prepare-assets: ${name} is not defined in styles/brand.css`);
  }
  const [, r, g, b] = match;
  return { r: Number(r), g: Number(g), b: Number(b), alpha: 1 };
}

/** The same token as a hex string, for the places that take CSS colour rather than a sharp input. */
async function readBrandHex(name) {
  const { r, g, b } = await readBrandToken(name);
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`.toUpperCase();
}

/** Writes one WebP at a fixed width, preserving aspect ratio. */
async function webp(input, outRel, width, { quality = 82, alpha = false, trim = false } = {}) {
  const outAbs = path.join(OUT, outRel);
  await ensure(path.dirname(outAbs));
  let pipeline = sharp(input, { limitInputPixels: false });
  if (trim) {
    pipeline = pipeline.trim({ threshold: 1 });
  }
  const info = await pipeline
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, alphaQuality: alpha ? 100 : 80, effort: 6 })
    .toFile(outAbs);
  record(`/images/${outRel}`, info);
  return info;
}

/** Writes a responsive set and records the largest as the intrinsic size. */
async function responsive(input, baseRel, widths, opts) {
  let largest = null;
  for (const width of widths) {
    const info = await webp(input, `${baseRel}-${width}.webp`, width, opts);
    if (largest === null || info.width > largest.width) {
      largest = info;
    }
  }
  record(`/images/${baseRel}`, largest);
}

async function main() {
  await ensure(OUT);

  // ── Hero ────────────────────────────────────────────────────────────────────
  // Two photographs of the same wall — one matte, one wet-gloss — shot from the same camera so
  // they superimpose. Both are cropped to the same centred window before resizing, which is what
  // sets the tile scale: at full frame the wall reads as texture rather than as tile, and the
  // crop below enlarges it by HERO_ZOOM without moving either layer relative to the other.
  //
  // The two must be cropped identically and by the same code path. Anything that treats them
  // differently — a different crop, a different output size, even a different element type at
  // render — puts the wet grout a few pixels off the dry grout, and the effect depends entirely
  // on those two grids being the same grid.
  const heroCrop = async (file) => {
    const image = sharp(path.join(GEN, file), { limitInputPixels: false });
    const { width = 0, height = 0 } = await image.metadata();
    const keep = 1 / HERO_ZOOM;
    return image
      .extract({
        left: Math.round((width * (1 - keep)) / 2),
        top: Math.round((height * (1 - keep)) / 2),
        width: Math.round(width * keep),
        height: Math.round(height * keep),
      })
      .toBuffer();
  };

  // 1920 is the last width worth writing: the crop leaves 1573px, and `webp()` does not upscale,
  // so anything larger is the same file under another name.
  await responsive(await heroCrop('hero-tile-base.png'), 'hero/tile-base', [1280, 1920], {
    quality: 80,
  });
  await responsive(await heroCrop('hero-tile-highlight.png'), 'hero/tile-highlight', [1280, 1920], {
    quality: 76,
  });

  // The tile strip that edges every black section. Short, wide, and repeated on the x axis.
  const stripSource = await sharp(path.join(GEN, 'hero-tile-base.png'), { limitInputPixels: false })
    .extract({ left: 0, top: 0, width: 2752, height: 460 })
    .toBuffer();
  await webp(stripSource, 'texture/tile-strip.webp', 1600, { quality: 74 });

  // ── Surfaces ────────────────────────────────────────────────────────────────
  // The newsprint ground: the supplied collage of torn newspaper clippings.
  //
  // Toned rather than mirrored. Mirroring is what makes a photographed sheet tile without a join,
  // but this source is built from big set headlines, and reflecting those produced an obvious
  // kaleidoscope. A plain repeat leaves a seam instead — which, in a collage already made of cut
  // edges at every angle, is the one artefact that looks like it belongs.
  //
  // The tone pass neutralises the yellowing and compresses the range hard: the paper goes to white
  // and the ink to a light grey, so the section can carry the texture at a readable strength
  // without the headlines fighting the copy set over them.
  await webp(
    await sharp(path.join(SRC, 'newspaper.webp'), { limitInputPixels: false })
      .greyscale()
      .linear(0.62, 113)
      .toBuffer(),
    'texture/paper.webp',
    // Tiled at 340 CSS px by `Surface`, so 720 covers a 2x display exactly. It used to ship at
    // 1800 — 120KB of newsprint downloaded on every page with a paper section to draw a third of
    // it, once, very small.
    720,
    { quality: 78 },
  );

  // ── Burger ──────────────────────────────────────────────────────────────────
  await responsive(path.join(GEN, 'burger-complete.png'), 'burger/complete', [720, 1200], {
    quality: 84,
  });
  // The exploded reference ships as a cut-out so it can sit on the beige surface without a black
  // plate behind it. The source with its background intact stays in assets/generated for reference.
  await responsive(
    path.join(GEN, 'cutout', 'burger-exploded.png'),
    'burger/exploded',
    [720, 1200],
    {
      quality: 86,
      alpha: true,
      trim: true,
    },
  );

  // The scroll-built burger. Each layer is trimmed to its own ink so the component can position
  // it by its real edges rather than by an arbitrary canvas, and every layer keeps its alpha.
  // Two widths, because the stage is 13rem wide on a phone and 30rem on a desktop: a single
  // 900px layer meant a phone downloading five images at four and a half times the size it drew
  // them, which on this page is the difference between a third of a megabyte and a tenth of one.
  const layers = ['bun-top', 'patty-a', 'patty-b', 'veg', 'bun-bottom'];
  for (const layer of layers) {
    await responsive(
      path.join(GEN, 'cutout', `${layer}.png`),
      `burger/layer-${layer}`,
      [480, 900],
      {
        quality: 86,
        alpha: true,
        trim: true,
      },
    );
  }

  // ── Photography ─────────────────────────────────────────────────────────────
  const photos = [
    ['tortenetunk.jpg', 'story/tortenetunk', [960, 1600, 2200]],
    ['csapat_about_us_2.jpg', 'story/csapat', [960, 1600, 2200]],
    ['rolunk.jpg', 'story/rolunk', [960, 1600]],
    ['about us.jpg', 'story/pult', [960, 1600]],
  ];
  for (const [file, base, widths] of photos) {
    await responsive(path.join(SRC, file), base, widths, { quality: 80 });
  }

  // ── Menu photography ────────────────────────────────────────────────────────
  // The venue's own product shots, downloaded from its foodora listing. They arrive as square
  // JPEGs; they leave as WebP at the two widths the grid actually uses, so a 400px card never
  // downloads a 900px JPEG.
  const menuDir = path.join(ROOT, 'assets/foodora');
  const menuFiles = (await readdir(menuDir)).filter((file) => file.endsWith('.jpg'));
  for (const file of menuFiles.sort()) {
    const base = `menu/${path.basename(file, '.jpg')}`;
    await responsive(path.join(menuDir, file), base, [400, 800], { quality: 80 });
  }

  // ── Ordering platforms ──────────────────────────────────────────────────────
  // foodora's and Wolt's own app icons, so an order button is recognised as the platform it opens
  // before the label is read. Written at 2x the largest rendered size and no bigger.
  for (const platform of ['foodora', 'wolt']) {
    await webp(
      path.join(ROOT, 'assets/platform', `${platform}.png`),
      `platform/${platform}.webp`,
      96,
      {
        quality: 90,
        alpha: true,
      },
    );
  }

  // ── Share card ground ───────────────────────────────────────────────────────
  // The Open Graph route composes its card at request time, and its renderer reads raster
  // formats reliably where WebP and SVG are hit and miss. So the wall it draws on is written
  // here as a plain PNG at exactly the card's size.
  await ensure(path.join(OUT, 'og'));
  const ogWall = await sharp(path.join(GEN, 'hero-tile-highlight.png'), { limitInputPixels: false })
    .resize({ width: 1200, height: 630, fit: 'cover', position: 'centre' })
    .png({ palette: true, quality: 80 })
    .toFile(path.join(OUT, 'og/wall.png'));
  record('/images/og/wall.png', ogWall);

  // ── Brand wordmark ──────────────────────────────────────────────────────────
  // Three colourways from one drawing. The supplied artwork is a single compound path with an
  // even-odd fill — that rule is what keeps the counters in the S, the a and the R open — so each
  // colourway is the same path under a different fill and they cannot drift apart. The red comes
  // from the brand token, not from whatever red the source file was exported with: a wordmark a
  // shade off the buttons beside it reads as a mistake.
  const artwork = await readFile(path.join(SRC, 'smashr-logo-clean.svg'), 'utf8');
  const viewBox = /viewBox="([^"]+)"/.exec(artwork)?.[1];
  const outline = /<path[^>]*\sd="([^"]+)"/.exec(artwork)?.[1];
  const fillRule = /fill-rule="([^"]+)"/.exec(artwork)?.[1] ?? 'nonzero';
  if (viewBox === undefined || outline === undefined) {
    throw new Error('prepare-assets: assets/source/smashr-logo-clean.svg has no viewBox or path');
  }
  const wordmark = (fill) =>
    [
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-label="SmashR" fill="${fill}">`,
      `<path fill-rule="${fillRule}" d="${outline}"/>`,
      '</svg>',
      '',
    ].join('\n');

  await ensure(path.join(ROOT, 'public/brand'));
  const tones = [
    ['', await readBrandHex('--smashr-red')],
    ['-white', '#FFFFFF'],
    ['-mono', 'currentColor'],
  ];
  for (const [tone, fill] of tones) {
    await writeFile(path.join(ROOT, `public/brand/smashr-logo${tone}.svg`), wordmark(fill), 'utf8');
  }

  // ── Brand rasters ───────────────────────────────────────────────────────────
  // The wordmark is an SVG everywhere the page draws it. Two consumers cannot take one: the Open
  // Graph route, whose renderer rasterizes SVG unreliably, and the schema.org `logo` a search
  // engine fetches. Both are generated from the vector here rather than committed by hand, so a
  // new set of curves cannot leave a stale raster behind on the share card.
  for (const tone of ['', '-white']) {
    const info = await sharp(path.join(ROOT, `public/brand/smashr-logo${tone}.svg`), {
      density: 600,
    })
      .resize({ width: 1600 })
      .png()
      .toFile(path.join(ROOT, `public/brand/smashr-logo${tone}.png`));
    record(`/brand/smashr-logo${tone}.png`, info);
  }

  // ── Icons ───────────────────────────────────────────────────────────────────
  // A solid red plate behind the mark: the logo is a script wordmark with thin strokes, and a
  // transparent favicon disappears against a dark browser chrome.
  //
  // The plate colour is read out of the brand layer rather than repeated here, so the icons can
  // never end up a slightly different red from the buttons.
  const brandRed = await readBrandToken('--smashr-red');
  const logo = await sharp(path.join(ROOT, 'public/brand/smashr-logo-white.svg'), { density: 600 })
    .resize({ width: 380 })
    .toBuffer();
  for (const size of [192, 512]) {
    const pad = Math.round(size * 0.14);
    const mark = await sharp(logo)
      .resize({ width: size - pad * 2 })
      .toBuffer();
    const info = await sharp({
      create: { width: size, height: size, channels: 4, background: brandRed },
    })
      .composite([{ input: mark, gravity: 'center' }])
      .png()
      .toFile(path.join(ROOT, `public/icon-${size}.png`));
    record(`/icon-${size}.png`, info);
  }
  await sharp(path.join(ROOT, 'public/icon-512.png'))
    .resize(48)
    .toFile(path.join(ROOT, 'public/favicon.png'));

  // ── Manifest ────────────────────────────────────────────────────────────────
  const entries = Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b));
  const body = entries
    .map(([key, size]) => `  '${key}': { width: ${size.width}, height: ${size.height} },`)
    .join('\n');
  await ensure(path.join(ROOT, 'lib/images'));
  await writeFile(
    path.join(ROOT, 'lib/images/manifest.ts'),
    `/**\n * Intrinsic pixel sizes of every processed image, written by \`scripts/prepare-assets.mjs\`.\n * Do not edit by hand — re-run the script.\n *\n * Components read from here so an <Image> can always be given a real width and height, which is\n * what reserves the box before the bytes arrive and keeps the layout from shifting.\n */\nexport const IMAGE_SIZES = {\n${body}\n} as const satisfies Record<string, { readonly width: number; readonly height: number }>;\n\nexport type ImageKey = keyof typeof IMAGE_SIZES;\n\n/** The intrinsic size of a processed image. */\nexport function imageSize(key: ImageKey): { readonly width: number; readonly height: number } {\n  return IMAGE_SIZES[key];\n}\n`,
    'utf8',
  );

  const files = await readdir(OUT, { recursive: true });
  console.log(
    `prepare-assets: ${entries.length} entries, ${files.length} paths under public/images`,
  );
}

await main();
