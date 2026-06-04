# Tasks: Vercel Deployment & Portfolio Wiring

**Input**: Design documents from `specs/004-vercel-deploy/`

**Prerequisites**: plan.md ✓ spec.md ✓ research.md ✓ quickstart.md ✓

**Tests**: Not applicable — this is a configuration and infrastructure spec. Verification is
manual smoke testing against the live production URL, per `quickstart.md`.

**Organization**: Tasks grouped by user story. No foundational phase — each user story is
independently executable (US3 can begin immediately; US2 depends only on US1 completing).

**Note on file paths**: This spec involves no source code changes in this repo. "File paths"
in task descriptions reference configuration targets (Vercel dashboard, DNS provider settings,
portfolio repository) rather than local source files.

---

## Phase 1: User Story 1 — App is live and publicly accessible (Priority: P1) 🎯 MVP

**Goal**: The deployed app is reachable at a public `*.vercel.app` URL with all features
working correctly in the production environment.

**Independent Test**: Open the `*.vercel.app` URL in an incognito browser, enter `257` in
Original mode, confirm "systemised logistical projection" appears. Save a phrase, reload,
confirm it persists.

- [x] T001 [US1] Create Vercel project — import the `systematic-buzz-phrase-projector` GitHub
  repo via Vercel dashboard (vercel.com/new); verify framework auto-detected as Next.js,
  build command `npm run build`, output directory `.next`
- [x] T002 [US1] Confirm no environment variables required — in Vercel project settings →
  Environment Variables; confirm the list is empty (V1 is fully client-side; no secrets needed)
- [x] T003 [US1] Trigger first production deploy — in Vercel project settings → Git, confirm
  "Automatically deploy from Git" is enabled for the `main` branch (FR-001); push a commit to
  `main` (or use "Redeploy" in Vercel dashboard); confirm build log shows zero TypeScript errors
  and First Load JS ≤ 150 kB in the build output table
- [x] T004 [US1] Smoke test on `*.vercel.app` URL — open the deployment URL in incognito
  browser; enter `257` in Original mode → confirm "systemised logistical projection"; switch
  to Modern mode, enter `257` → confirm "generative telemetry alignment"; confirm all three
  display skins animate correctly
- [x] T005 [US1] localStorage round-trip — generate a phrase, click the star to save it to
  favourites, hard-reload the page (Ctrl+Shift+R / Cmd+Shift+R), confirm the saved phrase
  still appears in the favourites sidebar

**Checkpoint**: App is live and fully functional on the `*.vercel.app` URL. Both regression
phrases verified. localStorage persists across reload.

---

## Phase 2: User Story 2 — App accessible at permanent domain (Priority: P2)

**Goal**: `https://buzz.waynetellis.com` is the canonical URL with valid HTTPS and automatic
HTTP → HTTPS redirect.

**Independent Test**: Navigate to `https://buzz.waynetellis.com` in a fresh browser session —
no cert warning, URL bar shows the custom domain, smoke test phrases pass.

- [x] T006 [US2] Add custom domain in Vercel — Vercel dashboard → project → Settings →
  Domains → add `buzz.waynetellis.com`; note the CNAME target Vercel displays (expected:
  `cname.vercel-dns.com`)
- [x] T007 [US2] Create DNS CNAME record — in the DNS provider for `waynetellis.com`, add a
  CNAME record: Name `buzz`, Value `cname.vercel-dns.com`, TTL 300; wait for Vercel dashboard
  to show the domain status as "Valid Configuration" (typically 2–10 minutes)
- [x] T008 [US2] Verify HTTPS certificate — navigate to `https://buzz.waynetellis.com`;
  confirm the page loads with no browser security warning and the URL bar shows the custom
  domain; then navigate to `http://buzz.waynetellis.com` and confirm it redirects to HTTPS
  automatically
- [x] T009 [US2] Cross-browser HTTPS check — confirm no certificate warning in Chrome,
  Firefox, and Safari (or iOS Safari); confirm the app loads correctly in each
- [x] T010 [US2] Repeat smoke tests on custom domain — enter `257` Original → "systemised
  logistical projection" on `buzz.waynetellis.com`; enter `257` Modern → "generative telemetry
  alignment" on `buzz.waynetellis.com`; confirm favourites localStorage persists

