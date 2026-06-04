# Quickstart: Delight Layer — Integration Test Scenarios

## Regression Phrases (must pass before and after this spec)

- `257` Original mode → "systemised logistical projection"
- `257` Modern mode → "generative telemetry alignment"

## US1 — Shareable Phrase Links

### Scenario A: Share link encodes state

1. Open the app at `http://localhost:3000`
2. Select Modern mode
3. Select Dot-Matrix skin
4. Enter code `257` and submit
5. **Verify**: The URL bar now reads `?code=257&mode=modern&theme=dotmatrix`
6. Copy the URL

### Scenario B: Share link loads phrase on recipient's device

1. Open a fresh incognito tab
2. Navigate to `http://localhost:3000?code=257&mode=modern&theme=dotmatrix`
3. **Verify**: "generative telemetry alignment" is displayed immediately — no button press required
4. **Verify**: Mode selector shows "Modern 2026"
5. **Verify**: Theme selector shows "Dot-Matrix"

### Scenario C: URL updates on new generation

1. Open `http://localhost:3000?code=257&mode=original`
2. "systemised logistical projection" displays
3. Press Generate
4. **Verify**: URL updates to reflect the new code and mode (code changes, mode stays `original`)
5. Press Back in browser
6. **Verify**: Browser navigates to the page that preceded the app, NOT to the previous phrase

### Scenario D: Invalid URL params — graceful fallback

1. Navigate to `http://localhost:3000?code=xyz&mode=gibberish`
2. **Verify**: App loads in default state (no phrase displayed, Original mode, Split-Flap skin)
3. **Verify**: No error message or console error

### Scenario E: Partial URL params

1. Navigate to `http://localhost:3000?code=257` (no mode param)
2. **Verify**: App loads in default state (params are incomplete — silently ignored)

---

## US2 — Keyboard Shortcuts

### Scenario F: Space generates a phrase

1. Open the app at `http://localhost:3000`
2. Click somewhere on the page outside the code input (e.g., the heading)
3. Press Space
4. **Verify**: A phrase is generated and the animation plays

### Scenario G: Space inside code input — no trigger

1. Open the app
2. Click inside the three-digit code input field
3. Press Space
4. **Verify**: No phrase is generated; the Space character is not inserted (input is numeric)

### Scenario H: Space during animation — interrupt

1. Press Generate to start an animation
2. While the animation is running, press Space
3. **Verify**: The in-flight animation stops; a new phrase begins animating immediately

### Scenario I: Space with sidebar open

1. Open the favourites sidebar
2. Press Space
3. **Verify**: A new phrase is generated (sidebar does not block the shortcut)

---

## US3 — Easter Egg Codes

### Scenario J: Code `000` reveals easter egg in Original mode

1. Select Original mode
2. Enter code `000` and submit
3. **Verify**: The displayed phrase is NOT the standard matrix phrase for indices [0,0,0]
4. **Verify**: The phrase has the characteristic tone of Broughton's 1968 original

### Scenario K: Code `000` in Modern mode — different phrase

1. Select Modern mode
2. Enter code `000` and submit
3. **Verify**: A different special phrase is displayed (distinct from the Original `000` phrase)

### Scenario L: Code `000` in Chaos mode — different phrase

1. Select Chaos mode
2. Enter code `000` and submit
3. **Verify**: A third distinct special phrase is displayed

### Scenario M: Easter egg saveable to favourites

1. Enter code `000` in Original mode
2. Click the star to save it
3. Hard-reload (Ctrl+Shift+R)
4. Open the favourites sidebar
5. **Verify**: The easter egg phrase is present and correct

### Scenario N: Easter egg encodable in share link

1. Enter code `000` in Modern mode
2. **Verify**: URL updates to `?code=000&mode=modern&theme=...`
3. Open the URL in a fresh incognito tab
4. **Verify**: The easter egg phrase for Modern `000` is displayed

### Scenario O: Non-easter-egg code — normal matrix output

1. Enter code `123` in Original mode
2. **Verify**: The standard matrix phrase for [1,2,3] is displayed
3. **Verify**: No visual difference from any other matrix phrase

---

## Build & Bundle Gate

After implementation, run:

```bash
npm run build
```

**Verify**:
- Zero TypeScript errors
- First Load JS for the root page remains ≤ 150 kB
- No new lint warnings without justification comments
