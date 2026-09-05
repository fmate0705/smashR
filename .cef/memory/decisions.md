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

- **The wordmark ships as SVG, generated from one source drawing.** The client supplied a cleaned
  vector (2026-09-05, kept as `assets/source/smashr-logo-clean.svg`) whose curves are noticeably
  smoother than the traced original — one compound path with an even-odd fill, which is what keeps
  the counters in the S, the a and the R open. `npm run assets` writes the three colourways in
  `public/brand/` from it (brand red, white, `currentColor`) and then renders the two PNGs the
  Open Graph route and the schema.org `logo` need, plus the icons and the favicon. Nothing in that
  chain is hand-edited any more, so the next set of curves is one file drop and one command.

  The red is `--smashr-red` rather than the `#e60000` the supplied file was exported with: a
  wordmark a shade off the buttons beside it reads as a mistake. Say so if that was deliberate.

  The mark carries no background, so it sits directly on tile, on beige and on paper. In the hero
  it gets `.smashr-logo-shadow` — two black drop-shadows, a tight one for the thin joins and a
  wide soft one that only shows where the moving light falls on the tiles, so the sign casts its
  shadow with the light rather than having one painted underneath it.

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

## Editable content and the admin

- **Two tiers, and the split is deliberate.** What the *kitchen* changes week to week — the menu,
  the opening hours, the phone number, which four items lead the home page — lives in a content
  store behind a login at `/admin`. What the *operator* sets once at handover — company name,
  registration numbers, the data-protection address, the hosting provider — comes from environment
  variables. Nobody should have to open an editor to correct a VAT number, and nobody should have
  to redeploy to change a price.

- **A JSON file, not a database.** One restaurant, one editor, a few dozen rows. A database would
  add a service to run, a connection to fail and a migration to forget, and would buy nothing at
  this size. `lib/store/store.ts` writes to a temporary file and renames it into place, because
  `rename` is atomic on one filesystem: a reader sees the whole old document or the whole new one.
  The file lives at `SMASHR_DATA_DIR` (`/data` in the image) — outside `.next`, because the build
  output is replaced on every deploy and text the restaurant typed has to survive that. Both
  compose files mount a volume there.

- **The pages stay static.** Nothing was made dynamic to get editable content. `readContent()` is
  a file read wrapped in React's request cache, and every save calls `revalidatePath` for the five
  content routes. Verified in the production container: a price saved in `/admin` appeared on
  `/etlap` and `/` on the next request, with both still prerendered.

- **Everything that reaches the store is normalised.** `lib/store/document.ts` is pure and coerces
  rather than throws: a form can be posted by hand and the volume can be edited. Menu *order* and
  product *photography* never come from input — order is a design decision and a photograph is a
  promise about what the kitchen sends. An id the build does not know is dropped; an id the store
  has not heard of is added from the shipped copy, so a deploy can introduce an item without the
  restaurant re-entering it. One bug came out of writing its tests: `Number(null)` and `Number('')`
  are both 0, so a cleared price field published a burger at 0 Ft instead of keeping the last one.

- **`scrypt:` not `scrypt$`.** The password hash format uses colons. The usual dollar-separated
  form breaks in transit: dotenv expands `$name` inside a value and compose expands it again, so
  the salt and key arrive empty and the login fails with nothing in any log to explain it. Found
  by hitting it — the first hash written to `.env` could not sign in.

- **Every server action re-checks the session.** A server action is a public HTTP endpoint whatever
  the page around it looks like, so `requireSession()` runs inside each one; the check on the page
  decides what is *drawn*, the check in the action decides what is *allowed*.

- **No "create the first admin" screen.** `scripts/hash-password.mjs` prints the hash and a session
  secret. A setup page reachable before anyone has logged in is the oldest way to hand a site to a
  stranger.

## The `(site)` route group

The public pages moved to `app/(site)/` so the admin does not inherit the restaurant's navigation,
footer and cookie banner. The root layout is now the document shell only — fonts, tokens, metadata.

Three things worth remembering:

- **`not-found.tsx` stays at the root.** Next resolves an unmatched URL against the root
  not-found, which is rendered by the root layout alone — moving it into the group silently
  replaced the branded 404 with Next's own grey one. It now draws the chrome itself through
  `components/site/site-chrome.tsx`, which `(site)/layout.tsx` uses as well.

