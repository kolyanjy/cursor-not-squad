# TonightPick — Project Guide

**TonightPick** is a mobile-first web app that helps people decide what to do tonight by swiping
through activity cards (Nope / Tonight / Again) — Tinder for your evening, deliberately **no dashboard**.
Hackathon prompt: solve a real problem *without* a conventional dashboard as the primary interface.

## Read this first

📄 **[`scratchpad.md`](./scratchpad.md) is the distilled single source of truth.** It consolidates the
concept notes, `PITCH.md`, `API.md`, and the whole `docs/` set — including the canonical API contract,
UI spec, tech stack, roadmap, and a **Divergences & Open Questions** section (§17) flagging every known
contradiction between sources. Start there before reading the individual docs.

**Authority rule:** where `docs/` and the older concept notes (`PITCH.md`, `API.md`, scratchpad concept
sections) disagree, **`docs/` is canonical for the MVP**. See `scratchpad.md` §17 for the conflict list.

## Essentials

- **Stack (MVP):** frontend-only React 19 + Vite + TypeScript (strict) + Tailwind CSS 4 +
  react-router-dom + lucide-react. Lives in `frontend/`. Backend is contract-only / roadmap.
- **Routes:** `/` (Home) · `/event/:id/swipe` (Swipe) · `/event/:id/results` (Results).
- **API (canonical, 4 endpoints):** `POST /events` · `GET /events/:id/next` · `POST /events/:id/swipe` ·
  `GET /events/:id/liked`. There is **no** reroll endpoint — Again is client-side (re-calls `GET /next`;
  rerolls tracked in a `useRerolls` hook, default 3). Base URL `http://localhost:3001`.
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

- The stale **Python FastAPI** backend docs and **"Cursor Meetup"** naming have been removed/rewritten —
  the docs are now consistently frontend-first. A future backend is still on the roadmap, but as a **Node**
  REST service (`:3001`), not FastAPI. See `scratchpad.md` §17 for remaining MVP-vs-concept divergences
  (reroll is client-side, mood vocabulary, etc.).

<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
<!-- SPECKIT END -->
