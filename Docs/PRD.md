# Product Requirements Document
# Systematic Buzz Phrase Projector — V2.0

**Status:** Draft for SpecKit  
**Date:** 2026-06-02  
**Owner:** Wayne Ellis  

---

## 1. Background & Purpose

Philip Broughton, a program analyst at the U.S. Public Health Service, published his *Systematic Buzz Phrase Projector* in *Time* magazine on 13 May 1968. Frustrated with impenetrable bureaucratic jargon, he built a satirical 10×10×10 matrix of management vocabulary. Any three-digit number maps to a grammatically correct, authoritative-sounding phrase that is entirely devoid of meaning.

> *"No-one will have the remotest idea of what you're talking about. But the important thing is that they're not going to admit it."* — Philip Broughton

This application is a multi-mode digital homage to that system, updated with a modern corporate/AI/agile lexicon and delivered with three distinct retro-themed visual skins. It lives at `waynetellis.com/workshop/buzz-phrase-projector` as a standalone Next.js deployment linked from the portfolio workshop page.

---

## 2. Linguistic Model

The projector's universality rests on a strict syntactic frame: **Adjective + Adjective/Noun-Adjunct + Abstract Noun** (A + Aₙ + N).

| Column | Role | Characteristic |
|--------|------|----------------|
| Column 1 | Operational qualifier | Describes the state, readiness, or alignment of a system |
| Column 2 | Domain-specific descriptor | Grounds the phrase in a corporate, structural, or technical realm |
| Column 3 | Abstract deliverable | Sounds technically significant but resists precise definition |

Because every C1 word grammatically precedes any C2 word, which in turn modifies any C3 noun, all 1,000 (or 8,000 in Chaos mode) combinations are grammatically correct.

---

## 3. Word Matrices

### 3.1 Original Matrix (1968)

| Index | Column 1 | Column 2 | Column 3 |
|-------|----------|----------|----------|
| 0 | integrated | management | options |
| 1 | total | organisational | flexibility |
| 2 | systemised | monitored | capability |
| 3 | parallel | reciprocal | mobility |
| 4 | functional | digital | programming |
| 5 | responsive | logistical | concept |
| 6 | optional | transitional | time-phase |
| 7 | synchronised | incremental | projection |
| 8 | compatible | third generation | hardware |
| 9 | balanced | policy | contingency |

### 3.2 Modern Matrix (2026)

| Index | Column 1 | Column 2 | Column 3 |
|-------|----------|----------|----------|
| 0 | hyper-scale | algorithmic | paradigm |
| 1 | decentralised | friction-free | ecosystem |
| 2 | generative | multi-channel | touchpoint |
| 3 | cross-functional | cloud-native | synergy |
| 4 | agile | composable | bandwidth |
| 5 | sustainable | telemetry | optimisation |
| 6 | cognitive | omni-directional | pipeline |
| 7 | proactive | zero-trust | alignment |
| 8 | leveraged | tokenised | standard |
| 9 | deep-dive | asynchronous | vector |

### 3.3 Chaos Matrix (derived)

Chaos concatenates both matrices in column order: indices 0–9 map to the Original rows; indices 10–19 map to the Modern rows. This yields a 20×20×20 = 8,000 combination matrix.

```typescript
CHAOS_MATRIX.column1 = [...ORIGINAL_MATRIX.column1, ...MODERN_MATRIX.column1]
// index 0-9: original, 10-19: modern
```

---

## 4. System Architecture

### 4.1 Deployment

- **Repo:** `github.com/footnote42/systematic-buzz-phrase-projector`
- **Framework:** Next.js 16 App Router, TypeScript, Tailwind CSS 4
- **Deployment:** Vercel (standalone project, separate from portfolio)
- **Portfolio link:** `portfolio-site/app/workshop/page.tsx` gets a `WorkshopCard` component linking to the Vercel URL

### 4.2 File Structure

```
src/
  app/
    page.tsx            # Root: mode selector + display area + favourites drawer
    layout.tsx          # Minimal shell (no portfolio nav)
    globals.css         # Tailwind base + custom animation keyframes
  components/
    ModeSelector.tsx    # "Original / Modern / Chaos" toggle
    ThemeSelector.tsx   # "Split-Flap / Slot Machine / Dot-Matrix" toggle
    ManualInput.tsx     # 3-digit numeric input with validation
    GenerateButton.tsx  # Primary CTA — triggers random generation
    FavouritesSidebar.tsx # Saved phrases drawer
    display/
      SplitFlapDisplay.tsx   # CSS flip animation + Web Audio
      SlotMachineDisplay.tsx # translateY scroll animation
      DotMatrixDisplay.tsx   # Typewriter character reveal
  hooks/
    useBuzzword.ts      # Core state: mode, indices, phrase, isAnimating
    useLocalFavourites.ts # localStorage read/write for saved phrases
    useAudio.ts         # Web Audio API noise synthesis (Split-Flap only)
  constants/
    buzzwords.ts        # ORIGINAL_MATRIX, MODERN_MATRIX, CHAOS_MATRIX
    themes.ts           # Theme config per display skin
```

