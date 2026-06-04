# Handoff — Systematic Buzz Phrase Projector

## What was just completed

All five SpecKit specs (001–005) are complete and live. Spec 005 delivered shareable URLs (`?code=257&mode=original`), the Space bar generate shortcut, and easter egg codes (`000` in each mode). The app is deployed at `https://buzz.waynetellis.com`.

Key files from spec 005:
- `src/constants/easterEggs.ts` — easter egg lookup table
- `src/hooks/useBuzzword.ts` — URL sync (T001) + URL read on mount (T002/T008), `isMountedRef` guard
- `src/components/BuzzPhraseApp.tsx` — Space bar `keydown` handler; `key={mode}` on ActiveSkin
- `tests/unit/easterEggs.test.ts` — 10 unit tests covering easter egg contracts

## Current state

- Branch: `main`
- Tests: 52 passing (5 files)
- Build: passing, 0 TypeScript errors
- Deployed: yes — `https://buzz.waynetellis.com` (Vercel, auto-deploys on push to main)
- Lint: clean
- Working tree: clean

## Next task — Polish Sprint (no new SpecKit spec needed)

This is a direct implementation sprint covering five areas. The full plan is in `C:/Users/kenho/.claude/plans/read-prompt-md-and-advise-spicy-riddle.md`.

### 1. Navigation
Add a "← Workshop" link at the top of `BuzzPhraseApp.tsx`, targeting `https://waynetellis.com/workshop`.

### 2. Design — Skin-Responsive Page Aesthetics

**This is the core of the sprint.** The page chrome transforms to match the active display skin. Three distinct aesthetic packages:

| Skin | Theme | Character |
|------|-------|-----------|
| `splitflap` | International airport terminal | Deep navy `oklch(0.10 0.03 230)`, amber/yellow flight-board tones, condensed all-caps labels |
| `slotmachine` | Casino / fruit machine | Deep felt-green or burgundy `oklch(0.10 0.03 10)`, gold accents, damask texture |
| `dotmatrix` | 80s home computer (C64/BBC Micro) | C64 blue `oklch(0.20 0.08 240)`, phosphor green accent, full-page CRT scanlines |

**Connection to portfolio brand:** Cabinet Grotesk headings (replace Space Grotesk), Newsreader body, Wayne's voice: curious, scrappy, warm. Reference: `C:/Users/kenho/Projects/portfolio-site/.impeccable.md`.

**Implementation mechanism:** Add `data-skin={theme}` to the `BuzzPhraseApp` wrapper. Define three `[data-skin="..."]` blocks in `globals.css` overriding CSS custom properties (`--color-base`, `--color-accent`, `--color-surface`, `--color-text`). All Tailwind color classes in components replaced with CSS var references.

**Files to change:** `layout.tsx` (fonts), `globals.css` (CSS vars + skin blocks), `BuzzPhraseApp.tsx` (data-skin attr + dark base), `EditorialSection.tsx` (currently wrong `bg-gray-50`), all selector/input/button components.

**Also apply** the `frontend-design` skill (from `anthropic-agent-skills` plugin) for aesthetic direction and polish.

### 3. Prose — Natural-Prose Review + Expandable Build Story
- Apply `/natural-prose` skill rules to existing `EditorialSection.tsx` copy
- Add an expandable "Story of the Build" section (use `<details>` or React toggle for consistent styling)
- Build story: **collaborative** — draft first from what you know (SpecKit workflow, 5 spec cycles, key challenges, jargon-satire angle), then quiz Wayne to inject personal voice

### 4. Display Improvements

**Split-Flap:**
- Long phrases (chaos mode words like "stakeholder-centric", 18 chars) overflow at 375px. Fix: compute tile width dynamically — scale down when max column word length > 12 chars.
- Audio: extend noise burst from 220 to 660 samples (~15ms) and apply `GainNode` exponential decay for a percussive tail.

**Slot Machine:**
- Cylinder illusion: add `mask-image: linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)` to reel container.
- Ching-ching audio: add `playSettle()` to `useAudio.ts` — two descending sine tones (~800Hz → 600Hz, 80ms each) triggered on `transitionend` when all 3 reels settled.

**Dot-Matrix:**
- Tick audio: add `playTick()` to `useAudio.ts` — ~2ms square-wave pulse at ~400Hz per character reveal.
- Blank between phrases: when `isAnimating` fires with existing text, blank first (150ms pause), then typewrite.

### 5. Obsidian Vault Entry (interactive — do this in-session)
- Quiz Wayne retrospectively (5–7 questions: what surprised you, what you'd do differently, craft decisions you're proud of, what this project means for the portfolio)
- Then create: `C:/Users/kenho/Obsidian/Second Brain/Projects/Systematic Buzz Phrase Projector/README.md` + `00-Planning/Decisions.md` + `01-Logs/20260604 - Retrospective.md`
- Follow vault patterns from existing projects (frontmatter, status table, wikilinks, "Done when" clarity)

## Sequencing recommendation

1. Design (Item 2) + Navigation (Item 1) first — sets the visual foundation
2. Prose (Item 3) alongside or immediately after — knows the final editorial layout
3. Display fixes (Item 4) — component-level, independent
4. Obsidian quiz + vault (Item 5) — interactive, separate from codebase work

## Project quick-reference

```bash
npm run dev      # localhost:3000
npm run build    # TypeScript check + production build
npm run lint     # ESLint
npm test -- --run  # Vitest (no watch)
```

- British English throughout (identifiers, prose, UI copy — not Tailwind class names)
- Regression check: `257` Original → "systemised logistical projection"; `257` Modern → "generative telemetry alignment"
- `'use client'` boundary at `src/components/BuzzPhraseApp.tsx`; `page.tsx` is a Server Component
- React Compiler active — no manual `useMemo`/`useCallback`
- Easter eggs: `src/constants/easterEggs.ts`; `000` returns a special phrase in all three modes
- `isMountedRef` in `useBuzzword.ts` guards URL sync from clearing the URL before URL read runs on mount
- `key={mode}` on `ActiveSkin` in `BuzzPhraseApp.tsx` forces remount on mode change — do not remove this

## Key reference files

- `Docs/PRD.md` — full product requirements (§11 covers planned polish)
- `specs/005-delight-layer/` — last completed spec (all tasks `[x]`)
- `src/components/display/SplitFlapDisplay.tsx` — split-flap skin
- `src/components/display/SlotMachineDisplay.tsx` — slot machine skin
- `src/components/display/DotMatrixDisplay.tsx` — dot-matrix skin
- `src/hooks/useAudio.ts` — Web Audio synthesis (currently split-flap only)
- `C:/Users/kenho/Projects/portfolio-site/.impeccable.md` — brand system reference
