# Architecture overview

TonightPick is a **mobile-first single-page application** with a thin client architecture. The MVP ships as **frontend-only**, talking to a REST API via environment-configured base URL or an in-app mock layer.

---

## High-level diagram

```
┌─────────────────────────────────────────────────────────────────┐
│  Browser / Mobile Web                                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  React SPA (Vite, max-width ~430px)                       │  │
│  │  ┌─────────┐  ┌──────────────┐  ┌──────────────┐          │  │
│  │  │  Home   │  │    Swipe     │  │   Results    │          │  │
│  │  │    /    │  │ /event/:id/  │  │ /event/:id/  │          │  │
│  │  │         │  │    swipe     │  │   results    │          │  │
│  │  └────┬────┘  └──────┬───────┘  └──────┬───────┘          │  │
│  │       └──────────────┼─────────────────┘                  │  │
│  │                      ▼                                    │  │
│  │              src/api/client.ts                            │  │
│  │         (mock adapter OR HTTP fetch)                      │  │
│  └──────────────────────┬────────────────────────────────────┘  │
└─────────────────────────┼───────────────────────────────────────┘
                          │
          ┌───────────────┴───────────────┐
          ▼                               ▼
┌──────────────────┐            ┌──────────────────┐
│  Mock module     │            │  REST API        │
│  VITE_USE_MOCK   │            │  VITE_API_URL    │
│  = true          │            │  :3001 (default) │
└──────────────────┘            └──────────────────┘
```

---

## Design principles

| Principle | Implementation |
|-----------|----------------|
| **Frontend-first MVP** | Full UX shippable with mock data; API is a stable contract |
| **Route-driven UI** | Three pages, no dashboard; `react-router-dom` |
| **Typed boundaries** | Shared `Activity` type; API responses validated at client |
| **Mobile constraints first** | Touch targets, safe areas, fixed action bar |
| **Progressive enhancement** | Mock → real API swap via env flag only |

---

## Application layers

### Presentation (`src/pages/`, `src/components/`)

- **Pages** own route params, data fetching triggers, and navigation.
- **Components** are presentational where possible (`ActivityCard`, `SwipeActionBar`).
- **No global dashboard** — each screen is a focused flow step.

### Data (`src/api/`, `src/types/`)

- **`types/activity.ts`** — Canonical `Activity` interface.
- **`api/client.ts`** — HTTP functions for each endpoint.
- **`api/mock.ts`** — Sample activities and in-memory event state when `VITE_USE_MOCK=true`.

### Routing

| Path | Page | Primary API calls |
|------|------|-------------------|
| `/` | Home | `POST /events` |
| `/event/:id/swipe` | Swipe | `GET .../next`, `POST .../swipe` |
| `/event/:id/results` | Results | `GET .../liked` |

---

## Frontend project structure (target)

```
frontend/
├── src/
│   ├── main.tsx                 # React entry + RouterProvider
│   ├── App.tsx                  # Route definitions
│   ├── index.css                # Tailwind + design tokens
│   ├── types/
│   │   └── activity.ts          # Activity, Budget, SwipeAction
│   ├── api/
│   │   ├── client.ts            # createEvent, getNext, swipe, getLiked
│   │   └── mock.ts              # Mock data + handlers
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── SwipePage.tsx
│   │   └── ResultsPage.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   └── AppShell.tsx
│   │   ├── swipe/
│   │   │   ├── ActivityCard.tsx
│   │   │   ├── SwipeActionBar.tsx
│   │   │   └── TagPill.tsx
│   │   └── ui/                  # Shared primitives (Button, Badge)
│   └── hooks/
│       ├── useRerolls.ts        # Client-side reroll counter (default 3)
│       └── useActivityTransition.ts
├── vite.config.ts
└── package.json
```

---

## State management (MVP)

| State | Location | Notes |
|-------|----------|-------|
| Event ID | URL param `:id` | Source of truth after creation |
| Current activity | Swipe page local state | Refetched on next / again |
| Rerolls remaining | `useRerolls` hook (session) | Default 3; decrements on Again only |
| Liked activities | Server (`GET /liked`) | Mock stores in memory per event |
| Mood / title | Home form → POST body | Not persisted client-side after nav |

No Redux required for MVP; React state + router params suffice.

---

## Backend (contract only — MVP)

The MVP frontend targets a REST API on `VITE_API_URL`. Backend implementation is **out of MVP scope** but the contract is fixed:

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/events` | Create event |
| `GET` | `/events/:id/next` | Next activity card |
| `POST` | `/events/:id/swipe` | Record like or pass |
| `GET` | `/events/:id/liked` | List liked activities |

See [API reference](../api/reference.md) for request/response schemas.

**Suggested future backend stack** (not required for frontend MVP):

- Node (Express/Fastify) or Python (FastAPI)
- PostgreSQL or SQLite for events, swipes, activities
- Optional Redis for session reroll counts if server-authoritative rerolls are needed

---

## Environment & deployment

| Variable | Role |
|----------|------|
| `VITE_API_URL` | API origin (default `http://localhost:3001`) |
| `VITE_USE_MOCK` | `true` → bypass network, use mock module |

Production: static build (`dist/`) served from CDN or object storage; API on separate origin with CORS configured.

---

## Security (MVP)

- No auth — events identified by opaque UUID in URL (security through obscurity; acceptable for MVP demo).
- No PII fields in MVP forms.
- Sanitize activity text when rendering (React default escaping).

---

## Related documentation

- [API reference](../api/reference.md)
- [UI specification](../design/ui-spec.md)
- [Frontend development](../development/frontend.md)
- [Environment variables](../development/environment-variables.md)
