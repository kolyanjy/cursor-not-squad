# TonightPick — Hackathon Context

> Single source of truth for the build. Distilled from concept notes, `API.md`, `PITCH.md`, and the `docs/` set.
>
> **Authority rule:** where the structured `docs/` spec and the original concept notes disagree, **`docs/` is canonical for the MVP** (it describes what is actually being built). The concept notes are kept as the *vision / north star*. All known conflicts are listed in §17.

---

## 1. Hackathon Brief

**Prompt:** Build a tool, system, or workflow that solves a real problem **without relying on a conventional dashboard as the primary interface.**

**Our answer:** The main interface is **one decision card** (a verdict, like an answer from fate) — not a panel or a list of activities. History and settings are secondary and hidden away.

### One-liner
**TonightPick:** Tinder for your evening — one swipe, one plan, no dashboard.
*"One tap — one concrete thing to do tonight. No endless scrolling, no dashboard."*

---

## 2. The Problem (real personal pain point)

| Pain | Real? |
|------|-------|
| Decision fatigue after work | Yes — low energy to choose |
| "What should we do?" group-chat loops | Yes — social friction |
| Netflix / phone scroll instead of living | Yes — default behavior |
| Traditional planners feel like work | Yes — dashboard fatigue |

TonightPick reduces **decision paralysis** by: (1) constraining the choice set — one card at a time; (2) frictionless preference capture — swipe instead of typing; (3) surfacing consensus — a short liked-list and a single "Pick winner" moment.

---

## 3. The Solution

| Before | After |
|--------|-------|
| 30 min deciding | 2 min swiping |
| Dashboard with 50 tasks | One card at a time |
| Analysis paralysis | Forced choice (pick a winner) |

**Core loop:** context → spin → one action with a CTA → accept / try again (reroll limited).

---

## 4. Why It Wins the Rubric

| Criterion | Weight | How we close it |
|-----------|--------|-----------------|
| Innovation | 25% | Not "random from a list" but a smart spin: mood + budget + time + weather + "already rejected" |
| Technical Execution | 25% | Scoring/weather contract + swipe UX; typed client + mock layer + clean 3-route SPA |
| Functional Completeness | 20% | Full cycle: context → spin → one action with CTA → accept / again (reroll limit) |
| Problem–Solution Fit | 20% | "Can't decide what to do tonight" — instantly recognizable to everyone |
| UX & Design | 5% | One screen, large typography, 3–5 screens for AI visual review |
| Learning & Ambition | 5% | Group mode or AI personalization — "we tried harder than a plain random" |

---

## 5. Differentiation (Innovation)

Not a random number generator. Not another todo app.

- **Weighted picks** — mood, budget, duration, weather boost
- **Swipe UX** — fun, mobile-native feel in the browser
- **Event-based** — shareable link for friends (roadmap)
- **Anti-dashboard** — aligns directly with the hackathon prompt

---

## 6. Product

### Target users
| Persona | Need |
|---------|------|
| The Planner | "Give me something we can agree on in 5 minutes." |
| The Participant | "Show me good ideas without reading a wall of text." |
| The Couple | "Something fun tonight that fits our mood and budget." |

**Context of use:** same evening, mobile phone in hand, 2–6 people, low patience for forms or dashboards.

### Core user journey
```
Home                    Swipe                         Results
┌──────────────┐       ┌──────────────┐              ┌──────────────┐
│ Event title  │  ──►  │ Activity     │  ──►         │ Liked list   │
│ Mood chips   │       │ card +       │              │ Pick winner  │
│ [ Start ]    │       │ Nope/Tonight │              │              │
└──────────────┘       └──────────────┘              └──────────────┘
```

### Scope (MVP)
**In:** mobile-first React UI (dark + teal); 3 routes; typed API client OR mock mode; card transitions; touch action bar; iPhone safe areas.
**Out:** auth/accounts; real-time multi-device sync; admin dashboard/analytics; native apps; real recommendation engine (mock/static data is fine initially).

### Success metrics (MVP)
| Metric | Target |
|--------|--------|
| Time to first swipe | < 30 s |
| Swipes per session | ≥ 5 |
| Touch target compliance | 100% ≥ 48 px |
| Visual parity with design | High |

---

## 7. Architecture (canonical — frontend-first)

Mobile-first **single-page application** with a thin client. The MVP ships **frontend-only**, talking to a REST API via env-configured base URL **or** an in-app mock layer.

