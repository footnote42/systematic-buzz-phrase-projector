# Feature Specification: Delight Layer

**Feature Branch**: `005-delight-layer`

**Created**: 2026-06-04

**Status**: Draft

**Input**: User description: "delight"

## Clarifications

### Session 2026-06-04

- Q: Should URL updates push a new browser history entry (Back navigates phrase history) or replace the current entry (URL stays in sync, Back goes to previous page)? → A: Replace current history entry — URL stays in sync, Back goes to previous page.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Shareable Phrase Links (Priority: P1)

A user generates a phrase they find particularly amusing and wants to share it with a colleague. They copy a link from the page, paste it into a chat message, and the recipient opens it to see exactly the same phrase — same mode, same code — without any extra steps.

**Why this priority**: Shareability is the highest-leverage delight feature. It turns a solo tool into a social one and drives organic discovery of the app. It requires no account, no server state, and no friction for either party.

**Independent Test**: Navigate to `https://buzz.waynetellis.com?code=257&mode=original` — the app opens with "systemised logistical projection" already displayed, in Original mode, with no interaction required.

**Acceptance Scenarios**:

1. **Given** a phrase is displayed, **When** the user copies the page URL, **Then** the URL includes the current phrase code and mode as query parameters.
2. **Given** a URL with `?code=257&mode=original`, **When** the page loads, **Then** "systemised logistical projection" is displayed immediately without user interaction.
3. **Given** a URL with `?code=257&mode=modern`, **When** the page loads, **Then** "generative telemetry alignment" is displayed immediately without user interaction.
4. **Given** a URL with `?code=257&mode=chaos`, **When** the page loads, **Then** the chaos-mode phrase for code 257 is displayed.
5. **Given** a URL with an invalid or missing code, **When** the page loads, **Then** the app loads normally in its default state with no error shown.
6. **Given** a URL with a valid code and mode, **When** the user switches mode or generates a new phrase, **Then** the URL updates to reflect the new state.

---

### User Story 2 — Keyboard Shortcuts (Priority: P2)

A user wants to generate phrases rapidly without reaching for the mouse. Pressing the Space bar triggers a new phrase instantly, letting them spin through combinations with a single key. The behaviour feels natural and delightful — like a slot machine lever.

**Why this priority**: Keyboard access directly extends the app's core interaction loop. It makes rapid exploration fluid and rewards curious users who discover it by accident. It also improves accessibility and is trivially reversible if unwanted.

**Independent Test**: Focus anywhere on the page (not inside the code input field) and press Space — a new phrase is generated and animated.

**Acceptance Scenarios**:

1. **Given** focus is anywhere on the page outside the code input, **When** Space is pressed, **Then** a new phrase is generated and the animation plays.
2. **Given** focus is inside the manual code input field, **When** Space is pressed, **Then** no phrase is generated (normal text entry behaviour is preserved).
3. **Given** an animation is in progress, **When** Space is pressed, **Then** the current animation is interrupted and a new phrase begins animating immediately.
4. **Given** the page has just loaded with no phrase yet, **When** Space is pressed, **Then** the first phrase is generated.
5. **Given** the favourites sidebar is open, **When** Space is pressed, **Then** a new phrase is generated (the sidebar does not consume the keypress).

---

### User Story 3 — Easter Egg Codes (Priority: P3)

A user entering codes discovers that certain three-digit combinations return special, pre-written phrases that break the normal matrix format — perhaps referencing Broughton himself, the app's own creation, or other in-jokes. The experience is a small reward for curious exploration.

**Why this priority**: Easter eggs add personality and reward exploration without requiring any UI changes. They are low risk, entirely opt-in (only discoverable by those who look), and reinforce the satirical tone of the original 1968 source material.

**Independent Test**: Enter code `000` in Original mode — a special phrase appears that is not produced by the standard matrix lookup.

**Acceptance Scenarios**:

