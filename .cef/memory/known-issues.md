# Known Issues

## Release blockers

- **The legal documents are unfilled drafts.** `content/legal.ts` carries bracketed placeholders
  wherever a value can only come from the operator's company records — company name, registered
  address, company registration number, tax number, registering court, e-mail address, legal
  representative, and the hosting provider's details. `cef review` reports this as a Content
  blocker, correctly: the site must not go live until those are filled and the four documents have
  been read by a qualified legal professional. All four pages carry a visible review notice and are
  served `noindex` until then. Nothing was invented to make the gate pass.

- **`public/security.txt` names an unmonitored address.** `security@smashr.hu` is a placeholder from
  the scaffold. Point it at a real inbox before launch, and move the `Expires` date forward.

## Open, non-blocking

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
