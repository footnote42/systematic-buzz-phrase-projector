# Implementation Plan: Animated Display Skins

**Branch**: `002-display-themes` | **Date**: 2026-06-03 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/002-display-themes/spec.md`

## Summary

Replace the `StaticDisplay` placeholder from spec 001 with three fully animated display skins — Split-Flap (CSS tile flip + Web Audio), Slot Machine (translateY scroll with bounce), and Dot-Matrix (setTimeout typewriter with cursor blink). All three implement the existing `DisplayProps` interface; `BuzzPhraseApp` selects the active skin by `theme`. A new `useReducedMotion` hook skips animations for users with reduced-motion preferences. The `useAudio` stub is upgraded to full Web Audio synthesis. No new npm dependencies are introduced.

---

## Technical Context

**Language/Version**: TypeScript 5.x / React 19.2.4 / Next.js 16.2.7

**Primary Dependencies**:
- Tailwind CSS 4 (existing) — utility classes for layout and colour tokens
- Web Audio API (browser built-in) — Split-Flap click synthesis
- `next/font/google` (Next.js built-in) — VT323 font for Dot-Matrix, self-hosted at build time

**Storage**: `localStorage` — new key `sbpp-dotmatrix-colour` (`'green' | 'amber'`, default `'green'`). Existing keys from spec 001 unchanged.

**Testing**: Vitest + jsdom (existing). Animation components exempt from unit tests per constitution §II. `useReducedMotion` gets a single SSR-guard unit test.

**Target Platform**: Browser (Chrome, Firefox, Safari, Edge — current versions). Viewport minimum: 375 px.

**Project Type**: Next.js App Router single-page client application

**Performance Goals**: 60 fps animations; First Load JS < 150 kB; TTI < 3 s on simulated mid-range mobile

**Constraints**:
- CSS `transform` and `opacity` only — no layout-reflow properties
- No animation libraries (Framer Motion, GSAP, Anime.js, etc.)
- Single `AudioContext` per page lifetime
- `prefers-reduced-motion: reduce` → skip animation, call `onAnimationComplete` immediately

**Scale/Scope**: 3 new components, 1 new hook, 1 hook upgrade, 1 new type, 1 component deleted

---

## Constitution Check

*Constitution version: 1.0.1 — checked 2026-06-03*

| Principle | Check | Status |
|---|---|---|
| §I — Strict TypeScript, no `any` | All new components and hooks use explicit types; `ColourVariant` added to `src/types/index.ts`. | ✅ PASS |
| §I — Single responsibility | Skins render only. `useReducedMotion` is pure state. `useAudio` owns audio side-effects. | ✅ PASS |
| §I — Function components only | All three skins are function components. | ✅ PASS |
| §I — Props interfaces in `types/` or co-located | `DisplayProps` and `ColourVariant` in `src/types/index.ts`. Internal state types are unnamed inferred types. | ✅ PASS |
| §I — No dead code | `StaticDisplay` is deleted. No commented-out blocks. | ✅ PASS |
| §II — Unit tests for pure utilities | `useReducedMotion` SSR guard tested. Animation components exempt per constitution. Canonical regressions unchanged. | ✅ PASS |
| §II — Build exits clean | TypeScript strict mode enforced; `npm run build` gate before merge. | ✅ PASS |
| §III — All three skins present identical controls | `BuzzPhraseApp` renders all controls. Skins render display area only (plus Dot-Matrix colour toggle which is part of the display area by design). | ✅ PASS |
| §III — Animation interruptible | Each skin cancels in-flight animation when `words` changes or component unmounts. | ✅ PASS |
| §III — Keyboard accessible | Interactive controls remain in `BuzzPhraseApp`, unchanged from spec 001. Dot-Matrix colour toggle is a `<button>` with keyboard support. | ✅ PASS |
| §III — Skin-switching instant | `SKIN_MAP[theme]` dispatch in `BuzzPhraseApp` renders new skin immediately with current phrase. | ✅ PASS |
| §III — localStorage on load | `sbpp-dotmatrix-colour` uses lazy `useState` initialiser with `typeof window` SSR guard. | ✅ PASS |
| §IV — Bundle < 150 kB | No new npm dependencies. VT323 via `next/font/google` adds ~8 kB (single weight, latin subset). | ✅ PASS |
| §IV — 60 fps, transform/opacity only | Split-Flap: `rotateX` transform. Slot Machine: `translateY` transform. Dot-Matrix: text-content update (no layout). Scanline: `background` on pseudo-element (paint only, compositor-friendly). | ✅ PASS |
| §IV — Single AudioContext | Created lazily in `useAudio` on first `playClick()`, stored in `useRef`, reused forever. | ✅ PASS |
| §IV — TTI < 3 s | No blocking resources. VT323 preloaded by `next/font`. | ✅ PASS |

**Gate result: ALL PASS — proceed to implementation.**

---

## Project Structure

### Documentation (this feature)

```text
specs/002-display-themes/
├── plan.md                        ← this file
├── research.md                    ← Phase 0 output
├── data-model.md                  ← Phase 1 output
├── quickstart.md                  ← Phase 1 output
├── contracts/
│   └── display-skin-contract.md  ← Phase 1 output
└── tasks.md                       ← /speckit-tasks output (not yet created)
```

### Source Code Changes

```text
src/
  app/
    layout.tsx                     MODIFY — add VT323 via next/font/google as CSS variable
    globals.css                    MODIFY — add @keyframes blink, @keyframes flipTop, @keyframes flipBottom
  components/
    BuzzPhraseApp.tsx              MODIFY — SKIN_MAP dispatch; pass columnWords to Slot Machine and Split-Flap
    display/
      StaticDisplay.tsx            DELETE
      SplitFlapDisplay.tsx         CREATE
      SlotMachineDisplay.tsx       CREATE
      DotMatrixDisplay.tsx         CREATE
  hooks/
    useAudio.ts                    MODIFY — upgrade stub to full Web Audio synthesis
    useReducedMotion.ts            CREATE
  types/
    index.ts                       MODIFY — add ColourVariant type