```
Browser / Mobile Web  (max-width ~430px, centered on desktop)
  React SPA (Vite)
    Home (/)  ─┐
    Swipe (/event/:id/swipe)  ─┤──►  src/api/client.ts
    Results (/event/:id/results) ─┘     (mock adapter OR HTTP fetch)
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  ▼                                                ▼
          Mock module (VITE_USE_MOCK=true)        REST API (VITE_API_URL, default :3001)
```

**Principles:** frontend-first MVP (full UX shippable on mock data; API is a stable contract) · route-driven UI, no dashboard · typed boundaries (shared `Activity` type) · mobile constraints first · mock → real API swap via env flag only.

**State (MVP):** Event ID lives in the URL param · current activity in Swipe page local state · rerolls in a `useRerolls` hook (client session, default 3, decrements on **Again** only) · liked list from server (`GET /liked`) / mock in-memory. No Redux needed.

**Security (MVP):** no auth — events identified by opaque UUID in URL (acceptable for demo); no PII; rely on React default escaping.

---

## 8. Tech Stack (frontend)

| Layer | Tech | Target version |
|-------|------|----------------|
| Runtime | React | 19.x |
| Build | Vite | 8.x |
| Language | TypeScript | 6.x (strict) |
| Styling | Tailwind CSS | 4.x |
| Routing | react-router-dom | 7.x |
| Icons | lucide-react | 1.x |
| HTTP | native `fetch` | — |

**Prereqs:** Node.js 20+, npm 10+. Lint: Oxlint.

### Repo layout
```
.
├── frontend/              # React + Vite + TS + Tailwind (the MVP)
│   └── src/
│       ├── main.tsx       # entry + RouterProvider
│       ├── App.tsx        # route definitions
│       ├── index.css      # Tailwind + design tokens
│       ├── pages/         # HomePage, SwipePage, ResultsPage
│       ├── components/     # layout/AppShell, swipe/{ActivityCard,SwipeActionBar,TagPill}, ui/
│       ├── api/           # client.ts (createEvent,getNext,swipe,getLiked) + mock.ts
│       ├── types/         # activity.ts (Activity, Budget, SwipeAction)
│       └── hooks/         # useRerolls, useActivityTransition
├── backend/               # contract-only / future (see §17 — currently ambiguous)
└── docs/                  # full structured spec set
```

**Conventions:** pages own data+nav; components presentational; pages never call `fetch` directly (all HTTP/mock in `src/api/`). Use `@/` path alias. Imports at top of file only. Discriminated unions for async state (`loading | success | error`) with exhaustive `switch` + `never` default.

---

## 9. Screens & UI Spec

**Design principles:** one decision at a time · thumb-zone actions (fixed bottom bar) · scannable metadata (tag/budget/duration pills) · confident large typography on muted descriptions.

**Color tokens:** `bg-app` `#0a0a0f`/slate-950 (gradient) · `bg-card` slate-900/800 · `accent-primary` `#4FD1C5`/teal-400 (Tonight button, "TONIGHT MATCH" border) · `text-primary` white · `text-muted` slate-400 · Nope = red · Again = orange.

**Layout:** max width ~430 px centered on desktop (no separate desktop layout) · card `rounded-3xl` · min touch target 48×48 · Tonight = largest center circle · iPhone safe-area padding (`env(safe-area-inset-*)`).

### Home (`/`)
Title input (required; placeholder e.g. "Friday crew") · optional mood chips (sent as `mood` on `POST /events`) · teal **Start** CTA → creates event → navigate to `/event/:id/swipe`. Minimal chrome, no nav bars.

### Swipe (`/event/:id/swipe`)
Card: header = `TONIGHT MATCH` badge (left, teal) + `{n} rerolls left` pill (right) · body = huge bold title, muted description, tag-pills row · footer = "Weather boost active" (only if `weatherBoost===true`, left) + "Score {n}" (right).
Tag-pills order: each `activity.tags`, then budget pill (`free`→"free", `low`→`$`, `medium`→`$$`), then duration (prefix `~`).
Bottom action bar (fixed, safe-area aware):
| Button | Size | Icon | Action |
|--------|------|------|--------|
| Nope | small | red `X` | `POST /events/:id/swipe { action:"pass" }` → next |
| Tonight | **large** (center) | teal `Heart` | `POST /events/:id/swipe { action:"like" }` → next |
| Again | small | orange `RefreshCw` | `GET /events/:id/next` only; decrement rerolls; disabled at 0 |

Animate card change via a key on `activity.id` (subtle horizontal slide + opacity).

### Results (`/event/:id/results`)
`GET /events/:id/liked` → scrollable compact liked cards · teal **Pick winner** CTA (MVP: local highlight / confirm, no extra API unless `POST /events/:id/winner` is added) · empty state + back-to-swipe link when no likes.

