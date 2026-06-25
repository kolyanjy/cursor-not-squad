# TonightPick Documentation

Technical and product documentation for **TonightPick** — a mobile-first app that helps groups pick what to do tonight through a swipe-based activity flow.

---

## Product

| Document | Description |
|----------|-------------|
| [Product overview](product/overview.md) | Problem, users, value proposition, scope |
| [MVP roadmap](product/mvp-roadmap.md) | Phased delivery plan from scaffold to ship |

---

## Design & architecture

| Document | Description |
|----------|-------------|
| [UI specification](design/ui-spec.md) | Visual design, screens, components, interactions |
| [Architecture overview](architecture/overview.md) | System design, folder structure, state model |

---

## Development

| Document | Description |
|----------|-------------|
| [Quick start](getting-started/quick-start.md) | Install and run locally |
| [Frontend development](development/frontend.md) | React/Vite conventions and implementation guide |
| [Environment variables](development/environment-variables.md) | `VITE_API_URL`, `VITE_USE_MOCK`, and more |
| [Contributing](development/contributing.md) | Contribution guidelines |

---

## API

| Document | Description |
|----------|-------------|
| [API reference](api/reference.md) | REST endpoints, schemas, mock mode |

---

## Repository layout

```
.
├── frontend/              # React + Vite + TypeScript + Tailwind (TonightPick UI)
│   └── src/
│       ├── pages/         # Home, Swipe, Results
│       ├── components/    # ActivityCard, SwipeActionBar, …
│       ├── api/           # HTTP client + mock adapter
│       └── types/         # Activity and shared types
├── backend/               # Optional future API (contract defined in docs)
└── docs/                  # Documentation (you are here)
```

---

## Quick reference

**Stack:** Vite · React 19 · TypeScript · Tailwind CSS 4 · react-router-dom  

**Routes:** `/` · `/event/:id/swipe` · `/event/:id/results`  

**MVP scope:** Frontend only; mock mode supported  

**Accent:** Teal `#4FD1C5` on dark `#0a0a0f` background
