# Installation

This guide covers cloning the repository and getting the stack ready. The Docker workflow is recommended; a native (no-Docker) path is included for each service.

## Clone the repository

```bash
git clone <repository-url>
cd cursor-not-squad
```

---

## Option A — Docker (recommended)

One command builds the images, starts PostgreSQL + Rails + Vite, and prepares the database:

```bash
make setup
```

`make setup` runs `build`, starts services in the background, then runs `bin/rails db:prepare` and `bin/rails db:seed` inside the backend container.

To start everything in the foreground instead:

```bash
make up
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000 |
| PostgreSQL | localhost:5433 |

That's all you need — skip to [Quick start](quick-start.md).

---

## Option B — Native (no Docker)

### Backend (Rails)

```bash
cd backend
bundle install
bin/rails db:prepare      # create + migrate + seed (SQLite fallback when DB_HOST is unset)
bin/rails server -p 3000
```

The backend uses SQLite automatically when `DB_HOST` is not set (see `config/database.yml`). To point it at a local PostgreSQL, export `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, and `DB_NAME` — see [Environment variables](../development/environment-variables.md).

### Frontend (Vite)

In a second terminal, from the project root:

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server proxies `/api` to `http://localhost:3000` by default (override with `VITE_API_PROXY_TARGET`).

---

## Verify installation

| Check | Command | Expected result |
|-------|---------|-----------------|
| API health | `curl -i http://localhost:3000/up` | `200 OK` |
| Sample endpoint | `curl "http://localhost:3000/activities/random?category_slug=outdoor"` | JSON activity |
| Backend gems | `bundle list` (in `backend/`) | `rails`, `pg`, `puma`, `rspec-rails` listed |
| Frontend deps | `npm ls react` (in `frontend/`) | React 19 resolved without errors |

## Next steps

Continue to [Quick start](quick-start.md) to run and explore the application.
