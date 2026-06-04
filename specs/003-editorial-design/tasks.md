# Tasks: Editorial Layer & Page Design

**Input**: Design documents from `specs/003-editorial-design/`

**Prerequisites**: plan.md ✓ spec.md ✓ research.md ✓ data-model.md ✓ contracts/ ✓ quickstart.md ✓

**Tests**: Not requested in spec. No test tasks generated. Regression suite (`npm test -- --run`) runs in the Polish phase.

**Organization**: Tasks grouped by user story. Foundational phase blocks all stories.

---

## Phase 1: Foundational (Blocking Prerequisites)

**Purpose**: Load the headline font and restructure the page layout into two sections
(interactive + editorial). Both user stories US1 and US2 depend on this phase completing
before their implementation tasks can begin.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T001 [P] Load Space Grotesk font in `src/app/layout.tsx` — import `Space_Grotesk` from `next/font/google` with `weight: ['400', '600']`, `subsets: ['latin']`, `display: 'swap'`, `variable: '--font-space-grotesk'`; extend `<html>` className to include both `vt323.variable` and `spaceGrotesk.variable`
- [ ] T002 [P] Restructure `src/components/BuzzPhraseApp.tsx` layout — replace the single centred `<main>` with an outer `<div className="flex flex-col min-h-screen">` containing: (1) `<main>` holding all existing interactive content with its own vertical centring, and (2) a placeholder `<section>` where `EditorialSection` will mount in Phase 2

**Checkpoint**: Dev server renders correctly; all existing controls still function; page now has a natural document-flow structure below the interactive area.

---

## Phase 2: User Story 1 — First-time visitor understands the tool (Priority: P1) 🎯 MVP

**Goal**: A first-time visitor can read the origin story, Broughton quote, and author's note and understand what the tool is and where it came from.

**Independent Test**: Load the page with no prior knowledge. Scroll past the controls. Confirm origin story, canonical quote, and author's note are all present and readable at 375px and 1280px.

- [ ] T003 [P] [US1] Create `src/components/EditorialSection.tsx` — static presentational component (no props, no state) containing:
  - `<section>` with `bg-gray-50 border-t` and `max-w-2xl mx-auto px-6 py-10`
  - Section heading `<h2>` using `font-[family-name:var(--font-space-grotesk)]` (heading copy TBD by author — use "About the Projector" as placeholder)
  - Origin story `<p>` naming Philip Broughton, referencing *Time* magazine, 13 May 1968, and the 10×10×10 matrix concept (3–4 sentences)
  - Canonical quote `<blockquote>` with italic styling and left-border treatment: *"No-one will have the remotest idea of what you're talking about. But the important thing is that they're not going to admit it."* — Philip Broughton, 1968
  - Author's note `<p>` using `const AUTHOR_NOTE = '[PLACEHOLDER — Wayne Ellis to supply 1–2 sentences in first person about the Modern 2026 and Chaos matrix extensions]'`
  - Attribution line as final element: `<p>` reading "Original concept by Philip Broughton, published in *Time* magazine, 1968."
- [ ] T004 [US1] Wire `EditorialSection` into `src/components/BuzzPhraseApp.tsx` — replace the placeholder `<section>` from T002 with `<EditorialSection />`; confirm it renders below the interactive area

**Checkpoint**: Editorial section visible below interactive controls. Origin story, quote, author's note placeholder, and attribution all render. Layout stable at 375px (no overflow).

---

## Phase 3: User Story 2 — Page has clear visual hierarchy (Priority: P2)

**Goal**: The page title is the dominant typographic element at desktop viewports; the interactive controls are above the fold; the three visual layers (title/controls, display, editorial) are immediately distinguishable.

**Independent Test**: View page at 1280px and 375px without reading any text. Title should clearly anchor the top; generate button should be visible without scrolling on a 768px-tall viewport.

- [ ] T005 [US2] Apply prominent display title in `src/components/BuzzPhraseApp.tsx`:
  - Enlarge `<h1>` to `text-3xl md:text-4xl font-semibold font-[family-name:var(--font-space-grotesk)] tracking-tight`
  - Add subtitle tagline `<p>` directly beneath: `const SUBTITLE = 'A digital homage to Philip Broughton\'s 1968 management-jargon matrix.'` (author may revise wording)
  - Reposition mute toggle — remove from the same flex row as the title; place it as a small secondary button in the controls row alongside `ThemeSelector`
  - Remove the old compact `<header>` wrapper; replace with a centred title block at the top of the interactive `<main>`

**Checkpoint**: Title is visually dominant. Subtitle renders beneath. Mute toggle is accessible but not competing with the title. Generate button visible without scroll at 768px tall.

---

## Phase 4: User Story 3 — Manual input is self-explanatory (Priority: P3)

**Goal**: A visitor can correctly enter a 3-digit code and generate a phrase without verbal guidance, aided by inline micro-copy.

**Independent Test**: View the manual input area in Original, Modern, and Chaos modes. Confirm the hint text is present and accurate in all three.