**Checkpoint**: `https://buzz.waynetellis.com` is the working canonical URL. TLS cert valid
in major browsers. HTTP → HTTPS redirect confirmed. Smoke test passes on the custom domain.

---

## Phase 3: User Story 3 — Portfolio links to the live app (Priority: P3)

**Goal**: `waynetellis.com/workshop` lists the Systematic Buzz Phrase Projector with a
working link to the live app.

**Note**: This phase operates in the **portfolio repository** (separate repo). Tasks are
tracked here and implemented inline, but the PR is raised against the portfolio repo.

**Independent Test**: Visit the live portfolio workshop page. Locate the entry. Click the
link. Confirm it opens `buzz.waynetellis.com`.

- [x] T011 [P] [US3] Inspect portfolio workshop section — in the portfolio repo, locate the
  file(s) that control the workshop/projects listing (likely a data array in a `.ts` file, MDX
  content files, or a React component); note the exact pattern used for existing project entries
- [x] T012 [US3] Add WorkshopCard entry in portfolio repo — following the existing pattern
  exactly, add an entry with: name "Systematic Buzz Phrase Projector", description ≤ 2 sentences
  (see `research.md` for draft copy), link `https://buzz.waynetellis.com`, link behaviour
  matching existing portfolio entries
- [x] T013 [US3] Test WorkshopCard locally — start the portfolio dev server; verify the new
  entry appears on the workshop page; check at 375px (no overflow, link tappable) and 1280px
  (card fully visible)
- [x] T014 [US3] Open and merge portfolio PR — raise PR in the portfolio repo; merge after
  approval; verify the live portfolio workshop page shows the new entry and the link opens the
  correct URL

**Checkpoint**: Portfolio workshop page includes the entry. Link opens `buzz.waynetellis.com`.
Card readable at 375px.

---

## Phase 4: Polish & Sign-off

**Purpose**: Full acceptance sign-off against `quickstart.md` before closing the spec.

- [x] T015 Lighthouse mobile audit — open Chrome DevTools → Lighthouse → Mobile preset →
  Analyze on `https://buzz.waynetellis.com`; confirm Performance score ≥ 80 and
  Time to Interactive < 3 seconds; confirm zero console errors during page load
- [x] T016 Final sign-off per `specs/004-vercel-deploy/quickstart.md` — run through all
  Phase 1–4 checklist items; confirm every item passes before raising the spec completion PR

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (US1)**: No dependencies — start immediately
- **Phase 2 (US2)**: Depends on T003 (app must be deployed before domain can be wired)
  - T007 depends on T006 (need CNAME target from Vercel first)
  - T008–T010 depend on T007 (domain must be active)
- **Phase 3 (US3)**: T011 is fully independent — can start immediately in parallel with Phase 1
  - T012 depends on T011 (must understand portfolio pattern first)
  - T013–T014 depend on T012
- **Phase 4**: Depends on all phases complete

### Parallel Opportunities

```
Can run in parallel immediately:
  T001  Create Vercel project
  T011  Inspect portfolio workshop section   ← different system, no dependency

After T003 (deploy complete) + T011 (portfolio pattern identified):
  T004  Smoke test on *.vercel.app
  T012  Add WorkshopCard entry in portfolio repo

After T005 (localStorage confirmed):
  T006  Add custom domain in Vercel

Sequentially:
  T007  DNS CNAME record (after T006)
  T008  Verify HTTPS (after T007)
  T009  Cross-browser check (after T008)
  T010  Repeat smoke tests on custom domain (after T008)
```

### User Story Dependencies

- **US1 (P1)**: Independent — start immediately
- **US2 (P2)**: Depends on US1 (T003 must be complete)
- **US3 (P3)**: T011 is fully independent; T012–T014 need T011 only (not US1 or US2)

---

## Implementation Strategy

### MVP First (User Story 1)

1. Complete T001–T005 — app live on `*.vercel.app`, smoke tests pass
2. **STOP and VALIDATE**: both regression phrases verified; localStorage confirmed
3. If validated: proceed to US2 (custom domain) and US3 (portfolio) in parallel

### Full Delivery

1. US1 (T001–T005) → US2 (T006–T010) → Phase 4 sign-off
2. US3 (T011–T014) can run in parallel starting from T011 immediately
3. T015–T016 close the spec once all user stories are complete
