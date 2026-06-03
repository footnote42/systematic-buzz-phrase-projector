# Research: Core Application — Buzz Phrase Projector

**Branch**: `001-core-app` | **Date**: 2026-06-03

## 1. Testing Framework

**Decision**: Vitest (jsdom environment)

**Rationale**: Vitest is ESM-native, has first-class TypeScript support with zero configuration, and is the de-facto standard for Next.js 16 / Tailwind CSS 4 projects. The jsdom environment simulates browser APIs (localStorage, window) needed for hook tests without a full browser. Speed and minimal config overhead are decisive advantages over Jest for a project of this scale.

**Install**:
```bash
npm install -D vitest @vitest/coverage-v8 jsdom @testing-library/react @testing-library/user-event
```

**Alternatives considered**:
- Jest 29 — rejected: requires Babel transform overhead and additional ESM config; slower startup.
- Playwright component tests — rejected: appropriate for E2E/visual tests (spec 002 concern), not unit tests.

---

## 2. React Compiler (babel-plugin-react-compiler)

**Decision**: Leave enabled; comply with Rules of React strictly throughout.

**Rationale**: `babel-plugin-react-compiler: 1.0.0` is already installed. The compiler automatically memoises components and hooks that satisfy the Rules of React, eliminating the need for manual `useMemo` / `useCallback`. Breaking this contract (mutating props, calling hooks conditionally) causes the compiler to bail out silently in production, introducing subtle performance regressions.

**Practical rules**:
- Do not write manual `useMemo` or `useCallback` — the compiler handles this.
- All state updates in `useBuzzword` and `useLocalFavourites` must be immutable (spread, not mutate).
- `useEffect` dependencies must be exhaustive — the compiler validates this in development.

---

## 3. Next.js 16 App Router — `'use client'` Boundary

**Decision**: Single `'use client'` boundary at `BuzzPhraseApp.tsx`.

**Rationale**: Every feature on this page requires client-side state, effects, or browser APIs — there is no data to fetch from a server. Rather than marking every component individually, one client boundary at the top of the interactive tree is cleaner. `page.tsx` stays a Server Component so the outer HTML shell (lang attribute, font variables, body wrapper) is server-rendered, giving a slight FCP improvement.

**Pattern**:
```tsx
// src/app/page.tsx — Server Component (no directive)
import BuzzPhraseApp from '@/components/BuzzPhraseApp'
export default function Page() {
  return <BuzzPhraseApp />
}

// src/components/BuzzPhraseApp.tsx
'use client'
// hooks and state live here or in children
```

---

## 4. Tailwind CSS 4

**Decision**: `@import 'tailwindcss'` in globals.css; configuration via `@theme` block in CSS.

**Rationale**: Tailwind v4 replaces JS config files with CSS-first configuration. The `postcss.config.mjs` with `@tailwindcss/postcss` is already present. Custom design tokens (colours, spacing) go in the `@theme` block inside globals.css — no `tailwind.config.js` required.

**Key difference from v3**: `@tailwind base/components/utilities` → `@import 'tailwindcss'`. All utility class names used in the CLAUDE.md architecture notes (`items-center`, `flex`, etc.) are unchanged.

---

## 5. localStorage Graceful Degradation

**Decision**: Wrap all localStorage access in `try/catch`; return safe defaults on failure.

**Rationale**: Private browsing modes, some browser extensions, and quota exhaustion can make localStorage throw or return null unexpectedly. FR-014 requires the app to remain functional in all cases.

**Pattern**:
```typescript
function safeGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeSet(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // silently ignore — session continues without persistence
  }
}
```

---

## 6. Favourites Deduplication

**Decision**: Deduplicate by `id` — re-saving an existing phrase removes the old entry and prepends a new one with an updated `savedAt` timestamp.

**Rationale**: The BuzzPhrase `id` (`{mode}-{d1}{d2}{d3}`) uniquely identifies a phrase. Favouriting the same phrase twice should not create duplicates. Moving to the top on re-save is the natural UX behaviour. The 50-entry limit removes the entry with the lowest `savedAt` when exceeded.

---

## 7. `BuzzPhrase.id` Zero-Padding

**Decision**: Single digits are stored as their character value only — no zero-padding. ID format is `{mode}-{d1}{d2}{d3}` where each dN is the raw digit character (always a single character since valid digits are 0–9).

**Rationale**: All valid manual-entry digits are 0–9 (single character). A code of `"034"` has d1=`'0'`, d2=`'3'`, d3=`'4'`. The resulting ID `"chaos-034"` is correct and unambiguous. No padding logic is required.
