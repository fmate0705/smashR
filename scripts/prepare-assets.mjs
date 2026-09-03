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

/** The paper ground's base tone. Warm off-white, close to uncoated newsprint. */
const PAPER_BASE = [250, 246, 238];

/**
 * Removes the large-scale lighting from a photographed sheet, keeping only its surface.
 *
 * A scan carries the curve of the paper and the fall-off of whatever lit it. Mirror-tiling that
 * turns a soft shadow into a symmetrical blotch that reads as a stain rather than as paper. This
 * subtracts a heavily blurred copy of the image from itself — a high-pass — which leaves the
 * fibre, the ghosted columns of type and the rules, then re-lays that detail over a flat tone.
 */
async function flattenLighting(input, { strength = 1.35 } = {}) {
  const grey = sharp(input).greyscale();
  const { data, info } = await grey.raw().toBuffer({ resolveWithObject: true });
  // Sigma large enough to hold only the lighting, not the type.
  const { data: base } = await sharp(input)
    .greyscale()
    .blur(60)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const out = Buffer.allocUnsafe(info.width * info.height * 3);
  for (let i = 0; i < data.length; i += 1) {
    // Signed detail around mid-grey, amplified, then applied to the flat paper tone.
    const detail = ((data[i] ?? 0) - (base[i] ?? 0)) * strength;
    for (let channel = 0; channel < 3; channel += 1) {
      const value = (PAPER_BASE[channel] ?? 255) + detail;
      out[i * 3 + channel] = value < 0 ? 0 : value > 255 ? 255 : value;
    }
  }

  return sharp(out, { raw: { width: info.width, height: info.height, channels: 3 } })
    .png()
    .toBuffer();
}

/**
 * Crops an image to a clean interior and mirrors it into a 2x2 block.
 *
 * A photographed sheet has margins and a page edge; repeated as a background it tiles as a grid of
 * borders. Mirroring makes every outer edge of the block identical to the edge it will meet, so
 * the texture repeats with no visible join. The symmetry it introduces is invisible on an organic surface
 * at the opacity this ground is used at.
 */
async function mirrorTile(input, inset = { left: 0.14, top: 0.1, width: 0.6, height: 0.78 }) {
  const source = sharp(input, { limitInputPixels: false });
  const { width = 0, height = 0 } = await source.metadata();
  const cell = await flattenLighting(
    await source
      .extract({
        left: Math.round(width * inset.left),
        top: Math.round(height * inset.top),
        width: Math.round(width * inset.width),
        height: Math.round(height * inset.height),
      })
      .toBuffer(),
  );

  const { width: cw = 0, height: ch = 0 } = await sharp(cell).metadata();
  const [flopped, flipped, both] = await Promise.all([
    sharp(cell).flop().toBuffer(),
    sharp(cell).flip().toBuffer(),
    sharp(cell).flip().flop().toBuffer(),
  ]);

  return sharp({ create: { width: cw * 2, height: ch * 2, channels: 3, background: '#ffffff' } })
    .composite([
      { input: cell, left: 0, top: 0 },
      { input: flopped, left: cw, top: 0 },
      { input: flipped, left: 0, top: ch },
      { input: both, left: cw, top: ch },
    ])
    .png()
    .toBuffer();
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
  // Two layers of the same wall. The highlight layer is only ever seen through a small circular
  // window that follows the pointer, so it can carry a lower quality than the base without any
  // visible difference — which keeps the hero's total bytes close to a single background.
  //
  // Both are cropped to the same centred half-frame before resizing. The generated wall is about
  // twenty tiles across, which reads as texture rather than as tile at hero scale; taking the
  // middle 50% doubles their apparent size, and doing it identically to both layers is what keeps
  // the gloss aligned to the matte grout when the window moves over it.
  const heroCrop = async (file) => {
    const image = sharp(path.join(GEN, file), { limitInputPixels: false });
    const { width = 0, height = 0 } = await image.metadata();
    return image
      .extract({
        left: Math.round(width * 0.25),
        top: Math.round(height * 0.25),
        width: Math.round(width * 0.5),
        height: Math.round(height * 0.5),
      })
      .toBuffer();
  };

  const heroBase = await heroCrop('hero-tile-base.png');
  const heroHighlight = await heroCrop('hero-tile-highlight.png');
  await responsive(heroBase, 'hero/tile-base', [1280, 1920, 2560], { quality: 80 });
  await responsive(heroHighlight, 'hero/tile-highlight', [1280, 1920, 2560], { quality: 74 });

  // The tile strip that edges every black section. Short, wide, and repeated on the x axis.
  const stripSource = await sharp(path.join(GEN, 'hero-tile-base.png'), { limitInputPixels: false })
    .extract({ left: 0, top: 0, width: 2752, height: 460 })
    .toBuffer();
  await webp(stripSource, 'texture/tile-strip.webp', 1600, { quality: 74 });

  // ── Surfaces ────────────────────────────────────────────────────────────────
  // The newsprint ground: an old newspaper page photographed from the back, so its columns of
  // type show through as unreadable grey rather than competing with the text set on top of it.
  //
  // The source is a whole sheet with margins and a page edge, which would tile as a visible grid
  // of borders. It is cropped to a clean interior and then mirrored into a 2x2 block, so opposite
  // edges match exactly and the background repeats without a visible join.
  await webp(await mirrorTile(path.join(GEN, 'paper-newsprint.png')), 'texture/paper.webp', 1600, {
    quality: 72,
  });

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
  const layers = ['bun-top', 'patty-a', 'patty-b', 'veg', 'bun-bottom'];
  for (const layer of layers) {
    await webp(path.join(GEN, 'cutout', `${layer}.png`), `burger/layer-${layer}.webp`, 900, {
      quality: 86,
      alpha: true,
      trim: true,
    });
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
