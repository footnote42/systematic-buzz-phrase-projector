# Feature Specification: Editorial Layer & Page Design

**Feature Branch**: `003-editorial-design`

**Created**: 2026-06-04

**Status**: Draft

**Input**: User description: "editorial layer and page design"

---

## Overview

The app is fully functional but presents itself as a bare instrument: controls, output,
no context. A first-time visitor has no idea who Philip Broughton was, why this exists,
or why there are three word-set modes. This feature adds the editorial layer that frames
the experience — origin story, author's note, and the design polish that elevates the
page from a prototype to a finished product.

---

## Clarifications

### Session 2026-06-04

- Q: Page title treatment — compact font-swap vs prominent display title with subtitle? → A: Option B — prominent display title (text-3xl or larger) with a short subtitle tagline beneath; mute toggle moves to a secondary position.
- Q: Editorial section visual treatment — bordered callout, background tint, or divider only? → A: Option B — subtle background tint with a single top border; no side or bottom borders.
- Q: Attribution placement — inside editorial section or separate page footer? → A: Option A — attribution line is the final element inside the editorial section; no separate page footer.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — First-time visitor understands the tool (Priority: P1)

A visitor arrives via the portfolio link or a shared URL. They have never heard of Philip
Broughton or the Systematic Buzz Phrase Projector. Before or after generating a phrase,
they should be able to understand: what this is, where it came from, and why the modern
and chaos modes exist.

**Why this priority**: Without context the app is a curiosity that doesn't stick. With
context it becomes a story. The editorial layer is what makes a shareworthy first
impression.

**Independent Test**: Load the page on a fresh browser with no prior knowledge of the
app. Without any interaction, the origin story and author's note should be readable
and sufficient to explain the tool's purpose.

**Acceptance Scenarios**:

1. **Given** a visitor lands on the page for the first time, **When** they scroll past the
   interactive controls, **Then** they see a brief origin story naming Philip Broughton
   and referencing the 1968 *Time* magazine publication, including the canonical quote.
2. **Given** a visitor reads the editorial section, **When** they have finished, **Then**
   they understand that the Modern (2026) and Chaos modes are the author's extensions
   to the original matrix.
3. **Given** a visitor is on a 375px-wide mobile viewport, **When** they scroll to the
   editorial section, **Then** all text is fully visible with no horizontal overflow or
   clipped content.

---

### User Story 2 — Page has clear visual hierarchy (Priority: P2)

The page should communicate its structure at a glance. A visitor should instantly
distinguish the interactive area (controls and display) from the editorial area (copy
and context), and the title should anchor the entire experience.

**Why this priority**: Visual hierarchy reduces cognitive load. Without it, the page
reads as a wall of controls and text with no clear entry point.

**Independent Test**: View the page at 1280px and 375px. The three visual layers
(title + controls, display output, editorial copy) should be immediately distinguishable
without reading any text.

**Acceptance Scenarios**:

1. **Given** a visitor loads the page, **When** they view it at a desktop viewport
   (1280px wide), **Then** the page title is the dominant typographic element and the
   generate control is visible without scrolling.
2. **Given** a visitor switches between the three display skins, **When** the skin
   changes, **Then** the editorial section below remains visually stable and skin-neutral
   (it does not change colour or typography with the skin).
3. **Given** the page at any viewport, **When** scanned top-to-bottom, **Then** the
   information hierarchy reads: (1) title and mode/theme controls, (2) display output
   and generate controls, (3) editorial context and attribution.

---

### User Story 3 — Manual input is self-explanatory (Priority: P3)

The three-digit code entry is not an obvious UI pattern. A brief inline explanation
near the input field tells the visitor how to use it without requiring them to read
the full editorial section.

**Why this priority**: Reduces abandonment of the manual-input feature. Many users will
miss it entirely if it is not labelled.

**Independent Test**: Show the page to someone unfamiliar with the tool without
explaining anything. They should be able to correctly enter a three-digit code and
generate a phrase without any verbal guidance.

**Acceptance Scenarios**:

1. **Given** a visitor sees the manual input field, **When** they read the adjacent
   micro-copy, **Then** they understand that each digit selects a word from one of the
   three columns.
2. **Given** a visitor is in chaos mode, **When** they look at the manual input area,
   **Then** the micro-copy indicates that random generation covers indices beyond 9.

