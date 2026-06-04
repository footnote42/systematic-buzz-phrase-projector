# Systematic Buzz Phrase Projector

A digital homage to Philip Broughton's 1968 satirical management-jargon matrix. Pick a three-digit code or hit Generate — you'll get a grammatically correct, authoritative-sounding phrase that means absolutely nothing.

Live at **[buzz.waynetellis.com](https://buzz.waynetellis.com)**

---

## What it does

Three word matrices, three display skins, one joke that never gets old.

**Modes**
- *Original (1968)* — Broughton's own 10×10×10 matrix, unchanged
- *Modern (2026)* — the same structure, restocked with AI/agile/cloud vocabulary
- *Chaos* — both matrices combined; 8,000 combinations

**Display skins**
- *Split-Flap* — animated tile flip with Web Audio click synthesis
- *Slot Machine* — scrolling reels with bounce easing
- *Dot-Matrix* — typewriter character reveal with CRT scanline overlay

**Other things it does**
- Manual code entry: type `257` and press Enter to get a specific phrase
- Shareable URLs: every phrase is encoded in the address bar (`?code=257&mode=original`)
- Space bar generates a new phrase
- Save phrases to a local favourites drawer (no account needed)
- Easter eggs: try `000` in each mode

---

## Running it locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build    # production build + TypeScript check
npm run lint     # ESLint
npm test -- --run  # Vitest unit tests
```

---

## Stack

Next.js 16 App Router · React 19 · TypeScript · Tailwind CSS 4 · Vitest

No backend. All state is client-side (localStorage + URL params).

---

## Verification

- `257` in Original mode → "systemised logistical projection"
- `257` in Modern mode → "generative telemetry alignment"

---

## Background

Philip Broughton published the original *Systematic Buzz Phrase Projector* in *Time* magazine on 13 May 1968. Frustrated by impenetrable bureaucratic language, he built a satirical matrix: any three-digit number maps to a phrase that sounds authoritative and says nothing.

> *"No-one will have the remotest idea of what you're talking about. But the important thing is that they're not going to admit it."* — Philip Broughton, 1968

The Modern and Chaos modes are Wayne Ellis's additions — the same joke, updated for the era of AI, cloud, and agile frameworks.