---

## 10. Data Models

### Activity (canonical — docs)
```ts
interface Activity {
  id: string                 // e.g. "act_bubble_tea_walk"
  title: string
  description: string
  emoji?: string
  tags: string[]             // e.g. ["Outdoor"]
  budget: 'free' | 'low' | 'medium'
  duration: string           // e.g. "45 min"
  score?: number             // 70–95 typical; shown in UI (mock random if missing)
  weatherBoost?: boolean     // true → show "Weather boost active"
}
```
Budget display: `free`→"free", `low`→`$`, `medium`→`$$`.

> Concept-notes variant additionally had a `mood: string[]` field on Activity (which moods it fits) — not in the docs schema. See §17.

---

## 11. API Reference (canonical — docs, 4 endpoints)

Base URL (dev): `http://localhost:3001` · Content-Type `application/json` · errors `{ "error": "message" }`.

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/events` | Create event |
| `GET` | `/events/:id/next` | Next activity card |
| `POST` | `/events/:id/swipe` | Record like/pass |
| `GET` | `/events/:id/liked` | List liked activities |

### `POST /events`
Body: `{ "title": "Friday crew", "mood": "chill" }` (`title` required, `mood` optional).
Response `201`: `{ "id": "evt_8f3k2m9x" }`
```ts
const { id } = await createEvent({ title: 'Friday crew', mood: 'chill' })
navigate(`/event/${id}/swipe`)
```

### `GET /events/:id/next`
Used on swipe load **and on Again** (reroll = re-fetch next, no swipe recorded).
Response `200`: `{ "activity": { ...Activity, score, weatherBoost } }`
Errors: `404` event not found · `204`/empty = no more activities (navigate to Results / show end state).

### `POST /events/:id/swipe`
Body: `{ "activityId": "act_...", "action": "like" | "pass" }` (`like`=Tonight, `pass`=Nope).
Response `200`: `{ "ok": true }`
**Again does NOT call this endpoint** — it only calls `GET /next`.

### `GET /events/:id/liked`
Response `200`: `{ "activities": Activity[] }` (all Tonight picks for the event).

### Error handling (frontend)
| Status | Meaning | Action |
|--------|---------|--------|
| 400 | invalid body | inline error |
| 404 | unknown event | redirect Home |
| 422 | validation | field errors |
| 5xx | server error | retry CTA + toast |

### Typed client signatures
```ts
export type SwipeAction = 'like' | 'pass'
createEvent(body:{title:string; mood?:string}): Promise<{id:string}>
getNextActivity(eventId:string): Promise<{activity:Activity}>
recordSwipe(eventId:string, body:{activityId:string; action:SwipeAction}): Promise<{ok:boolean}>
getLikedActivities(eventId:string): Promise<{activities:Activity[]}>
```

> **Extended concept-notes API (NOT in docs / not MVP):** `GET /events/:id` (full event), a dedicated `POST /events/:id/reroll` (server-authoritative rerolls + `rerollsLeft`), richer create response (`shareUrl`, `rerollsLeft:3`), swipe returning `likedCount`/`passedCount`, `GET /weather`, `GET /activities/random`, group `POST /room/:id/vote`. Treat as roadmap, not the current contract. See §17.

---

## 12. Mock Mode (`VITE_USE_MOCK=true`)
Same client function signatures, no network:
| Behavior | Mock |
|----------|------|
| Create event | random `id`, empty session |
| Next | rotate sample activities incl. the reference card |
| Swipe | append to liked if `like`; ignore `pass` |
| Liked | return in-memory liked array |

Reference sample card: **"Grab bubble tea and walk 30min"**, tags Outdoor / `$` / ~45 min, `weatherBoost: true`, `score: 82` (or random 70–95).

---

## 13. Environment Variables (frontend, Vite — `VITE_` prefix only)
| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:3001` | REST API base URL |
| `VITE_USE_MOCK` | `false` | `true` → use in-app mock, no HTTP |

Set in `frontend/.env.local` (gitignored). Restart Vite after changes. Never put secrets in `VITE_*` (embedded in client bundle).
```ts
const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'
const useMock = import.meta.env.VITE_USE_MOCK === 'true'
```

---

