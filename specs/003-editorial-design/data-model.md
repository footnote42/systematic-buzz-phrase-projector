# Data Model: Editorial Layer & Page Design

This spec introduces no new data entities, localStorage keys, or state. All new content
is static prose rendered at build time.

## Affected Interfaces

### `ManualInputProps` (additive change)

```typescript
// src/components/ManualInput.tsx — before
interface ManualInputProps {
  onSubmit: (value: string) => void
  validationError: string | null
  disabled: boolean
}

// src/components/ManualInput.tsx — after
interface ManualInputProps {
  onSubmit: (value: string) => void
  validationError: string | null
  disabled: boolean
  hint: string          // ← new: caller-derived hint text for the active mode
}
```

### Hint derivation in `BuzzPhraseApp`

```typescript
const MANUAL_HINT: Record<Mode, string> = {
  original: 'Each digit (0–9) picks one word per column.',
  modern: 'Each digit (0–9) picks one word per column.',
  chaos: 'Each digit (0–9) picks from both matrices. Random generation covers 0–19.',
}
```

`BuzzPhraseApp` passes `hint={MANUAL_HINT[mode]}` to `ManualInput`.

## Static Content Constants

No new types. The editorial copy lives as string literals in `EditorialSection.tsx`.
The author's note body is a `const AUTHOR_NOTE` placeholder filled by Wayne Ellis
during implementation.

## No localStorage Changes

The existing keys (`sbpp-favourites`, `sbpp-mode`, `sbpp-theme`, `sbpp-dotmatrix-colour`)
are unchanged. No new keys are added.
