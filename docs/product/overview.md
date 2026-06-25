# Product overview

**Cursor Meetup** is a dockerized full-stack starter that pairs a **Ruby on Rails 8.1 API** with a **React 19 + Vite** frontend. It exists to demonstrate a clean, reproducible local setup and a minimal end-to-end slice — a sample "activities by category" domain — that teams can build on.

---

## What it is

- A **reference stack**: Rails API + React SPA + PostgreSQL, wired together with Docker Compose and a Makefile.
- A **working vertical slice**: a `Category → Activity` data model, seed data, and a `GET /activities/random` endpoint.
- A **branded landing page** ("Cursor Meetup") on the frontend, plus a reusable API health indicator component.

It is intentionally small — a foundation to extend, not a finished product.

---

## Goals

| Goal | How it's met |
|------|--------------|
| **One-command setup** | `make setup` builds images, starts services, and seeds the database |
| **Reproducible environments** | Pinned Ruby (3.4.9), Node (22), Postgres (16) in containers |
| **Clear front/back separation** | API-only Rails backend; React SPA proxies `/api` |
| **A real example to copy** | Models, controller, route, seeds, and a typed fetch client |

---

## The sample domain

```
Category (e.g. "Outdoor")
   └── many Activities (e.g. "Go for a hike", "Ride a bike")
```

Eight seeded categories — `outdoor`, `creative`, `social`, `fitness`, `cooking`, `learning`, `relaxation`, `adventure` — each with ~15 activities. The API can return a random activity overall or within one category.

See [API reference](../api/reference.md) and [Architecture overview](../architecture/overview.md).

---

## Who it's for

| Audience | Need |
|----------|------|
| **Developers starting a project** | A ready Rails+React skeleton without boilerplate setup |
| **Meetup / workshop attendees** | A shared, runnable baseline to experiment from |
| **Contributors** | Conventions and structure to extend the API and UI |

---

## Scope

**In scope (today)**

- Rails 8.1 API-only backend with PostgreSQL (SQLite fallback for native dev).
- `Category`/`Activity` models, seeds, `GET /up` and `GET /activities/random`.
- React 19 + Vite + Tailwind 4 landing page and `ui/` primitives.
- Docker Compose + Makefile orchestration.

**Not in scope (yet)**

- Authentication / user accounts.
- Full CRUD UI for activities/categories.
- The frontend consuming the activities endpoint end-to-end (the landing page is currently static; `client.ts` only defines a health call).
- Production deploy automation (Kamal is available but not configured).

---

## Related documentation

- [MVP roadmap](mvp-roadmap.md)
- [Architecture overview](../architecture/overview.md)
- [API reference](../api/reference.md)
- [UI specification](../design/ui-spec.md)
