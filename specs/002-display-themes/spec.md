# Feature Specification: Animated Display Skins

**Feature Branch**: `002-display-themes`

**Created**: 2026-06-03

**Status**: Draft

**Input**: User description: "the next stage of the build"

## Context

Spec 001 delivered the full data and state layer plus a `StaticDisplay` placeholder component. This spec replaces that placeholder with three distinct animated display skins — Split-Flap, Slot Machine, and Dot-Matrix — each consuming the existing `DisplayProps` interface and rendering the same three-word phrase with its own visual personality.

All three skins share the same state layer (mode, theme, phrase, `isAnimating`) delivered by `useBuzzword`. The animated skins are the primary novelty of the product; spec 001 deliberately deferred them so the state layer could be validated first.

---

## Clarifications

### Session 2026-06-03

- Q: When the user's OS/browser has `prefers-reduced-motion` enabled, what should the skins do? → A: Skip animation entirely — show the resolved phrase immediately with no animation.
- Q: For Split-Flap words shorter than the panel width, what do unused tile positions display? → A: Trailing dash characters (`-`), word left-aligned — matching the aesthetic of real electromechanical departure boards.
- Q: What do the three skins show before any phrase has been generated (initial/empty state)? → A: Split-Flap panels and Slot Machine columns display placeholder dashes (`-`) in each position; Dot-Matrix shows a lone blinking cursor on an otherwise empty line.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Split-Flap Display Skin (Priority: P1)

A user selects the "Split-Flap" theme. When a phrase is generated, each word panel displays an animated sequence of tile flips — like an airport departure board — before settling on the target word. Each flip is accompanied by a brief mechanical click sound. A mute control in the header silences the audio globally.

**Why this priority**: The Split-Flap skin is the most iconic and technically richest of the three skins. It combines the visual animation (tile flip) with audio synthesis and is the primary aesthetic hook for the product. Delivering it first proves the animation-plus-audio integration pattern that informs the other two skins.

**Independent Test**: Load the app, select "Split-Flap" theme, click Generate. Tiles should flip to reveal each word of the generated phrase with an audible click per tile. Verify mute silences clicks. Verify switching theme immediately shows the phrase in the new skin without re-animating.

**Acceptance Scenarios**:

1. **Given** Split-Flap is the active theme, **When** the user clicks Generate, **Then** each character tile in each word panel flips individually with a staggered delay, ultimately revealing the generated phrase.
2. **Given** Split-Flap is active and audio is unmuted, **When** a tile flips, **Then** a brief mechanical click sound is emitted per tile flip.
3. **Given** the user clicks the mute button, **When** a subsequent phrase is generated, **Then** no audio plays; the visual animation is unaffected.
4. **Given** an animation is in progress, **When** the user triggers Generate again, **Then** the in-flight animation is cancelled immediately and a new animation begins for the new phrase.
5. **Given** a phrase is displayed in Split-Flap, **When** the user switches to a different theme, **Then** the phrase appears immediately in the new skin with no re-animation.
6. **Given** the page is reloaded, **When** the stored theme is "splitflap", **Then** Split-Flap is active with no visible flash of the default state.

---

### User Story 2 — Slot Machine Display Skin (Priority: P2)

A user selects the "Slot Machine" theme. When a phrase is generated, three vertical reels spin rapidly and decelerate with a bounce to land on each target word, evoking a vintage British fruit machine.

**Why this priority**: The Slot Machine skin is the most immediately legible animation metaphor for random selection. It uses a different animation primitive (vertical scroll) than the Split-Flap and validates that the animation layer can support multiple independent approaches without coupling to the state layer.

**Independent Test**: Load the app, select "Slot Machine" theme, click Generate. Three vertical columns should spin and settle on the three words of the generated phrase. Verify the bounce-settle behaviour. Verify switching theme mid-animation moves to the new skin.

**Acceptance Scenarios**:

1. **Given** Slot Machine is the active theme, **When** the user clicks Generate, **Then** each of the three word columns scrolls upward rapidly and decelerates with a visible bounce, landing on the target word.
2. **Given** an animation is in progress, **When** the user triggers Generate, **Then** the columns snap to the new target immediately and animate to the new phrase.
3. **Given** a phrase is displaying in the Slot Machine skin, **When** the user manually enters a code and submits, **Then** the columns animate to the resolved phrase as if generated randomly.
4. **Given** words of different lengths are displayed across modes, **When** the slot machine settles, **Then** each column accommodates the longest word in the active matrix without overflow or clipping.

