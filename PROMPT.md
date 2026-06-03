# Handoff — Systematic Buzz Phrase Projector

## What was just completed

Spec 002: display-themes

Three animated retro display skins were implemented on top of the core data and state layer from spec 001. Each skin receives the current phrase via `DisplayProps` and signals completion via `onAnimationComplete`. The `SKIN_MAP` dispatch pattern in `BuzzPhraseApp` selects the active skin at runtime with no conditional rendering logic.

Key files created or significantly modified:

- `src/types/index.ts` — added `ColourVariant = 'green' | 'amber'`
- `src/hooks/useReducedMotion.ts` — SSR-safe reduced-motion hook (lazy `useState`)
- `src/hooks/useAudio.ts` — upgraded from stub to full Web Audio synthesis (white-noise burst, band-pass filter)
- `src/app/globals.css` — added `@keyframes blink`, `flipTop`, `flipBottom`
- `src/app/layout.tsx` — VT323 font via `next/font/google`, exposed as `--font-vt323`
- `src/components/BuzzPhraseApp.tsx` — `SKIN_MAP` dispatch, `getColumnWords`, `ActiveSkin` render
- `src/components/display/SplitFlapDisplay.tsx` — two-phase `rotateX` tile flip, 30ms stagger, Web Audio click
- `src/components/display/SlotMachineDisplay.tsx` — DOM-driven `translateY` with bounce easing, generation counter for interrupt safety
- `src/components/display/DotMatrixDisplay.tsx` — setTimeout typewriter, green/amber phosphor toggle, CRT scanline overlay
- `src/components/display/StaticDisplay.tsx` — deleted (dead code)
- `tests/unit/useReducedMotion.test.ts` — SSR guard test

## Current state

- Branch: `main`
- All tests passing: yes (41 tests)
- Build: passing (First Load JS under 150 kB)
- Deployed: no — not yet pushed to Vercel

## Next task

No pending spec. The next step is to run `/speckit-specify <feature description>` to start the next feature.

Candidates from the PRD (`Docs/PRD.md`) likely include:
- Favourites sidebar (save/recall phrases, localStorage)
- Vercel deployment and domain wiring
- Manual digit-code input (3-digit entry with per-mode validation)

Run `/speckit-specify <chosen feature>` to begin.

## Project quick-reference

- Dev server: `npm run dev` (localhost:3000)
- Tests: `npm test -- --run`
- Build: `npm run build`
- Lint: `npm run lint`
- British English throughout (identifiers, prose, UI copy — not Tailwind class names)
- Constitution: `.specify/memory/constitution.md`
- Verification: `257` Original → "systemised logistical projection" · `257` Modern → "generative telemetry alignment"
