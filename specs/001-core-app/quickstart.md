# Quickstart: Core Application — Buzz Phrase Projector

**Branch**: `001-core-app`

## Prerequisites

- Node.js 20+ (LTS)
- npm 10+

## First-time setup

```bash
# Install app dependencies
npm install

# Install test dependencies (not yet in package.json)
npm install -D vitest @vitest/coverage-v8 jsdom @testing-library/react @testing-library/user-event
```

## Development

```bash
npm run dev
# → http://localhost:3000
```

## Tests

```bash
npx vitest run              # one-shot run
npx vitest                  # watch mode
npx vitest run --coverage   # with v8 coverage report
```

## Build and type-check

```bash
npm run build   # production build — exits non-zero on TypeScript errors (hard gate)
npm run lint    # ESLint via eslint-config-next (hard gate)
npm run start   # serve the production build locally
```

## Canonical regression verification

Manually enter these codes after `npm run dev`:

| Code | Mode | Expected phrase |
|------|------|-----------------|
| `257` | Original | "systemised logistical projection" |
| `257` | Modern | "generative telemetry alignment" |

These same lookups are also covered by the named regression tests in `tests/unit/buzzwords.test.ts`.
