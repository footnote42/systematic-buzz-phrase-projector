# Data Model: Animated Display Skins

## Existing Types (from spec 001 — unchanged)

```typescript
// src/types/index.ts
interface DisplayProps {
  words: readonly [string, string, string]
  isAnimating: boolean
  onAnimationComplete: () => void
}
```

All three skin components implement `DisplayProps` as their props interface. No new shared types are introduced.

---

## New Types (this spec)

### ColourVariant

```typescript
// src/types/index.ts — add to existing file
export type ColourVariant = 'green' | 'amber'
```

- Belongs to `DotMatrixDisplay` only.
- Persisted in `localStorage` under key `sbpp-dotmatrix-colour`.
- Default: `'green'`.
- Not passed as a prop — managed internally by `DotMatrixDisplay` via lazy `useState`.

---

## Internal Component State (not shared — not in types/index.ts)

### SplitFlapDisplay internal state

| Field | Type | Description |
|---|---|---|
| `displayedWords` | `[string, string, string]` | Words currently shown in the panels (may lag behind `words` prop during animation) |
| `tileTargets` | `string[][]` | Per-panel array of target characters for the current animation run |
| `isFlipping` | `boolean` | True while any tile is mid-animation |

### SlotMachineDisplay internal state

| Field | Type | Description |
|---|---|---|
| `targetIndices` | `[number, number, number]` | The reel position to scroll each column to |
| `isTransitioning` | `boolean` | True while CSS transition is running |

### DotMatrixDisplay internal state

| Field | Type | Description |
|---|---|---|
| `displayedText` | `string` | The portion of the phrase revealed so far by the typewriter |
| `colourVariant` | `ColourVariant` | Current phosphor colour — `'green'` or `'amber'` |
| `timeoutRef` | `RefObject<ReturnType<typeof setTimeout> \| null>` | Active timeout handle for cancellation |

---

## localStorage Keys (additions to spec 001)

| Key | Type | Default | Owner |
|---|---|---|---|
| `sbpp-dotmatrix-colour` | `'green' \| 'amber'` | `'green'` | `DotMatrixDisplay` |

Existing keys from spec 001 (`sbpp-favourites`, `sbpp-mode`, `sbpp-theme`) are unchanged.
