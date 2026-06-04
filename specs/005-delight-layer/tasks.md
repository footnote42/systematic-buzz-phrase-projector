# Tasks: Delight Layer

**Input**: Design documents from `specs/005-delight-layer/`

**Prerequisites**: plan.md ✓ spec.md ✓ research.md ✓ data-model.md ✓ quickstart.md ✓

**Tests**: Unit test task included in Polish phase per constitution §II (pure utility functions in `constants/` MUST have unit test coverage).

**Organization**: Tasks grouped by user story. US1 and US2 are fully independent (different files). US3 has a minor integration dependency on US1 (T008 extends T002's mount effect), noted in the Dependencies section.

---

## Phase 1: User Story 1 — Shareable Phrase Links (Priority: P1) 🎯 MVP

**Goal**: The page URL reflects the current phrase, mode, and theme at all times; navigating to a URL with `?code=257&mode=original&theme=splitflap` displays the correct phrase immediately with no user interaction.

**Independent Test**: Open incognito, navigate to `https://buzz.waynetellis.com?code=257&mode=original` — "systemised logistical projection" displays immediately; Back button returns to wherever the link was opened from, not to a previous phrase.

- [x] T001 [US1] Add URL sync useEffect to `src/hooks/useBuzzword.ts` — watches `[current, mode, theme]`; when `current` is non-null, calls `window.history.replaceState(null, '', '?' + new URLSearchParams({ code: current.indices.join(''), mode, theme }).toString())`; when `current` is null (e.g. after a mode switch clears the phrase), calls `window.history.replaceState(null, '', location.pathname)` to remove stale params; returns early only when `typeof window === 'undefined'` (SSR guard)
- [x] T002 [US1] Add URL read useEffect to `src/hooks/useBuzzword.ts` — runs once on mount after the existing localStorage effect; reads `new URLSearchParams(window.location.search)`; if `mode` param is a valid `Mode`, calls `setModeState(urlMode)` and `safeSet(MODE_KEY, urlMode)`; if `theme` param is a valid `Theme`, calls `setThemeState(urlTheme)` and `safeSet(THEME_KEY, urlTheme)`; if `code` param matches `/^\d{3}$/`, calls `validateCode(code, resolvedMode)` and if valid calls `resolvePhrase(resolvedMode, getMatrix(resolvedMode), result.indices!)` then `setCurrent` and `setIsAnimating(true)`; silently ignores missing or invalid params
- [x] T003 [US1] Verify quickstart.md Scenarios A–E: URL encodes state after submit; share link loads phrase in incognito; Back goes to previous page not previous phrase; invalid params load default state; partial params are ignored

**Checkpoint**: Navigating to a share link displays the correct phrase with no user interaction. Copy-pasting the URL from the address bar always gives a working share link. Back button behaviour is correct.

---

## Phase 2: User Story 2 — Keyboard Shortcuts (Priority: P2)

**Goal**: Pressing the Space bar anywhere on the page (except inside the code input) generates a new phrase.

**Independent Test**: Open the app, click on the page heading, press Space — a phrase generates and animates. Click inside the code input, press Space — no phrase is generated.

- [x] T004 [P] [US2] Add Space keydown useEffect to `src/components/BuzzPhraseApp.tsx` — registers a `keydown` handler on `document`; handler checks `event.key === ' '` and `!(event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement)`; if both checks pass, calls `generate()`; cleans up listener on unmount; place useEffect after the existing hook calls, before the JSX return

- [x] T005 [US2] Verify quickstart.md Scenarios F–I: Space outside input generates phrase; Space inside input does nothing; Space during animation interrupts and restarts; Space with sidebar open generates phrase

**Checkpoint**: Rapid-fire Space presses generate a stream of phrases. Code input is fully unaffected.

---

## Phase 3: User Story 3 — Easter Egg Codes (Priority: P3)

**Goal**: Entering code `000` in any mode reveals a special pre-authored phrase distinct from the standard matrix output. Easter egg phrases are saveable to favourites and encodable in share links.

**Independent Test**: Enter `000` in Original mode — the displayed phrase is NOT the matrix phrase for indices [0,0,0] (which would be the first words of each column). Repeat in Modern and Chaos — each returns a different special phrase.

- [x] T006 [P] [US3] Create `src/constants/easterEggs.ts` — export `EASTER_EGGS` as `Record<Mode, Record<string, readonly [string, string, string]>>`; author three `'000'` entries, one per mode, following the content guidelines in `specs/005-delight-layer/research.md` (Original: wink at Broughton's 1968 original; Modern: contemporary tech-jargon tone; Chaos: self-referential absurdity); ensure each phrase is three single words matching the grammatical style of the existing matrices

- [x] T007 [US3] Modify `submitCode` in `src/hooks/useBuzzword.ts` — after `validateCode` succeeds, check `EASTER_EGGS[mode]?.[code]`; if an easter egg entry exists, construct a `BuzzPhrase` with `id: buildPhraseId(mode, result.indices!)`, `words: easterEggWords`, `indices: result.indices!`, `mode`; call `setCurrent` and `setIsAnimating(true)` then return early before the standard `resolvePhrase` call; import `EASTER_EGGS` from `@/constants/easterEggs`

- [x] T008 [US3] Extend the URL read useEffect in `src/hooks/useBuzzword.ts` (from T002) to check easter eggs on mount — when a valid `code` param is present, check `EASTER_EGGS[resolvedMode]?.[code]` first; if found, construct the `BuzzPhrase` from the easter egg words; only fall through to `resolvePhrase` if no easter egg matches; this ensures share links with easter egg codes display the correct phrase on the recipient's device

- [x] T009 [US3] Verify quickstart.md Scenarios J–O: `000` shows distinct phrase per mode; easter egg saveable and persists across reload; `?code=000` share link shows easter egg in incognito; non-easter-egg codes display normal matrix output

**Checkpoint**: All three `000` easter eggs work in all three modes. Share links encode and decode easter egg codes correctly. Favourites round-trip works.

---

## Phase 4: Polish & Sign-off

**Purpose**: Constitution compliance, build gate, full acceptance.

- [x] T010 Add unit tests for `EASTER_EGGS` lookup to the existing test suite — test that each mode's `'000'` entry returns a three-word tuple distinct from the matrix phrase at `[0,0,0]`; test that a code with no easter egg entry returns `undefined`; follow the existing test file naming and location convention in the project
- [x] T011 Run `npm run build` and `npm run lint` — confirm zero TypeScript errors, First Load JS ≤ 150 kB for the root page, and lint exits clean (per constitution §II and §IV and SC-005)
- [x] T012 Run all quickstart.md Scenarios A–O against `https://buzz.waynetellis.com` (after merge and Vercel deploy) — confirm every scenario passes; confirm both regression phrases still correct (`257` Original → "systemised logistical projection", `257` Modern → "generative telemetry alignment")

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (US1)**: No dependencies — start immediately
- **Phase 2 (US2)**: No dependencies — fully independent, can start in parallel with Phase 1
- **Phase 3 (US3)**:
  - T006 (create `easterEggs.ts`): No dependencies — can start in parallel with Phase 1 and Phase 2
  - T007 (modify `submitCode`): Depends on T006 (`easterEggs.ts` must exist)
  - T008 (extend URL mount effect): Depends on T002 (mount effect must exist) and T006 (`easterEggs.ts` must exist)
  - T009 (verification): Depends on T006, T007, T008
- **Phase 4**: Depends on all phases complete

### Parallel Opportunities

```
Can run immediately in parallel:
  T001  URL sync useEffect (useBuzzword.ts)
  T004  Space keydown useEffect (BuzzPhraseApp.tsx — different file)
  T006  Create easterEggs.ts (new file — no conflicts)

After T001:
  T002  URL read useEffect (same file, sequential)

After T002 + T006:
  T007  Modify submitCode (useBuzzword.ts)
  T008  Extend URL mount effect (useBuzzword.ts) — sequential with T007 (same file)

After T007 + T008:
  T009  US3 verification
```

### User Story Dependencies

- **US1 (P1)**: Independent
- **US2 (P2)**: Independent — different file, start any time
- **US3 (P3)**: T006 independent; T007 needs T006; T008 needs T002 + T006

---

## Implementation Strategy

### MVP First (User Story 1)

1. Complete T001–T002 — URL state sync wired
2. Complete T003 — smoke test passes on dev server
3. **STOP and VALIDATE**: Share link works; Back button correct; invalid params handled gracefully
4. If validated: proceed to US2 and US3 in parallel

### Full Delivery

1. US1 (T001–T003) → URL sharing works
2. US2 (T004–T005) in parallel → keyboard shortcut works
3. US3 (T006–T009) extending US1's mount effect → easter eggs work including via share link
4. Polish (T010–T012) → constitution compliance + full acceptance
