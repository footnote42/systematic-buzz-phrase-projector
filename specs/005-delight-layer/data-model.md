# Data Model: Delight Layer

## New Types

### EasterEggMap

Lookup table of special phrase overrides, keyed by mode and then by three-digit code string.

```
EasterEggMap
├── mode: Mode                         ('original' | 'modern' | 'chaos')
└── code: string                       (three-digit string, e.g. '000')
    └── words: [string, string, string] (three-word phrase tuple)
```

- All three modes MUST have an entry for code `'000'`.
- Additional codes are optional.
- Codes that have no entry fall through to the standard matrix lookup silently.
- A code that is the same as a valid matrix code overrides the matrix output for that code.

### ShareUrlParams

The set of query parameters that encode the current app state into a shareable URL.

```
ShareUrlParams
├── code:  string   (three-digit index string, e.g. '257')
├── mode:  Mode     ('original' | 'modern' | 'chaos')
└── theme: Theme    ('splitflap' | 'slotmachine' | 'dotmatrix')
```

- `code` is derived from `BuzzPhrase.indices` joined as a string.
- All three fields MUST be present in a valid share URL.
- A URL with missing or invalid fields is treated as having no URL params (default state loads).

## Modified Types

### BuzzPhrase (no structural change)

Easter egg phrases use the same `BuzzPhrase` shape. The `id` field is generated using `buildPhraseId(mode, indices)` exactly as for matrix phrases. There is no `isEasterEgg` flag — the distinction is only at lookup time, not in the stored data structure.

This means easter egg phrases saved to favourites and recalled from localStorage are indistinguishable from matrix phrases at the type level, which is correct behaviour.

## State Flow

```
Page load
  ↓
Read URL params (window.location.search)
  ↓ params present & valid?
  Yes → set mode/theme from URL, resolve phrase (check easter eggs first, then matrix)
  No  → set mode/theme from localStorage, current = null
  ↓
User generates/submits phrase
  ↓
resolvePhrase or easter egg lookup
  ↓
current state updated
  ↓
URL updated via replaceState (code + mode + theme → query string)
```
