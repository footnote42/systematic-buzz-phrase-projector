# Research: Animated Display Skins

## Decision 1: VT323 Font Loading

**Decision**: Load VT323 via `next/font/google` in the `DotMatrixDisplay` component file (or `layout.tsx`).

**Rationale**: `next/font/google` self-hosts the font at build time — no external Google Fonts request at runtime, zero privacy concern, automatic subset optimisation. It generates a CSS variable that can be applied as a class. Importing in `layout.tsx` makes it globally available; importing in `DotMatrixDisplay.tsx` scopes it and makes the dependency explicit.

**Chosen approach**: Declare in `layout.tsx` as a CSS variable (`--font-vt323`) and apply it via the `className` on `<html>`. `DotMatrixDisplay` references `font-[family-name:var(--font-vt323)]` via Tailwind's arbitrary value syntax.

**Alternatives considered**:
- CDN `@import` in `globals.css` — rejected; introduces external runtime request and blocks render.
- Inline `<link rel="preload">` in `<head>` — rejected; bypasses Next.js font optimisation pipeline.

---

## Decision 2: `prefers-reduced-motion` Detection

**Decision**: A `useReducedMotion` hook reads `window.matchMedia('(prefers-reduced-motion: reduce)').matches` as a lazy `useState` initialiser. The hook does not subscribe to changes.

**Rationale**: A lazy `useState` initialiser is SSR-safe (`typeof window === 'undefined'` guard returns `false` on server), consistent with the pattern established in spec 001 for localStorage reads, and avoids a `useEffect` (which would require the `react-hooks/set-state-in-effect` lint exemption). For a novelty portfolio tool, reading the preference once at mount is sufficient; real-time updates when the OS setting changes mid-session are out of scope.

**Pattern**:
```typescript
export function useReducedMotion(): boolean {
  return useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })[0]
}
```

**Alternatives considered**:
- `useEffect` + `addEventlistener('change')` — rejected; overkill for this use case and triggers the lint rule.
- CSS `@media (prefers-reduced-motion: reduce)` only — rejected; CSS can suppress the visual animation but cannot ensure `onAnimationComplete` is called synchronously, which is required by FR-014.

---

## Decision 3: Split-Flap Tile DOM Structure

**Decision**: Each tile is a container with `position: relative; overflow: hidden` and two absolutely-positioned half-divs — top half and bottom half. The flip is simulated with two sequential CSS transitions:

1. **Top half folds down**: the top half div rotates `rotateX(0deg)` → `rotateX(-90deg)` (folds away), revealing the static bottom half of the *current* character behind it.
2. **Bottom half of next character unfolds up**: a new bottom half div rotates `rotateX(90deg)` → `rotateX(0deg)` (unfolds into view).

Each tile container sets `perspective: 400px` on the parent. `backface-visibility: hidden` is not strictly required with this half-panel approach but is set for safety.

**Tile width**: fixed to the widest character in the font (monospace `font-mono`), so all tiles are equal width. Panel width = `maxWordLength × tileWidth`.

**Stagger**: tiles within a word fire in sequence, left to right, with 30ms offset between tiles. Words fire sequentially (word 1 completes, then word 2 begins, etc.) — this matches real departure board behaviour and gives a readable reveal.

**Alternatives considered**:
- Full-height tile with front/back faces and `backface-visibility: hidden` (standard card flip) — rejected; requires hiding the back face during non-flip time and produces a different aesthetic than the real split-flap half-panel mechanic.
- Canvas-drawn tiles — rejected; violates the CSS-only animation constraint from the constitution.

---

## Decision 4: Web Audio Synthesis Upgrade

**Decision**: `useAudio` is upgraded from a no-op stub to a full implementation. A single `AudioContext` is created lazily on first call to `playClick()` (satisfying the browser autoplay policy — audio context must be resumed in response to a user gesture). The context is stored in a `ref` and reused for all subsequent clicks.

**Noise burst recipe**:
- `createBuffer(1, 220, 44100)` → fill channel with `Math.random() * 2 - 1` values (220 samples = ~5ms at 44.1kHz)
- `createBufferSource()` → connect to `createBiquadFilter({ type: 'bandpass', frequency: 2000, Q: 1 })` → connect to `destination`
- `source.start()` — plays immediately, auto-garbage-collected when done

**Mute**: When `isMuted` is true, `playClick()` is a no-op. The `AudioContext` remains created; no audio is submitted to it.

**Alternatives considered**:
- Pre-generated audio files — rejected; constitution prohibits audio files; Web Audio synthesis keeps bundle size zero.
- Creating a new `AudioContext` per click — rejected; constitution §IV explicitly prohibits this.

---

## Decision 5: Slot Machine Reel Layout

**Decision**: Each column is an `overflow: hidden` window (one row height tall). Inside it, a reel div contains all words in the active column stacked vertically with `display: flex; flex-direction: column`. Each word occupies a fixed row height (derived from `font-size × line-height`, set via CSS custom property). On generate, `transform: translateY(calc(-${targetIndex} * var(--row-height)))` is applied with a CSS transition using `cubic-bezier(0.34, 1.56, 0.64, 1)` (bounce) and duration ~600ms.

**Row height**: each word in the column is rendered inside a fixed-height div (`height: var(--row-height)`). The column window height equals `var(--row-height)`. The reel height = `N_words × var(--row-height)`. This keeps the layout stable regardless of word length.

**Interrupt/cancel**: When a new phrase arrives while animating, `transition` is temporarily set to `none`, the reel is snapped to the new target index, then `transition` is restored and re-applied. This is done via a `useEffect` cleanup that removes the transition class before applying the new target.

**Alternatives considered**:
- Infinite-loop reel with repeated word list — rejected; adds DOM complexity for no UX gain given the short word lists (10–20 entries).
- `scrollTop` animation — rejected; layout-reflow property, violates constitution §IV.

---

## Decision 6: Dot-Matrix Cursor and Scanline

**Decision**:
- **Cursor**: a `<span>` containing `█` with a CSS animation `@keyframes blink { 0%, 100% { opacity: 1 } 50% { opacity: 0 } }` at 1s interval. The cursor is always rendered; it moves to after the last revealed character during typewriter animation.
- **Scanline**: a pseudo-element `::after` on the display container with `background: repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)`, `pointer-events: none`, absolute positioned to cover the display area.
- **Typewriter implementation**: `setTimeout`-based character-reveal loop, storing the active timeout ID in a `ref` for cancellation. Each character appends to a `displayedText` state slice. On interrupt, `clearTimeout` is called and `displayedText` is set to the full phrase immediately.

**Alternatives considered**:
- `requestAnimationFrame` loop — rejected; overkill for ~40ms per character, and harder to cancel cleanly than `clearTimeout`.
- CSS `animation: typing steps(N)` — rejected; character count is dynamic (depends on phrase length), making static step counts impossible without JS.
