# Feature Specification: Vercel Deployment & Portfolio Wiring

**Feature Branch**: `004-vercel-deploy`

**Created**: 2026-06-04

**Status**: Draft

**Input**: User description: "deployment"

---

## Overview

The app is fully built and tested locally but is not yet publicly accessible. This feature
gets the Systematic Buzz Phrase Projector live on the internet, wires it to its permanent
home at `buzz.waynetellis.com`, and links it from the portfolio site's workshop area so
visitors can discover it.

No application code changes are required. This spec covers configuration, infrastructure,
and the one new portfolio component (a `WorkshopCard`) that links to the live URL.

---

## Clarifications

### Session 2026-06-04

- Q: Should this spec's tasks.md include tasks for creating the WorkshopCard in the portfolio repo, or should US3 be deferred as a follow-up note? → A: Include tasks in tasks.md, clearly flagged as targeting the portfolio repo; implement inline as part of this spec cycle.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — App is live and publicly accessible (Priority: P1)

The deployed app is reachable at a public URL. Any visitor who follows a direct link or
types the address can load the app and use all features immediately — no login, no
account, no special access.

**Why this priority**: Nothing else matters until the app is publicly deployed. The
preview deployment URL is immediately useful for testing on real devices and sharing for
feedback, even before the custom domain is in place.

**Independent Test**: Open the deployed URL in an incognito browser window on a device
not on the development network. Generate a phrase. Confirm the phrase matrix works and
no 404 or server error appears.

**Acceptance Scenarios**:

1. **Given** the app is deployed, **When** a visitor navigates to the public URL,
   **Then** the app loads fully and all three display skins are functional.
2. **Given** the deployed app, **When** the visitor enters `257` in Original mode,
   **Then** the phrase "systemised logistical projection" is generated — confirming the
   production build matches the expected word matrix.
3. **Given** the deployed app, **When** the visitor saves a phrase to favourites and
   reloads the page, **Then** the saved phrase persists — confirming localStorage works
   in the production environment.

---

### User Story 2 — App is accessible at its permanent domain (Priority: P2)

The app is reachable at `buzz.waynetellis.com`. This is the canonical URL that will
appear in the portfolio link, any shared URLs, and future marketing. The preview Vercel
URL continues to work but is secondary.

**Why this priority**: The permanent domain is what gets shared and bookmarked. Setting
it up early means any links created during testing or feedback already point to the
right address.

**Independent Test**: Navigate to `https://buzz.waynetellis.com` in a fresh browser
session. Confirm the app loads with HTTPS, no certificate warnings, and the URL bar
shows the custom domain (not the `*.vercel.app` fallback).

**Acceptance Scenarios**:

1. **Given** the custom domain is configured, **When** a visitor navigates to
   `https://buzz.waynetellis.com`, **Then** the app loads with a valid HTTPS certificate
   and no security warnings.
2. **Given** the custom domain, **When** a visitor navigates to the bare
   `http://buzz.waynetellis.com` (HTTP), **Then** they are automatically redirected to
   the HTTPS version.
3. **Given** the custom domain, **When** checked from a mobile device on a cellular
   network, **Then** the app loads without errors — confirming DNS propagation is
   complete.

---

### User Story 3 — Portfolio links to the live app (Priority: P3)

A visitor browsing `waynetellis.com/workshop` can see a card or entry for the
Systematic Buzz Phrase Projector and click through to the live app. The portfolio
presents the project with a short description and links directly to `buzz.waynetellis.com`.

**Why this priority**: The portfolio link is the primary discovery channel for new
visitors. Without it, the app is effectively invisible to the target audience.

**Independent Test**: Visit the portfolio workshop page. Locate the entry for this
project. Click the link. Confirm it opens `buzz.waynetellis.com` correctly.

**Acceptance Scenarios**:

1. **Given** the WorkshopCard is added to the portfolio, **When** a visitor views the
   workshop section, **Then** they see the Systematic Buzz Phrase Projector listed with
   its name, a short description, and a link.
