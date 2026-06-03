# Quickstart: Animated Display Skins — Integration Scenarios

Run `npm run dev` and open `http://localhost:3000` before executing these scenarios.

---

## Scenario 1: Split-Flap — Basic Generation (Split-Flap skin)

1. Select "Split-Flap" theme.
2. Click "Generate".
3. **Expected**: Three word panels animate tile-by-tile, left to right within each word, words in sequence. Each tile flip emits an audible click. After all tiles settle, `isAnimating` clears and the Generate button re-enables.

---

## Scenario 2: Audio Mute

1. Split-Flap theme active.
2. Click the mute toggle (🔇).
3. Click "Generate".
4. **Expected**: Tiles animate visually with no audio. Click mute again (🔊) — next generation restores clicks.

---

## Scenario 3: Cancel / Interrupt Animation

1. Any animated skin active.
2. Click "Generate" to start an animation.
3. Immediately click "Generate" again before the animation completes.
4. **Expected**: In-flight animation stops instantly. New phrase animation begins from the start. No stuck/frozen state.

---

## Scenario 4: Theme Switch Mid-Animation

1. Start an animation on any skin.
2. Click a different theme selector while animation is running.
3. **Expected**: Current phrase appears immediately in the new skin with no animation. Old skin's animation stops cleanly (no errors in console).

---

## Scenario 5: Theme Switch with Static Phrase

1. Generate a phrase and wait for animation to complete.
2. Click a different theme selector.
3. **Expected**: Phrase appears instantly in new skin. No re-animation. Switching back to original skin also shows phrase instantly.

---

## Scenario 6: Slot Machine — Bounce Settle

1. Select "Slot Machine" theme.
2. Click "Generate".
3. **Expected**: All three word columns scroll upward rapidly and decelerate with a visible bounce, landing on each target word. Words are readable after settling.

---

## Scenario 7: Dot-Matrix — Typewriter and Cursor

1. Select "Dot-Matrix" theme.
2. Click "Generate".
3. **Expected**: Phrase types out character by character with a brief pause between words. Block cursor blinks at the insertion point during typing and remains blinking at the end of the completed phrase.

---

## Scenario 8: Dot-Matrix — Colour Variant Toggle

1. Dot-Matrix theme active, phrase displayed.
2. Toggle the colour variant control (green ↔ amber).
3. **Expected**: Display switches phosphor colour instantly without re-animating. Reload the page — colour variant preference is restored from storage.

---

## Scenario 9: Canonical Regression Checks

1. Select "Original (1968)" mode. Enter `257`. Press Enter.
2. **Expected**: "systemised logistical projection" — in whichever skin is active.
3. Select "Modern (2026)" mode. Enter `257`. Press Enter.
4. **Expected**: "generative telemetry alignment".

---

## Scenario 10: Empty / Initial State

1. Hard-reload the page (Ctrl+Shift+R / Cmd+Shift+R).
2. Cycle through all three themes without generating.
3. **Expected**:
   - Split-Flap: panels show dashes filling each panel width.
   - Slot Machine: columns show a dash in the visible slot.
   - Dot-Matrix: empty line with a blinking cursor only.

---

## Scenario 11: Mobile Layout (375 px)

1. Open DevTools, set viewport to 375 × 667 px (iPhone SE).
2. Switch between all three themes and generate phrases.
3. **Expected**: No horizontal scroll, no clipping, all controls reachable by touch. Panels/columns stack vertically if they cannot fit horizontally.

---

## Scenario 12: Reduced Motion (if testable)

1. Enable "Reduce motion" in OS accessibility settings (macOS: System Settings → Accessibility → Display → Reduce Motion).
2. Hard-reload.
3. Click "Generate".
4. **Expected**: Phrase appears immediately with no animation across all three skins. No audio plays (Split-Flap). `isAnimating` clears correctly (Generate button re-enables).
