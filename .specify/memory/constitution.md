<!--
SYNC IMPACT REPORT
==================
Version change: (template) → 1.0.0
Added sections:
  - I. Code Quality
  - II. Testing Standards
  - III. User Experience Consistency
  - IV. Performance Requirements
  - Governance
Modified principles: N/A (initial ratification)
Removed sections: N/A (replaced placeholder template)
Templates reviewed:
  - .specify/templates/spec-template.md        ✅ no changes required
  - .specify/templates/plan-template.md        ✅ Constitution Check gate present; will be filled per feature
  - .specify/templates/tasks-template.md       ✅ no changes required
Deferred TODOs: none
-->

# Systematic Buzz Phrase Projector Constitution

## Core Principles

### I. Code Quality

Every file MUST be valid TypeScript with strict mode enabled — no `any` types, no implicit type
coercions, no disabled lint rules without a documented justification comment.

Components MUST follow a single-responsibility model: display components render only, hooks own
state and side-effects, constants files export only static data. Cross-cutting logic lives in
hooks, not components.

All React components MUST be function components. Class components are prohibited.

Props interfaces MUST be explicitly typed and co-located with their component file. Shared types
live in a dedicated `types/` directory.

Dead code MUST NOT be committed. Commented-out blocks are prohibited; use git history instead.

**Why**: The three visual skins share a common state layer. Strict boundaries between display and
logic prevent animation state leaking across skins and make future skin additions safe.

### II. Testing Standards

Every pure utility function in `hooks/` and `constants/` MUST have unit test coverage.
The two canonical phrase lookups (`257` in Original → "systemised logistical projection";
`257` in Modern → "generative telemetry alignment") MUST be present as named regression tests
and MUST pass before any release.

Manual-input validation logic (digit parsing, modulo application, mode-boundary enforcement) MUST
have boundary-condition tests covering: minimum index (0), maximum index per mode (9 for
original/modern, 19 for chaos), and single-digit inputs in chaos mode.

Animation components do NOT require unit tests. Visual correctness is verified by running
`npm run dev` and observing behaviour in the browser.

`npm run build` MUST exit with zero TypeScript errors. This is a hard gate — no merging with
type errors present.

`npm run lint` MUST exit clean. ESLint warnings are permitted only if accompanied by a
`// eslint-disable-next-line` comment that includes a reason.

**Why**: The word-matrix lookup is the irreducible core of the application. If the index engine
is wrong, every generated phrase is wrong. Everything else is presentation.

### III. User Experience Consistency

All three skins (Split-Flap, Slot Machine, Dot-Matrix) MUST present identical information
architecture: mode selector, theme selector, output display, generate button, manual input,
and favorites access. Switching skin MUST NOT move or remove any of these controls.

Animation MUST be interruptible: triggering generate while an animation is running MUST cancel
the in-flight animation and start a new one immediately. The UI MUST NOT lock the user out
during animation.

The generate button MUST be keyboard-accessible (`Enter` or `Space`) and the manual input MUST
submit on `Enter`. No feature may be mouse-only.

Skin-switching MUST be instant — the current phrase renders immediately in the new skin with no
re-animation. Only a fresh generate or manual submit triggers animation.

LocalStorage state (favorites, mode, theme) MUST be restored on page load with no visible flash
of default state.

**Why**: The three skins are the primary novelty of the product. Users will switch between them
to compare aesthetics. Any inconsistency in behaviour between skins will register as a bug even
if technically intentional.

### IV. Performance Requirements

`npm run build` bundle size for the root page MUST remain under 150 kB (First Load JS, as
reported by Next.js build output). No heavy animation libraries (Framer Motion, GSAP, etc.) are
permitted in V1. CSS transitions and the Web Audio API are the only animation primitives allowed.

All animations MUST target 60 fps. Any animation that causes a layout reflow (changes `width`,
`height`, `top`, `left`) is prohibited. Use `transform` and `opacity` exclusively.

The Split-Flap Web Audio synthesis MUST NOT create `AudioContext` instances on every flip. A
single `AudioContext` MUST be instantiated once and reused for the lifetime of the page.

Time-to-interactive on a simulated mid-range mobile device (Lighthouse "Mobile" preset) MUST
remain under 3 seconds. This is validated as part of pre-release sign-off.

**Why**: This is a novelty tool embedded in a portfolio. It must load fast and feel fluid or it
reflects poorly on the portfolio itself. CSS-only animations keep the bundle tiny and sidestep
browser compositor limitations.

## Governance

Amendments require: a written rationale in the PR description, a version bump following the
rules below, and this file updated before merging.

**Versioning policy**:
- MAJOR: A principle is removed or fundamentally redefined in a breaking way.
- MINOR: A new principle or mandatory section is added, or existing guidance is materially
  expanded to cover new constraints.
- PATCH: Wording clarified, typos fixed, non-semantic refinements made.

The `plan.md` Constitution Check gate MUST reference the current constitution version and list
which principles were checked for each feature. A plan MAY NOT proceed to implementation if any
principle is in violation without explicit justification recorded in the plan's
Complexity Tracking table.

**Version**: 1.0.0 | **Ratified**: 2026-06-02 | **Last Amended**: 2026-06-02
