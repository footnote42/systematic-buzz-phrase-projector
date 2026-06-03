# Tasks: Animated Display Skins

**Input**: Design documents from `specs/002-display-themes/`

**Branch**: `002-display-themes`

**Prerequisites**: plan.md ✅ · spec.md ✅ · research.md ✅ · data-model.md ✅ · contracts/display-skin-contract.md ✅ · quickstart.md ✅

**Tests**: `useReducedMotion` SSR guard test included per constitution §II. Animation components (SplitFlapDisplay, SlotMachineDisplay, DotMatrixDisplay) are exempt from unit tests per constitution §II.

**Organisation**: Tasks grouped by user story. Phase 2 stub scaffolding enables a passing build before any skin is fully implemented.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: [US1] = Split-Flap · [US2] = Slot Machine · [US3] = Dot-Matrix

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add the new type, hook skeletons, CSS keyframes, and font loading that all three skins depend on. No skin component work yet.

- [x]  [P] Add `ColourVariant = 'green' | 'amber'` type export to `src/types/index.ts`
- [x]  [P] Create `src/hooks/useReducedMotion.ts` — lazy `useState` initialiser with `typeof window === 'undefined'` SSR guard; returns `false` on server, `window.matchMedia('(prefers-reduced-motion: reduce)').matches` on client; no change listener
- [x]  Create `tests/unit/useReducedMotion.test.ts` — single test: mock `window` as `undefined` and assert hook returns `false` (SSR guard)
- [x]  [P] Upgrade `src/hooks/useAudio.ts` from no-op stub to full Web Audio synthesis — lazy `AudioContext` in `useRef` (created on first `playClick()` call); `playClick()` creates a 220-sample white-noise buffer (`createBuffer(1, 220, 44100)`), routes through `BiquadFilter` (`type: 'bandpass'`, `frequency: 2000`, `Q: 1`), and calls `source.start()`; is a no-op when `isMuted` is true
- [x]  [P] Add `@keyframes blink { 0%, 100% { opacity: 1 } 50% { opacity: 0 } }`, `@keyframes flipTop`, and `@keyframes flipBottom` to `src/app/globals.css`
- [x]  [P] Add VT323 font via `next/font/google` in `src/app/layout.tsx` (subsets: `latin`, display: `swap`); expose as `--font-vt323` CSS variable on `<html className={vt323.variable}>`

**Checkpoint**: All shared plumbing in place. Stub components can now be scaffolded in Phase 2.

---

## Phase 2: Foundational (BuzzPhraseApp Wiring)

**Purpose**: Scaffold stub skin components and wire the `SKIN_MAP` dispatch in `BuzzPhraseApp`. The app must build cleanly before any US implementation begins.

**⚠️ CRITICAL**: T011 (`npm run build` passing) MUST complete before any Phase 3/4/5 work starts.

- [x]  [P] Create stub `src/components/display/SplitFlapDisplay.tsx` — props: `DisplayProps & { columnWords: readonly [readonly string[], readonly string[], readonly string[]] }`; renders a static `<div>` placeholder; calls `onAnimationComplete()` synchronously in a `useEffect`
- [x]  [P] Create stub `src/components/display/SlotMachineDisplay.tsx` — same props contract as T007; renders a static `<div>` placeholder; calls `onAnimationComplete()` synchronously in a `useEffect`
- [x]  [P] Create stub `src/components/display/DotMatrixDisplay.tsx` — props: bare `DisplayProps`; renders a static `<div>` placeholder; calls `onAnimationComplete()` synchronously in a `useEffect`
- [x]  Update `src/components/BuzzPhraseApp.tsx` — import all three stub skins; define `SKIN_MAP: Record<Theme, React.ComponentType<DisplayProps>>` (use type cast for `columnWords` skins); replace `<StaticDisplay>` with `const ActiveSkin = SKIN_MAP[theme]`; derive `columnWords` from the active matrix constant and pass it to Split-Flap and Slot Machine skins; Dot-Matrix receives bare `DisplayProps`
- [x]  Run `npm run build` — must exit with zero TypeScript errors and report First Load JS under 150 kB; fix any type errors before proceeding

