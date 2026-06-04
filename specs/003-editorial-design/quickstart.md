# Quickstart & Verification: Editorial Layer & Page Design

## Running the dev server

```bash
npm run dev
# open http://localhost:3000
```

## Verification checklist

### Editorial content

- [ ] Origin story is visible below the interactive controls
- [ ] "Philip Broughton" and "1968" appear in the text
- [ ] The canonical quote block is present and styled distinctly (blockquote)
- [ ] Author's note is present (first-person, mentions Modern and Chaos modes)
- [ ] Attribution footer names Broughton and 1968

### Typography

- [ ] Page title uses Space Grotesk (check DevTools → computed font-family on `<h1>`)
- [ ] Editorial section heading uses Space Grotesk
- [ ] Display skin fonts (VT323, monospace, Georgia) are NOT used in the editorial section

### Layout & responsiveness

- [ ] At 1280px wide: title and generate button are both visible without scrolling
- [ ] At 768px wide: same as above (laptop viewport)
- [ ] At 375px wide: no horizontal scrollbar; all editorial text fully visible
- [ ] Editorial section has a visible visual boundary (border-top or background tint)

### Skin neutrality

- [ ] Switch to Split-Flap skin → editorial section appearance unchanged
- [ ] Switch to Slot Machine skin → editorial section appearance unchanged
- [ ] Switch to Dot-Matrix skin → editorial section appearance unchanged

### Manual input micro-copy

- [ ] In Original or Modern mode: hint "Each digit (0–9) picks one word per column." is visible
- [ ] In Chaos mode: hint mentions random generation covers 0–19

### Build

```bash
npm run build
# Must exit clean with zero TypeScript errors
# First Load JS must remain under 150 kB (check build output table)
```

```bash
npm test -- --run
# All 41 existing tests must pass
# Regression tests: 257 Original → "systemised logistical projection"
#                   257 Modern   → "generative telemetry alignment"
```

### Accessibility spot-check

- [ ] Contrast checker: editorial body text passes WCAG AA (4.5:1 minimum)
- [ ] Tab order through interactive controls is unaffected by layout changes
