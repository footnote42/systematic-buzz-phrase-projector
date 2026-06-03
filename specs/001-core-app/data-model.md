# Data Model: Core Application — Buzz Phrase Projector

**Branch**: `001-core-app` | **Date**: 2026-06-03

## TypeScript Types (`src/types/index.ts`)

```typescript
// Primitive union types
export type Mode = 'original' | 'modern' | 'chaos'
export type Theme = 'splitflap' | 'slotmachine' | 'dotmatrix'

// Static word matrix shape — readonly at runtime
export interface WordMatrix {
  readonly column1: readonly string[]
  readonly column2: readonly string[]
  readonly column3: readonly string[]
}

// A resolved buzz phrase (generated or manually looked up)
export interface BuzzPhrase {
  id: string                                    // "{mode}-{d1}{d2}{d3}", e.g. "original-257"
  words: readonly [string, string, string]
  indices: readonly [number, number, number]
  mode: Mode
  savedAt?: number                              // Unix ms — present only in favourites collection
}

// Core application state managed by useBuzzword
export interface BuzzState {
  mode: Mode
  theme: Theme
  current: BuzzPhrase | null
  isAnimating: boolean
}

// Prop contract between spec 001 state layer and spec 002 display skins
export interface DisplayProps {
  words: readonly [string, string, string]
  isAnimating: boolean
  onAnimationComplete: () => void
}

// Result of validateCode()
export interface ValidationResult {
  valid: boolean
  indices?: readonly [number, number, number]
  error?: string
}
```

---

## Entity Descriptions

### BuzzPhrase

The central domain object. Represents one resolved three-word phrase with its provenance (mode and indices). The `id` field combines mode and digit string so that `original-257` always refers to the same phrase regardless of when it was generated — this is the deduplication key for the favourites collection.

**ID format**: `{mode}-{d1}{d2}{d3}` where d1, d2, d3 are the raw digit characters of the code (always single characters 0–9).

| Example id | Words |
|------------|-------|
| `original-257` | "systemised logistical projection" |
| `modern-257` | "generative telemetry alignment" |
| `chaos-034` | words at chaos indices [0, 3, 4] |

`savedAt` is absent on unsaved phrases and added (as a Unix ms timestamp) when a phrase is written to the favourites collection.

---

### WordMatrix

Immutable at runtime. Defined with `satisfies WordMatrix` and `as const` in `buzzwords.ts`. The Chaos matrix is derived at module-load time by concatenating Original and Modern column arrays — it is never stored separately.

```typescript
// constants/buzzwords.ts (excerpt — illustrative)
export const ORIGINAL_MATRIX = {
  column1: [
    "integrated", "total", "systemised", "parallel", "functional",
    "responsive", "optional", "synchronised", "compatible", "balanced"
  ] as const,
  column2: [
    "management", "organisational", "monitored", "reciprocal", "digital",
    "logistical", "transitional", "incremental", "third generation", "policy"
  ] as const,
  column3: [
    "options", "flexibility", "capability", "mobility", "programming",
    "concept", "time-phase", "projection", "hardware", "contingency"
  ] as const,
} satisfies WordMatrix

export const MODERN_MATRIX = {
  column1: [
    "hyper-scale", "decentralised", "generative", "cross-functional", "agile",
    "sustainable", "cognitive", "proactive", "leveraged", "deep-dive"
  ] as const,
  column2: [
    "algorithmic", "friction-free", "multi-channel", "cloud-native", "composable",
    "telemetry", "omni-directional", "zero-trust", "tokenised", "asynchronous"
  ] as const,
  column3: [
    "paradigm", "ecosystem", "touchpoint", "synergy", "bandwidth",
    "optimisation", "pipeline", "alignment", "standard", "vector"
  ] as const,
} satisfies WordMatrix

export const CHAOS_MATRIX: WordMatrix = {
  column1: [...ORIGINAL_MATRIX.column1, ...MODERN_MATRIX.column1],  // 20 entries
  column2: [...ORIGINAL_MATRIX.column2, ...MODERN_MATRIX.column2],  // 20 entries
  column3: [...ORIGINAL_MATRIX.column3, ...MODERN_MATRIX.column3],  // 20 entries
}
```

---

### FavouritesCollection

An ordered array of `BuzzPhrase` objects (each with `savedAt` populated) persisted to localStorage under `sbpp-favourites`. Display order is reverse-chronological (most recently saved first). Maximum 50 entries — when the limit is exceeded, the entry with the lowest `savedAt` is removed before the new one is prepended.

---

## Utility Functions (`src/utils/phraseResolver.ts`)

```typescript
import type { Mode, BuzzPhrase, ValidationResult, WordMatrix } from '@/types'

// Matrix size per mode
export const MATRIX_SIZES: Record<Mode, number> = {
  original: 10,
  modern: 10,
  chaos: 20,
}

// Construct phrase ID from mode and raw digit characters
// e.g. buildPhraseId('original', [2, 5, 7]) → "original-257"
export function buildPhraseId(
  mode: Mode,
  indices: readonly [number, number, number]
): string

// Resolve words from the matrix for given indices (modulo applied)
// Returns a complete BuzzPhrase (without savedAt)
export function resolvePhrase(
  mode: Mode,
  matrix: WordMatrix,
  indices: readonly [number, number, number]
): BuzzPhrase

// Validate a raw 3-character string input
// Returns { valid: true, indices } or { valid: false, error }
export function validateCode(
  code: string,
  mode: Mode
): ValidationResult

// Generate uniformly random indices within the active mode's bounds
export function randomIndices(mode: Mode): readonly [number, number, number]
```

---

## localStorage Schema

See `contracts/localstorage-schema.md`.
