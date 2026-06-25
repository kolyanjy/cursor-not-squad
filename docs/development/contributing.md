# Contributing

Thank you for your interest in contributing to Cursor Meetup. This guide covers the workflow and conventions for making changes across the Rails backend and React frontend.

## Getting started

1. Fork and clone the repository.
2. Follow [Installation](../getting-started/installation.md) to bring up the stack (`make setup`).
3. Verify everything works with [Quick start](../getting-started/quick-start.md).

## Branch naming

Use descriptive branch names:

```
feature/activity-filtering
fix/random-activity-empty-db
docs/api-error-codes
```

## Making changes

### Backend (Rails)

- Add a migration and model for new tables (`bin/rails generate model …`).
- Keep controllers thin; put query logic in models/scopes (e.g. `Activity.random_for_category`).
- Render JSON with `render json:` and set explicit status codes on errors.
- Declare routes in `config/routes.rb`.
- Add request/model specs under `spec/`.
- Update [API reference](../api/reference.md) when adding or changing endpoints.

### Frontend (React)

- Add typed API functions in `src/api/client.ts` before using them in components.
- Model async state as a discriminated union handled exhaustively (see `HealthStatus.tsx`).
- Use the `@/` path alias and the `cn()` helper; style with Tailwind tokens.
- Keep components focused; reuse `ui/` primitives.

### Documentation

- Place new docs in the appropriate `docs/` subdirectory.
- Link new pages from `docs/README.md`.
- Keep commands and examples runnable and accurate.

## Code style

| Area | Convention | Tool |
|------|------------|------|
| Ruby | Omakase Ruby style | `bin/rubocop` |
| Ruby security | Static analysis | `bin/brakeman` |
| Gems | Audit known vulnerabilities | `bundle exec bundler-audit` |
| TypeScript | Strict mode; explicit types on public APIs | `oxlint` (`npm run lint`) |
| Imports | Top of file only; no inline imports | — |

## Tests

```bash
# backend
cd backend && bundle exec rspec

# frontend
cd frontend && npm run build && npm run lint
```

In Docker, run backend specs via `make shell-backend` then `bundle exec rspec`.

## Commit messages

Write clear, imperative commit messages:

```
Add activities/random category filter
Fix 404 when database has no activities
Document Rails API endpoints
```

## Pull request checklist

- [ ] Backend specs pass (`bundle exec rspec`) and RuboCop is clean
- [ ] Frontend builds and lints (`npm run build`, `npm run lint`)
- [ ] New or changed endpoints documented in `docs/api/reference.md`
- [ ] Environment variable changes reflected in docs and `docker-compose.yml`
- [ ] No secrets or credentials committed (`config/master.key` stays out of VCS)

## Questions?

Open an issue in the repository for bugs, feature requests, or questions about the codebase.
