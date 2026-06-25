# Cursor Meetup

A dockerized full-stack starter: a **Ruby on Rails 8.1 API** and a **React 19 + Vite** frontend, over a simple `Category → Activity` sample domain. One command brings up PostgreSQL, the API, and the web app.

---

## Documentation

Full documentation lives in [`docs/`](docs/README.md):

| Section | Link |
|---------|------|
| Quick start | [docs/getting-started/quick-start.md](docs/getting-started/quick-start.md) |
| Architecture | [docs/architecture/overview.md](docs/architecture/overview.md) |
| API reference | [docs/api/reference.md](docs/api/reference.md) |
| Backend guide | [docs/development/backend.md](docs/development/backend.md) |
| Frontend guide | [docs/development/frontend.md](docs/development/frontend.md) |
| Deployment | [docs/deployment/overview.md](docs/deployment/overview.md) |

---

## Quick start (Docker)

From the repository root:

```bash
make setup     # first run: build, start, prepare + seed the database
# or
make up        # start db + backend + frontend
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000 |
| PostgreSQL | localhost:5433 |

Run `make help` to list every target.

### Verify the API

```bash
curl -i http://localhost:3000/up
curl "http://localhost:3000/activities/random?category_slug=outdoor"
```

---

## Tech stack

| Layer | Stack |
|-------|-------|
| Backend | Ruby 3.4.9, Rails 8.1 (API-only), Puma, PostgreSQL 16 (SQLite fallback), RSpec |
| Frontend | React 19, TypeScript, Vite 8, Tailwind CSS 4, lucide-react, three |
| Tooling | Docker Compose, Makefile |

---

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/up` | Rails health check |
| `GET` | `/activities/random?category_slug=` | Random activity, optionally filtered by category |
