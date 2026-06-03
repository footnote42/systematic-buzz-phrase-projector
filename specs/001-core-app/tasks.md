# Tasks: Core Application — Buzz Phrase Projector

**Input**: Design documents from `specs/001-core-app/`

**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/ ✅

**Tests**: Unit tests are explicitly required by the spec (SC-001, SC-002, SC-003) and constitution §II. Test tasks are included for all pure utility functions. UI components are verified by manual observation per spec acceptance scenarios.

**Organisation**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no incomplete dependencies)
- **[Story]**: Which user story this task belongs to (US1–US4)

---

## Phase 1: Setup

**Purpose**: Install test tooling and configure project infrastructure. No application code.

- [x] T001 Install test dependencies: `npm install -D vitest @vitest/coverage-v8 jsdom @testing-library/react @testing-library/user-event` — update `package.json` scripts to add `"test": "vitest run"` and `"test:watch": "vitest"`
- [x] T002 [P] Create `vitest.config.ts` at repo root — set environment to `jsdom`, include `tests/setup.ts` as a global setup file, configure v8 coverage provider scoped to `src/utils` and `src/constants`
- [x] T003 [P] Create `tests/setup.ts` — mock `window.localStorage` with a functional in-memory implementation; call `localStorage.clear()` in `afterEach` to isolate tests

**Checkpoint**: `npx vitest run` exits with "no test files found" (no failures).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core types, word matrices, utility functions, and display shell. MUST be complete before any user story begins.

**⚠️ CRITICAL**: No user story implementation can begin until this phase is complete.

- [x] T004 Create `src/types/index.ts` — export `Mode`, `Theme`, `WordMatrix`, `BuzzPhrase`, `BuzzState`, `DisplayProps`, `ValidationResult` exactly as defined in `specs/001-core-app/data-model.md`
- [x] T005 [P] Create `src/constants/buzzwords.ts` — define and export `ORIGINAL_MATRIX` (10 words/column, matching PRD §3.1), `MODERN_MATRIX` (10 words/column, matching PRD §3.2), and `CHAOS_MATRIX` derived by concatenating columns at module level; all matrices typed as `satisfies WordMatrix` with `as const`
- [x] T006 [P] Create `src/constants/themes.ts` — export a `THEME_LABELS` record mapping each `Theme` value to its display label (`'splitflap' → 'Split-Flap'`, `'slotmachine' → 'Slot Machine'`, `'dotmatrix' → 'Dot-Matrix'`); this is a stub that spec 002 will extend
- [x] T007 Create `tests/unit/buzzwords.test.ts` — write named tests: (a) each column of `ORIGINAL_MATRIX` has exactly 10 entries; (b) each column of `MODERN_MATRIX` has exactly 10 entries; (c) each column of `CHAOS_MATRIX` has exactly 20 entries; (d) **regression**: `ORIGINAL_MATRIX.column1[2]` is `"systemised"`, `ORIGINAL_MATRIX.column2[5]` is `"logistical"`, `ORIGINAL_MATRIX.column3[7]` is `"projection"`; (e) **regression**: `MODERN_MATRIX.column1[2]` is `"generative"`, `MODERN_MATRIX.column2[5]` is `"telemetry"`, `MODERN_MATRIX.column3[7]` is `"alignment"`; (f) first 10 entries of `CHAOS_MATRIX.column1` equal `ORIGINAL_MATRIX.column1`
- [x] T008 Create `src/utils/phraseResolver.ts` — implement and export: `MATRIX_SIZES` record; `buildPhraseId(mode, indices)` returning `"{mode}-{d1}{d2}{d3}"`; `resolvePhrase(mode, matrix, indices)` applying modulo per mode and returning a full `BuzzPhrase` (no `savedAt`); `validateCode(code, mode)` returning `ValidationResult` (must be exactly 3 chars, each a digit 0–9); `randomIndices(mode)` returning three independent random integers within the mode's matrix size
- [x] T009 Create `tests/unit/phraseResolver.test.ts` — write tests covering: (a) **canonical regression**: `resolvePhrase('original', ORIGINAL_MATRIX, [2,5,7])` returns words `["systemised","logistical","projection"]` and id `"original-257"`; (b) **canonical regression**: `resolvePhrase('modern', MODERN_MATRIX, [2,5,7])` returns words `["generative","telemetry","alignment"]` and id `"modern-257"`; (c) boundary index 0 in original/modern resolves correctly; (d) boundary index 9 in original/modern resolves correctly; (e) chaos boundary index 0 resolves to original column word; (f) chaos boundary index 19 resolves to modern column word (index 9 within modern); (g) `validateCode("257", 'original')` returns `valid: true` with indices `[2,5,7]`; (h) `validateCode("abc", 'original')` returns `valid: false`; (i) `validateCode("25", 'original')` returns `valid: false` (too short); (j) `validateCode("2577", 'original')` returns `valid: false` (too long); (k) `buildPhraseId('chaos', [0,3,4])` returns `"chaos-034"`
- [x] T010 Run `npx vitest run` — confirm all tests in `tests/unit/buzzwords.test.ts` and `tests/unit/phraseResolver.test.ts` pass with no failures
- [x] T011 [P] Create `src/components/display/StaticDisplay.tsx` — mark `'use client'`; accept `DisplayProps`; call `onAnimationComplete()` immediately via `useEffect` when `isAnimating` becomes true; render `<p>{words.filter(Boolean).join(' ')}</p>` as plain text; exact prop shape from `specs/001-core-app/contracts/display-props.md`
- [x] T012 Update `src/app/layout.tsx` — set `metadata.title` to `"Systematic Buzz Phrase Projector"` and `metadata.description` to `"A digital homage to Philip Broughton's 1968 management jargon matrix."`; remove Geist font imports and their CSS variables; keep `<html lang="en">` and minimal `<body>` wrapper
- [x] T013 Replace `src/app/page.tsx` — make it a Server Component (no `'use client'`); import and render `<BuzzPhraseApp />` from `@/components/BuzzPhraseApp`; no props needed
- [x] T014 Create `src/components/BuzzPhraseApp.tsx` — mark `'use client'`; establish the client boundary; render a structural skeleton with placeholder `<div>` regions for: mode selector, theme selector, display area, generate button, manual input, and favourites trigger; no logic yet — layout scaffold only

