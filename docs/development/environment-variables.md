# Environment variables

TonightPick uses Vite environment variables on the frontend. All client-exposed keys must be prefixed with `VITE_`.

---

## Frontend variables

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `VITE_API_URL` | `http://localhost:3001` | No | Base URL for the TonightPick REST API |
| `VITE_USE_MOCK` | `false` | No | When `true`, use in-app mock data instead of HTTP |

---

## Setup

Create `frontend/.env.local` (gitignored):

```env
VITE_API_URL=http://localhost:3001
VITE_USE_MOCK=true
```

For local development **without a backend**, set `VITE_USE_MOCK=true`.

For integration with a real API:

```env
VITE_API_URL=http://localhost:3001
VITE_USE_MOCK=false
```

Restart the Vite dev server after changing env files.

---

## Usage in code

```typescript
const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'
const useMock = import.meta.env.VITE_USE_MOCK === 'true'
```

Vite replaces these at build time. Do not store secrets in `VITE_*` variables — they are embedded in the client bundle.

---

## Production

| Environment | `VITE_API_URL` | `VITE_USE_MOCK` |
|-------------|----------------|-----------------|
| Production | `https://api.tonightpick.example` | `false` |
| Staging | Staging API URL | `false` |
| Local demo | Any | `true` |

Set variables in your CI/CD platform or hosting provider (Vercel, Netlify, etc.) before `npm run build`.

---

## Backend variables (future)

When a backend is implemented for TonightPick, document server-side variables here. Suggested keys:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Persistence for events and swipes |
| `CORS_ORIGINS` | Allowed frontend origins |
| `PORT` | API listen port (default `3001`) |

The frontend MVP does not require a running backend when mock mode is enabled.

---

## Related documentation

- [Frontend development](frontend.md)
- [API reference](../api/reference.md)