**Checkpoint**: App builds with stub skins. All phrases render statically. Phases 3, 4, and 5 can now proceed — they target different files and are independent.

---

## Phase 3: User Story 1 — Split-Flap Display Skin (Priority: P1) 🎯 MVP

**Goal**: Replace the `SplitFlapDisplay` stub with a fully animated two-phase tile-flip implementation with Web Audio click synthesis.

**Independent Test**: Select "Split-Flap" theme → click Generate → character tiles in each word panel flip left-to-right with a 30ms stagger and an audible click per tile → Generate button re-enables after all tiles settle → mute toggle silences clicks without affecting visual → clicking Generate mid-animation cancels in-flight animation and starts a new one.

### Implementation for User Story 1

- [x]  [US1] Implement tile DOM structure in `src/components/display/SplitFlapDisplay.tsx` — compute `maxLengths: [Math.max(...columnWords[0].map(w => w.length)), ...]`; render three word panels as flex rows of tile containers (`position: relative; overflow: hidden; perspective: 400px`); each tile has a top-half `<div>` and bottom-half `<div>` (`clip-path: inset(50% 0 0 0)`); empty state fills all positions with `-`; words shorter than `maxLengths[i]` are padded with trailing `-` characters
- [x]  [US1] Implement the two-phase flip animation loop in `src/components/display/SplitFlapDisplay.tsx` — on `isAnimating` becoming `true`, build a `setTimeout` chain: for each word in sequence, for each tile left-to-right with 30ms stagger, apply `@keyframes flipTop` to the top half then `@keyframes flipBottom` to the bottom half, then update the displayed character; store all timeout IDs in a `useRef<ReturnType<typeof setTimeout>[]>`; call `onAnimationComplete()` after the final tile's last timeout fires
- [x]  [US1] Complete `src/components/display/SplitFlapDisplay.tsx` — call `useAudio().playClick()` on each tile flip; add `useReducedMotion()` fast-path (skip all timeouts, set displayed chars to final state, call `onAnimationComplete` synchronously); implement interrupt on new `words` (clear all pending timeouts, restart the chain); add `useEffect` cleanup on unmount (clear all pending timeouts)

**Checkpoint**: Split-Flap skin fully functional. Manually verify quickstart scenarios 1, 2, 3, 4, 5, 9, 10, 12. Commit before starting Phase 4.

---

## Phase 4: User Story 2 — Slot Machine Display Skin (Priority: P2)

**Goal**: Replace the `SlotMachineDisplay` stub with a vertically scrolling reel implementation that decelerates with a visible bounce to land on each target word.

**Independent Test**: Select "Slot Machine" theme → click Generate → three vertical columns scroll upward rapidly and settle with a bounce → switching theme mid-animation shows the phrase instantly in the new skin → all column words fit without overflow or clipping at 375 px viewport width.

### Implementation for User Story 2

- [x]  [US2] Implement reel layout in `src/components/display/SlotMachineDisplay.tsx` — each column is an `overflow: hidden` window (`height: var(--slot-row-height, 48px)`); inside, a reel `<div>` stacks a leading dash entry followed by the full `columnWords[i]` array, each item in a fixed-height row; derive `targetIndex` from `words[i]`'s position in `columnWords[i]` plus 1 (for dash offset); empty state: `targetIndex = 0` (dash visible), no transition on mount
- [x]  [US2] Implement scroll animation in `src/components/display/SlotMachineDisplay.tsx` — apply `transform: translateY(calc(-${targetIndex} * var(--slot-row-height, 48px)))` with `transition: transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1)` when `isAnimating` becomes true; call `onAnimationComplete()` in the `onTransitionEnd` handler of the final (third) column
- [x]  [US2] Implement interrupt and reduced-motion handling in `src/components/display/SlotMachineDisplay.tsx` — interrupt: set `transition: none` via inline style, snap `translateY` to new target immediately, restore transition on the next animation frame (`requestAnimationFrame`); `useReducedMotion()` fast-path: skip transition, snap directly, call `onAnimationComplete` synchronously; `useEffect` cleanup on unmount

