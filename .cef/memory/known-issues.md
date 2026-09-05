# Known Issues

## Release blockers

- **The legal documents are unfilled drafts.** They render a bracketed placeholder wherever a value
  can only come from the operator's company records — company name, registered address, company
  registration number, tax number, registering court, e-mail address, legal representative, and the
  hosting provider's details. All of them are now supplied through the `SMASHR_*` environment
  variables rather than edited into the source. `cef review` reports this as a Content blocker,
  correctly: the site must not go live until those are filled and the four documents have been read
  by a qualified legal professional. Nothing was invented to make the gate pass.

  The **"Munkapéldány" notice was removed from the pages on the client's instruction**
  (2026-09-05), along with the `review` flag that drove it. The documents stay `noindex` —
  obligatory text is not a search target — but nothing on the page now says the text is
  unreviewed, so this list is the only remaining record that it is.

- **`public/security.txt` names an unmonitored address.** `security@smashr.hu` is a placeholder from
  the scaffold. Point it at a real inbox before launch, and move the `Expires` date forward.

## Open, non-blocking

- **Two `cef review` SEO findings are deliberate, and they cost the gate 25 points.** The reviewer
  checks for `public/llms.txt` (major) and `public/schema.json` (minor) as files. Both are served
  as routes instead — `app/llms.txt/route.ts` and `app/schema.json/route.ts` — because both state
  the phone number, the opening hours and the menu, all of which the restaurant edits in `/admin`.
  A static copy would be wrong the first time any of them changed, and nobody would see it happen.
  Both endpoints return 200 with the right content type, which is all a crawler asks. The SEO gate
  reads 75/100 for this reason and for no other.

- **An invented `/jogi-informaciok/<slug>` returns HTTP 200 with the 404 page inside it.** The
  route is `force-dynamic` so the operator's environment variables are read per request, and Next
  has already begun streaming a 200 by the time `notFound()` throws. `dynamicParams = false` would
  give the real status, but only for a prerendered route — which is the thing this page cannot be
  without freezing the impressum at build time. The metadata for an unknown slug says
  `noindex, nofollow`, so the page cannot be indexed; the visitor sees the 404 either way. Every
  other unmatched URL on the site returns a real 404.

- **Five Impeccable findings stand deliberately** (0 blockers, 5 major). Two mask gradients read as
  background halos, display leading reads as body leading, and the brand tagline's tracking reads as
  body tracking. Each is reasoned in `decisions.md`; each was probed before being accepted. This is
  what holds the Design Craft gate at 24/100.

- **Two Motion findings stand deliberately** (both advisory). GS-14 flags the masked line reveal in
  `AnimatedHeading` as vestibular parallax — the element is clipped, so there is no depth illusion.
  GS-26 flags the hero's `getBoundingClientRect()` as hand-rolled presence animation — it is
  measuring for pointer tracking, and this project has no Framer Motion.

- **`cef review` wants `public/schema.json` as a file.** It is served at `/schema.json` from
  `app/schema.json/route.ts` instead, built from the same modules the pages render. A static copy
  would be a second source of truth for the address, hours and every price.

- **15 Impeccable rules and 4 scroll rules are owed to browser validation.** They cannot be decided
  from source. The screenshot pass (`npm run qa`) covers the same ground informally at three
  viewports plus reduced motion, but a formal browser validation run has not been recorded.

## Environment

- **webpack cannot build on this workstation.** The project path contains `!`, which webpack rejects
  in a context path. `npm run dev` and `npm run build:turbo` use Turbopack; `npm run build` (webpack)
  is verified green inside Docker, where the path is `/app`.
