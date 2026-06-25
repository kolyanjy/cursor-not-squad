# MVP roadmap

This roadmap tracks Cursor Meetup from an empty repo to a working full-stack slice, and lists grounded next steps. The stack is a **Rails 8.1 API** + **React 19 (Vite)** frontend, orchestrated with Docker Compose.

---

## Phase overview

| Phase | Goal | Status |
|-------|------|--------|
| **0 — Tooling** | Docker Compose + Makefile orchestration | ✅ Done |
| **1 — Backend scaffold** | Rails 8.1 API app, Postgres/SQLite config | ✅ Done |
| **2 — Domain** | `Category`/`Activity` models, migrations, seeds | ✅ Done |
| **3 — API** | `GET /up`, `GET /activities/random` | ✅ Done |
| **4 — Frontend shell** | Vite + React + Tailwind landing page, `ui/` primitives | ✅ Done |
| **5 — Wire-up** | Frontend consumes the activities API end-to-end | ⬜ Next |
| **6 — Polish & deploy** | Tests, CI, production deploy (Kamal) | ⬜ Future |

---

## Phase 0 — Tooling ✅

- [x] `docker-compose.yml`: `db` (Postgres 16), `backend` (Rails), `frontend` (Vite)
- [x] `Makefile`: `setup`, `up`, `down`, `logs`, `db-prepare`, `db-seed`, shells
- [x] `scripts/docker-ready.sh` auto-starts Docker Desktop on macOS

## Phase 1 — Backend scaffold ✅

- [x] Rails 8.1 API-only app (`config.api_only = true`)
- [x] `config/database.yml`: PostgreSQL when `DB_HOST` set, SQLite fallback otherwise
- [x] Puma, Solid Queue/Cache/Cable, RSpec

## Phase 2 — Domain ✅

- [x] `Category(name, slug unique)` and `Activity(title, description, category_id)`
- [x] Migrations + `schema.rb`
- [x] `db/seeds.rb`: 8 categories × ~15 activities, idempotent

## Phase 3 — API ✅

- [x] `GET /up` — Rails health check
- [x] `GET /activities/random?category_slug=` — random activity, optional category filter
- [x] 404 handling for unknown category / empty result

## Phase 4 — Frontend shell ✅

- [x] Vite + React 19 + TypeScript + Tailwind 4
- [x] `HomePage` landing page (nebula shader, glass card, header/footer)
- [x] `ui/` primitives (button, card, badge), `cn()` helper
- [x] `api/client.ts` fetch wrapper + `HealthStatus` component
- [x] `/api` dev proxy in `vite.config.ts`

---

## Phase 5 — Wire-up (next)

- [ ] Reconcile the `/api` prefix between the proxy and Rails routes (add an `/api` scope **or** strip the prefix in the proxy)
- [ ] Add a typed `getRandomActivity(categorySlug?)` to `src/api/client.ts`
- [ ] Render activities + category picker in the UI (or mount `HealthStatus`, which is built but not yet placed on the page)
- [ ] Loading / error states via the discriminated-union pattern

## Phase 6 — Polish & deploy (future)

- [ ] Request specs for `ActivitiesController`; component tests
- [ ] CI: RuboCop, Brakeman, bundler-audit, RSpec, frontend build/lint
- [ ] Enable CORS (`rack-cors`) if the SPA is served cross-origin
- [ ] Production deploy with Kamal; managed PostgreSQL

---

## Related documentation

- [Product overview](overview.md)
- [Architecture overview](../architecture/overview.md)
- [Backend development](../development/backend.md)
- [Frontend development](../development/frontend.md)