- [ ] T006 [P] [US3] Add `hint: string` prop to `src/components/ManualInput.tsx` — update `ManualInputProps` interface; render `<p className="text-xs text-gray-500 max-w-[7rem]">{hint}</p>` between the `<label>` and the `<input>`
- [ ] T007 [US3] Add `MANUAL_HINT` constant and pass hint to `ManualInput` in `src/components/BuzzPhraseApp.tsx`:
  ```
  const MANUAL_HINT: Record<Mode, string> = {
    original: 'Each digit (0–9) picks one word per column.',
    modern:   'Each digit (0–9) picks one word per column.',
    chaos:    'Each digit (0–9) picks from both matrices. Random covers 0–19.',
  }
  ```
  Pass `hint={MANUAL_HINT[mode]}` to `<ManualInput>`

**Checkpoint**: Hint text appears below the input label. Switching to Chaos mode updates hint correctly. All three modes show appropriate text.

---

## Phase 5: Polish & Verification

**Purpose**: Build gate, regression tests, and visual acceptance checks per `quickstart.md`.

- [ ] T008 Run `npm run build` — confirm zero TypeScript errors; confirm First Load JS ≤ 150 kB in build output table
- [ ] T008a Run `npm run lint` — confirm zero ESLint errors (constitution §II hard gate)
- [ ] T009 Run `npm test -- --run` — confirm all 41 existing tests pass; confirm regression phrases: `257` Original → "systemised logistical projection", `257` Modern → "generative telemetry alignment"
- [ ] T010 Browser resize verification per `quickstart.md` — load dev server; check 1280px (title dominant, generate above fold), 768px (generate above fold), 375px (no horizontal scroll, no clipped text)
- [ ] T011 Skin-switch visual stability — toggle all three skins; confirm editorial section background, typography, and layout remain unchanged across all skin states
- [ ] T012 Contrast and accessibility spot-check — verify `text-gray-900` on `bg-gray-50` passes WCAG AA in DevTools; verify tab order through interactive controls is unchanged from pre-spec state
- [ ] T012a Confirm all placeholder strings (`AUTHOR_NOTE`, section heading copy, `SUBTITLE` tagline) have been replaced with final wording before raising PR

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Foundational)**: No dependencies — start immediately
- **Phase 2 (US1)**: Depends on Phase 1 completion (T001 + T002 both done)
  - T003 can start as soon as T001 is done (EditorialSection.tsx is a new file; CSS var needed at runtime only)
  - T004 depends on T002 and T003 both complete
- **Phase 3 (US2)**: Depends on Phase 1 completion; T005 depends on T004 (BuzzPhraseApp.tsx in stable state post-US1 wiring)
- **Phase 4 (US3)**: T006 is fully independent of Phases 2–3 (different file); T007 depends on T006 and T005 (BuzzPhraseApp.tsx in final state)
- **Phase 5 (Polish)**: Depends on all implementation phases complete

### User Story Dependencies

- **US1 (P1)**: Depends on Foundational; no dependency on US2 or US3
- **US2 (P2)**: Depends on Foundational; should follow US1 to avoid BuzzPhraseApp.tsx edit conflicts
- **US3 (P3)**: T006 (ManualInput.tsx) is fully independent; T007 (BuzzPhraseApp.tsx) should follow US2

### Author Input Required

- **T003**: `AUTHOR_NOTE` constant — Wayne Ellis supplies the author's note wording (1–2 sentences, first-person)
- **T005**: `SUBTITLE` constant — Wayne Ellis may revise the subtitle tagline
- **T003**: Section heading copy — placeholder "About the Projector"; author may revise

These tasks have implementation placeholders. The build will pass with placeholder text; replacement is not a code change requiring a rebuild.

---

## Parallel Opportunities

```
Phase 1 (run together):
  T001  Load Space Grotesk in src/app/layout.tsx
  T002  Restructure BuzzPhraseApp.tsx layout

Phase 2 + Phase 4 (T003 and T006 can run together once T001 is done):
  T003  Create src/components/EditorialSection.tsx   [new file — no BuzzPhraseApp conflict]
  T006  Add hint prop to src/components/ManualInput.tsx   [separate file]

Then sequentially:
  T004  Wire EditorialSection into BuzzPhraseApp.tsx
  T005  Apply display title in BuzzPhraseApp.tsx
  T007  Add MANUAL_HINT + pass to ManualInput in BuzzPhraseApp.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 — Editorial Content)

1. Complete Phase 1 (T001, T002) — layout foundation
2. Complete Phase 2 (T003, T004) — editorial section live
3. **STOP and VALIDATE**: scroll past controls; confirm origin story, quote, author's note, attribution all render at 375px and 1280px
4. If validated: proceed to Phase 3 (title treatment) and Phase 4 (micro-copy)

### Full Delivery

1. Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5
2. Each phase checkpoint validates independently before moving on
3. Final Polish phase covers the hard gate checks (build, tests, browser, accessibility)
