# Frontend development

The frontend is a [React](https://react.dev/) application built with [Vite](https://vite.dev/) and [TypeScript](https://www.typescriptlang.org/), located in `frontend/`.

## Running locally

```bash
cd frontend
npm run dev
```

The dev server starts at `http://localhost:5173` with hot module replacement (HMR).

## Available scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start development server |
| `build` | `npm run build` | Production build to `dist/` |
| `preview` | `npm run preview` | Preview production build locally |
| `lint` | `npm run lint` | Run Oxlint |

## API client

All backend communication goes through `src/api/client.ts`. This module:

- Uses a relative `/api` base path (proxied by Vite in development).
- Provides typed functions for each endpoint.
- Throws on non-OK HTTP responses.

### Adding a new API function

1. Define the response type and fetch function in `src/api/client.ts`:

```typescript
export interface ItemResponse {
  id: number
  name: string
}

export function fetchItem(id: number): Promise<ItemResponse> {
  return request<ItemResponse>(`/items/${id}`)
}
```

2. Use it in a component:

```typescript
import { fetchItem } from '../api/client'

const item = await fetchItem(1)
```

## Components

Components live in `src/components/`. The `HealthStatus` component demonstrates the recommended pattern for async data loading:

- Discriminated union for load state (`loading` | `success` | `error`).
- Cleanup via `useEffect` return to avoid state updates on unmounted components.
- Exhaustive `switch` with a `never` check in the default case.

## Vite proxy

During development, requests to `/api/*` are forwarded to `http://localhost:8000`. This is configured in `vite.config.ts`:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
    },
  },
},
```

In production, configure your reverse proxy or CDN to route `/api` to the backend service.

## Styling

Global styles are in `src/index.css`. Component-specific styles are co-located (e.g. `App.css`). Extend or replace with your preferred approach (CSS Modules, Tailwind, etc.) as the project grows.

## Related docs

- [API reference](../api/reference.md)
- [Architecture overview](../architecture/overview.md)
