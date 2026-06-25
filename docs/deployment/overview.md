# Deployment overview

This document outlines considerations for deploying Cursor Meetup to production: a **Rails 8.1 API** (Puma) plus a **static React build**. The repository ships dev-oriented Docker tooling; treat this as a starting checklist for production.

## Architecture in production

```
                    ┌──────────────┐
   Users ──────────▶│  CDN /       │
                    │  Reverse     │
                    │  Proxy       │
                    └──────┬───────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
     ┌─────────────────┐     ┌─────────────────┐
     │  Static files   │     │  Rails API      │
     │  (frontend      │     │  (Puma,         │
     │   dist/)        │     │   port 3000)    │
     └─────────────────┘     └────────┬────────┘
                                      │
                                      ▼
                             ┌─────────────────┐
                             │  PostgreSQL     │
                             └─────────────────┘
```

## Frontend

Build the production bundle:

```bash
cd frontend
npm run build
```

Output is written to `frontend/dist/`. Serve these static files from any static host (Nginx, S3 + CloudFront, Vercel, Netlify, etc.).

### API routing in production

The Vite dev proxy does not exist in production. Configure your host to forward `/api` requests to the Rails backend.

**Nginx example**

```nginx
location /api/ {
    proxy_pass http://backend:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}

location / {
    root /var/www/frontend/dist;
    try_files $uri $uri/ /index.html;
}
```

> Whether to keep or strip the `/api` prefix depends on how your Rails routes are mounted — the current routes (`/up`, `/activities/random`) live at the root. Align the proxy path with the routes (see [Backend development](../development/backend.md)).

## Backend

The backend image is built from `backend/Dockerfile` (production) and runs Puma. Within the container the default entrypoint runs `bin/rails server`.

```bash
cd backend
RAILS_ENV=production bin/rails server -b 0.0.0.0 -p 3000
```

For container deployments, [Kamal](https://kamal-deploy.org/) is bundled (`gem "kamal"`); [Thruster](https://github.com/basecamp/thruster) is available for HTTP asset caching/compression in front of Puma.

### Database & migrations

Run migrations as part of the release step:

```bash
RAILS_ENV=production bin/rails db:prepare
```

`config/database.yml` defaults the production database to SQLite in `storage/` (mounted as a persistent volume). Point it at managed PostgreSQL with `DATABASE_URL` or the `DB_*` variables — see [Environment variables](../development/environment-variables.md).

### Environment checklist

| Variable | Production value |
|----------|------------------|
| `RAILS_ENV` | `production` |
| `RAILS_MASTER_KEY` | Decryption key for `config/credentials.yml.enc` |
| `DATABASE_URL` / `DB_*` | Managed database connection |
| `RAILS_MAX_THREADS` | Tune to your DB connection pool |

## Health checks

Use `GET /up` (Rails' built-in health controller) as a liveness/readiness probe for load balancers and orchestrators:

```bash
curl -f http://backend:3000/up
```

## Security checklist

- [ ] `RAILS_ENV=production` and debug tooling disabled
- [ ] `config/master.key` / `RAILS_MASTER_KEY` kept out of version control and artifacts
- [ ] CORS restricted to known origins if the SPA is served cross-origin (enable `rack-cors` + `config/initializers/cors.rb`)
- [ ] HTTPS enforced at the proxy layer; `config.force_ssl` considered
- [ ] Gems audited (`bundler-audit`) and scanned (`brakeman`); dependencies pinned
- [ ] Database credentials supplied via environment, not committed

## Related docs

- [Environment variables](../development/environment-variables.md)
- [Backend development](../development/backend.md)
- [API reference](../api/reference.md)