**Checkpoint**: `npm run build` exits clean. `npm run dev` loads at localhost:3000 with the skeleton layout. All unit tests pass.

---

## Phase 3: User Story 1 — Generate a Random Phrase (Priority: P1) 🎯 MVP

**Goal**: Users can generate a random phrase in any mode by clicking the Generate button. Mode switching clears the current phrase. The phrase displays as plain text via StaticDisplay.

**Independent Test**: Load the page → click Generate in Original mode → three-word phrase appears → switch to Modern → click Generate → different three-word phrase appears → switch to Chaos → Generate → phrase drawn from 20-word columns. Switching mode clears the display.

- [x] T015 [US1] Create `src/hooks/useBuzzword.ts` — expose: `mode` state (default `'original'`); `theme` state (default `'splitflap'`); `current: BuzzPhrase | null` (default `null`); `isAnimating: boolean`; `setMode(mode: Mode)` — updates mode, clears `current`, resets any in-flight animation; `generate()` — calls `randomIndices(mode)`, calls `resolvePhrase`, sets `current`, sets `isAnimating: true`; `handleAnimationComplete()` — sets `isAnimating: false`; all state updates are immutable (spread, not mutate); do NOT add localStorage or submitCode yet
- [x] T016 [P] [US1] Create `src/components/ModeSelector.tsx` — render three buttons/tabs: "Original 1968", "Modern 2026", "Chaos"; highlight the active mode; call an `onModeChange(mode: Mode)` prop on click; keyboard accessible
- [x] T017 [P] [US1] Create `src/components/GenerateButton.tsx` — render a primary button labelled "Generate"; accept `onGenerate: () => void` and `disabled: boolean` props; disable when `disabled` is true; respond to `Enter` and `Space` keyboard events (standard button behaviour)
- [x] T018 [US1] Wire `BuzzPhraseApp.tsx` — call `useBuzzword()`; render `<ModeSelector>` passing mode + setMode; render `<GenerateButton>` passing generate + isAnimating as disabled; render `<StaticDisplay>` passing `current?.words ?? ['','','']`, `isAnimating`, and `handleAnimationComplete`
- [x] T019 [US1] Manual verify: `npm run dev` → click Generate in each mode → phrases display correctly with correct words for each mode; switching mode clears the display; Generate button is disabled while StaticDisplay is "animating" (briefly, since StaticDisplay resolves immediately)

**Checkpoint**: User Story 1 is fully functional and independently testable. MVP deliverable.

---

## Phase 4: User Story 2 — Manual Code Lookup (Priority: P2)

**Goal**: Users can type a 3-digit code and submit it to resolve the exact corresponding phrase. Invalid inputs display an error message. The canonical phrases are reachable by code.

**Independent Test**: Enter `257` in Original mode → "systemised logistical projection" appears. Enter `257` in Modern mode → "generative telemetry alignment" appears. Enter `"abc"` → error shown, no phrase rendered. Enter `"25"` → error shown. Press Enter in the input field → submits without clicking a button.

