# TonightPick — Project Guide

**TonightPick** is a mobile-first web app that helps people decide what to do tonight by swiping
through activity cards (Nope / Tonight / Again) — Tinder for your evening, deliberately **no dashboard**.
Hackathon prompt: solve a real problem *without* a conventional dashboard as the primary interface.

## Read this first

📄 **`docs/` is the single source of truth.** Start with:
- [`docs/product/overview.md`](./docs/product/overview.md) — what TonightPick is and its MVP scope
- [`docs/api/reference.md`](./docs/api/reference.md) — canonical API contract (4 endpoints + Activity type)
- [`docs/design/ui-spec.md`](./docs/design/ui-spec.md) — design tokens, screen layouts, swipe card spec
- [`docs/development/frontend.md`](./docs/development/frontend.md) — routing, mock mode, hooks, project structure

## Essentials

- **Stack (MVP):** React 19 + Vite + TypeScript (strict) + Tailwind CSS 4 + react-router-dom + lucide-react. Lives in `frontend/`. Rails backend exists as a starter; TonightPick API contract is in `docs/api/reference.md`.
- **Routes:** `/` (Home) · `/event/:id/swipe` (Swipe) · `/event/:id/results` (Results).
- **API (4 endpoints):** `POST /events` · `GET /events/:id/next` · `POST /events/:id/swipe` · `GET /events/:id/liked`. No reroll endpoint — Again is client-side (re-calls `GET /next`; rerolls in `useRerolls` hook, default 3). Base URL `http://localhost:3001`.
- **Mock mode:** `VITE_USE_MOCK=true` bypasses the network entirely — the app ships without a backend.
- **Design:** dark `#0a0a0f` + teal accent `#4FD1C5`; max-width ~430px centered; touch targets ≥48px.

## Commands

```bash
cd frontend
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + bundle → dist/
npm run lint     # Oxlint
```

Set `frontend/.env.local`: `VITE_USE_MOCK=true`, `VITE_API_URL=http://localhost:3001`.

## Conventions

- Pages own data + navigation; pages never call `fetch` directly — all HTTP/mock lives in `src/api/`.
- Use the `@/` path alias; imports at top of file only.
- Discriminated unions for async state (`loading | success | error`) with exhaustive `switch` + `never`.

## Watch out

- The existing `frontend/` code is the Cursor Meetup landing page starter (no routes, no mock, Rails-proxied health call). The TonightPick product — routes, swipe pages, activity types, mock layer — needs to be built on top of it. See `docs/development/frontend.md` (TonightPick additions section).
- Reroll is client-side only (`useRerolls` hook). No `/reroll` endpoint.
- Mood vocabulary: use chips **Chill · Active · Out · Cozy** on the Home screen.

<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
<!-- SPECKIT END -->
