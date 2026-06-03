# Contract: Display Skin Components

All three skin components (`SplitFlapDisplay`, `SlotMachineDisplay`, `DotMatrixDisplay`) MUST satisfy this contract. `BuzzPhraseApp` selects the active skin by `theme` and renders it with the props below — no other coupling exists.

---

## Props Interface

```typescript
// Already defined in src/types/index.ts
interface DisplayProps {
  words: readonly [string, string, string]
  isAnimating: boolean
  onAnimationComplete: () => void
}
```

`DotMatrixDisplay` additionally renders its own colour variant toggle internally; this does not affect the `DisplayProps` surface.

---

## Behavioural Contract

### On `isAnimating` becoming `true`

- The skin MUST start its animation sequence.
- When the animation completes naturally, the skin MUST call `onAnimationComplete()`.
- If `useReducedMotion()` returns `true`, the skin MUST skip animation and call `onAnimationComplete()` synchronously (within the same render cycle or immediately via `useEffect` with no delay).

### On `words` changing while `isAnimating` is `true`

- The skin MUST cancel any in-flight animation immediately (clear timeouts, cancel RAF, remove transition classes).
- The skin MUST begin a new animation for the new `words`.
- `onAnimationComplete()` from the cancelled animation MUST NOT be called.

### On `isAnimating` becoming `false` externally

- The skin MUST stop any in-flight animation.
- The phrase MUST be displayed statically in its final state.

### On theme switch (component unmount)

- The skin MUST clean up all timers and animation state in its `useEffect` cleanup.

### Empty / initial state (`words === ['', '', '']`)

- Split-Flap: each panel displays dashes filling the full panel width.
- Slot Machine: each column shows a dash in the visible position.
- Dot-Matrix: displays only a blinking cursor on an empty line.
- No animation runs for the empty state.

---

## Integration Point in BuzzPhraseApp

```typescript
// src/components/BuzzPhraseApp.tsx (pseudocode)
const SKIN_MAP: Record<Theme, React.ComponentType<DisplayProps>> = {
  splitflap: SplitFlapDisplay,
  slotmachine: SlotMachineDisplay,
  dotmatrix: DotMatrixDisplay,
}

const ActiveSkin = SKIN_MAP[theme]

<ActiveSkin
  words={current?.words ?? ['', '', '']}
  isAnimating={isAnimating}
  onAnimationComplete={handleAnimationComplete}
/>
```

`StaticDisplay` is removed entirely once all three skins are in place.

---

## What This Contract Does NOT Cover

- Internal animation mechanics (CSS approach, timing, easing) — each skin owns its own implementation.
- Colour variant for Dot-Matrix — internal state, not part of the shared contract.
- Audio synthesis — owned by `SplitFlapDisplay` via `useAudio`; not part of the shared interface.