- [x] T020 [US2] Extend `src/hooks/useBuzzword.ts` — add `validationError: string | null` state; add `submitCode(code: string)` action — calls `validateCode(code, mode)`, on invalid sets `validationError` and clears `current`, on valid clears `validationError`, resolves phrase via `resolvePhrase`, sets `current` and `isAnimating: true`; clear `validationError` when `setMode` is called
- [x] T021 [US2] Create `src/components/ManualInput.tsx` — render a single `<input type="text">` with `maxLength={3}`; filter non-digit keystrokes on `onKeyDown` (allow only `0`–`9`, Backspace, Delete, Tab, arrow keys); call `onSubmit(value: string)` prop on `Enter` keypress; render `validationError` prop as an inline error message when non-null; accept `disabled` prop (disable during animation); include an accessible label
- [x] T022 [US2] Wire `ManualInput` into `BuzzPhraseApp.tsx` — pass `submitCode` as `onSubmit`, `validationError` from hook state, and `isAnimating` as `disabled`
- [x] T023 [US2] Manual verify: enter `257` in Original → "systemised logistical projection"; enter `257` in Modern → "generative telemetry alignment"; enter `abc` → error appears; enter `25` → error appears; press Enter in input → phrase resolves; switch mode → error clears

**Checkpoint**: Manual code lookup works; canonical regression phrases confirmed by hand; errors display correctly.

---

## Phase 5: User Story 3 — Save and Review Favourite Phrases (Priority: P3)

**Goal**: Users can favourite the currently displayed phrase, view saved phrases in a sidebar, remove individual entries, copy phrases to clipboard, and find their collection restored after closing the browser.

**Independent Test**: Generate a phrase → star it → phrase appears in sidebar with mode badge → close and reopen browser → phrase still present → click Remove → phrase gone → open sidebar with no saved phrases → instructional placeholder shown.

- [x] T024 [US3] Create `src/utils/favouritesUtils.ts` — implement and export pure functions: `addToFavourites(collection: BuzzPhrase[], phrase: BuzzPhrase): BuzzPhrase[]` (deduplicates by `id`, prepends with `savedAt: Date.now()`, enforces 50-entry limit by removing lowest `savedAt`); `removeFromFavourites(collection: BuzzPhrase[], id: string): BuzzPhrase[]`; `isFavourited(collection: BuzzPhrase[], id: string): boolean`
- [x] T025 [P] [US3] Create `tests/unit/favourites.test.ts` — write tests covering: (a) adding a phrase prepends it with `savedAt`; (b) adding a duplicate phrase removes the old entry and prepends a new one with updated `savedAt`; (c) adding a 51st phrase removes the entry with the lowest `savedAt`; (d) removing a phrase by id returns collection without it; (e) removing a non-existent id returns the collection unchanged; (f) `isFavourited` returns true for a saved id, false otherwise
- [x] T026 [US3] Create `src/hooks/useLocalFavourites.ts` — mark `'use client'`; initialise `favourites` state by parsing `sbpp-favourites` from localStorage on mount (graceful degradation: return `[]` on parse error or unavailable storage); expose `favourites: BuzzPhrase[]`; `toggleFavourite(phrase: BuzzPhrase)` — calls `addToFavourites` or `removeFromFavourites` depending on `isFavourited`, updates state and writes to localStorage via `safeSet`; `isFavourited(id: string): boolean`; implement `safeGet`/`safeSet` helpers that wrap localStorage in `try/catch`
- [x] T027 [US3] Run `npx vitest run` — confirm `tests/unit/favourites.test.ts` passes
- [x] T028 [US3] Create `src/components/FavouritesSidebar.tsx` — accept props: `phrases: BuzzPhrase[]`; `onRemove(id: string): void`; `isOpen: boolean`; `onClose(): void`; render a drawer/panel that is always mountable (visibility controlled by `isOpen`); show instructional placeholder ("Generate a phrase and star it to save it here") when `phrases` is empty; when non-empty, render entries in reverse-chronological order (array is already stored in order), each showing: full phrase text, mode badge, the original index code (e.g. `"257"` — the three digit characters from `phrase.id`, or formatted as `phrase.indices.join('')`), Remove button, Copy button (`navigator.clipboard.writeText` copies the phrase text); accessible close mechanism
- [x] T029 [US3] Wire favourites into `BuzzPhraseApp.tsx` — call `useLocalFavourites()`; add star/bookmark toggle button next to the display area (active state when `isFavourited(current?.id)`); clicking it calls `toggleFavourite(current)` (disabled when `current` is null); add persistent "Saved ★ N" trigger button that shows count and toggles sidebar open/closed; render `<FavouritesSidebar>` with wired props
- [x] T030 [US3] Manual verify: generate → star → sidebar shows phrase with mode badge; close browser → reopen → phrase still saved; star same phrase again → moves to top with updated timestamp; reach 51 saved → oldest removed; empty state shows placeholder