**Checkpoint**: Slot Machine skin fully functional. Manually verify quickstart scenarios 3, 4, 5, 6, 9, 10, 11, 12. Commit before starting Phase 5.

---

## Phase 5: User Story 3 — Dot-Matrix Display Skin (Priority: P3)

**Goal**: Replace the `DotMatrixDisplay` stub with a character-by-character typewriter implementation with blinking block cursor, colour variant toggle, and CRT scanline overlay.

**Independent Test**: Select "Dot-Matrix" theme → click Generate → phrase types out left-to-right with 40ms per character and a 160ms pause at each word boundary → blinking cursor visible at insertion point during and after typing → colour toggle switches green/amber instantly without re-animating → colour preference persists on page reload → scanline overlay visible.

### Implementation for User Story 3

- [x]  [US3] Implement typewriter character reveal in `src/components/display/DotMatrixDisplay.tsx` — `phraseString = words.filter(Boolean).join(' ')`; `displayedText` state grows one character per `setTimeout` (40ms per char; extra 160ms delay when the appended character is a space); `timeoutRef: useRef<ReturnType<typeof setTimeout> | null>` stores active timeout ID; render `{displayedText}` followed by a `<span className="animate-blink">█</span>` cursor; apply VT323 font via Tailwind class `font-[family-name:var(--font-vt323)]`; empty state shows cursor alone (phraseString is empty)
- [x]  [US3] Implement colour variant toggle and localStorage persistence in `src/components/display/DotMatrixDisplay.tsx` — lazy `useState` initialiser reads `localStorage.getItem('sbpp-dotmatrix-colour')` with `typeof window === 'undefined'` SSR guard; defaults to `'green'`; render a `<button>` inside the component that toggles between `'green'` and `'amber'` and writes to localStorage; apply phosphor colour via conditional CSS class (green: `text-green-400`; amber: `text-amber-400` — or equivalent Tailwind tokens)
- [x]  [US3] Implement scanline overlay, interrupt handling, reduced-motion fast-path, and `useEffect` cleanup in `src/components/display/DotMatrixDisplay.tsx` — scanline: add a `relative` wrapper with `after:absolute after:inset-0 after:pointer-events-none` and `after:bg-[repeating-linear-gradient(to_bottom,transparent_0px,transparent_2px,rgba(0,0,0,0.05)_2px,rgba(0,0,0,0.05)_4px)]`; interrupt: `clearTimeout(timeoutRef.current)`, set `displayedText` to full `phraseString`, call `onAnimationComplete()`; `useReducedMotion()` fast-path: set full phrase immediately without any timeout; cleanup on unmount: `clearTimeout(timeoutRef.current)`; ensure `onAnimationComplete()` is called when typewriter reaches the last character

**Checkpoint**: All three skins complete and functional. Proceed to Phase 6 for cleanup and full verification.

---

## Phase 6: Polish & Verification

**Purpose**: Remove dead code, run all build and test gates, and verify all 12 quickstart scenarios manually.

- [x]  Delete `src/components/display/StaticDisplay.tsx` — dead code per constitution §I; all import references already replaced in T010
- [x]  Run `npm run build` — must exit with zero TypeScript errors; verify First Load JS is under 150 kB in the build output
- [x]  Run `npm run lint` — must exit clean; resolve any ESLint warnings or add justified `// eslint-disable-next-line` comments
- [x]  Run `npm test` — all existing regression tests must pass; new `useReducedMotion` SSR guard test (T003) must pass; verify total test count is 40+ (was 40 before this spec)
- [x]  Manual browser run of all 12 quickstart scenarios in `specs/002-display-themes/quickstart.md` — pay particular attention to canonical regressions (`257` Original → "systemised logistical projection"; `257` Modern → "generative telemetry alignment") and the reduced-motion scenario (Scenario 12)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No external dependencies — all [P] tasks can start immediately; T003 depends only on T002
- **Foundational (Phase 2)**: T007/T008/T009 [P] after Phase 1 completes; T010 depends on T007/T008/T009; T011 (build gate) depends on T010 — BLOCKS all user story phases
- **User Story Phases (3 / 4 / 5)**: All depend on T011 (build gate); each targets a different file so all three can proceed in parallel
- **Polish (Phase 6)**: Depends on Phases 3, 4, and 5 all complete

