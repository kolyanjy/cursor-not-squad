# Frontend development

The TonightPick frontend is a **mobile-first React SPA** built with Vite, TypeScript, and Tailwind CSS. It lives in the `frontend/` directory.

---

## Tech stack

| Layer | Technology | Version (target) |
|-------|------------|------------------|
| Runtime | React | 19.x |
| Build | Vite | 8.x |
| Language | TypeScript | 6.x |
| Styling | Tailwind CSS | 4.x |
| Routing | react-router-dom | 7.x (to add) |
| Icons | lucide-react | 1.x |
| HTTP | Native `fetch` | — |

---

## Prerequisites

- Node.js 20+
- npm 10+

---

## Running locally

```bash
cd frontend
npm install
npm run dev
```

App: **http://localhost:5173**

### Mock mode (no backend)

```bash
# .env.local
VITE_USE_MOCK=true
VITE_API_URL=http://localhost:3001
```

With mock enabled, all API calls are handled in `src/api/mock.ts`.

### With backend

```bash
VITE_USE_MOCK=false
VITE_API_URL=http://localhost:3001
```

Ensure the API server implements the [API reference](../api/reference.md).

---

## Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Dev server + HMR |
| `build` | `npm run build` | Typecheck + production bundle → `dist/` |
| `preview` | `npm run preview` | Serve production build locally |
| `lint` | `npm run lint` | Oxlint |

---

## Project conventions

### File organization

- **`pages/`** — One file per route; orchestrate data + navigation.
- **`components/`** — Reusable UI; group by feature (`swipe/`, `layout/`).
- **`api/`** — All HTTP and mock logic; pages never call `fetch` directly.
- **`types/`** — Shared interfaces (`Activity`, etc.).
- **`hooks/`** — Reusable stateful logic (`useRerolls`).

### Imports

Use the `@/` path alias (configure in `vite.config.ts` and `tsconfig.json`):

```typescript
import { ActivityCard } from '@/components/swipe/ActivityCard'
import type { Activity } from '@/types/activity'
```

Keep imports at the top of each module (no inline imports).

### TypeScript

- Discriminated unions for async state: `loading | success | error`.
- Exhaustive `switch` with `never` in default for union types.

### Styling

- Tailwind utility classes in JSX.
- Design tokens documented in [UI specification](../design/ui-spec.md).
- App shell enforces `max-w-[430px] mx-auto` and safe-area padding:

```css
padding-bottom: env(safe-area-inset-bottom);
padding-top: env(safe-area-inset-top);
```

---

## Routing setup

```typescript
// App.tsx (target)
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/event/:id/swipe" element={<SwipePage />} />
  <Route path="/event/:id/results" element={<ResultsPage />} />
</Routes>
```

Install router when implementing:

```bash
npm install react-router-dom
```

---

## API client pattern

```typescript
// src/api/client.ts
const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'
const useMock = import.meta.env.VITE_USE_MOCK === 'true'

export async function getNextActivity(eventId: string) {
  if (useMock) return mockGetNext(eventId)
  const res = await fetch(`${baseUrl}/events/${eventId}/next`)
  if (!res.ok) throw new ApiError(res.status)
  return res.json() as Promise<{ activity: Activity }>
}
```

Centralize error types and JSON parsing in one module.

---

## Swipe page implementation notes

1. **Load** — On mount, `GET /events/:id/next`.
2. **Nope** — `POST swipe` with `pass`, then fetch next.
3. **Tonight** — `POST swipe` with `like`, then fetch next.
4. **Again** — Only `GET next`; decrement rerolls; disable at 0.
5. **Animate** — Toggle a key on `activity.id` to trigger enter/exit CSS transitions.

Reroll count is **client-side** for MVP (default 3). Server-authoritative rerolls can be added later.

---

## Results page

- Fetch `GET /events/:id/liked` on mount.
- Reuse `ActivityCard` in compact/list variant or a slim `LikedActivityRow`.
- **Pick winner** — MVP: highlight selected card or show confirmation modal; no extra API required unless product adds `POST /events/:id/winner`.

---

## Desktop behavior

Same mobile layout centered on wide viewports. No responsive dashboard or multi-column layout.

---

## Quality checklist

- [ ] Touch targets ≥ 48 px on all three swipe buttons
- [ ] Tonight button visibly larger than Nope / Again
- [ ] Card animation on activity change
- [ ] Weather boost hidden when `weatherBoost !== true`
- [ ] Budget pills map correctly (`free` / `$` / `$$`)
- [ ] iPhone safe areas on bottom action bar
- [ ] `npm run build` passes without type errors

---

## Related documentation

- [UI specification](../design/ui-spec.md)
- [API reference](../api/reference.md)
- [Environment variables](environment-variables.md)
- [MVP roadmap](../product/mvp-roadmap.md)