tests/
  unit/
    useReducedMotion.test.ts       CREATE — SSR fallback test (returns false when window undefined)
```

**Structure decision**: Single Next.js project. All changes within established `src/` layout from spec 001.

---

## Implementation Phases

### Phase 1: Foundation (sequential — blocks all skins)

Plumbing all three skins depend on. Create stub versions of skin components first so the build passes before full implementation.

1. Add `ColourVariant = 'green' | 'amber'` to `src/types/index.ts`
2. Create `src/hooks/useReducedMotion.ts` with lazy `useState` SSR guard
3. Create `tests/unit/useReducedMotion.test.ts` — verify SSR guard returns `false`
4. Upgrade `src/hooks/useAudio.ts` — lazy `AudioContext` in `useRef`, full noise burst synthesis
5. Add `@keyframes blink`, `@keyframes flipTop`, `@keyframes flipBottom` to `src/app/globals.css`
6. Add VT323 to `src/app/layout.tsx` via `next/font/google`; expose as `--font-vt323` CSS variable
7. Create stub `SplitFlapDisplay.tsx`, `SlotMachineDisplay.tsx`, `DotMatrixDisplay.tsx` (return `null` or static text temporarily)
8. Update `src/components/BuzzPhraseApp.tsx`:
   - Import all three skin components
   - Define `SKIN_MAP: Record<Theme, React.ComponentType<...>>`
   - Replace `<StaticDisplay>` with `<ActiveSkin words={...} isAnimating={...} onAnimationComplete={...} columnWords={...} />`
   - Derive `columnWords` from active matrix (passed to Slot Machine and Split-Flap; Dot-Matrix ignores it)
9. `npm run build` — must pass with stubs in place

### Phase 2: Slot Machine Skin (P2 — simplest, validates translateY)

Full `SlotMachineDisplay` implementation:
- Props: `DisplayProps & { columnWords: readonly [readonly string[], readonly string[], readonly string[]] }`
- Each column: `overflow: hidden` wrapper, height = `var(--slot-row-height)` (48px default)
- Reel inside each column: full `columnWords[i]` stacked vertically, dash entry prepended for empty state
- `targetIndex` derived from `words[i]` position in `columnWords[i]` (+1 for dash offset)
- `transition: transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1)`
- Interrupt: `useEffect` on `words` change — clear transition, snap, restore transition next frame
- `prefers-reduced-motion`: snap directly, call `onAnimationComplete` synchronously
- `onTransitionEnd` → call `onAnimationComplete` (guarded: only after the last column settles)
- Empty state: `targetIndex = 0` (dash entry visible), no transition on mount

### Phase 3: Split-Flap Skin (P1 — most complex)

Full `SplitFlapDisplay` implementation:
- Props: `DisplayProps & { columnWords: readonly [readonly string[], readonly string[], readonly string[]] }`
- `maxLengths`: `[Math.max(...columnWords[0].map(w => w.length)), ...]` — one per column
- Each panel: flex row of tile containers, count = `maxLengths[i]`
- Each tile: `position: relative; overflow: hidden` with top-half and bottom-half `<div>` children
- Top half shows upper half of current char; bottom half shows lower half of target char (via `clip-path: inset(50% 0 0 0)`)
- Flip sequence: `setTimeout` chain per tile, staggered 30ms; words sequentially
- On flip: play `useAudio().playClick()`
- `prefers-reduced-motion`: skip timeouts, set final chars, call `onAnimationComplete`
- `onAnimationComplete` called after final tile's last timeout fires
- All timeout IDs stored in `ref` array; cleanup in `useEffect` return
- Empty state: all tile positions show `-`

### Phase 4: Dot-Matrix Skin (P3)

Full `DotMatrixDisplay` implementation:
- Props: `DisplayProps` only (no `columnWords` needed)
- `phraseString`: `words.filter(Boolean).join(' ')` — empty when `words` is `['','','']`
- `displayedText` state: grows character by character; 40ms per char; extra 160ms pause at space positions
- `timeoutRef`: ref holding active timeout ID for cancellation
- Cursor: `<span className="animate-blink">█</span>` using `@keyframes blink` from globals.css
- Colour variant: lazy `useState` from `sbpp-dotmatrix-colour`; toggle `<button>` inside component
- Scanline: `::after` pseudo-element on display wrapper — `repeating-linear-gradient` overlay
- VT323: `font-[family-name:var(--font-vt323)]` Tailwind class on display element
- `prefers-reduced-motion`: set `displayedText` to full `phraseString`, call `onAnimationComplete`
- `onAnimationComplete` called after final character timeout
- Empty state: `displayedText = ''`; cursor blinks alone

### Phase 5: Cleanup and Verification

1. Delete `src/components/display/StaticDisplay.tsx`
2. `npm run build` — zero TypeScript errors
3. `npm run lint` — clean
4. `npm test` — all prior 40 tests pass + new `useReducedMotion` test
5. Manual browser run of all 12 quickstart scenarios
6. Lighthouse mobile TTI — < 3 s
7. Bundle size — First Load JS < 150 kB

---

## Complexity Tracking

> No constitution violations — no entries required.

---

## Key Planning Decisions

| Decision | Choice | Rationale |
|---|---|---|
| `'use client'` boundary | `BuzzPhraseApp.tsx` (unchanged) | Skin components are pure display; boundary stays at app root |
| `columnWords` prop on Slot Machine + Split-Flap | `readonly [readonly string[], readonly string[], readonly string[]]` passed from `BuzzPhraseApp` | Skins need full column lists for reel/panel construction; avoids importing matrix constants inside skin components |
| `useReducedMotion` pattern | Lazy `useState` init, no change listener | SSR-safe; consistent with spec 001; out-of-scope to react to real-time OS changes |
| Lazy `AudioContext` | Created on first `playClick()`, stored in `useRef` | Browser autoplay policy requires user gesture; lazy creation satisfies this naturally |
| Dot-Matrix colour variant | Internal state in `DotMatrixDisplay` | Skin-specific; does not belong in shared `BuzzPhraseApp` state |
| `StaticDisplay` | Deleted (Phase 5) | Dead code per constitution §I; git history preserves the file |
| VT323 font loading | `next/font/google` in `layout.tsx` | Self-hosted at build time; preloaded; zero runtime network request |
| Slot Machine interrupt | Remove `transition`, snap translateY, restore `transition` | CSS-only cancel; no JS animation frame needed |
| Split-Flap tile flip | Two-phase `setTimeout` (flipTop then flipBottom) | Matches real departure board mechanic; CSS-only with zero animation library |
