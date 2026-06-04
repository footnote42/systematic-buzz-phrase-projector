# Research: Vercel Deployment & Portfolio Wiring

## Vercel Project Setup

**Decision**: Connect GitHub repository directly via Vercel dashboard import.

**Rationale**: Zero-config for Next.js — Vercel auto-detects the framework, sets
`npm run build` as the build command, and uses `.next` as the output directory. No
`vercel.json` or `vercel.ts` config file is needed for V1 (no rewrites, custom headers,
or cron jobs required).

**Alternatives considered**:
- Manual `vercel deploy` CLI: requires Vercel CLI install and manual token management;
  no benefit over dashboard import for a single-developer project
- GitHub Actions + Vercel action: additional pipeline complexity; Vercel's native GitHub
  integration (auto-deploy on push to `main`) is sufficient

---

## Automatic Deploy Behaviour

**Decision**: Accept Vercel's default — push to `main` triggers production deploy;
push to any other branch creates a preview deployment at a unique URL.

**Rationale**: This matches the project's single-developer workflow. Preview deploys
on feature branches (e.g., `005-delight`) are useful for testing before merge without
any additional configuration.

**Note on environment variables**: None required. The app is entirely client-side — no
API keys, secrets, or server-side config. The Vercel environment variable UI can be
safely ignored for V1.

---

## Custom Domain — DNS Configuration

**Decision**: CNAME record `buzz` → `cname.vercel-dns.com` at the `waynetellis.com`
DNS provider.

**Rationale**: CNAME is the standard Vercel approach for subdomains. An A record
pointing to a Vercel IP is also supported but requires updating if Vercel changes IPs;
CNAME is more resilient. `buzz.waynetellis.com` is the subdomain confirmed in the PRD.

**TLS**: Vercel provisions a Let's Encrypt certificate automatically once the CNAME is
verified. HTTP-to-HTTPS redirect is enabled by default — no config required.

**DNS TTL**: Set initial TTL to 300 seconds (5 min) for fast propagation during
setup; can be raised to 3600 after the domain is stable.

**Alternatives considered**:
- A record: less resilient to Vercel IP changes; CNAME preferred for subdomains
- `waynetellis.com/workshop/buzz` path: would require the portfolio to proxy this
  deployment, coupling two separate repos — rejected per PRD decision

---

## Portfolio WorkshopCard

**Decision**: Match existing workshop section pattern — inspect the portfolio repo
before writing any code.

**Rationale**: The portfolio repo framework is not known in advance. Common patterns
seen in developer portfolios: (a) a typed data array in a `projects.ts` file, (b) MDX
files in a `content/` directory, (c) React components directly in a `workshop` page.
The correct approach is to read the existing pattern and add an entry that is
indistinguishable from the others.

**WorkshopCard content**:
- **Name**: Systematic Buzz Phrase Projector
- **Short description** (draft — author may revise): "A digital homage to Philip
  Broughton's 1968 management-jargon matrix. Generate three-word phrases of perfect
  meaninglessness, with three retro animated skins."
- **URL**: `https://buzz.waynetellis.com`
- **Link behaviour**: follow existing portfolio convention (same-tab or new-tab,
  whichever other external projects use)

---

## Smoke Test — Canonical Phrases

Both phrases must be verified against the **production URL** after each deploy:

| Code | Mode | Expected phrase |
|------|------|----------------|
| 257 | Original | systemised logistical projection |
| 257 | Modern | generative telemetry alignment |

These are the constitution §II regression anchors. A production deploy that fails
either check MUST NOT be considered complete.

---

## Lighthouse Targets

Per constitution §IV and spec SC-001 / SC-003:

| Metric | Target | How to measure |
|--------|--------|----------------|
| Performance score | ≥ 80 | Chrome DevTools → Lighthouse → Mobile preset |
| Time-to-interactive | < 3 s | Same Lighthouse report |

Run against `https://buzz.waynetellis.com` (production, not localhost) once the custom
domain is live. The production CDN edge caching will produce better results than a local
dev server.
