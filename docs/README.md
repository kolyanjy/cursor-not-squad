# Cursor Meetup Documentation

Welcome to the Cursor Meetup project documentation. This guide covers everything you need to understand, develop, and deploy the application.

## What is Cursor Meetup?

A full-stack application with a **React** frontend and a **Python (FastAPI)** backend. The frontend proxies API requests through Vite during development and displays live backend health status.

## Documentation map

| Section | Description |
|---------|-------------|
| [Getting started](getting-started/quick-start.md) | Install dependencies and run the app locally |
| [Architecture](architecture/overview.md) | System design, data flow, and project layout |
| [Development](development/backend.md) | Backend and frontend development guides |
| [API reference](api/reference.md) | REST endpoints and response schemas |
| [Deployment](deployment/overview.md) | Production deployment considerations |

## Quick links

- **Run locally:** [Quick start](getting-started/quick-start.md)
- **Environment config:** [Environment variables](development/environment-variables.md)
- **Contribute:** [Contributing guide](development/contributing.md)
- **Interactive API docs:** `http://localhost:8000/docs` (when the backend is running)

## Repository structure

```
.
├── backend/          # Python FastAPI API
│   └── app/
│       ├── api/      # Route handlers
│       ├── core/     # Config and shared utilities
│       └── models/   # Pydantic schemas
├── frontend/         # React + Vite + TypeScript
│   └── src/
│       ├── api/      # API client
│       └── components/
└── docs/             # Project documentation (you are here)
```