1. **Given** Original mode is active, **When** code `000` is entered, **Then** a special phrase is shown that differs from the standard matrix output for that index.
2. **Given** Modern mode is active, **When** code `000` is entered, **Then** a different special phrase is shown appropriate to the Modern mode tone.
3. **Given** Chaos mode is active, **When** code `000` is entered, **Then** a Chaos-specific special phrase is shown.
4. **Given** an easter egg phrase is displayed, **When** the user saves it to favourites, **Then** it is saved and recalled identically to any other phrase.
5. **Given** an easter egg phrase is displayed, **When** the user copies the share link, **Then** the link correctly encodes the easter egg code so the recipient sees the same phrase.
6. **Given** a non-easter-egg code is entered, **When** the result is displayed, **Then** the output is the standard matrix phrase with no visible difference in rendering.

---

### Edge Cases

- What happens when the URL contains a code that is valid for one mode but out of range for the currently-selected mode?
- What happens when the URL specifies a theme (e.g., `?theme=dotmatrix`) that differs from the user's saved theme preference — URL wins, or localStorage wins?
- What happens if the user is mid-animation and pastes a share link into the address bar and navigates?
- What happens when an easter egg code is entered in a mode where no easter egg is defined — falls through to normal matrix output?
- What happens when Space is pressed while focus is on the Generate button — double-trigger or single?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The page URL MUST update automatically whenever the displayed phrase changes, encoding the phrase code, mode, and theme as query parameters. Each update MUST replace the current browser history entry — not push a new one — so the Back button navigates to the page that linked to the app, not through phrase history.
- **FR-002**: The app MUST read `code` and `mode` query parameters on page load and display the matching phrase immediately, before any user interaction.
- **FR-003**: Invalid, out-of-range, or absent query parameters MUST be silently ignored — the app MUST load in its default state without showing an error.
- **FR-004**: Pressing the Space key while focus is outside the manual code input MUST trigger phrase generation.
- **FR-005**: The Space shortcut MUST NOT interfere with text entry in the manual code input field.
- **FR-006**: A Space keypress during an active animation MUST interrupt the current animation and begin a new generation immediately.
- **FR-007**: A defined set of special three-digit codes MUST return pre-written phrases that override the standard matrix lookup.
- **FR-008**: Easter egg phrases MUST be saveable to favourites using the same mechanism as standard phrases.
- **FR-009**: Easter egg phrases MUST be encodable in share links and correctly decoded on the receiving end.
- **FR-010**: The URL MUST include the `theme` parameter in share links so recipients see the same visual skin.

### Key Entities

- **Share URL**: A page URL encoding `code`, `mode`, and `theme` as query parameters; fully self-contained and stateless.
- **Easter Egg Entry**: A mapping from a specific three-digit code (per mode) to a pre-written phrase tuple that overrides the matrix lookup.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A URL containing a valid code and mode displays the correct phrase within 2 seconds of page load on a mid-range mobile device — no user interaction required.
- **SC-002**: All three regression phrases (`257` Original, `257` Modern, and `000` easter egg in each mode) resolve correctly from share URLs in an incognito session.
- **SC-003**: The Space shortcut triggers phrase generation in under 100ms of the keypress on desktop.
- **SC-004**: Easter egg phrases are present and distinct from the standard matrix output for every mode.
- **SC-005**: The `npm run build` bundle size remains under 150 kB First Load JS after all delight features are added (no regression from spec 004 baseline of 96 Lighthouse Performance score).

## Assumptions

- The URL share feature encodes only `code`, `mode`, and `theme` — no phrase text is encoded in the URL. This keeps URLs short and ensures the source of truth remains the word matrix.
- The `theme` parameter in share links sets the visual skin on load, overriding localStorage, so recipients see exactly what the sharer intended.
- Easter egg codes are a fixed, hardcoded set (not user-configurable). The codes and phrases are chosen at authoring time and do not change at runtime.
- Code `000` is the canonical easter egg code for all three modes. Additional easter egg codes may be added but `000` is the minimum required set.
- The Space shortcut applies globally on the page when focus is not in a text input. No visual indicator or tooltip is required for V1 — discovery is intentional.
- No confetti, particle effects, or third-party animation libraries are introduced. The delight comes from behaviour, not visual spectacle, to preserve the 150 kB bundle ceiling.