2. **Given** the WorkshopCard link, **When** clicked, **Then** it opens
   `https://buzz.waynetellis.com` in the expected manner (same or new tab, per portfolio
   convention).
3. **Given** the WorkshopCard, **When** viewed on a 375px mobile viewport, **Then**
   the card is fully readable and the link is tappable without zooming.

---

### Edge Cases

- What if DNS propagation for `buzz.waynetellis.com` has not completed? The app remains
  accessible via the Vercel preview URL in the interim; the custom domain is additive, not
  a replacement.
- What if the production build fails during Vercel deployment? The previous deploy (if any)
  remains live; the failure must be investigated before re-deploying.
- The portfolio site is a separate repository with its own build pipeline. The WorkshopCard
  task is tracked in this spec's tasks.md and implemented inline as part of this spec cycle,
  but it goes through the portfolio repo's own PR and deployment process.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The app MUST be deployed to Vercel with automatic deploys triggered on
  pushes to the `main` branch.
- **FR-002**: The production deployment MUST pass a smoke test: entering `257` in
  Original mode returns "systemised logistical projection".
- **FR-003**: The app MUST be accessible at `https://buzz.waynetellis.com` with a valid
  HTTPS certificate (provisioned automatically by the hosting provider).
- **FR-004**: HTTP requests to `buzz.waynetellis.com` MUST be redirected to HTTPS
  automatically.
- **FR-005**: The portfolio workshop section MUST include an entry for this project,
  linking to `https://buzz.waynetellis.com`, with the project name and a short
  description.
- **FR-006**: The deployed app MUST load all three display skins and all three word
  modes without error.
- **FR-007**: The `sbpp-favourites` localStorage key MUST persist correctly in the
  production environment across page reloads.

### Key Entities

- **Vercel Project**: The hosting configuration binding the GitHub repository to a
  deployment pipeline. Defines build command, output directory, and environment.
- **Custom Domain**: `buzz.waynetellis.com` — the public canonical URL. Requires a DNS
  CNAME record pointing to Vercel's edge network.
- **WorkshopCard**: A new component or entry in the portfolio site that presents this
  project to portfolio visitors. Contains name, description, and link.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The app loads at `https://buzz.waynetellis.com` with a Lighthouse
  Performance score above 80 on mobile preset — confirming the production bundle is
  within budget and loads fast on constrained devices.
- **SC-002**: The smoke test phrase (`257` Original → "systemised logistical projection")
  passes on the production URL — confirming the word matrix is intact in the deployed
  build.
- **SC-003**: The app loads completely in under 3 seconds on a simulated mid-range mobile
  device (Lighthouse mobile preset, no throttling override) — matching the
  constitution's §IV time-to-interactive target.
- **SC-004**: The custom domain serves HTTPS with no certificate warnings in Chrome,
  Firefox, and Safari — confirming the TLS configuration is correct across major
  browsers.
- **SC-005**: The portfolio WorkshopCard is visible and the link reaches the correct URL
  — confirming the discovery path from portfolio to app is intact.

---

## Assumptions

- The Vercel project will be connected directly to the GitHub repository; no manual
  upload of build artefacts is needed.
- The `waynetellis.com` DNS is managed by a provider where a CNAME record for
  `buzz.waynetellis.com` can be added.
- The portfolio site (`waynetellis.com`) is a separate repository with its own deployment
  process. The WorkshopCard task is tracked in this spec's tasks.md and implemented inline,
  but merges via the portfolio repo's own PR — not this repo's PR.
- No environment variables are required for V1 — all state is client-side, no API keys
  or server secrets exist.
- The Vercel free tier is sufficient for V1 traffic levels and feature requirements.
- Automatic HTTPS provisioning via Vercel covers both the `*.vercel.app` domain and the
  custom domain once the CNAME is verified.
- "Workshop section" on the portfolio refers to an existing section or page; this spec
  does not require creating a new portfolio section from scratch.
