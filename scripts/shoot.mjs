/**
 * Visual QA capture.
 *
 * Drives a local Chrome over CDP and writes screenshots of every page at a set of viewports,
 * including scroll positions, so scroll-driven sections can actually be reviewed. Development
 * tooling — it is not part of the build and ships with nothing.
 *
 *   node scripts/shoot.mjs [outDir] [baseUrl]
 */
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const OUT = process.argv[2] ?? path.resolve(import.meta.dirname, '../.qa');
const BASE = process.argv[3] ?? 'http://localhost:3000';
const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';

/** name → { path, viewport, scroll (px or 'full'), reducedMotion } */
const SHOTS = [
  { name: 'home-1-hero', url: '/', w: 1440, h: 900, scroll: 0 },
  { name: 'home-2-build-start', url: '/', w: 1440, h: 900, scroll: 1000 },
  { name: 'home-3-build-mid', url: '/', w: 1440, h: 900, scroll: 2100 },
  { name: 'home-4-build-end', url: '/', w: 1440, h: 900, scroll: 3200 },
  { name: 'home-5-menu', url: '/', w: 1440, h: 900, scroll: 4300 },
  { name: 'home-6-story', url: '/', w: 1440, h: 900, scroll: 5200 },
  { name: 'home-7-location', url: '/', w: 1440, h: 900, scroll: 6300 },
  { name: 'etlap-1', url: '/etlap', w: 1440, h: 900, scroll: 0 },
  { name: 'etlap-2', url: '/etlap', w: 1440, h: 900, scroll: 900 },
  { name: 'etlap-3', url: '/etlap', w: 1440, h: 900, scroll: 2200 },
  { name: 'experience-1', url: '/smashr-experience', w: 1440, h: 900, scroll: 0 },
  { name: 'experience-2', url: '/smashr-experience', w: 1440, h: 900, scroll: 900 },
  { name: 'experience-3', url: '/smashr-experience', w: 1440, h: 900, scroll: 2000 },
  { name: 'experience-4', url: '/smashr-experience', w: 1440, h: 900, scroll: 3000 },
  { name: 'rolunk-1', url: '/rolunk', w: 1440, h: 900, scroll: 0 },
  { name: 'rolunk-2', url: '/rolunk', w: 1440, h: 900, scroll: 1100 },
  { name: 'rolunk-3', url: '/rolunk', w: 1440, h: 900, scroll: 2400 },
  { name: 'kapcsolat-1', url: '/kapcsolat', w: 1440, h: 900, scroll: 0 },
  { name: 'kapcsolat-2', url: '/kapcsolat', w: 1440, h: 900, scroll: 800 },
  { name: 'jogi-1', url: '/jogi-informaciok', w: 1440, h: 900, scroll: 0 },
  { name: 'jogi-2', url: '/jogi-informaciok/impresszum', w: 1440, h: 900, scroll: 700 },
  { name: 'notfound', url: '/nincs-ilyen-oldal', w: 1440, h: 900, scroll: 0 },
  { name: 'm-home-1', url: '/', w: 390, h: 844, scroll: 0, mobile: true },
  { name: 'm-home-2', url: '/', w: 390, h: 844, scroll: 1200, mobile: true },
  { name: 'm-home-3', url: '/', w: 390, h: 844, scroll: 3400, mobile: true },
  { name: 'm-etlap', url: '/etlap', w: 390, h: 844, scroll: 900, mobile: true },
  { name: 'm-kapcsolat', url: '/kapcsolat', w: 390, h: 844, scroll: 600, mobile: true },
  { name: 't-home', url: '/', w: 834, h: 1112, scroll: 1200 },
  { name: 't-etlap', url: '/etlap', w: 834, h: 1112, scroll: 900 },
  { name: 'rm-home', url: '/', w: 1440, h: 900, scroll: 2100, reduced: true },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--hide-scrollbars', '--force-device-scale-factor=1', '--disable-lcd-text'],
  });

  const only = process.env.ONLY;
  const shots = only === undefined ? SHOTS : SHOTS.filter((s) => s.name.includes(only));

  for (const shot of shots) {
    const page = await browser.newPage();
    await page.setViewport({
      width: shot.w,
      height: shot.h,
      deviceScaleFactor: 1,
      isMobile: shot.mobile === true,
      hasTouch: shot.mobile === true,
    });
    if (shot.reduced === true) {
      await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    }
    // Consent is already answered, so the window does not cover the design under review.
    // The record has to match `lib/consent/store.ts` exactly, version included, or it is discarded.
    await page.evaluateOnNewDocument(() => {
      const record = JSON.stringify({
        version: 1,
        decidedAt: new Date().toISOString(),
        granted: { necessary: true, functional: true, analytics: true },
      });
      document.cookie = `cef-consent=${encodeURIComponent(record)}; Path=/; Max-Age=15552000; SameSite=Lax`;
    });

    await page.goto(`${BASE}${shot.url}`, { waitUntil: 'networkidle2', timeout: 60000 });
    await sleep(900);
    if (shot.scroll > 0) {
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), shot.scroll);
      await sleep(1100);
    }
    await page.screenshot({ path: path.join(OUT, `${shot.name}.png`) });
    console.log(`shot ${shot.name} (${shot.w}x${shot.h} @${shot.scroll})`);
    await page.close();
  }

  await browser.close();
}

await main();
