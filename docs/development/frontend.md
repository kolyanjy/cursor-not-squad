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

---

## TonightPick additions

The sections below describe what the TonightPick product adds on top of the landing-page baseline above.

### Additional dependencies

```bash
npm install react-router-dom framer-motion
```

`framer-motion` is already present (`tinder-like-swipe.tsx`). `react-router-dom` must be added.

### Routing

`App.tsx` is replaced with a `RouterProvider` + three routes:

```
/                        → HomePage      (create event)
/event/:id/swipe         → SwipePage     (swipe loop)
/event/:id/results       → ResultsPage   (liked list + pick winner)
```

### Environment variables

Set in `frontend/.env.local` (gitignored):

```
VITE_USE_MOCK=true
VITE_API_URL=http://localhost:3001
```

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:3001` | TonightPick API base URL |
| `VITE_USE_MOCK` | `false` | `true` → in-app mock, no HTTP calls |

`VITE_USE_MOCK=true` lets the frontend run without any backend. The mock rotates a static activity list in memory; swipe actions update in-memory liked state.

### Extended project structure

```
frontend/src/
├── main.tsx              # entry + RouterProvider
├── App.tsx               # route definitions
├── index.css             # Tailwind + design tokens
├── pages/
│   ├── HomePage.tsx      # event creation (title + mood chips + Start)
│   ├── SwipePage.tsx     # card + Nope/Tonight/Again
│   └── ResultsPage.tsx   # liked list + Pick winner
├── components/
│   ├── swipe/
│   │   ├── ActivityCard.tsx    # card body (title, description, tag-pills)
│   │   └── SwipeActionBar.tsx  # fixed bottom bar (Nope / Tonight / Again)
│   └── ui/               # existing primitives
├── api/
│   ├── client.ts         # createEvent, getNextActivity, recordSwipe, getLikedActivities
│   └── mock.ts           # in-memory mock adapter (same signatures)
├── types/
│   └── activity.ts       # Activity, Budget, SwipeAction
└── hooks/
    ├── useRerolls.ts      # reroll counter (default 3, decrements on Again only)
    └── useActivityTransition.ts  # card key/animation helper
```

### Activity types

```ts
// src/types/activity.ts
export type Mood   = 'home' | 'out' | 'friends'
export type Budget = 'free' | 'low' | 'medium'

export interface Activity {
  id: string
  title: string
  description: string
  emoji?: string
  tags: string[]
  budget: Budget
  duration: string
  mood: Mood[]          // which moods this activity fits
}

export interface ActivityCard extends Activity {
  score: number         // 0–100
  weatherBoost: boolean
}
```

### Mock reference card

```ts
{
  id: 'act_bubble_tea_walk',
  title: 'Grab bubble tea and walk 30 min',
  tags: ['outdoor'],
  budget: 'low',
  duration: '45 min',
  mood: ['out'],
  weatherBoost: true,
  score: 91,
}
```

### Rerolls (server-authoritative)

`rerollsLeft` is returned by `POST /events` (always `3`) and by each `POST /events/:id/reroll` response. The frontend tracks it in local state, seeded from the create response. Again calls `POST /events/:id/reroll` — not `GET /next`. The button is disabled when `rerollsLeft === 0`.

### Page conventions

- Pages own data-fetching and navigation; they never call `fetch` directly — all HTTP/mock lives in `src/api/`.
- Async state modeled as discriminated union: `{ kind: 'loading' } | { kind: 'success'; data: T } | { kind: 'error'; message: string }` with exhaustive `switch` + `never` default.
