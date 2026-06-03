# Implementation Plan: Core Application — Buzz Phrase Projector

**Branch**: `001-core-app` | **Date**: 2026-06-03 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-core-app/spec.md`

## Summary

Build the complete data and state layer for the Systematic Buzz Phrase Projector: static word matrices, shared TypeScript types, phrase resolution utilities, core state hook, localStorage persistence, and all base UI components. The result is a fully functional single-page app where every feature (generate, manual lookup, favourites, preference persistence) works with a static text output placeholder standing in for the visual animation skins. The animation skins are delivered by spec `002-display-themes`, which consumes the `DisplayProps` interface defined here.

## Technical Context

**Language/Version**: TypeScript 5 (strict mode — `"strict": true` in tsconfig)

**Primary Dependencies**:
- Next.js 16.2.7 (App Router)
- React 19.2.4 with React Compiler (`babel-plugin-react-compiler 1.0.0` in devDependencies)
- Tailwind CSS 4 (`@tailwindcss/postcss`)
- Vitest + jsdom (to be installed — no test framework present yet)
- @testing-library/react (to be installed)

**Storage**: `window.localStorage` (client-side only). Keys: `sbpp-favourites`, `sbpp-mode`, `sbpp-theme`. Graceful no-op degradation when storage is unavailable (private browsing, quota exceeded).

**Testing**: Vitest with jsdom environment. Pure utility functions (`phraseResolver.ts`, `buzzwords.ts`) run in node environment. Hook tests and localStorage-dependent tests run with jsdom. See `research.md` §1 for full rationale.

**Target Platform**: Modern web browser (Chrome, Firefox, Safari, Edge). Deployed to Vercel.

**Project Type**: Web application — single standalone page, no shared nav or auth with the portfolio site in V1.

**Performance Goals**: <150 kB First Load JS (Next.js build output); <3 s TTI on simulated mid-range mobile (Lighthouse Mobile preset); 60 fps animations (animation implementation deferred to spec 002).

**Constraints**:
- No Framer Motion, GSAP, or heavy animation libraries — CSS transitions + Web Audio API only
- No backend, no external API calls in V1
- `'use client'` boundary at `BuzzPhraseApp.tsx`; `page.tsx` stays a Server Component
- React Compiler is active — do not write manual `useMemo`/`useCallback`; use immutable state updates

## Constitution Check

*Constitution version: 1.0.1 | Gate: must pass before implementation. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| §I — TypeScript strict mode | PASS | tsconfig strict already set in starter |
| §I — Single responsibility | PASS | hooks own state, constants export data, display components render only |
| §I — Function components only | PASS | no class components planned |
| §I — Props interfaces explicitly typed | PASS | shared types in `src/types/index.ts` |
| §I — No dead code | PASS | stubs (useAudio, themes.ts) export only their intended interface |
| §II — Unit tests for pure utilities | PASS | phraseResolver.ts and buzzwords.ts fully tested |
| §II — Canonical regression tests | PASS | `257 → "systemised logistical projection"` and `257 → "generative telemetry alignment"` as named tests |
| §II — Boundary condition tests | PASS | indices 0 and 9 (original/modern), 0 and 19 (chaos via randomiser), chaos manual single digit |
| §II — npm run build zero errors | **GATE** | hard stop before any merge |
| §II — npm run lint clean | **GATE** | hard stop before any merge |
| §III — Identical info architecture across skins | PASS | enforced by shared `DisplayProps` interface |
| §III — Animation interruptible | PASS | `isAnimating` flag with cancel path in `useBuzzword` (FR-009) |
| §III — Keyboard accessible | PASS | Enter/Space on GenerateButton; Enter on ManualInput (FR-015) |
| §III — Skin switching instant | PASS | theme change does not set `isAnimating`; phrase renders immediately in new skin |
| §III — localStorage restored on load | PASS | `useBuzzword` reads stored values synchronously before first render (FR-013) |
| §IV — <150 kB First Load JS | PASS | no heavy libraries; static word data bundled as typed constants |
| §IV — 60 fps animations | DEFERRED | animation implementation is spec 002 |
| §IV — Single AudioContext | DEFERRED | `useAudio.ts` is a no-op stub in spec 001 |
| §IV — <3 s TTI | PASS | no server round-trips; lightweight bundle |

**No violations. Complexity Tracking table omitted.**

## Project Structure

### Documentation (this feature)

```text
specs/001-core-app/
├── plan.md                      # This file
├── research.md                  # Phase 0 — tech decisions and rationale
├── data-model.md                # Phase 1 — TypeScript types and entity model
├── quickstart.md                # Phase 1 — developer setup instructions
├── contracts/
│   ├── display-props.md         # DisplayProps interface (consumed by spec 002)
│   └── localstorage-schema.md   # localStorage keys and JSON shapes
├── checklists/
│   └── requirements.md          # Spec quality checklist (from /speckit-specify)
└── tasks.md                     # Phase 2 — generated by /speckit-tasks
```

### Source Code (repository root)

```text
src/
  app/
    page.tsx              # Server Component — imports and renders <BuzzPhraseApp />
    layout.tsx            # Minimal shell — update title/description; remove Geist fonts
    globals.css           # @import 'tailwindcss'; app-level custom properties
  components/
    BuzzPhraseApp.tsx     # 'use client' boundary — top-level interactive wrapper
    ModeSelector.tsx      # Mode toggle: Original 1968 / Modern 2026 / Chaos
    ThemeSelector.tsx     # Theme toggle: Split-Flap / Slot Machine / Dot-Matrix
    ManualInput.tsx       # 3-digit code input with inline validation feedback
    GenerateButton.tsx    # Primary CTA randomiser button (keyboard: Enter/Space)
    FavouritesSidebar.tsx # Saved-phrases drawer with empty-state placeholder
    display/
      StaticDisplay.tsx   # Placeholder renderer (plain text); replaced by spec 002 skins
  hooks/
    useBuzzword.ts        # Core state: mode, theme, current phrase, isAnimating
    useLocalFavourites.ts # localStorage CRUD for saved phrases (key: sbpp-favourites)
    useAudio.ts           # No-op stub — full Web Audio synthesis in spec 002
  constants/
    buzzwords.ts          # ORIGINAL_MATRIX, MODERN_MATRIX, CHAOS_MATRIX (as const)
    themes.ts             # Theme display labels/metadata (stub; extended in spec 002)
  types/
    index.ts              # Mode, Theme, BuzzPhrase, BuzzState, DisplayProps, WordMatrix
  utils/
    phraseResolver.ts     # resolvePhrase(), validateCode(), buildPhraseId(), randomIndices()
    favouritesUtils.ts    # addToFavourites(), removeFromFavourites(), isFavourited() — pure functions

tests/
  unit/
    buzzwords.test.ts       # Matrix integrity (10/20 entries per column), canonical lookups
    phraseResolver.test.ts  # resolvePhrase(), validateCode(), buildPhraseId() boundary tests
    favourites.test.ts      # Add, remove, deduplication, 50-entry limit enforcement
  setup.ts                  # Vitest global setup (localStorage mock / reset between tests)
vitest.config.ts            # Vitest config (environment: jsdom, coverage: v8)
```

**`'use client'` strategy**: A single boundary at `BuzzPhraseApp.tsx` covers all interactive children. `page.tsx` remains a Server Component so Next.js can server-render the outer HTML shell (improving First Contentful Paint marginally). All child components of `BuzzPhraseApp` inherit the client context without needing their own `'use client'` directives.

## Complexity Tracking

> No constitution violations — table omitted.
