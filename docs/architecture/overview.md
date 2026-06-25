# Architecture overview

Cursor Meetup is a client–server application with a clear separation between the React frontend and the FastAPI backend.

## High-level diagram

```
┌─────────────────────────────────────────────────────────┐
│  Browser (localhost:5173)                               │
│  ┌───────────────────────────────────────────────────┐  │
│  │  React App                                        │  │
│  │  ├── components/   (UI)                           │  │
│  │  └── api/client.ts (fetch wrapper)                │  │
│  └───────────────────────┬───────────────────────────┘  │
└──────────────────────────┼──────────────────────────────┘
                           │ GET /api/health
                           ▼
┌─────────────────────────────────────────────────────────┐
│  Vite Dev Server (proxy)                                │
│  /api/* → http://localhost:8000                         │
└──────────────────────────┼──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  FastAPI Backend (localhost:8000)                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  app/main.py         Application entry + CORS     │  │
│  │  app/api/routes/     Route handlers               │  │
│  │  app/models/         Pydantic request/response    │  │
│  │  app/core/config.py  Settings from environment    │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Design principles

- **API-first backend** — FastAPI exposes REST endpoints with automatic OpenAPI documentation.
- **Thin frontend client** — The React app delegates data fetching to a small `api/client.ts` module.
- **Environment-driven config** — Backend settings load from `.env` via Pydantic Settings; no secrets in source code.
- **Development proxy** — Vite forwards `/api` requests to the backend so the frontend can use relative URLs.

## Backend structure

| Path | Responsibility |
|------|----------------|
| `app/main.py` | FastAPI app instance, CORS middleware, router registration |
| `app/core/config.py` | Centralized settings (`Settings` class) |
| `app/api/routes/` | HTTP route handlers, grouped by domain |
| `app/models/schemas.py` | Pydantic models for request/response validation |

## Frontend structure

| Path | Responsibility |
|------|----------------|
| `src/main.tsx` | React entry point |
| `src/App.tsx` | Root layout and page composition |
| `src/api/client.ts` | Typed HTTP client for backend endpoints |
| `src/components/` | Reusable UI components |

## Request flow (health check example)

1. `HealthStatus` component mounts and calls `fetchHealth()`.
2. `client.ts` sends `GET /api/health` to the Vite dev server.
3. Vite proxies the request to `http://localhost:8000/api/health`.
4. FastAPI `health_check` handler returns a `HealthResponse` JSON payload.
5. The component renders the status message or an error.

## Technology choices

| Layer | Stack | Rationale |
|-------|-------|-----------|
| Backend | FastAPI + Pydantic | Async-ready, auto-generated docs, strong typing |
| Frontend | React + TypeScript + Vite | Fast dev experience, type safety, modern tooling |
| Config | pydantic-settings | Validated env vars with sensible defaults |

## Related docs

- [Backend development](../development/backend.md)
- [Frontend development](../development/frontend.md)
- [API reference](../api/reference.md)
