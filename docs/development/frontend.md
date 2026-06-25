# Frontend development

The frontend is a **React 19 + Vite** single-page app written in TypeScript and styled with Tailwind CSS 4. It lives in `frontend/` and currently renders a landing page ("Cursor Meetup") with a live API health indicator.

---

## Tech stack

| Layer | Technology | Version |
|-------|------------|---------|
| Runtime | React | 19.x |
| Build | Vite | 8.x |
| Language | TypeScript | ~6.x |
| Styling | Tailwind CSS | 4.x (`@tailwindcss/vite`) |
| UI primitives | shadcn-style components (Radix Slot, CVA) | — |
| Icons | lucide-react | 1.x |
| 3D / shader | three | 0.184 (nebula background) |
| Lint | oxlint | 1.x |
| HTTP | native `fetch` | — |

> There is **no `react-router-dom`** and **no mock layer** in the project today — `App.tsx` renders `HomePage` directly.

---

## Prerequisites

- Node.js 22 (matches `frontend/Dockerfile.dev`)
- npm 10+

---

## Running locally

Via Docker (with the backend) from the repo root:

```bash
make up
```

Or the frontend alone:

```bash
cd frontend
npm install
npm run dev
```

App: **http://localhost:5173**

The dev server proxies `/api` to the backend. Override the target with `VITE_API_PROXY_TARGET` (defaults to `http://localhost:3000`):

```bash
VITE_API_PROXY_TARGET=http://localhost:3000 npm run dev
```

See [Environment variables](environment-variables.md).

---

## Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Dev server + HMR |
| `build` | `npm run build` | `tsc -b` typecheck + production bundle → `dist/` |
| `preview` | `npm run preview` | Serve the production build locally |
| `lint` | `npm run lint` | Oxlint |

---

## Project structure

```
frontend/src/
├── main.tsx                 # React entry
├── App.tsx                  # renders <HomePage />
├── index.css                # Tailwind import + design tokens (oklch CSS vars)
├── api/
│   └── client.ts            # fetch wrapper, prefixes /api
├── components/
│   ├── HomePage.tsx         # landing page
│   ├── HealthStatus.tsx     # async loading | success | error indicator
│   └── ui/                  # button, card, badge, liquid-shader (shadcn-style)
├── lib/
│   └── utils.ts             # cn() — clsx + tailwind-merge
└── assets/
```

---

## Conventions

### Path alias

Use the `@/` alias (configured in `vite.config.ts` and `tsconfig.app.json`):

```typescript
import { Button } from '@/components/ui/button'
import { fetchHealth } from '@/api/client'
import { cn } from '@/lib/utils'
```

Keep imports at the top of each module.

### Styling

- Tailwind utility classes in JSX.
- Design tokens are CSS custom properties (oklch) defined in `src/index.css` and referenced through Tailwind theme colors (`bg-background`, `text-muted-foreground`, `text-primary`, …).
- Compose conditional classes with the `cn()` helper from `@/lib/utils`.
- UI primitives follow shadcn ("new-york" style); add more with the shadcn CLI per `components.json`.

### TypeScript

- Strict mode is on.
- Model async UI state as a discriminated union and handle it exhaustively (with a `never` check in the default branch). `HealthStatus.tsx` is the reference example:

```typescript
type LoadState =
  | { kind: 'loading' }
  | { kind: 'success'; data: HealthResponse }
  | { kind: 'error'; message: string }
```

---

## API client pattern

All network calls go through [`src/api/client.ts`](../../frontend/src/api/client.ts), which prefixes requests with `/api` so they hit the Vite proxy:

```typescript
const API_BASE = '/api'

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`)
  if (!response.ok) throw new Error(`Request failed: ${response.status}`)
  return response.json() as Promise<T>
}

export function fetchHealth(): Promise<HealthResponse> {
  return request<HealthResponse>('/health')
}
```

> **Path note:** the Vite proxy forwards `/api/*` to the backend without stripping `/api`, and the current Rails routes (`/up`, `/activities/random`) are mounted at the root. So `fetchHealth()` (`/api/health`) does not map to an existing route as-is. When wiring real calls, align the two — add an `/api` scope in `config/routes.rb`, or rewrite the proxy path in `vite.config.ts`. Add typed functions here before using them in components. See [API reference](../api/reference.md).

---

## Quality checklist

- [ ] `npm run build` passes (typecheck + bundle) with no errors
- [ ] `npm run lint` (oxlint) is clean
- [ ] New API calls go through `src/api/client.ts` with explicit types
- [ ] Async UI uses a discriminated union handled exhaustively
- [ ] Classes composed with `cn()`; tokens used instead of hardcoded colors

---

## Related documentation

- [API reference](../api/reference.md)
- [Environment variables](environment-variables.md)
- [Architecture overview](../architecture/overview.md)
- [Backend development](backend.md)
