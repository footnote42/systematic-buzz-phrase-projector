# Implementation Plan: Delight Layer

**Branch**: `005-delight-layer` | **Date**: 2026-06-04 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/005-delight-layer/spec.md`

## Summary

Three independent delight features built on top of the stable V1 app: (1) shareable phrase links via URL query parameters that load and display the encoded phrase on arrival; (2) a Space bar keyboard shortcut to generate phrases without the mouse; (3) easter egg codes that override the standard matrix lookup with pre-authored phrases for certain three-digit inputs. All three features are additive — no existing behaviour changes. No new dependencies. No bundle size risk.

## Technical Context

**Language/Version**: TypeScript 5 (strict mode)

**Primary Dependencies**: Next.js 16 App Router, React 19, Tailwind CSS 4 — no new packages required

**Storage**: `window.localStorage` (existing); `window.history.replaceState` for URL writes

**Testing**: Existing unit test suite (Jest/vitest — see `package.json`). New unit tests required for easter egg lookup and URL param parsing.

**Target Platform**: Browser (client-side only; app is fully static)

**Performance Goals**: URL `replaceState` on every phrase generation — must not cause layout reflow or measurable delay; keyboard handler must respond in <100ms (SC-003)

**Constraints**: Bundle must remain ≤ 150 kB First Load JS. No third-party animation or state libraries. No Suspense boundary required.

**Scale/Scope**: Three features across ~4 files (one new file, three modified)

## Constitution Check

*Constitution version: 1.0.1 — checked 2026-06-04*

| Principle | Check | Status |
|-----------|-------|--------|
| §I Code Quality — strict TypeScript, no `any` | `EasterEggMap`, `ShareUrlParams` will be fully typed. `window.history.replaceState` call is typed. No `any`. | PASS |
| §I Code Quality — single responsibility | Easter egg data in `easterEggs.ts` (data only). Keyboard listener in `BuzzPhraseApp` (display layer). URL logic in `useBuzzword` (state layer). | PASS |
| §II Testing — regression phrases | `257` Original and Modern assertions unchanged. `000` easter egg added as a new named regression. | PASS |
| §II Testing — `npm run build` zero errors | No API changes that break existing call sites. All new code is additive. | PASS |
| §III UX Consistency — Space key must not be mouse-only | Keyboard shortcut is the feature itself. | PASS |
| §III UX Consistency — animation interruptible | Space keypress during animation must interrupt and restart (covered by FR-006, Scenario H). | PASS |
| §III UX Consistency — localStorage restored on load | URL params override localStorage on first load — this is an intentional, spec-driven exception. localStorage still restores if no URL params present. | PASS |
| §IV Performance — bundle ≤ 150 kB | No new dependencies. `easterEggs.ts` adds <1 kB of static data. | PASS |
| §IV Performance — 60 fps animations | `replaceState` does not trigger layout reflow. Keyboard handler is a no-op unless Space is pressed. | PASS |

**No violations. No complexity tracking entries required.**

## Project Structure

### Documentation (this feature)

```text
specs/005-delight-layer/
├── plan.md          ← this file
├── spec.md
├── research.md
├── data-model.md
├── quickstart.md
├── checklists/
│   └── requirements.md
└── tasks.md         (created by /speckit-tasks)
```

### Source Code Changes

```text
src/
  constants/
    easterEggs.ts          ← NEW: EasterEggMap constant, EASTER_EGGS data
    buzzwords.ts           (no change)
  hooks/
    useBuzzword.ts         ← MODIFIED: URL read on mount, URL write on phrase change,
                                        easter egg lookup in submitCode
  components/
    BuzzPhraseApp.tsx      ← MODIFIED: Space keydown listener useEffect
  utils/
    phraseResolver.ts      (no change)
  types/
    index.ts               (no change — easter eggs use existing BuzzPhrase shape)
```

### Implementation Notes per Feature

**US1 — URL State**

`useBuzzword.ts` gains two new `useEffect` blocks:

1. Mount effect (runs once, after existing localStorage effect):
   ```
   Read window.location.search
   Parse code, mode, theme params
   If valid mode → setModeState(urlMode), safeSet(MODE_KEY, urlMode)
   If valid theme → setThemeState(urlTheme), safeSet(THEME_KEY, urlTheme)
   If valid code → check EASTER_EGGS[resolvedMode][code] first,
                   then resolvePhrase; setCurrent; setIsAnimating(true)
   ```

2. Sync effect (runs when current/mode/theme change):
   ```
   If current is null → return (no URL to write)
   const code = current.indices.join('')
   const params = new URLSearchParams({ code, mode, theme })
   window.history.replaceState(null, '', '?' + params.toString())
   ```

**US2 — Keyboard Shortcut**

`BuzzPhraseApp.tsx` gains one `useEffect`:
```
document.addEventListener('keydown', handler)
handler: if (e.key === ' ' && !(e.target instanceof HTMLInputElement)) → generate()
return () → document.removeEventListener('keydown', handler)
```
No additional state required.

**US3 — Easter Eggs**

`src/constants/easterEggs.ts`:
```typescript
const EASTER_EGGS: Record<Mode, Record<string, readonly [string, string, string]>> = {
  original: { '000': ['<word1>', '<word2>', '<word3>'] },
  modern:   { '000': ['<word1>', '<word2>', '<word3>'] },
  chaos:    { '000': ['<word1>', '<word2>', '<word3>'] },
}
```
Words authored at implementation time per research.md constraints.

`useBuzzword.ts` — `submitCode` function:
```
const easterEggWords = EASTER_EGGS[mode][code]
if (easterEggWords) {
  const phrase = { id: buildPhraseId(mode, result.indices!), words: easterEggWords, indices: result.indices!, mode }
  setCurrent(phrase); setIsAnimating(true)
  return
}
// else: standard resolvePhrase path
```

## Complexity Tracking

*No constitution violations — table not required.*
