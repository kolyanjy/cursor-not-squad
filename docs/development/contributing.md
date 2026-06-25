# Contributing

Thank you for your interest in contributing to Cursor Meetup. This guide covers the workflow and conventions for making changes.

## Getting started

1. Fork and clone the repository.
2. Follow [Installation](../getting-started/installation.md) to set up both services.
3. Verify everything works with [Quick start](../getting-started/quick-start.md).

## Branch naming

Use descriptive branch names:

```
feature/add-user-auth
fix/cors-origin-parsing
docs/api-error-codes
```

## Making changes

### Backend

- Add Pydantic schemas before route handlers.
- Mount new routers under the `/api` prefix in `app/main.py`.
- Update [API reference](../api/reference.md) when adding or changing endpoints.

### Frontend

- Add typed API functions in `src/api/client.ts` before using them in components.
- Use discriminated unions for async state management.
- Keep components focused; extract reusable logic into hooks or utilities.

### Documentation

- Place new docs in the appropriate `docs/` subdirectory.
- Link new pages from `docs/README.md`.
- Keep examples runnable and accurate.

## Code style

| Area | Convention |
|------|------------|
| Python | Follow PEP 8; use type hints on all function signatures |
| TypeScript | Strict mode enabled; prefer explicit types on public APIs |
| Imports | Top of file only; no inline imports |
| Switch statements | Exhaustive handling with `never` check in default case |

## Commit messages

Write clear, imperative commit messages:

```
Add health check endpoint
Fix CORS config for multiple origins
Document API response schemas
```

## Pull request checklist

- [ ] Code runs locally (backend + frontend)
- [ ] New endpoints documented in `docs/api/reference.md`
- [ ] Environment variable changes reflected in `.env.example` and docs
- [ ] No secrets or credentials committed

## Questions?

Open an issue in the repository for bugs, feature requests, or questions about the codebase.