### 4.3 Core Data Types

```typescript
// constants/buzzwords.ts
interface BuzzWordMatrix {
  column1: string[]
  column2: string[]
  column3: string[]
}

// hooks/useBuzzword.ts
type Mode = 'original' | 'modern' | 'chaos'
type Theme = 'splitflap' | 'slotmachine' | 'dotmatrix'

interface BuzzPhrase {
  id: string                          // "{mode}-{i1}{i2}{i3}"
  words: [string, string, string]
  indices: [number, number, number]
  mode: Mode
}

interface BuzzState {
  mode: Mode
  theme: Theme
  current: BuzzPhrase | null
  isAnimating: boolean
}
```

---

## 5. Feature Specifications

### 5.1 Mode Controller

**Input:** Three-option toggle — "Original (1968)" | "Modern (2026)" | "Chaos"

**Behavior:**
- `original` → active dataset is `ORIGINAL_MATRIX`; valid indices 0–9; modulo 10
- `modern` → active dataset is `MODERN_MATRIX`; valid indices 0–9; modulo 10
- `chaos` → active dataset is `CHAOS_MATRIX`; valid indices 0–19; modulo 20

Switching mode clears the current phrase and resets the manual input field. Selected mode persists in `localStorage`.

---

### 5.2 Generator Engine

#### 5.2.1 Random Generator

A "Generate" CTA button picks three independent random integers, each in range `[0, matrixSize)` where `matrixSize` is 10 for original/modern and 20 for chaos.

```typescript
const randomIndices = (): [number, number, number] => {
  const size = mode === 'chaos' ? 20 : 10
  return [rand(size), rand(size), rand(size)]
}
```

Triggers the active display skin's animation sequence. Button is disabled during animation.

#### 5.2.2 Manual Code Entry

A 3-digit numeric input field. Accepts digits 0–9 only (no letters, no spaces).

**Validation rules:**
- Exactly 3 characters required to resolve
- Each digit is independently parsed and applied modulo `matrixSize`
- In `original`/`modern` mode: digit `8` resolves to index 8; digit `9` resolves to index 9; no digit can exceed 9 (digits are always valid since they are 0–9 and modulo 10 maps them unchanged)
- In `chaos` mode: single-digit entries are valid indices 0–9; the user can enter e.g. `"0"`, `"9"` which resolve to original words, or `"10"`–`"19"` would require two-character per column — **resolution:** in chaos mode, the input shifts to a 2-digit-per-column format (total 6 characters) OR the digit is left as modulo 20 of a single digit (i.e. digits 0–9 still valid, map to original half of chaos matrix)

> **Design decision:** For simplicity in V1, chaos mode manual input still accepts 3 digits 0–9 (giving access to the original half of the chaos matrix only). The random generator covers the full 0–19 range. A 6-digit input for full chaos manual access is a post-V1 enhancement.

**On submit (Enter key or dedicated Resolve button):** resolves words and triggers display animation.

---

### 5.3 Display Themes

Three visual skins are togglable at any time. The selected theme persists in `localStorage`. Switching theme mid-session shows the current phrase immediately in the new skin without re-animating.

#### Theme A: Split-Flap Display

Mechanical airport departure board aesthetic.

- **Animation:** Each word is rendered as a sequence of character tiles. On change, each tile animates through a rapid flip sequence (top half rotates down, bottom half reveals) before settling on the target character.
- **CSS mechanics:** `backface-visibility: hidden`, absolute-positioned top/bottom half divs, `rotateX(-180deg)` → `rotateX(0deg)` transitions per tile, staggered by ~30ms per character.
- **Audio:** Web Audio API synthesizes a ~5ms white-noise burst, band-pass filtered at ~2kHz, triggered once per tile flip. A mute toggle in the header disables audio globally.
- **Typography:** Monospace bold (e.g. `font-mono font-bold`), white text on dark charcoal (`#1a1a1a`) background.
- **Layout:** Three word panels arranged horizontally, each panel sized to the longest word in the active matrix.

#### Theme B: Slot Machine (Fruit Machine)