---

### Edge Cases

- What if the user's browser font stack does not include the chosen display font? The
  page must degrade gracefully with a suitable system font fallback.
- What if the editorial copy is expanded in a future spec (more text added)? The layout
  must not break if the copy block grows by 50%.
- How does the layout handle very long generated phrases (chaos mode can produce long
  compound words)? The display area must not collide with the editorial section.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The page MUST display a prominent display-scale title (`text-3xl` or larger)
  that names the application, rendered in the display/headline font. A short subtitle
  tagline MUST appear directly beneath it. The mute toggle moves to a secondary position
  (not the same row as the title).
- **FR-002**: The page MUST include an origin story section that names Philip Broughton,
  references the 1968 *Time* magazine publication, and includes the canonical quote:
  *"No-one will have the remotest idea of what you're talking about. But the important
  thing is that they're not going to admit it."*
- **FR-003**: The page MUST include an author's note (1–2 sentences, first-person) that
  attributes the Modern (2026) and Chaos modes to the site author and explains the
  intent behind updating the lexicon.
- **FR-004**: The page MUST display micro-copy near the manual input controls that
  explains the three-digit code mechanic in plain language.
- **FR-005**: The editorial content MUST be positioned below the interactive controls
  so that the generate action remains visible without scrolling on a 768px-tall viewport.
- **FR-006**: The editorial section MUST use a subtle background tint and a single top
  border to separate it from the interactive area above. No side or bottom borders.
  The treatment must not conflict with any of the three active display skins.
- **FR-007**: The page title and section headings MUST use a display/headline font
  distinct from the three skin-specific fonts (VT323, monospace, serif).
- **FR-008**: All editorial text MUST remain legible at the minimum supported viewport
  width of 375px with no horizontal scroll, clipped text, or broken layout.
- **FR-009**: Switching between display skins MUST NOT alter the editorial section's
  appearance — colour, typography, and layout remain constant regardless of active skin.
- **FR-010**: The attribution line crediting Philip Broughton and the 1968 original MUST
  appear as the final element inside the editorial section, not as a separate page footer.

### Key Entities

- **Origin Story block**: Static prose content — Broughton attribution, publication
  reference, canonical quote. No interactivity.
- **Author's Note block**: First-person attribution of the Modern/Chaos extensions.
  No interactivity.
- **Micro-copy**: Inline helper text co-located with the manual input field. Updates
  contextually to reflect the active mode's index range.
- **Page Title**: The primary heading. Displayed once, persistently.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor unfamiliar with the tool can correctly describe its origin and
  purpose after reading the page without any verbal explanation — validated by informal
  usability check.
- **SC-002**: The page title and generate control are both visible without scrolling on
  a viewport 768px tall or taller (standard laptop screen).
- **SC-003**: The editorial section text has a contrast ratio of at least 4.5:1 against
  its background in all three skin states, meeting WCAG AA.
- **SC-004**: The page layout has no horizontal overflow and no content clipping at
  375px viewport width.
- **SC-005**: `npm run build` exits with zero TypeScript errors and the First Load JS
  bundle remains under 150 kB after adding any new font or editorial components.
- **SC-006**: The editorial section is visually stable — no layout shift, reflow, or
  style change — when the user toggles between any two display skins.

---

## Assumptions

- The editorial copy (Broughton text, author's note) is fixed prose — there is no CMS
  or content-editing interface. Copy changes require a code change.
- The display font chosen for the title is loaded via `next/font` (the same mechanism
  used for VT323 in spec 002) to avoid layout shift and stay within the bundle budget.
- "Skin-neutral" means the editorial section uses a palette that does not visually clash
  with any of the three skin backgrounds (charcoal, cream, near-black). A neutral light
  grey or white background with dark text satisfies this for all three.
- The author's note is written in first person by Wayne Ellis. The spec defines the
  *requirement* for the note; the exact wording is the author's prerogative and will be
  supplied during implementation.
- Micro-copy for the manual input is a static hint string, not a dynamic tooltip. It
  does not need to animate or change on digit entry — it simply labels the control.
- No new interactive components are introduced by this spec. All changes are layout,
  typography, and static prose.
- The 150 kB bundle constraint from the constitution (§IV) applies. A Google Font added
  via `next/font` is preloaded and does not count against the JS bundle.