---

### User Story 3 — Dot-Matrix Display Skin (Priority: P3)

A user selects the "Dot-Matrix" theme. When a phrase is generated, the full three-word phrase types out character by character on a dark terminal background with green phosphor text, a blinking cursor, and a faint CRT scanline texture.

**Why this priority**: The Dot-Matrix skin completes the trio of retro aesthetics. Its animation (sequential character reveal) is independent of the other two and provides a deliberate tonal contrast — slower, more contemplative — that suits users who want to linger on the absurdity of a phrase.

**Independent Test**: Load the app, select "Dot-Matrix" theme, click Generate. The phrase should type out character by character with a blinking cursor and a brief pause between words. Verify the scanline overlay is visible. Verify the amber/green colour toggle works within the theme.

**Acceptance Scenarios**:

1. **Given** Dot-Matrix is the active theme, **When** the user clicks Generate, **Then** the phrase types out left-to-right, character by character, with a blinking block cursor at the insertion point.
2. **Given** the typewriter is in progress, **When** a word boundary is reached, **Then** a brief pause occurs before the next word begins typing.
3. **Given** the typewriter is in progress, **When** the user triggers Generate again, **Then** the in-flight typewriter is cancelled and the new phrase begins typing from the start.
4. **Given** Dot-Matrix is active, **When** the phrase is fully displayed, **Then** the cursor continues blinking at the end of the phrase.
5. **Given** Dot-Matrix is active, **When** the user toggles the colour variant control, **Then** the display switches between green phosphor and amber phosphor instantly without re-animating.
6. **Given** a phrase is shown in Dot-Matrix, **When** the user switches to a different theme, **Then** the phrase appears instantly in the new skin with no re-animation.

---

### Edge Cases

- What happens when the user switches theme while an animation is in progress? The current phrase should render immediately in the new skin; the old animation is cancelled.
- What happens when a very short phrase (e.g. all single-character words) enters the Split-Flap skin? Each panel sizes to the longest word in the active matrix; unused tile positions show trailing dashes so the panel width never collapses.
- What happens in the Dot-Matrix skin when `isAnimating` is reset before the typewriter completes? The typewriter should stop immediately and show the complete phrase statically.
- What happens if `AudioContext` is blocked by the browser autoplay policy? The visual animation must still run; audio failure is silent and graceful.
- What happens when the user rapidly alternates between Generate and manual code submission? Each submission cancels any prior animation and starts a fresh one.
- What happens on a 375 px wide viewport? All three skins must remain legible and unclipped at minimum mobile width.
- What happens when `prefers-reduced-motion` is enabled? All skins skip their animation and show the resolved phrase immediately; `onAnimationComplete` is called synchronously so the state layer is not left with a stale `isAnimating: true`.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The app MUST provide three selectable display skins: Split-Flap, Slot Machine, and Dot-Matrix.
- **FR-002**: Each skin MUST consume the same phrase data and `isAnimating` signal from the existing state layer without modifying that layer.
- **FR-003**: Triggering generation or manual code submission MUST start the active skin's animation sequence and set `isAnimating` to true; when the animation completes, the skin MUST call `onAnimationComplete` to clear that flag.
- **FR-004**: If generation is triggered while an animation is already running, the in-flight animation MUST be cancelled immediately and the new animation MUST begin.
- **FR-005**: Switching skin MUST display the current phrase instantly in the new skin with no animation; only a fresh generation or code submission triggers animation.
- **FR-006**: The Split-Flap skin MUST animate each character tile with a staggered flip sequence, revealing the target word tile by tile.
- **FR-007**: The Split-Flap skin MUST synthesise a brief mechanical click sound per tile flip using the Web Audio API; a single audio context MUST be created once and reused.
- **FR-008**: A mute control MUST globally silence Split-Flap audio without affecting the visual animation; the mute state MUST persist in `localStorage`.
- **FR-009**: The Slot Machine skin MUST animate each of the three word columns as a vertically scrolling reel that decelerates with a visible bounce to land on the target word.
- **FR-010**: The Dot-Matrix skin MUST reveal the phrase character by character, left to right, with a brief pause between words and a blinking block cursor at the insertion point.
- **FR-011**: The Dot-Matrix skin MUST provide a colour variant toggle (green phosphor / amber phosphor) that switches the display colour instantly without re-animating.
- **FR-012**: All skins MUST present the same controls (mode selector, theme selector, generate button, manual input, favourites access) as specified in the existing layout; switching skin MUST NOT move or remove any control.
- **FR-013**: All three skins MUST remain legible and unclipped at a viewport width of 375 px (minimum mobile width).
- **FR-014**: When the user's OS or browser signals a `prefers-reduced-motion` preference, all three skins MUST skip their animation and display the resolved phrase immediately; `onAnimationComplete` MUST still be called so the state layer clears `isAnimating` correctly.
- **FR-015**: In the Split-Flap skin, each word panel MUST be fixed to the width of the longest word in the active matrix; character positions not occupied by the current word MUST display a trailing dash character (`-`), with the word left-aligned.
- **FR-016**: Before any phrase has been generated, the Split-Flap skin MUST display each panel filled with dash characters; the Slot Machine skin MUST display each column with a dash in the visible position; the Dot-Matrix skin MUST display a lone blinking cursor on an otherwise empty output line.

