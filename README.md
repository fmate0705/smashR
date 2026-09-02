# smashr

SmashR premium smashburger etterem Budapesten. Magyar nyelvu bemutatkozo weboldal: fooldal, rolunk, etlap, kapcsolat es SmashR Experience markaoldal. Friss marhahus, smash technika, street food kultura, Foodora es Wolt rendeles, terkep es utvonaltervezes.

Built with nextjs and typescript, scaffolded by the Claude Enterprise
Framework (CEF).

## Getting started

```bash
npm install
npm run dev
```

The app runs on http://localhost:3000.

## Scripts

- `npm run dev` — start the development server
- `npm run build` — build for production
- `npm run start` — run the production build
- `npm run lint` — lint with ESLint · `npm run format` — format with Prettier
- `npm run test` — run the test suite with Vitest
- `npm run verify` — run every gate in review order (types, lint, format, tests)

## Docker

```bash
docker compose up --build
```

## Project structure

This project follows the CEF conventions. See `CLAUDE.md` and `.cef/manifest.yaml` for the
enabled engines and configuration.

## Deployment

Target: **vercel**. See `.cef/project.json` for the full configuration.