## 14. Dev Commands
```bash
cd frontend
npm install
npm install react-router-dom    # when wiring routes, if not present
# frontend/.env.local: VITE_USE_MOCK=true , VITE_API_URL=http://localhost:3001
npm run dev        # http://localhost:5173
npm run build      # typecheck + bundle → dist/
npm run preview     # serve prod build
npm run lint        # Oxlint
```
Routes to verify: `/` → Start · `/event/:id/swipe` → Nope/Tonight/Again · `/event/:id/results` → liked + Pick winner.
**Production:** static `dist/` on any static host (Vercel/Netlify/S3+CDN); API on separate origin with CORS; set env in CI/CD before build.

---

## 15. Roadmap (phases)
| Phase | Goal | Exit criteria |
|-------|------|---------------|
| 0 Foundation | scaffold + tokens | Vite+React+TS+Tailwind running; theme tokens; AppShell max-w-430 |
| 1 Home | event creation | `/` title + mood chips + Start → `POST /events` |
| 2 Swipe | core loop | card UI + Nope/Tonight/Again per UI spec |
| 3 Results | consensus | liked list + Pick winner |
| 4 API & mock | data layer | typed client, `VITE_USE_MOCK`, env base URL, error/loading states |
| 5 Polish | prod feel | animations, reroll limits, safe areas, desktop max-width, a11y, `npm run build` green |

**Post-MVP:** live backend (full persistence) · group sync (shared room, aggregate likes) · smart ranking (score/weather/mood) · location & "open now" · share link · AI-generated activities.

---

## 16. Pitch & Demo

### 30-second pitch (read aloud)
> "How many times have you had a free evening and spent forty minutes deciding what to do — then ended up scrolling anyway?
>
> TonightPick fixes that. You create an event, swipe through ideas like Tinder — Nope or Tonight — and pick one winner. No dashboard, no todo list, just one card and a decision.
>
> We built a mobile web app with a React frontend and a Node API. Activities are scored by mood, budget, and even weather. Try it: create 'Friday night', swipe three cards, and you already have a plan."

### Demo script (2 min)
1. Open on a phone browser (or narrow desktop window).
2. Create event: **"Saturday with friends"**, mood **Out**.
3. Show card **"Grab bubble tea and walk 30min"**.
4. Tap **Tonight** → next card. 5. Tap **Nope** on one. 6. Go to **Results** → 2 liked. 7. Tap **Pick one for tonight** → winner. 8. *"That's the whole loop. Under two minutes from zero to a plan."*

### Q&A prep
- **Why not Google Maps?** Maps shows options; we force a decision and remember rejections.
- **Why no login?** MVP — event ID in URL is enough; auth is roadmap.
- **Why web, not native?** Faster to ship, mobile-first, works on any phone via link.
- **AI angle?** Weighted scoring now; LLM-generated activities on roadmap.

---

## 17. ⚠️ Divergences & Open Questions

Conflicts found between sources — resolve before/at build time:

1. **Backend stack — RESOLVED.** The stale **Python FastAPI `:8000`** docs (`development/backend.md`,
   `getting-started/*`, `deployment/overview.md`) and the **"Cursor Meetup"** naming have been removed/rewritten.
   Docs are now frontend-first and consistent: MVP runs frontend-only (mock or real API), and the **future**
   backend is a **Node REST service on `:3001`** (architecture "suggested future backend stack"). `VITE_API_URL`
   defaults to `:3001`.

2. **Reroll: endpoint vs client-side.** Concept notes/`API.md` define `POST /events/:id/reroll` with server `rerollsLeft`. The docs MVP has **no reroll endpoint** — Again just re-calls `GET /next` and rerolls are client state (`useRerolls`, default 3). → MVP = client-side; server reroll is roadmap.

3. **`POST /events` response shape.** `API.md`: `{ id, title, shareUrl, rerollsLeft }`. `docs/api`: `{ id }` only. → Use `{ id }` for MVP.

4. **Mood vocabulary.** Concept/`API.md`: enum `home | out | friends`. `docs` UI/API examples: free-form chips like `"chill"`, `"active"`. → Decide one vocabulary and align Home chips ↔ activity matching ↔ mock.

5. **Activity `mood` field.** Concept Activity has `mood: string[]`; docs Activity schema omits it. → Add it back only if server-side mood matching is implemented.

6. **Extra endpoints** (`GET /events/:id`, `GET /weather`, `GET /activities/random`, group `POST /room/:id/vote`, swipe count fields) exist only in concept notes → roadmap, not MVP contract.

7. **Stale project name "Cursor Meetup"** appears in `contributing.md`, `prerequisites.md`, `deployment.md` (repo is `cursor-not-squad`, product is TonightPick). → Rename when touched.

8. **Port consistency.** Frontend dev `:5173`; API `:3001` (Node story) vs `:8000` (FastAPI story). Pick one and make `VITE_API_URL` match.
