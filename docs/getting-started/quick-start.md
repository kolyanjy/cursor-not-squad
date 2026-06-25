# Quick start

Get Cursor Meetup running locally in a few minutes. The fastest path is Docker.

---

## Prerequisites

- **Docker** with Compose v2 and **Make** (recommended), or
- Native **Ruby 3.4.9** + **Node.js 22** (see [Prerequisites](prerequisites.md))

---

## 1. Start everything (Docker)

From the repository root:

```bash
make setup     # first time: build, start, prepare + seed the database
```

On later runs just use:

```bash
make up        # foreground
# or
make up-d      # background (detached)
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000 |
| PostgreSQL | localhost:5433 |

Useful targets:

```bash
make logs         # follow logs from all services
make db-seed      # re-run database seeds
make shell-backend  # bash shell in the Rails container
make down         # stop services
make clean        # stop and remove volumes (resets the DB)
```

Run `make help` to list every target.

---

## 2. Verify the API

```bash
# health check
curl -i http://localhost:3000/up

# random activity (optionally filtered by category)
curl "http://localhost:3000/activities/random?category_slug=creative"
```

Available category slugs: `outdoor`, `creative`, `social`, `fitness`, `cooking`, `learning`, `relaxation`, `adventure`.

---

## 3. Open the app

Visit **http://localhost:5173** — the Cursor Meetup landing page. API calls from the frontend go through the Vite `/api` proxy to the backend. (A reusable `HealthStatus` component exists in `src/components/` but is not yet mounted on the page — see the [MVP roadmap](../product/mvp-roadmap.md).)

---

## Native (no Docker)

```bash
# terminal 1 — backend
cd backend && bundle install && bin/rails db:prepare && bin/rails server -p 3000

# terminal 2 — frontend
cd frontend && npm install && npm run dev
```

See [Installation](installation.md) for details.

---

## Next steps

- [Architecture overview](../architecture/overview.md) — how the services fit together
- [Backend development](../development/backend.md) — Rails conventions and adding endpoints
- [Frontend development](../development/frontend.md) — React/Vite conventions
- [API reference](../api/reference.md) — endpoints and schemas
