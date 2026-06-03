# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

A multi-mode digital homage to Philip Broughton's 1968 *Systematic Buzz Phrase Projector* — a satirical management-jargon matrix. Users generate grammatically correct, meaningless three-word phrases by picking a three-digit code or spinning a randomiser. Three retro visual skins animate the output. Deployed standalone to Vercel; linked from `waynetellis.com/workshop`.

Full PRD at `Docs/PRD.md`.

## Language

British English is the canonical spelling convention for all prose, UI copy, code identifiers, and documentation in this project. Use "favourites", "colour", "organise", "behaviour", etc. throughout.

Exceptions: Tailwind CSS utility class names (e.g., `items-center`) are framework API terms and are not subject to this convention.

## Commands

```bash
npm run dev      # start development server at localhost:3000
npm run build    # production build + TypeScript type-check
npm run lint     # ESLint via eslint-config-next
npm run start    # serve the production build locally
```

All `specify` commands require `PYTHONUTF8=1` prefix on Windows:

```bash
PYTHONUTF8=1 specify <subcommand>
```

## Architecture

### Stack

Next.js 16 App Router · React 19 · TypeScript · Tailwind CSS 4. No backend in V1 — all state is client-side.

### Planned structure

```
src/
  app/
    page.tsx              # Root page — mode selector, display area, favourites trigger
    layout.tsx            # Minimal shell (no portfolio nav)
  components/
    ModeSelector.tsx      # "Original 1968 / Modern 2026 / Chaos" toggle
    ThemeSelector.tsx     # "Split-Flap / Slot Machine / Dot-Matrix" toggle
    ManualInput.tsx       # 3-digit code entry with per-mode validation
    GenerateButton.tsx    # Randomiser CTA
    FavouritesSidebar.tsx  # Saved-phrases drawer (localStorage)
    display/
      SplitFlapDisplay.tsx    # CSS backface-visibility flip + Web Audio
      SlotMachineDisplay.tsx  # translateY scroll + bounce easing
      DotMatrixDisplay.tsx    # setTimeout character typewriter
  hooks/
    useBuzzword.ts        # Core state: mode, theme, indices, phrase, isAnimating
    useLocalFavourites.ts  # localStorage read/write (key: sbpp-favourites)
    useAudio.ts           # Web Audio noise burst for Split-Flap clicks
  constants/
    buzzwords.ts          # ORIGINAL_MATRIX, MODERN_MATRIX, CHAOS_MATRIX
```

### Data model

```typescript
type Mode = 'original' | 'modern' | 'chaos'   // modulo 10 / 10 / 20
type Theme = 'splitflap' | 'slotmachine' | 'dotmatrix'

interface BuzzPhrase {
  id: string                      // "{mode}-{i1}{i2}{i3}"
  words: [string, string, string]
  indices: [number, number, number]
  mode: Mode
}
```

`CHAOS_MATRIX` is derived at module level: concatenate Original + Modern column arrays. Indices 0–9 are original words, 10–19 are modern. Modulo 20 applies.

### localStorage keys

| Key | Contents |
|-----|----------|
| `sbpp-favourites` | JSON array of saved `BuzzPhrase` objects |
| `sbpp-mode` | Last selected `Mode` |
| `sbpp-theme` | Last selected `Theme` |

### Audio

Synthesised via Web Audio API — no audio files. Split-Flap skin only. Each tile flip triggers a ~5ms white-noise burst through a band-pass filter at ~2kHz.

### Verification references

- `257` in Original mode → "systemised logistical projection"
- `257` in Modern mode → "generative telemetry alignment"

## SpecKit Workflow

Specs live under `specs/`. The workflow order is:

```
/speckit-specify   → specs/<NNN>-<name>/spec.md
/speckit-plan      → specs/<NNN>-<name>/plan.md
/speckit-tasks     → specs/<NNN>-<name>/tasks.md
/speckit-implement → execute tasks phase by phase
```

Run `/speckit-agent-context-update` after each planning phase to refresh the section below.

<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
at `specs/002-display-themes/plan.md`.

Key planning decisions:
- `'use client'` boundary at `src/components/BuzzPhraseApp.tsx`; `page.tsx` is a Server Component
- React Compiler (`babel-plugin-react-compiler`) is active — no manual `useMemo`/`useCallback`
- `DisplayProps` interface in `src/types/index.ts` is the shared contract for all three skin components
- Slot Machine and Split-Flap receive `columnWords` prop (full active matrix columns) from `BuzzPhraseApp`
- `useReducedMotion` hook (lazy `useState` SSR-safe) — all skins skip animation and call `onAnimationComplete` immediately when true
- `useAudio` upgraded from stub to full Web Audio synthesis; single `AudioContext` in `useRef`
- VT323 font loaded via `next/font/google` in `layout.tsx`, exposed as `--font-vt323` CSS variable
- `StaticDisplay` is deleted; `SKIN_MAP[theme]` in `BuzzPhraseApp` dispatches to the active skin
- New localStorage key: `sbpp-dotmatrix-colour` (`'green' | 'amber'`, default `'green'`)
- Animation components are exempt from unit tests per constitution §II; `useReducedMotion` gets one SSR test
<!-- SPECKIT END -->
