# Feature Specification: Core Application — Buzz Phrase Projector

**Feature Branch**: `001-core-app`

**Created**: 2026-06-03

**Status**: Draft

**Input**: User description: "core elements of the build to meet the PRD"

## Clarifications

### Session 2026-06-03

- Q: How should Chaos mode manual code entry address indices 10–19 (which exceed a single decimal digit)? → A: Three-digit code, digits 0–9 only; chaos indices 10–19 are randomiser-only. The input widget and validation are identical across all modes.
- Q: What is the exact format of a BuzzPhrase unique ID? → A: `{mode}-{d1}{d2}{d3}` — e.g., `original-257`, `modern-009`, `chaos-034`.
- Q: What does the favourites sidebar show when no phrases have been saved? → A: Sidebar is always accessible; empty state shows a short instructional placeholder (e.g., "Generate a phrase and star it to save it here").
- Q: Which spelling convention is canonical — British ("favourites") or American ("favorites")? → A: British English throughout — "favourites", "colour", etc. Full reword of all project documents (including CLAUDE.md architecture notes which currently use "favorites") is deferred to a later pass.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Generate a Random Phrase (Priority: P1)

A visitor arrives at the page and hits the generate button. The app instantly picks three random indices — one per column — and displays the resulting phrase. The visitor can switch between Original (1968 lexicon), Modern (2026 lexicon), or Chaos (combined) modes; each mode changes the active word set and re-randomises on the next generate.

**Why this priority**: This is the irreducible core of the product. Without it, nothing else delivers value.

**Independent Test**: Load the page, click Generate — a three-word phrase appears. Switch mode, click Generate again — the phrase changes. Can be fully verified with no other features present.

**Acceptance Scenarios**:

1. **Given** the app is loaded in Original mode, **When** the user clicks Generate, **Then** a phrase is displayed consisting of one word from each of the three 1968 columns (indices 0–9 per column).
2. **Given** the app is in Modern mode, **When** the user clicks Generate, **Then** a phrase is displayed drawn from the modern lexicon (indices 0–9 per column).
3. **Given** the app is in Chaos mode, **When** the user clicks Generate, **Then** a phrase is displayed drawn from the combined 20-word columns (indices 0–19 per column).
4. **Given** an animation is in progress, **When** the user clicks Generate again, **Then** the in-flight animation is cancelled and a new one begins immediately — the UI does not lock.

---

### User Story 2 — Look Up a Phrase by Manual Code (Priority: P2)

A visitor types a three-digit code (e.g., `257`) into the input field and submits it. The app parses each digit as a column index and displays the exact phrase that code maps to in the current mode. The visitor can verify the canonical reference phrases from the original 1968 pamphlet.

**Why this priority**: Manual code entry is the central mechanic of the original Broughton projector — it gives the tool credibility as a faithful homage, not just a random generator.

**Independent Test**: Enter `257` in Original mode → phrase must read "systemised logistical projection". Enter `257` in Modern mode → phrase must read "generative telemetry alignment".

**Acceptance Scenarios**:

1. **Given** Original mode is active, **When** the user enters `257` and submits, **Then** the phrase "systemised logistical projection" is displayed.
2. **Given** Modern mode is active, **When** the user enters `257` and submits, **Then** the phrase "generative telemetry alignment" is displayed.
3. **Given** Chaos mode is active, **When** the user enters a three-digit code (each digit 0–9), **Then** the correct word from the chaos matrix is displayed for each column index (chaos indices 10–19 are only reachable via the randomiser, not manual entry).
4. **Given** the user enters a code with a non-numeric character or a digit outside the valid range for the active mode, **When** they submit, **Then** a clear validation error is shown and no phrase is rendered.
5. **Given** the manual input field is focused, **When** the user presses `Enter`, **Then** the phrase is submitted (no mouse click required).

---

### User Story 3 — Save and Review Favourite Phrases (Priority: P3)

