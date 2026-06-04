# Research: Editorial Layer & Page Design

## Headline Font Selection

**Decision**: Space Grotesk (Google Fonts, `next/font/google`)

**Rationale**: The three skin-specific fonts cover the retro-display spectrum —
VT323 (pixel/dot-matrix), system monospace (split-flap), and Georgia/Times (slot-machine
serif). Space Grotesk is a geometric sans-serif with a slightly technical personality that
sits above all three as a neutral "chrome" font without competing aesthetically. It has
good optical sizing at large display sizes and readable body weights at 16px.

**Alternatives considered**:
- Playfair Display: too editorial and serif-heavy; visually collides with the slot-machine
  skin's Georgia typeface
- IBM Plex Mono: monospace family; conflicts with the split-flap skin's use of monospace
  for its tile characters
- Inter / DM Sans: clean but generic; Space Grotesk has more personality appropriate for
  a novelty tool

**Bundle impact**: Loaded via `next/font/google` (preloaded, no CLS, not counted in JS
bundle). Weight variants needed: 400 (body/editorial), 600 (title). Variable font subset
(latin) keeps the font file under 20 kB.

---

## Layout Architecture

**Decision**: Split `BuzzPhraseApp.tsx` into two vertical sections:
1. Interactive section — constrained to viewport height minus reasonable padding, sticky
   at top; contains all controls, display, and favourites trigger
2. Editorial section — natural document flow below, scrollable

**Rationale**: Currently the entire `<main>` uses `flex flex-col items-center justify-center`
which vertically centres the interactive area. This works while there is nothing below
it but breaks when editorial content is appended — the interactive area floats up or the
centre calculation breaks at small viewports.

**Approach**: Replace the single centred `<main>` with a two-section layout:
- `<section>` for interactive area: `min-h-screen` equivalent (use `py-8` padding with
  `flex flex-col items-center justify-center`) — keeps the tool above-the-fold on most
  viewports
- `<section>` for editorial: `bg-gray-50 border-t` with `max-w-2xl mx-auto px-6 py-10`

The outer wrapper becomes a plain `<div className="flex flex-col min-h-screen">`.

---

## Skin-Neutral Palette for Editorial

**Decision**: `bg-gray-50` (`#F9FAFB`) background with `text-gray-900` body text and
`border-gray-200` separator.

**Rationale**: The three display skin backgrounds are:
- Split-flap: `#1a1a1a` (dark charcoal) — contained within the display `<section>`
- Slot-machine: `#FDF8F0` (cream) — also contained within its display component
- Dot-matrix: `#0D0D0D` (near-black) — contained within its display component

All three skins render their background only within their own display `<section>` element,
not on the page body. The page body remains `bg-white`. The editorial section below sits
on `bg-gray-50` which reads neutrally regardless of which skin is active in the display
area above.

**Contrast**: `text-gray-900` on `bg-gray-50` exceeds 15:1 — well above WCAG AA (4.5:1).
The canonical quote rendered in `text-gray-600` on `bg-gray-50` is approximately 6.5:1 —
still above AA.

---

## ManualInput Micro-copy Strategy

**Decision**: Add a `mode` prop to `ManualInput`. Render a static hint string beneath the
label using `<p>` with `text-xs text-gray-500`. Three hint variants:

| Mode | Hint text |
|------|-----------|
| `original` / `modern` | "Each digit (0–9) picks one word per column." |
| `chaos` | "Each digit (0–9) picks from both matrices. Random generation covers 0–19." |

**Rationale**: The hint is genuinely mode-dependent only for chaos (where users should
know the manual input only covers indices 0–9 while the randomiser covers 0–19). Keeping
it as a prop-driven string in the component and deriving it in `BuzzPhraseApp` keeps
`ManualInput` dumb and testable.

**Interface change**: `ManualInput` gains a `hint: string` prop (not `mode` directly —
passing a derived string keeps the component decoupled from Mode type knowledge).

---

## New Components

**`EditorialSection`** (`src/components/EditorialSection.tsx`)
- Pure presentational component, no props, no state
- Contains: origin story block, canonical Broughton quote, author's note, attribution
  footer
- Uses Space Grotesk CSS variable for section heading; body text uses the global font
- The author's note body text is a placeholder `[AUTHOR_NOTE]` constant in the file;
  Wayne Ellis provides the exact wording during implementation

**No other new components required.** `ManualInput` gains one prop. `BuzzPhraseApp`
gains the `EditorialSection` import and the layout restructure.

---

## Component Contracts Affected

| Component | Change | Type |
|-----------|--------|------|
| `ManualInput` | Add `hint: string` prop | Additive, non-breaking |
| `BuzzPhraseApp` | Layout restructure; derive and pass `hint` to `ManualInput`; add `EditorialSection` below interactive area | Internal refactor |
| `layout.tsx` | Add Space Grotesk font load; expose as `--font-space-grotesk` CSS variable | Additive |
