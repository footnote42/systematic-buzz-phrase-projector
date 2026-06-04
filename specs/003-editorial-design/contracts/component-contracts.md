# Component Contracts: Editorial Layer & Page Design

## ManualInput — updated interface

**File**: `src/components/ManualInput.tsx`

**Change**: One additive prop — `hint: string`. The prop is required (no default);
callers must always supply it. The component renders it as a `<p>` element below the
label, with `text-xs text-gray-500` styling.

```
Props:
  onSubmit(value: string) → void    — no change
  validationError: string | null    — no change
  disabled: boolean                  — no change
  hint: string                       — NEW: helper text displayed below label
                                        caller is responsible for mode-awareness
```

**Backward compatibility**: Non-breaking for new callers. No existing callers outside
`BuzzPhraseApp`; `BuzzPhraseApp` is updated in the same PR.

---

## EditorialSection — new component

**File**: `src/components/EditorialSection.tsx`

```
Props: none
State: none
Side-effects: none
```

Renders a `<section>` containing:
1. Origin story paragraph (Broughton attribution, Time magazine reference)
2. Blockquote — canonical Broughton quote
3. Author's note paragraph (first-person, Wayne Ellis)
4. Attribution footer (`<footer>` or `<p>` inside the section)

Uses CSS variable `--font-space-grotesk` for the section heading. Body text uses
the global body font (Arial/Helvetica sans-serif stack).

**Testability**: Component has no logic — no unit tests required (constitution §II:
"Animation components do NOT require unit tests. Visual correctness is verified by
running `npm run dev`"). Same principle applies to static prose components.

---

## layout.tsx — font addition

**File**: `src/app/layout.tsx`

Add Space Grotesk alongside the existing VT323 load:

```
Fonts loaded:
  VT323 — weight 400, variable --font-vt323         (existing)
  Space Grotesk — weights 400+600, variable --font-space-grotesk  (new)
```

Both fonts use `display: 'swap'` and `subsets: ['latin']`. The `<html>` element's
`className` is extended to include both font variables.
