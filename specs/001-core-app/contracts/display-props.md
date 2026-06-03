# Contract: DisplayProps Interface

**Version**: 1.0.0 | **Defined in**: spec 001-core-app | **Consumed by**: spec 002-display-themes

## Purpose

This interface is the handshake between the state layer (spec 001) and the display skin components (spec 002). Every display component — the three animation skins from spec 002 and the static placeholder from spec 001 — MUST accept props conforming to this shape and no others from the display contract.

## Interface

```typescript
// src/types/index.ts
export interface DisplayProps {
  words: readonly [string, string, string]   // Three resolved words, one per column
  isAnimating: boolean                        // True during the animation sequence
  onAnimationComplete: () => void             // Skin calls this when its animation ends
}
```

## Semantics

| Prop | Description |
|------|-------------|
| `words` | The three resolved words to display. An empty/pre-generate state uses `['', '', '']` — never `null`. |
| `isAnimating` | Set to `true` by `useBuzzword` when a generate or submit action fires. Set back to `false` after `onAnimationComplete()` is called. |
| `onAnimationComplete` | Callback the skin MUST call exactly once at the end of each animation cycle. The static placeholder calls it immediately via `useEffect`. |

## Constraints

- Skins MUST NOT store `words` in local state — always render directly from props.
- `onAnimationComplete` MUST be called exactly once per animation cycle. Calling it multiple times or never calling it are both bugs.
- If a new animation starts before the previous `onAnimationComplete` fires (i.e., the user triggers generate during animation), the skin MUST cancel the in-flight animation and begin a new cycle. Constitution §III requires animation to be interruptible.

## StaticDisplay Placeholder (spec 001)

`StaticDisplay.tsx` satisfies this contract with a no-op animation:

```tsx
'use client'
import { useEffect } from 'react'
import type { DisplayProps } from '@/types'

export default function StaticDisplay({ words, isAnimating, onAnimationComplete }: DisplayProps) {
  useEffect(() => {
    if (isAnimating) onAnimationComplete()
  }, [isAnimating, onAnimationComplete])

  return <p>{words.filter(Boolean).join(' ')}</p>
}
```
