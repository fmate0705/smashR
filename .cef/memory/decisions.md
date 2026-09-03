# Decisions

## Scaffold

- **Framework: nextjs** — Chosen at scaffold time; server-first rendering is the default.
- **Language: typescript** — Type safety is a non-negotiable; strict mode is on.
- **Package manager: npm** — Reproducible installs from a committed lockfile.
- **Deployment target: docker** — The Klivo Docker hosting platform, per the deploy bundle in
  `deploy/DEPLOY.md`. The manifest was moved off `vercel` to match.
- **Database: none** — Persistence chosen at scaffold time.
- **Server-first architecture** — Less client JavaScript, faster loads, secrets stay on the server.

## Information architecture

- **Five pages, not seven.** The generator's page planner proposed `reservations` and `gallery` for
  a hospitality project. SmashR takes no bookings (there is a counter, not a dining room) and had
  no gallery brief, so both were removed and a `smashr-experience` brand page was added in their
  place. Routes: `/`, `/etlap`, `/smashr-experience`, `/rolunk`, `/kapcsolat`, `/jogi-informaciok`.
  Because the planner re-derives its page list from the manifest on every run, a full
  `cef generate` will re-emit `app/foglalas` and `app/galeria`; delete them again if that happens.

- **Do not re-run a full `cef generate` on this project.** Generation is a scaffold step, and this
  project is past it. A full run overwrites the hand-built `components/site/*`,
  `components/sections/hero.tsx`, `components/ui/button.tsx` and `content/menu.ts`. Regenerate a
  single concern instead (`cef generate seo`, `cef generate deploy`), or back the files up first —
  that is how the consent layer was regenerated after adding the `functional` purpose.

## Design system

- **Brand tokens live in `styles/brand.css`, not in `app/globals.css`.** `globals.css` is generated
  and carries the CEF primitive scale; the brand layer is a semantic layer imported after it in
  `app/layout.tsx` that re-points the framework's semantic tokens at the SmashR palette. That keeps
  `cef generate` able to refresh the primitives without touching the brand.

- **One committed identity, no light mode.** The light and dark token blocks resolve to the same
  values. A visitor whose OS prefers light does not get a beige-on-white SmashR; they get SmashR.
  `components/site/theme-script.tsx` was removed because nothing switches.

- **Two button variants only.** The generated `outline` and `ghost` variants were dropped and the
  consent window moved onto `secondary`. A third weight is where a control system starts to leak.

## Assets

- **The wordmark ships as SVG.** The supplied `Logo.jpg` had a white plate behind it; the supplied
  `logo.svg.svg` turned out to be four paths with no background at all, so the transparent mark is
  the vector, recoloured to the exact brand red and to white, with the viewBox tightened to the
  artwork. No raster wordmark is used on screen.

- **The burger build is DOM layers, not video.** The brief allowed a generated video for the
  scroll-driven burger assembly. It ships as five cut-out photographs transformed by GSAP instead:
  a video cannot be scrubbed frame-accurately across browsers, costs megabytes against an LCP
  budget, and cannot be pinned to a layout that reflows. The two reference stills the brief asked
  for were still generated — the assembled burger and the exploded stack — and the exploded one is
  used on `/smashr-experience`.

- **Menu photography is never generated.** Every product image on `/etlap` comes from SmashR's own
  foodora listing. The three Wolt-only triple-patty sizes have no published photo, so their cards
  are typographic rather than borrowing a picture of the smaller burger.

## Craft catalogue deviations

Three `cef impeccable detect` findings are deliberate and stand. Each was probed before being
accepted, not waved through.

- **IM-015 Radial-gradient background halo — `components/sections/hero.tsx` (2 findings).** These
  are the `mask-image` declarations that give the hero's moving light its soft edge, not a
  background wash. The rule refuses "a saturated radial wash fading to transparent behind a dark
  page"; this is the aperture a photograph is revealed through, sits in no stacking order behind
  content, and adds no colour. The actual vignette the rule is aimed at *was* found and removed —
  it is now two linear scrims at the edges where the navigation and buttons sit.

- **IM-039 Tight line height — `styles/brand.css` (2 findings).** `.smashr-display` sets 0.95 and
  `.smashr-display-xl` 0.9. The rule's floor of 1.3 is a body-text floor; display type set at 1.5
  reads as separate sentences rather than one block, which is the entire premise of the brutalist
  stack. Running text on this site never carries these classes — it uses `leading-relaxed`.

- **IM-046 Wide letter spacing — `components/sections/hero.tsx`.** The 0.22em tracking on
  "WE SMASH. YOU EAT." matches the lettering on the restaurant's own wall. The rule permits wide
  tracking on "short uppercase labels", which this is; the detector reads it as body text because
  it is a `<p>`. Every genuine instance the rule was aimed at was fixed: the footer copyright line
  lost its label treatment, and the menu card's channel line came down to 0.05em.

`IM-027 Crushed letter spacing` was *not* waived. Probing showed the detector treats any negative
tracking as past the −0.04em floor, so the negative tracking was removed outright rather than
tuned — Archivo Black is narrow enough at display sizes that nothing was lost.

## Environment

- **`next dev` and `next build` run through Turbopack on this workstation.** The project path
  contains `!` (`F:\Klivo\! PROJEKTEK\SmashR`), a character webpack refuses in a context path, so
  the webpack builder cannot start here. `npm run build` is still the webpack build — that is what
  the Docker image and CI run, where the path is `/app` — and `npm run build:turbo` is the local
  escape hatch. Both were verified green.
