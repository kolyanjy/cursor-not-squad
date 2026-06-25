# Architecture overview

**Cursor Meetup** is a dockerized full-stack starter: a **Ruby on Rails 8.1 API** backed by PostgreSQL, plus a **React 19 + Vite** single-page frontend. The two services run side by side via Docker Compose, with the frontend proxying API calls to the backend.

---

## High-level diagram

```
┌──────────────────────────────────────────────────────────────────┐
│  Browser                                                          │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  React SPA (Vite dev server, :5173)                         │  │
│  │  HomePage (landing) · HealthStatus · ui/ primitives        │  │
│  │                    src/api/client.ts  ──fetch('/api/..')──┐ │  │
│  └───────────────────────────────────────────────────────────┼─┘  │
└──────────────────────────────────────────────────────────────┼────┘
                                                                │
                            Vite dev proxy: /api → backend:3000 │
                                                                ▼
                                          ┌──────────────────────────┐
                                          │  Rails 8.1 API (:3000)    │
                                          │  ActivitiesController     │
                                          │  rails/health (/up)       │
                                          └────────────┬─────────────┘
                                                       │ Active Record
                                                       ▼
                                          ┌──────────────────────────┐
                                          │  PostgreSQL 16 (:5432,    │
                                          │  host port 5433)          │
                                          └──────────────────────────┘
```

---

## Services (Docker Compose)

Defined in [`docker-compose.yml`](../../docker-compose.yml):

| Service | Image / build | Container port | Host port | Notes |
|---------|---------------|----------------|-----------|-------|
| `db` | `postgres:16-alpine` | 5432 | **5433** | Healthcheck via `pg_isready` |
| `backend` | `backend/Dockerfile.dev` (Rails) | 3000 | 3000 | Depends on healthy `db` |
| `frontend` | `frontend/Dockerfile.dev` (Vite) | 5173 | 5173 | Proxies `/api` → `http://backend:3000` |

Orchestrated through the [Makefile](../../Makefile) — `make up` builds and starts all three.

---

## Design principles

| Principle | Implementation |
|-----------|----------------|
| **API-only backend** | Rails `config.api_only = true`; JSON in, JSON out, no server-rendered views |
| **Thin client** | React SPA fetches JSON; no business logic duplicated client-side |
| **Proxy over CORS** | The Vite dev server proxies `/api`, so no CORS config is needed in development |
| **Containers as the source of truth** | One `make up` brings up db + API + web with matching versions |
| **SQLite fallback** | Backend runs natively on SQLite when `DB_HOST` is unset, for quick local hacking |

---

## Backend (`backend/`)

A standard Rails 8.1 API app.

```
backend/
├── app/
│   ├── controllers/
│   │   ├── application_controller.rb   # ActionController::API
│   │   └── activities_controller.rb    # GET /activities/random
│   └── models/
│       ├── application_record.rb
│       ├── category.rb                 # has_many :activities
│       └── activity.rb                 # belongs_to :category, random scopes
├── config/
│   ├── routes.rb                       # /up, /activities/random
│   ├── database.yml                    # Postgres (Docker) / SQLite (local)
│   └── initializers/cors.rb            # template, currently disabled
├── db/
│   ├── migrate/                        # categories, activities
│   ├── schema.rb
│   └── seeds.rb                        # 8 categories × ~15 activities
├── spec/                               # RSpec
├── Gemfile
├── Dockerfile  /  Dockerfile.dev
└── bin/rails …
```

See [Backend development](../development/backend.md) and [API reference](../api/reference.md).

---

## Frontend (`frontend/`)

A Vite + React 19 + TypeScript + Tailwind 4 SPA. Currently a single landing page ("Cursor Meetup") plus an API health indicator.

```
frontend/
├── src/
│   ├── main.tsx                  # React entry
│   ├── App.tsx                   # renders <HomePage />
│   ├── index.css                 # Tailwind + tokens
│   ├── api/
│   │   └── client.ts             # fetch wrapper, prefixes /api
│   ├── components/
│   │   ├── HomePage.tsx          # landing page
│   │   ├── HealthStatus.tsx      # async loading|success|error state
│   │   └── ui/                   # button, card, badge, liquid-shader
│   ├── lib/
│   │   └── utils.ts              # cn() helper
│   └── assets/
├── vite.config.ts                # @ alias + /api proxy
└── package.json
```

> There is **no client-side router** and **no mock layer** today — `App.tsx` renders `HomePage` directly. See [Frontend development](../development/frontend.md).

---

## Data model

```
Category 1 ──< many Activity

Category(id, name, slug unique)
Activity(id, title, description, category_id → Category)
```

`Activity.random_for_category(slug)` returns one random activity, scoped to a category when a slug is given (`ORDER BY RANDOM() LIMIT 1`).

---

## Request flow (example)

1. Browser loads the SPA from the Vite dev server on `:5173`.
2. A component calls `fetch('/api/...')` via `src/api/client.ts`.
3. The Vite dev proxy forwards `/api/*` to `http://backend:3000` (configurable with `VITE_API_PROXY_TARGET`).
4. Rails routes the request, the controller queries Postgres through Active Record, and renders JSON.

---

## Environment & configuration

| Variable | Service | Role |
|----------|---------|------|
| `VITE_API_PROXY_TARGET` | frontend | Proxy target for `/api` (default `http://localhost:3000`) |
| `DB_HOST` / `DB_PORT` / `DB_NAME` | backend | Postgres connection; unset → SQLite fallback |
| `DB_USERNAME` / `DB_PASSWORD` | backend | Postgres credentials |
| `RAILS_ENV` | backend | `development` / `test` / `production` |

See [Environment variables](../development/environment-variables.md).

---

## Production notes

- Backend: build the production `backend/Dockerfile`, serve with Puma (Thruster available for asset caching/compression). Kamal is bundled for container deploys.
- Frontend: `npm run build` produces static assets in `frontend/dist/`, served by any static host with `/api` routed to the backend.
- Configure CORS (uncomment `rack-cors` and `config/initializers/cors.rb`) when the frontend is served from a different origin than the API.

See [Deployment overview](../deployment/overview.md).

---

## Related documentation

- [API reference](../api/reference.md)
- [Backend development](../development/backend.md)
- [Frontend development](../development/frontend.md)
- [Environment variables](../development/environment-variables.md)
