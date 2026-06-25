# Environment variables

Cursor Meetup is configured through environment variables on both the backend (Rails) and frontend (Vite). When running via Docker Compose, the defaults below are already wired in [`docker-compose.yml`](../../docker-compose.yml).

---

## Backend (Rails)

The database connection is read in `config/database.yml`. **If `DB_HOST` is unset, Rails falls back to SQLite** (`storage/*.sqlite3`), which is convenient for native local development.

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `DB_HOST` | _(unset → SQLite)_ | No | PostgreSQL host. Set it to use Postgres |
| `DB_PORT` | `5432` | No | PostgreSQL port (inside the container network) |
| `DB_NAME` | `backend_development` | No | Database name (development) |
| `DB_NAME_TEST` | `backend_test` | No | Database name (test) |
| `DB_USERNAME` | `postgres` | No | PostgreSQL user |
| `DB_PASSWORD` | `postgres` | No | PostgreSQL password |
| `RAILS_ENV` | `development` | No | Rails environment |
| `RAILS_MAX_THREADS` | `5` | No | Max DB connections / Puma threads |

In Docker, the `backend` service sets `DB_HOST=db` so Rails connects to the `db` Postgres service.

---

## Frontend (Vite)

Client-exposed variables must be prefixed with `VITE_`.

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `VITE_API_PROXY_TARGET` | `http://localhost:3000` | No | Where the dev server proxies `/api` requests. In Docker it is `http://backend:3000` |

Used in [`frontend/vite.config.ts`](../../frontend/vite.config.ts):

```typescript
server: {
  proxy: {
    '/api': {
      target: process.env.VITE_API_PROXY_TARGET ?? 'http://localhost:3000',
      changeOrigin: true,
    },
  },
}
```

Because the dev server proxies `/api`, the browser only ever calls same-origin paths — no CORS configuration is needed in development.

> Vite replaces `import.meta.env.VITE_*` values at build time. Never put secrets in `VITE_*` variables — they are embedded in the client bundle.

---

## Setup

**Docker:** nothing to do — values are set in `docker-compose.yml`.

**Native backend** — to use a local PostgreSQL instead of the SQLite fallback:

```bash
export DB_HOST=localhost
export DB_PORT=5432
export DB_USERNAME=postgres
export DB_PASSWORD=postgres
export DB_NAME=backend_development
bin/rails db:prepare
```

**Native frontend** — to point the proxy elsewhere:

```bash
VITE_API_PROXY_TARGET=http://localhost:3000 npm run dev
```

Restart the relevant dev server after changing environment values.

---

## Production

| Concern | Backend | Frontend |
|---------|---------|----------|
| Secrets | `config/credentials.yml.enc` + `RAILS_MASTER_KEY` | none in the bundle |
| Database | `DATABASE_URL` or the `DB_*` vars; production defaults to SQLite in `storage/` (see `config/database.yml`) | n/a |
| API origin | n/a | reverse proxy routes `/api` → backend; configure CORS if cross-origin |

Set variables in your CI/CD or hosting platform before building. See [Deployment overview](../deployment/overview.md).

---

## Related documentation

- [Backend development](backend.md)
- [Frontend development](frontend.md)
- [API reference](../api/reference.md)
