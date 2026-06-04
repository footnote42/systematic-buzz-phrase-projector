# Research: Delight Layer

## URL State Management in Next.js App Router

**Decision**: Read URL params via `new URLSearchParams(window.location.search)` inside `useEffect([], [])`. Write URL updates via `window.history.replaceState(null, '', '?...')` inside a separate `useEffect([current, mode, theme], ...)`.

**Rationale**: `useSearchParams()` from `next/navigation` requires a `<Suspense>` boundary in Next.js 16 to avoid a build warning. The existing codebase reads all client-only state (localStorage) in `useEffect` on mount — applying the same pattern for URL params is zero-friction and fully consistent. `replaceState` updates the URL bar without triggering a React re-render or pushing a new history entry, which is exactly what FR-001 requires.

**Alternatives considered**:
- `useRouter().replace()` — triggers a full re-render cycle and could cause infinite loops if `current` changes trigger a navigation that re-reads params. Rejected.
- `useSearchParams()` — requires Suspense boundary, adds component surface area. Rejected for simplicity.
- Reading params directly in the component render (outside useEffect) — breaks SSR hydration consistency, the exact bug that was fixed in specs 001/004. Rejected.

---

## Keyboard Shortcut Implementation

**Decision**: Add a `keydown` event listener on `document` inside a `useEffect` in `BuzzPhraseApp.tsx`. Guard with `!(event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement)`.

**Rationale**: The keyboard handler needs access to `generate()` from `useBuzzword`. `BuzzPhraseApp` already holds all hook references. Placing the listener here avoids prop-drilling or extending the hook's return type. React Compiler is active — no manual `useCallback` needed for the dependency. Listener on `document` (not `window`) captures keypresses from any focused element on the page.

**Alternatives considered**:
- New `useKeyboardShortcuts.ts` hook — adds abstraction with no reuse benefit (only one call site). Rejected.
- Adding listener inside `useBuzzword.ts` — would require `useBuzzword` to import a DOM API and know about the input guard, breaking the hook's single-responsibility model. Rejected.

---

## Easter Egg Pattern

**Decision**: New file `src/constants/easterEggs.ts` exports `EASTER_EGGS: Record<Mode, Record<string, readonly [string, string, string]>>`. In `useBuzzword.ts`, `submitCode()` checks `EASTER_EGGS[mode][code]` before calling `resolvePhrase`. Easter egg phrases use the same `BuzzPhrase` shape with `buildPhraseId(mode, indices)` for the `id` field, where `indices` are derived from the code digits (e.g., `'000'` → `[0,0,0]`).

**Rationale**: Keeps easter eggs as pure static data, consistent with how `ORIGINAL_MATRIX`, `MODERN_MATRIX`, and `CHAOS_MATRIX` are structured. No changes to `resolvePhrase` (pure function, single responsibility preserved). The check in `submitCode` is a two-line guard. URL param loading on mount must also apply the same lookup.

**Alternatives considered**:
- Embedding easter egg logic inside `resolvePhrase` — would require `resolvePhrase` to know about easter eggs, mixing two concerns. Rejected.
- Using a separate `resolveEasterEgg` utility exported from `phraseResolver.ts` — reasonable, but `phraseResolver.ts` is already a generic utility; easter eggs are app-specific content. Separate file is cleaner. Rejected.

---

## URL-Priority vs localStorage-Priority

**Decision**: On page load, URL params take priority over localStorage for `mode` and `theme`. If valid URL params are present, they are used and also written back to localStorage so subsequent navigations remember the preference.

**Rationale**: A recipient clicking a share link should see exactly what the sharer sent. If localStorage silently overrode the URL, the share feature would be broken for recipients who have previously visited the app.

**Alternatives considered**:
- URL wins for display only, localStorage not updated — creates a confusing state where the URL shows one mode but the next generate uses a different one. Rejected.
- localStorage always wins — breaks sharing entirely for returning visitors. Rejected.

---

## Easter Egg Phrase Content

**Decision**: Deferred to authoring time during implementation. The three `'000'` phrases (one per mode) must satisfy these constraints:
1. Each phrase is a three-word tuple matching the grammatical style of the existing matrices.
2. Original `'000'` phrase references or winks at Broughton's 1968 original.
3. Modern `'000'` phrase uses contemporary tech-jargon tone.
4. Chaos `'000'` phrase is self-referential (acknowledges the chaos/absurdity).

The actual word selection is not an architectural decision.