After generating or looking up a phrase they like, a visitor clicks a star/favourite button to save it. The saved phrase appears in a sidebar or drawer with its mode and code. The collection persists across browser sessions. The visitor can remove individual phrases from their saved list.

**Why this priority**: Favourites extend engagement and personalise the tool, but the core phrase engine must work first.

**Independent Test**: Generate a phrase, star it, close and reopen the browser — the saved phrase is still present. Can be verified independently of mode-switching or display themes.

**Acceptance Scenarios**:

1. **Given** no phrases have been favourited, **When** the user opens the sidebar/drawer, **Then** a short instructional placeholder is shown (the sidebar is accessible at all times, not gated on having saved phrases).
2. **Given** a phrase is currently displayed, **When** the user clicks the favourite button, **Then** the phrase is added to the saved list and the button shows an active/starred state.
3. **Given** a phrase has already been favourited, **When** the user clicks the favourite button again, **Then** the phrase is removed from the saved list.
4. **Given** the user has saved one or more phrases, **When** they close and reopen the browser, **Then** the saved phrases are restored from persistent storage with no visible flash.
5. **Given** the favourites list is non-empty, **When** the user opens the sidebar/drawer, **Then** each saved phrase is shown with its three words, the mode it was generated in, and its index code.

---

### User Story 4 — Persist Mode and Theme Preference (Priority: P4)

A visitor selects a mode (Original / Modern / Chaos) and a display theme (Split-Flap / Slot Machine / Dot-Matrix). When they return to the page later, their last-used mode and theme are automatically restored.

**Why this priority**: Preference persistence removes friction for returning visitors; without it the app always resets to defaults.

**Independent Test**: Select Modern mode and Dot-Matrix theme, close the browser, reopen — both settings are restored without any visible flash of default state.

**Acceptance Scenarios**:

1. **Given** a user selects Modern mode and closes the browser, **When** they return, **Then** the app loads in Modern mode.
2. **Given** a user selects the Dot-Matrix theme and closes the browser, **When** they return, **Then** the app loads with Dot-Matrix active.
3. **Given** no stored preference exists, **When** the page loads, **Then** the app defaults to Original mode and Split-Flap theme.

---

### Edge Cases

- In Chaos mode, manual code entry only addresses indices 0–9 per column (the first half of each 20-word column). Indices 10–19 are only reachable via the randomiser. The input widget and validation rules are identical across all modes.
- What happens when `localStorage` is unavailable (private browsing, storage quota exceeded)? The app must degrade gracefully — no crash, no blank screen; favourites and preferences simply do not persist for that session.
- What happens when a stored favourite references a mode that no longer exists or a phrase that has shifted indices? Stored phrases are self-contained (words + indices + mode snapshot) so display is not affected by future matrix changes.
- What happens if the user types a non-numeric character into the code input? The field must reject non-digit input and show a clear validation hint.
- What happens if the user submits a code with fewer or more than three digits? Validation must require exactly three digits; partial or over-length codes return an error.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a word matrix for Original mode containing exactly 10 words per column across three columns, matching Philip Broughton's 1968 lexicon.
- **FR-002**: System MUST provide a word matrix for Modern mode containing exactly 10 words per column across three columns, reflecting contemporary corporate and AI terminology.
- **FR-003**: System MUST derive the Chaos matrix by concatenating the Original and Modern column arrays, yielding exactly 20 words per column.
- **FR-004**: System MUST apply modulo-10 index bounds for Original and Modern modes and modulo-20 bounds for Chaos mode.
- **FR-005**: System MUST allow the user to select one of three modes (Original, Modern, Chaos) at any time; selecting a mode changes the active word set immediately.
- **FR-006**: System MUST generate a random phrase on demand by selecting a uniformly random index for each of the three columns within the active mode's bounds.
- **FR-007**: System MUST accept a three-digit manual code entry, parse each digit as a column index, and display the corresponding phrase in the active mode.
- **FR-008**: System MUST validate manual code input: exactly three characters, each a single digit 0–9 (valid for all modes); in Chaos mode, digits 0–9 address the first 10 entries of the 20-word column — indices 10–19 are accessible via the randomiser only. Invalid inputs display a user-facing error and do not render a phrase.
- **FR-009**: System MUST cancel any in-progress animation and begin a new one immediately when a new generate or submit action is triggered while an animation is running.
- **FR-010**: System MUST allow the user to favourite the currently displayed phrase; favourited phrases are stored persistently on the client.
- **FR-011**: System MUST allow the user to remove a previously favourited phrase from their saved list.
- **FR-012**: System MUST display the favourites collection in a sidebar or drawer, showing each saved phrase with its words, mode, and original index code.
- **FR-013**: System MUST restore the user's saved favourites, last-selected mode, and last-selected theme on page load without a visible flash of default state.
- **FR-014**: System MUST remain functional if client-side storage is unavailable; favourites and preferences will not persist but no error or blank screen will occur.
- **FR-015**: The generate action MUST be triggerable by keyboard (Enter or Space on the generate button); the manual input MUST submit on Enter.