### User Story Dependencies

| Story | Depends on | Parallel with |
|---|---|---|
| US1 — Split-Flap (P1) | Phase 2 complete | US2, US3 |
| US2 — Slot Machine (P2) | Phase 2 complete | US1, US3 |
| US3 — Dot-Matrix (P3) | Phase 2 complete | US1, US2 |

### Within Each User Story

- T012 → T013 → T014 (sequential — same file, each task builds on the previous)
- T020 → T021 → T022 (sequential — same file, each task builds on the previous)
- T025 → T026 → T027 (sequential — same file, each task builds on the previous)

---

## Parallel Opportunities

### Phase 1 — all independent files

```
T001 (types/index.ts)        T002 (useReducedMotion.ts)    T004 (useAudio.ts)
T005 (globals.css)            T006 (layout.tsx)
→ then T003 (useReducedMotion.test.ts, depends on T002)
```

### Phase 2 — stubs independent, wiring sequential

```
T007 (SplitFlapDisplay stub)    T008 (SlotMachineDisplay stub)    T009 (DotMatrixDisplay stub)
→ then T010 (BuzzPhraseApp, depends on T007/T008/T009)
→ then T011 (npm run build — build gate)
```

### Phases 3, 4, 5 — different component files; all unblock simultaneously after T011

```
T012 → T013 → T014          T020 → T021 → T022          T025 → T026 → T027
(SplitFlapDisplay.tsx)       (SlotMachineDisplay.tsx)     (DotMatrixDisplay.tsx)
```

---

## Implementation Strategy

### MVP Scope (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational — T011 (`npm run build`) must pass
3. Complete Phase 3: User Story 1 — Split-Flap skin (T012 → T013 → T014)
4. **Validate**: Run quickstart scenarios 1, 2, 3, 4, 5, 9, 10, 12
5. The other two skins remain as static stubs — the app is functional but incomplete

### Incremental Delivery

1. Phase 1 + Phase 2 → foundation ready; app renders phrases in all three stub skins
2. Phase 3 (US1) → Split-Flap complete → validate → commit
3. Phase 4 (US2) → Slot Machine complete → validate → commit
4. Phase 5 (US3) → Dot-Matrix complete → validate → commit
5. Phase 6 → cleanup + full verification → branch ready for PR

### Implementation Order Note

The plan recommends implementing Slot Machine (US2) before Split-Flap (US1) when working solo, because Slot Machine is simpler and validates the `translateY` animation primitive first. This is a valid sequence — reverse Phase 3 and Phase 4 if preferred. The priority labels (P1, P2, P3) reflect product value order, not mandatory implementation order.

---

## Notes

- `[P]` tasks target different files with no dependencies — safe to execute in parallel
- All three skin components are exempt from unit tests per constitution §II; visual correctness is verified via `npm run dev` and the quickstart scenarios
- The `useReducedMotion` hook is the only new hook requiring a unit test (T003)
- Every stub (T007/T008/T009) MUST call `onAnimationComplete()` synchronously — if it does not, `isAnimating` stays `true` and the Generate button is permanently disabled
- `onAnimationComplete()` MUST be called in all code paths: natural completion, reduced-motion fast-path, and interrupt (only for the new animation's completion — never for the cancelled one)
- See `specs/002-display-themes/contracts/display-skin-contract.md` for the full behavioural contract that all three skins must satisfy
