# Cursor Meetup Documentation

Technical and product documentation for **Cursor Meetup** — a dockerized full-stack starter pairing a **Ruby on Rails 8.1 API** with a **React 19 + Vite** frontend, over a `Category → Activity` sample domain.

---

## Getting started

| Document | Description |
|----------|-------------|
| [Prerequisites](getting-started/prerequisites.md) | Docker (recommended) or native Ruby/Node setup |
| [Installation](getting-started/installation.md) | Clone and bring up the stack |
| [Quick start](getting-started/quick-start.md) | `make up`, verify the API, open the app |

---

## Product

| Document | Description |
|----------|-------------|
| [Product overview](product/overview.md) | What the starter is, goals, sample domain, scope |
| [MVP roadmap](product/mvp-roadmap.md) | What's built and what's next |

---

## Design & architecture

| Document | Description |
|----------|-------------|
| [Architecture overview](architecture/overview.md) | Services, request flow, data model, structure |
| [UI specification](design/ui-spec.md) | Landing page layout, design tokens, components |

---

## Development

| Document | Description |
|----------|-------------|
| [Backend development](development/backend.md) | Rails conventions, routes, database, tooling |
| [Frontend development](development/frontend.md) | React/Vite conventions and patterns |
| [Environment variables](development/environment-variables.md) | `DB_*`, `VITE_API_PROXY_TARGET`, and more |
| [Contributing](development/contributing.md) | Workflow and contribution guidelines |

---

## API & deployment

| Document | Description |
|----------|-------------|
| [API reference](api/reference.md) | `GET /up`, `GET /activities/random`, schemas |
| [Deployment overview](deployment/overview.md) | Puma, static frontend, Kamal, checklist |

---

## Repository layout

```
.
├── backend/               # Ruby on Rails 8.1 API (Category, Activity)
│   ├── app/               # controllers, models
│   ├── config/            # routes.rb, database.yml
│   └── db/                # migrations, schema, seeds
├── frontend/              # React 19 + Vite + TypeScript + Tailwind 4 SPA
│   └── src/               # api/, components/ (HomePage, ui/), lib/
├── docker-compose.yml     # db (Postgres) + backend (Rails) + frontend (Vite)
├── Makefile               # make up / setup / db-seed / shells …
├── scripts/               # docker-ready.sh
└── docs/                  # Documentation (you are here)
```

---

## Quick reference

**Backend:** Ruby 3.4.9 · Rails 8.1 (API-only) · Puma · PostgreSQL 16 (SQLite fallback) · RSpec

**Frontend:** Vite 8 · React 19 · TypeScript · Tailwind CSS 4 · lucide-react · three

**Endpoints:** `GET /up` · `GET /activities/random?category_slug=`

**Run:** `make up` → frontend `:5173`, API `:3000`, Postgres host `:5433`
