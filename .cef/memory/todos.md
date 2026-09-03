# TODOs

Status of the CEF capability checklist for this project. Unchecked items are genuinely outstanding,
not aspirational.

## Before launch

- [ ] Fill the bracketed placeholders in `content/legal.ts` from the operator's company records
- [ ] Have the four legal documents reviewed by a qualified legal professional, then flip
      `review: false` on each and drop the `noindex` in `app/jogi-informaciok/[dokumentum]/page.tsx`
- [ ] Point `public/security.txt` and `public/.well-known/security.txt` at a monitored inbox
- [ ] Create the hosting-platform client with slug `smashr` and the external network
      `client_smashr_net`, then deploy per `deploy/DEPLOY.md`
- [ ] Set `NEXT_PUBLIC_SITE_URL` in the platform's environment panel
- [ ] Confirm with the venue that a second social channel (Instagram/TikTok) exists before adding
      one to `content/site.ts` — only the Facebook page could be verified

## Core

- [x] Establish constitution and rules
- [x] Wire memory and decision log

## Architecture

- [x] Define structure and boundaries — three surfaces, one content layer, one motion layer
- [x] Record architecture decisions — `decisions.md`

## Design

- [x] Resolve design tokens — CEF primitives in `app/globals.css`, brand layer in `styles/brand.css`
- [x] Define component variants — two button variants, three surface tones

## Accessibility

- [x] Audit semantics and focus order — one `h1` per page, no heading jumps, no unnamed controls,
      no missing alt, no duplicate ids, verified across all seven routes
- [ ] Verify WCAG 2.2 AA conformance — automated structural checks pass; a manual pass with a
      screen reader and a keyboard-only run has not been recorded

## Components

- [x] Build the component library
- [x] Document component states — hover, focus-visible and reduced-motion states are in the source

## Docker

- [x] Author the reproducible Dockerfile
- [x] Verify a clean build — image builds and serves every route, 322 MB

## Deployment

- [x] Configure the release pipeline — compose matches the platform contract
- [ ] Verify rollback — needs the real platform

## Experience

- [x] Map primary user flows — order, plan a route, read the menu
- [x] Validate interaction patterns

## Legal

- [x] Draft required legal pages
- [ ] Confirm review by qualified counsel

## Motion

- [x] Define motion tokens — durations and easings in the brand layer
- [x] Apply purposeful, reduced-motion-safe transitions — every effect is inside a `matchMedia`
      branch keyed to `prefers-reduced-motion`

## Performance

- [x] Set the performance budget
- [x] Optimize Core Web Vitals — pre-built responsive WebP, preloaded hero, intrinsic sizes on every
      image, transform/opacity-only animation, 103 kB shared first-load JS
- [ ] Measure real Core Web Vitals against the deployed origin

## Platform

- [x] Configure framework and tooling
- [x] Set up build pipeline

## Security

- [x] Validate inputs at boundaries — the site takes no input; every outbound link is `noopener`
- [x] Set security headers and secrets policy — CSP, HSTS, nosniff, frame-deny, referrer and
      permissions policy in `next.config.mjs`, verified on the running container

## SEO

- [x] Author metadata and canonical URLs
- [x] Emit structured data and sitemap

## AI SEO

- [x] Structure content for answer engines
- [x] Publish llms.txt

## Validation

- [x] Run browser and responsive checks — `npm run qa`, 30 shots at 1440/834/390 plus reduced motion
- [ ] Clear review blockers — one remains, the legal placeholders above