Vintage British one-armed bandit aesthetic, honouring the 1968 print era.

- **Animation:** Each column is an `overflow: hidden` container wrapping a vertically scrolling list of words. On generate, the list translates upward rapidly then decelerates with a slight bounce (`cubic-bezier(0.34, 1.56, 0.64, 1)`) to land on the target word.
- **CSS mechanics:** `transform: translateY(calc(-${targetIndex} * ${rowHeight}px))` with a CSS transition. Target height is calculated dynamically from the word list item height.
- **Typography:** Georgia or Times New Roman serif, bold, dark ink (`#1a1a1a`) on cream (`#FDF8F0`) background.
- **Layout:** Three equal-width vertical columns with visible top/bottom fade masks (gradient overlay).

#### Theme C: Dot-Matrix Teleprinter

Retro terminal printout aesthetic.

- **Animation:** The full phrase types out character-by-character, left to right, with a cursor blinking at the insertion point. No per-column separation — the phrase prints as a single string with a space between words.
- **Timing:** ~40ms per character, with a brief pause (200ms) between words.
- **Typography:** `VT323` Google Font (or fallback `Courier New`), `#00FF41` green on `#0D0D0D` near-black. A secondary amber variant (`#FFB000` on `#0D0D0D`) togglable within the theme.
- **Layout:** Centered single-line output area with a blinking block cursor (`|` or `█`). A faint scanline CSS overlay adds CRT texture.

---

### 5.4 Favourites & Local Storage

**Saving a phrase:**
- A star/bookmark icon appears next to the generated phrase.
- Clicking it toggles the phrase in/out of a `localFavourites` array.
- Saved item shape: `{ id: string, words: [string, string, string], mode: Mode, savedAt: number }`.
- State syncs to `window.localStorage` on every toggle.

**Favourites sidebar/drawer:**
- Triggered by a persistent "Saved" button or drawer handle.
- Lists saved phrases in reverse chronological order.
- Each entry shows the full phrase text, the mode badge, and a remove button.
- A "Copy" button copies the phrase to clipboard.
- Maximum 50 saved phrases (oldest removed when limit is exceeded).

**localStorage keys:**
- `sbpp-favourites` — JSON array of saved phrases
- `sbpp-mode` — last selected mode
- `sbpp-theme` — last selected theme

---

## 6. UI Layout

```
┌─────────────────────────────────────────────────────────┐
│  Systematic Buzz Phrase Projector         [Saved ★ 3]   │
│  [Original 1968] [Modern 2026] [Chaos]                  │
│  [Split-Flap]  [Slot Machine]  [Dot-Matrix]  [🔊/🔇]   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│         ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│         │systemised│  │logistical│  │projection│      │
│         └──────────┘  └──────────┘  └──────────┘      │
│                                                         │
│         [   GENERATE   ]    or    [ 2 ][ 5 ][ 7 ]  →  │
│                                                         │
│                                   [★ Save this phrase] │
└─────────────────────────────────────────────────────────┘
```

---

## 7. Non-Goals (V1)

| Feature | Status |
|---------|--------|
| Supabase global upvote leaderboard | Post-V1 |
| Real-time headline → phrase feed | Post-V1 |
| Full 6-digit chaos manual input | Post-V1 |
| User accounts / cross-device sync | Post-V1 |
| Share-to-social buttons | Post-V1 |
| Framer Motion (use CSS transitions only) | Excluded — CSS-only keeps bundle minimal |

---

## 8. Implementation Phases

| Phase | Description |
|-------|-------------|
| 1 | Data & state scaffold: `buzzwords.ts`, `useBuzzword.ts`, `useLocalFavourites.ts` |
| 2 | Base UI: mode selector, theme selector, manual input, generate button, plain text output |
| 3 | Slot Machine skin (simplest animation — validates the translate approach) |
| 4 | Split-Flap skin + Web Audio synthesis |
| 5 | Dot-Matrix typewriter skin |
| 6 | Favourites sidebar with localStorage persistence |
| 7 | Theme/mode persistence, mute toggle, polish pass |
| 8 | Portfolio `WorkshopCard` link in `portfolio-site` |

---

## 9. Acceptance Criteria

- Entering `257` in Original mode produces "systemised logistical projection"
- Entering `257` in Modern mode produces "generative telemetry alignment"
- All three skins animate without layout shift on desktop and mobile (375px min width)
- Split-Flap audio fires on flip and is silenced by the mute toggle
- Saving a phrase and reloading the page preserves it in the sidebar
- `npm run build` exits with zero TypeScript errors
- Switching modes mid-session clears the display and disables the generate button for 0ms (no orphaned state)