- **`cef review` maps a route to `app/<path>/page.tsx` and does not strip the group segment.** The
  seven remaining *"Internal link has no matching page"* findings — `/`, `/etlap`, `/rolunk` — are
  artefacts of that, not broken links. All five routes return 200 in the running container.

- **Two accessibility blockers turned out to be this codebase's own prose.** The reviewer's
  html-lang and img-alt checks are regexes over source text, and a comment in the site layout
  wrote out an html tag while one in `components/sections/hero.tsx` wrote out an img tag. Both
  were read as real markup — a second root layout without `lang`, an image without `alt`. The
  comments now name the elements in words, and the gate passes 100/100. Before writing a tag
  inside a comment in this project: the gate reads comments too.

## Tooling

- **`cef memory update` overwrites the hand-written memory files.** It regenerates
  `.cef/memory/*.md` from the manifest, and it flattened `decisions.md` from 93 lines to an 8-line
  scaffold stub, `known-issues.md` from 40 to 3 and `todos.md` from 102 to 65. Restored with
  `git checkout`. Treat it exactly like `cef generate`: it is a scaffold step, and this project is
  past it. Write to these files by hand.

## Production and SEO audit (2026-09-05)

Measured against the real Docker image, not the dev server: headers, caching and image selection
only tell the truth there.

- **Every page's share card was missing.** Next merges metadata shallowly, so a page that declares
  its own `openGraph` replaces the layout's entirely — type, locale, site name and the file-based
  `opengraph-image` went with it. Five of the six pages had no `og:image`; the two nobody shares,
  which declared no `openGraph`, kept theirs. `lib/seo/metadata.ts` now builds the whole object in
  one place, so it cannot come apart one page at a time. Its parameter is called `canonical`
  rather than `path` partly because that is what it is and partly because `cef review` reads the
  word off the page that declares it.

- **`/schema.json` was emitting `null` for the restaurant and the menu.** The two builders became
  async when the content store landed and the route still put the *functions* into the graph.
  Caught by reading the endpoint rather than by any gate. Both it and `/llms.txt` are now in the
  admin's `revalidatePath` list.

- **`/llms.txt` is a route, not a file.** Half of what it states — phone, hours, which items are
  on the menu — is editable in the admin, and a static copy in `public/` would be wrong the first
  time the restaurant corrected it. Its opening hours are rendered from the schema.org day codes
  rather than the editable Hungarian label, because the document's whole audience reads English.

- **The hero preload was firing on all six pages.** Only the home page draws that image. Moved on
  to the page that uses it; the other five stopped paying for a download they never used.

- **The hero shipped a duplicate width.** The 1.75x crop leaves 1573px and the pipeline does not
  upscale, so `-1920` and `-2560` were byte-identical files advertising the same `1573w`
  descriptor — a candidate the browser could never choose. Dropped to two widths.

- **The burger layers had one width for every viewport.** Five 900px cut-outs rendered at ~200px
  on a phone: 338KB to draw a third of that. They now ship at 480 and 900 with a `sizes` written
  from the stage's real measure, so a phone takes 139KB and a 2x desktop still gets the 900s.

- **The paper grain shipped at 1800px to be tiled at 340.** 120KB → 52KB, on every page with a
  paper section.

- **The first content image on `/rolunk` and `/smashr-experience` was lazy and low priority**
  despite being above the fold. `SmashImage` already had `priority`; those two call sites now use
  it, as `/etlap`'s first four cards already did.

Result on the production image, cold cache: LCP 0.55–0.95s on 4G and 1.3–2.2s on Fast 3G against
a 2.5s budget, CLS at most 0.025, home-page image weight 537KB → 269KB.

- **CLS 0.025 on `/etlap` at desktop is the font swap, and it stays.** Measured: the shift lands at
  494ms, one millisecond after `document.fonts.ready`, when the latin-ext faces Hungarian needs
  arrive and Archivo Black replaces the fallback. `display: 'optional'` would take it to zero by
  showing Impact to every first-time visitor instead, which on a brand this typographic is the
  worse trade. It is a quarter of the "good" threshold.

- **Sub-24px tap targets were checked, not assumed.** Thirteen elements are shorter than 24px —
  they are text links at their own line height. Every one passes WCAG 2.2 SC 2.5.8 through the
  spacing exception: the nearest neighbouring target's centre is at least 32px away on a phone and
  80px on a desktop.