### Key Entities

- **BuzzPhrase**: A generated phrase record — three words (one per column), the three column indices, the mode it was generated in, and a unique ID in the format `{mode}-{d1}{d2}{d3}` (e.g., `original-257`, `chaos-034`). This ID is used for deduplication in the favourites collection.
- **Mode**: One of `original | modern | chaos` — controls which word matrix is active and the valid index range per column.
- **Theme**: One of `splitflap | slotmachine | dotmatrix` — controls which visual skin renders the phrase (skin implementations are scoped to a separate spec).
- **WordMatrix**: Three arrays of strings (column1, column2, column3) — the static data source for a given mode.
- **FavouritesCollection**: An ordered list of BuzzPhrase objects persisted to client storage under a stable key.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The canonical lookup `257` in Original mode returns "systemised logistical projection" 100% of the time — verified by automated regression test.
- **SC-002**: The canonical lookup `257` in Modern mode returns "generative telemetry alignment" 100% of the time — verified by automated regression test.
- **SC-003**: All boundary-condition inputs for manual entry (index 0, index 9 in all modes) return a valid phrase without error; the randomiser correctly addresses the full 0–19 range in Chaos mode — verified by automated unit tests.
- **SC-004**: Favourites, mode, and theme are restored on page reload with no visible flash of default state — verified by manual observation in the browser.
- **SC-005**: Manual code input rejects non-numeric characters and codes of incorrect length, displaying a clear error message — verified by manual testing.
- **SC-006**: Triggering generate during an active animation cancels the animation and starts a new one within one frame — verified by manual observation.
- **SC-007**: The app loads and displays a usable interface within 3 seconds on a simulated mid-range mobile device.
- **SC-008**: The production bundle for the root page remains under 150 kB First Load JS, as reported by the build tool output.

## Assumptions

- No backend or server-side rendering of phrase data is required in V1 — all word matrices are static, bundled constants.
- Display theme switching is instant (current phrase renders immediately in the new skin) — no re-animation on theme change. Theme-specific animation components are implemented in a separate spec (`002-display-themes`); this spec provides only a static text fallback renderer.
- The three visual skins share a common prop interface (`words: [string, string, string]` plus an `isAnimating` boolean) defined in this spec's types, consumed by the display-themes spec.
- `localStorage` is the persistence mechanism for favourites, mode, and theme preferences. No external database or account system is in scope for V1.
- British English is the canonical spelling convention for all UI copy, code identifiers, and documentation in this project. Existing project documents (CLAUDE.md, architecture notes) that use American spelling (e.g., "favorites") will be updated in a deferred reword pass.
- The app is a standalone page; it does not share navigation, auth, or global state with the wider portfolio site.
- Mobile layout is in scope; native mobile app is out of scope.
- The "Phrase of the Moment" real-time feed (stretch target in the PRD) is explicitly out of scope for this spec.