**Checkpoint**: Favourites persist across sessions; deduplication and 50-entry limit confirmed by hand; copy to clipboard works.

---

## Phase 6: User Story 4 — Persist Mode and Theme Preference (Priority: P4)

**Goal**: The user's last-selected mode and theme survive page reload with no visible flash of default state. ThemeSelector controls which display skin is active.

**Independent Test**: Select Modern mode + Dot-Matrix theme → close browser → reopen → app loads in Modern mode with Dot-Matrix active, no flash of Original/Split-Flap defaults.

- [x] T031 [US4] Extend `src/hooks/useBuzzword.ts` — on mount, read `sbpp-mode` and `sbpp-theme` from localStorage (validate against `Mode`/`Theme` unions; fall back to `'original'`/`'splitflap'` if invalid or absent); write `sbpp-mode` to localStorage whenever `mode` changes; write `sbpp-theme` to localStorage whenever `theme` changes; add `setTheme(theme: Theme)` action (no phrase clear — theme switching is instant)
- [x] T032 [P] [US4] Create `src/hooks/useAudio.ts` — export a `useAudio()` hook that returns `{ playClick: () => void, isMuted: boolean, toggleMute: () => void }`; all functions are no-ops in spec 001 (full Web Audio synthesis implemented in spec 002); mark `'use client'`
- [x] T033 [P] [US4] Create `src/components/ThemeSelector.tsx` — render three buttons/tabs: "Split-Flap", "Slot Machine", "Dot-Matrix"; highlight the active theme; call `onThemeChange(theme: Theme)` prop on click; keyboard accessible
- [x] T034 [US4] Wire `ThemeSelector` into `BuzzPhraseApp.tsx` — pass `theme` and `setTheme` from `useBuzzword()`; connect `useAudio()` and render a mute toggle button in the header (no-op in spec 001); the display area always renders `<StaticDisplay>` regardless of active theme (spec 002 replaces this with the actual skins)
- [x] T035 [US4] Manual verify: select Modern + Dot-Matrix → close browser → reopen → both settings restored with no visible flash; no stored preference → loads Original + Split-Flap; switching theme is instant (phrase does not re-animate)

**Checkpoint**: All four user stories are complete. Mode, theme, and favourites all persist. App fully functional with static display placeholder.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Quality gates, accessibility verification, and final validation before handoff to spec 002.

- [x] T036 Run `npm run build` — confirm zero TypeScript errors and zero type assertions; resolve any type errors before proceeding (hard gate — constitution §II); confirm First Load JS for the root page is below 150 kB as reported in the build output (SC-008, constitution §IV) — **verified 147.2 kB gzip via route-bundle-stats.json**
- [x] T042 Run Lighthouse Mobile preset against the production build (via `npm run start` or Vercel preview URL) — confirm Time-to-Interactive is below 3 seconds (SC-007, constitution §IV pre-release sign-off gate) — **verified TTI 2.27s, Lighthouse score 98**
- [x] T037 Run `npm run lint` — confirm ESLint exits clean; fix any lint violations; add `// eslint-disable-next-line` with a reason comment only where genuinely necessary (hard gate — constitution §II)
- [x] T038 Run `npx vitest run --coverage` — confirm all unit tests pass; confirm `src/utils/phraseResolver.ts` and `src/constants/buzzwords.ts` have 100% function coverage; confirm canonical regression tests (`257 → "systemised logistical projection"` and `257 → "generative telemetry alignment"`) are present and named in output
- [x] T039 [P] Update `src/app/globals.css` — ensure `@import 'tailwindcss'` is the first import; add an `@theme` block for any custom CSS custom properties used by the app (e.g., `--color-*` tokens if any); add comment `/* spec 002 will add animation keyframes here */`
- [x] T040 [P] Verify localStorage graceful degradation — open the app in a browser's private/incognito mode; confirm the app loads without errors and phrases generate normally; confirm no console errors related to localStorage
- [x] T041 Accessibility pass — confirm via keyboard-only navigation: Tab to GenerateButton → Enter/Space fires generate; Tab to ManualInput → type `257` → Enter submits; Tab to star button → Enter toggles favourite; Tab to "Saved" button → Enter opens sidebar; all interactive elements have visible focus styles

