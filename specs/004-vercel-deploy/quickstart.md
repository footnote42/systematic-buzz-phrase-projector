# Quickstart & Verification: Vercel Deployment & Portfolio Wiring

## Phase 1 — Initial deployment verification

After first Vercel deploy, check:

- [ ] Vercel build log shows zero TypeScript errors
- [ ] Vercel build output table shows First Load JS ≤ 150 kB for the root page
- [ ] App loads at `*.vercel.app` URL in incognito browser
- [ ] Smoke test: select Original mode, enter `257` → phrase reads "systemised logistical projection"
- [ ] Smoke test: select Modern mode, enter `257` → phrase reads "generative telemetry alignment"
- [ ] All three display skins load and animate correctly
- [ ] All three modes (Original, Modern, Chaos) generate phrases without error
- [ ] Save a phrase to favourites → reload page → phrase is still in the sidebar

## Phase 2 — Custom domain verification

After CNAME record is in place and Vercel shows "Valid Configuration":

- [ ] `https://buzz.waynetellis.com` loads with no browser security warning
- [ ] URL bar shows `buzz.waynetellis.com` (not `*.vercel.app`)
- [ ] Navigating to `http://buzz.waynetellis.com` redirects to HTTPS automatically
- [ ] Repeat smoke tests above on the custom domain URL
- [ ] Check from a mobile device on cellular (not home Wi-Fi) to confirm DNS propagation

### Browser cross-check

- [ ] Chrome — no certificate warning
- [ ] Firefox — no certificate warning
- [ ] Safari (or iOS Safari) — no certificate warning

## Phase 3 — Portfolio verification

After WorkshopCard PR is merged and portfolio is re-deployed:

- [ ] Visit `waynetellis.com/workshop` (or equivalent portfolio workshop URL)
- [ ] Systematic Buzz Phrase Projector entry is visible with name and description
- [ ] Click the link → `https://buzz.waynetellis.com` opens correctly
- [ ] Card is readable at 375px mobile viewport (no overflow, link is tappable)

## Phase 4 — Lighthouse audit

Run against `https://buzz.waynetellis.com` (production URL, not localhost):

```
Chrome DevTools → Lighthouse → Mobile preset → Analyze page load
```

- [ ] Performance score ≥ 80
- [ ] Time to Interactive < 3 seconds
- [ ] No console errors in DevTools during page load

## Final sign-off checklist

- [ ] All Phase 1–4 items above pass
- [ ] `257` Original → "systemised logistical projection" confirmed on production domain
- [ ] `257` Modern → "generative telemetry alignment" confirmed on production domain
- [ ] Portfolio card links to the correct URL