### Key Entities

- **DisplayProps**: The shared interface contract between the state layer and each skin — `words`, `isAnimating`, `onAnimationComplete`. Already defined in `src/types/index.ts`; each new skin component implements this interface.
- **AudioContext (singleton)**: A single Web Audio API context managed by `useAudio`, instantiated once on first use and reused for the lifetime of the page session. Shared across all Split-Flap tile flips.
- **ColourVariant**: A toggleable property of the Dot-Matrix skin representing the phosphor colour choice (`green` | `amber`). Persisted in `localStorage` under a dedicated key.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All three skins animate without any layout shift at both desktop (1280 px) and minimum mobile width (375 px); no word is clipped or overflows its container during or after animation.
- **SC-002**: Animations run at 60 fps on a simulated mid-range mobile device (verified by browser DevTools frame rate overlay); no frame drops below 30 fps during peak animation.
- **SC-003**: Triggering a new generation while an animation is in progress cancels the prior animation and starts the new one within one frame (< 17 ms).
- **SC-004**: Switching between any two skins while a phrase is displayed takes effect instantly — perceptibly less than 100 ms — with no re-animation.
- **SC-005**: The page first-load bundle size remains under 150 kB (First Load JS) after all three skins are added; no animation library dependency is introduced.
- **SC-006**: Time-to-interactive on a simulated mid-range mobile device remains under 3 seconds after the skins are integrated.
- **SC-007**: The mute control silences Split-Flap audio within the same interaction (click → immediate silence on the next flip), with no audio bleed.
- **SC-008**: All three canonical phrase-lookup regression tests continue to pass (`257` in Original → "systemised logistical projection"; `257` in Modern → "generative telemetry alignment").

---

## Assumptions

- The `DisplayProps` interface (`words`, `isAnimating`, `onAnimationComplete`) defined in spec 001 is stable and will not be changed by this spec.
- The `useBuzzword` and `useAudio` hooks from spec 001 are complete and available; this spec adds implementations to `useAudio` (currently a no-op stub) and adds the three skin components.
- The `StaticDisplay` component from spec 001 is replaced by the active skin component selected via `theme`; `StaticDisplay` is removed once all three skins are in place.
- The VT323 font for the Dot-Matrix skin is loaded via Google Fonts (or self-hosted equivalent); it is a single-weight display font with negligible bundle impact.
- No animation library (Framer Motion, GSAP, Anime.js, etc.) is introduced; all animation is achieved with CSS transitions/keyframes and the Web Audio API.
- Dot-Matrix colour variant state is persisted under `localStorage` key `sbpp-dotmatrix-colour` to survive page reload.
- The amber/green colour toggle is part of the Dot-Matrix skin only; it does not affect other skins or the global mute control.
- Mobile layout is single-column for Split-Flap and Slot Machine (three panels stacked vertically) when the viewport is too narrow for horizontal arrangement; the spec does not prescribe the exact breakpoint.
