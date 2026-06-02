# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

A multi-mode digital homage to Philip Broughton's 1968 *Systematic Buzz Phrase Projector* — a satirical management-jargon matrix. Users generate grammatically correct, meaningless three-word phrases by picking a three-digit code or spinning a randomiser. Three retro visual skins animate the output. Deployed standalone to Vercel; linked from `waynetellis.com/workshop`.

Full PRD at `Docs/PRD.md`.

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
    page.tsx              # Root page — mode selector, display area, favorites trigger
    layout.tsx            # Minimal shell (no portfolio nav)
  components/
    ModeSelector.tsx      # "Original 1968 / Modern 2026 / Chaos" toggle
    ThemeSelector.tsx     # "Split-Flap / Slot Machine / Dot-Matrix" toggle
    ManualInput.tsx       # 3-digit code entry with per-mode validation
    GenerateButton.tsx    # Randomiser CTA
    FavoritesSidebar.tsx  # Saved-phrases drawer (localStorage)
    display/
      SplitFlapDisplay.tsx    # CSS backface-visibility flip + Web Audio
      SlotMachineDisplay.tsx  # translateY scroll + bounce easing
      DotMatrixDisplay.tsx    # setTimeout character typewriter
  hooks/
    useBuzzword.ts        # Core state: mode, theme, indices, phrase, isAnimating
    useLocalFavorites.ts  # localStorage read/write (key: sbpp-favorites)
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
| `sbpp-favorites` | JSON array of saved `BuzzPhrase` objects |
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
<!-- SPECKIT END -->
