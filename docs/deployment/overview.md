# Deployment overview

This document outlines considerations for deploying Cursor Meetup to production. The project does not include deployment automation yet; use this as a starting checklist.

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
     │  Static files   │     │  FastAPI        │
     │  (frontend      │     │  (backend       │
     │   build)        │     │   service)      │
     └─────────────────┘     └─────────────────┘
```

## Frontend

Build the production bundle:

```bash
cd frontend
npm run build
```

Output is written to `frontend/dist/`. Serve these static files from any static host (Nginx, S3 + CloudFront, Vercel, Netlify, etc.).

### API routing in production

The Vite dev proxy does not exist in production. Configure your host to forward `/api` requests to the backend:

**Nginx example**

```nginx
location /api/ {
    proxy_pass http://backend:8000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}

location / {
    root /var/www/frontend/dist;
    try_files $uri $uri/ /index.html;
}
```

## Backend

Run with a production ASGI server:

```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

For production workloads, consider [Gunicorn](https://gunicorn.org/) with Uvicorn workers or a managed container platform.

### Environment checklist

| Variable | Production value |
|----------|-----------------|
| `DEBUG` | `false` |
| `CORS_ORIGINS` | Your production frontend URL(s) |
| `APP_NAME` | Your chosen application name |

## Health checks

Use `GET /api/health` as a liveness/readiness probe for load balancers and orchestrators (Kubernetes, ECS, etc.).

```bash
curl -f http://backend:8000/api/health
```

## Security checklist

- [ ] `DEBUG` is disabled
- [ ] CORS origins are restricted to known domains
- [ ] HTTPS is enforced at the proxy layer
- [ ] `.env` files are not included in deployment artifacts
- [ ] Dependencies are pinned and regularly updated

## Related docs

- [Environment variables](../development/environment-variables.md)
- [API reference](../api/reference.md)
