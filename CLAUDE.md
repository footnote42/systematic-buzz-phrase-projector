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
Active spec: none — all specs complete

Completed specs:
- `specs/001-core-app/` — data layer, state hooks, word matrices, manual input, favourites
- `specs/002-display-themes/` — Split-Flap, Slot Machine, and Dot-Matrix animated skins
- `specs/003-editorial-design/` — editorial layer and page design
- `specs/004-vercel-deploy/` — Vercel deployment, buzz.waynetellis.com, portfolio WorkshopCard
- `specs/005-delight-layer/` — shareable links, Space keyboard shortcut, easter egg codes

Stable architectural decisions carried forward:
- `'use client'` boundary at `src/components/BuzzPhraseApp.tsx`; `page.tsx` is a Server Component
- React Compiler active — no manual `useMemo`/`useCallback`
- `DisplayProps` interface in `src/types/index.ts` is the shared contract for all skin components
- `SKIN_MAP[theme]` in `BuzzPhraseApp` dispatches to the active skin component; `key={mode}` forces remount on mode change so tile arrays reinitialise correctly
- All localStorage keys: `sbpp-favourites`, `sbpp-mode`, `sbpp-theme`, `sbpp-dotmatrix-colour`

Spec 003 decisions:
- Headline font: Space Grotesk (next/font/google), CSS var `--font-space-grotesk`
- Page layout splits into interactive section (above fold) + editorial section (scrollable below)
- New component: `src/components/EditorialSection.tsx` (static prose, no props)
- `ManualInput` gains a `hint: string` prop; hint is derived in `BuzzPhraseApp` via `MANUAL_HINT[mode]`
- Editorial palette: `bg-gray-50` / `text-gray-900` — skin-neutral, WCAG AA compliant

Spec 004 decisions:
- Deployment target: Vercel (free tier), connected to GitHub repo, auto-deploy on push to `main`
- Custom domain: `buzz.waynetellis.com` via CNAME → `cname.vercel-dns.com`; TLS auto-provisioned
- No environment variables needed — app is fully client-side
- WorkshopCard: tracked in this spec's tasks.md; implemented as a separate PR in the portfolio repo

Spec 005 decisions:
- URL state: `window.history.replaceState` for writes (not `router.replace`); `window.location.search` in `useEffect` for reads — consistent with SSR-safe localStorage pattern
- URL params override localStorage on load; resolved values are written back to localStorage
- Keyboard shortcut: `document` `keydown` listener in `BuzzPhraseApp.tsx` `useEffect`; guard against `HTMLInputElement` target
- Easter eggs: `src/constants/easterEggs.ts`; lookup in `useBuzzword.submitCode`; mount effect also checks easter eggs when loading from URL
- `isMountedRef` guards T001 (URL sync) from running before T002 (URL read) on mount, preventing premature URL clearing
- `react-hooks/set-state-in-effect` suppressed with eslint-disable blocks on SSR-safe localStorage/URL hydration effects in `useBuzzword.ts` and `useLocalFavourites.ts`
<!-- SPECKIT END -->