**Final Checkpoint**: `npm run build` clean ✅ | First Load JS < 150 kB ✅ | `npm run lint` clean ✅ | all unit tests pass ✅ | canonical phrases verified ✅ | keyboard navigation functional ✅ | Lighthouse TTI < 3 s ✅ | ready for spec 002-display-themes.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — **BLOCKS all user story phases**
- **US1 (Phase 3)**: Depends on Foundational complete — first deliverable (MVP)
- **US2 (Phase 4)**: Depends on US1 complete (extends `useBuzzword.ts`)
- **US3 (Phase 5)**: Depends on Foundational complete — can run in parallel with US2 (different files)
- **US4 (Phase 6)**: Depends on US1 complete (extends `useBuzzword.ts`); can run in parallel with US3
- **Polish (Phase 7)**: Depends on all user story phases complete

### User Story Dependencies

| Story | Depends On | Blocks |
|-------|-----------|--------|
| US1 (P1) | Phase 2 | US2, US4 (both extend useBuzzword) |
| US2 (P2) | US1 (extends useBuzzword) | nothing |
| US3 (P3) | Phase 2 only | nothing |
| US4 (P4) | US1 (extends useBuzzword) | nothing |

**US2 and US4 both extend `useBuzzword.ts` — they must be done sequentially or carefully merged. US3 touches different files and can proceed in parallel with either.**

### Parallel Opportunities Per Phase

**Phase 2 (Foundational)**:
```
T005 buzzwords.ts  ──┐
T006 themes.ts     ──┼── all parallelisable once T004 (types) is done
T011 StaticDisplay ──┘
T012 layout.tsx ──────── independent of above
T013 page.tsx  ──────── independent of above
T014 BuzzPhraseApp ────── after T013 (imports it)
```

**Phase 3 (US1)**:
```
T016 ModeSelector    ──┐
T017 GenerateButton  ──┘ parallel; both depend on T004 (types)
T015 useBuzzword     ──── then T018 wires them together
```

**Phase 5 (US3)**:
```
T024 favouritesUtils  ──── then T025 test it  ──── then T026 hook
T028 FavouritesSidebar ──── parallel with T025/T026
```

---

## Parallel Execution Examples

### Foundational Phase (after T004 types):

```
Parallel batch A:
  Task: "Create src/constants/buzzwords.ts" (T005)
  Task: "Create src/constants/themes.ts" (T006)
  Task: "Create src/components/display/StaticDisplay.tsx" (T011)
  Task: "Update src/app/layout.tsx" (T012)

Sequential after batch A:
  Task: "Create tests/unit/buzzwords.test.ts" (T007) — needs T005
  Task: "Create src/utils/phraseResolver.ts" (T008) — needs T004, T005
  Task: "Create tests/unit/phraseResolver.test.ts" (T009) — needs T008
  Task: "Run vitest to confirm tests pass" (T010)
  Task: "Replace src/app/page.tsx" (T013) — needs T014 stub
  Task: "Create BuzzPhraseApp.tsx skeleton" (T014)
```

### US3 Phase (after Phase 2):

```
Parallel:
  Task: "Create src/utils/favouritesUtils.ts" (T024) — leads to T025 test
  Task: "Create src/components/FavouritesSidebar.tsx" (T028) — needs only types

Sequential:
  T024 → T025 (tests) → T026 (hook) → T027 (run tests) → T029 (wire)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational — all tests pass
3. Complete Phase 3: User Story 1 (generate random phrases)
4. **STOP and VALIDATE**: Generate phrases in all three modes; switch modes; confirm display clears
5. This is a shippable MVP — static text output with all core logic working

### Incremental Delivery

1. Setup + Foundational → word matrices validated, utilities tested
2. US1 → phrase generation works → **deploy/demo** (MVP)
3. US2 → manual code lookup added → deploy
4. US3 → favourites added → deploy
5. US4 → persistence added → deploy
6. Polish → quality gates passed → **hand off to spec 002**

---

## Notes

- `[P]` tasks = different files, no dependency on incomplete tasks in the same phase
- `[Story]` label maps each task to its user story for traceability
- React Compiler is active — do not write `useMemo`/`useCallback` anywhere
- All `useBuzzword` and `useLocalFavourites` state updates must be immutable (spread)
- The `'use client'` directive is only on `BuzzPhraseApp.tsx`; child components inherit the client context
- `StaticDisplay.tsx` is a placeholder — spec 002 replaces it with three animated skins consuming the same `DisplayProps` interface
- Commit after each phase or logical group; constitution §II gates (`npm run build`, `npm run lint`) must pass before merging
