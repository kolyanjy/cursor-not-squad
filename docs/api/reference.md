# API reference

The backend is a **Ruby on Rails 8.1 API-only** app. It exposes a health probe and a sample endpoint that returns a random activity, optionally filtered by category.

**Base URL (development):** `http://localhost:3000`
**Content-Type:** `application/json`

> The frontend reaches the API through the Vite dev proxy at `/api` (see [Architecture overview](../architecture/overview.md)). The proxy target is configurable via `VITE_API_PROXY_TARGET`.

---

## Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/up` | Rails health check (200 if the app boots, 500 otherwise) |
| `GET` | `/activities/random` | Return a random activity, optionally filtered by `category_slug` |

Defined in [`backend/config/routes.rb`](../../backend/config/routes.rb).

---

## Data models

The sample domain has two Active Record models.

### Category

| Field | Type | Notes |
|-------|------|-------|
| `id` | integer | Primary key |
| `name` | string | Required |
| `slug` | string | Required, unique |

### Activity

| Field | Type | Notes |
|-------|------|-------|
| `id` | integer | Primary key |
| `title` | string | Required |
| `description` | text | Optional |
| `category_id` | integer | Belongs to `Category` |

Seeded categories (`db/seeds.rb`): `outdoor`, `creative`, `social`, `fitness`, `cooking`, `learning`, `relaxation`, `adventure`.

---

## Endpoints

### Health check

`GET /up`

Returns HTTP `200` with an HTML page if the application boots without raising, otherwise `500`. Intended for load balancers and uptime monitors.

```bash
curl -i http://localhost:3000/up
```

---

### Random activity

`GET /activities/random`

Returns a single random activity. If `category_slug` is supplied, the activity is drawn from that category only.

**Query parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `category_slug` | string | No | Restrict the pick to one category (e.g. `outdoor`) |

**Example request**

```bash
curl "http://localhost:3000/activities/random?category_slug=outdoor"
```

**Response** `200 OK`

```json
{
  "id": 12,
  "title": "Go for a hike",
  "description": "Find a nearby trail and explore nature for an hour.",
  "category": {
    "id": 1,
    "name": "Outdoor",
    "slug": "outdoor"
  }
}
```

**Errors**

| Status | Body | When |
|--------|------|------|
| `404` | `{ "error": "Category not found" }` | `category_slug` provided but no such category |
| `404` | `{ "error": "No activities found" }` | No activities match (e.g. empty database — run `make db-seed`) |

The handler lives in [`backend/app/controllers/activities_controller.rb`](../../backend/app/controllers/activities_controller.rb) and uses the `Activity.random_for_category` scope.

---

## Frontend client

The frontend talks to the API through a thin `fetch` wrapper in [`frontend/src/api/client.ts`](../../frontend/src/api/client.ts), which prefixes requests with `/api`:

```typescript
const API_BASE = '/api'

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`)
  if (!response.ok) throw new Error(`Request failed: ${response.status}`)
  return response.json() as Promise<T>
}
```

> **Path note:** the Vite proxy forwards `/api/*` to the backend without stripping `/api`. The Rails routes above are mounted at the root, so when wiring a real call either add an `/api` scope in `config/routes.rb` or strip the prefix in the proxy `rewrite`. See [Backend development](../development/backend.md).

---

## Adding endpoints

1. Add or update a controller in `backend/app/controllers/`.
2. Declare the route in `backend/config/routes.rb`.
3. Render JSON with `render json:` and set explicit status codes on errors.
4. Document the endpoint here.

See [Backend development](../development/backend.md) for the full workflow.

---

## Related documentation

- [Architecture overview](../architecture/overview.md)
- [Backend development](../development/backend.md)
- [Environment variables](../development/environment-variables.md)

---

## TonightPick event API

These four endpoints power the TonightPick swipe product. The backend must implement them (or the frontend uses `VITE_USE_MOCK=true` to skip the network entirely).

**Base URL (dev):** `http://localhost:3001` · **Content-Type:** `application/json`

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/events` | Create a new swipe session |
| `GET` | `/events/:id/next` | Fetch the next activity card |
| `POST` | `/events/:id/swipe` | Record a like or pass |
| `GET` | `/events/:id/liked` | List all liked activities |

### Activity type (TonightPick)

```ts
interface Activity {
  id: string            // e.g. "act_bubble_tea_walk"
  title: string
  description: string
  emoji?: string
  tags: string[]        // e.g. ["Outdoor"]
  budget: 'free' | 'low' | 'medium'   // display: free → "free", low → "$", medium → "$$"
  duration: string      // e.g. "45 min"
  score?: number        // 70–95 typical; shown on card
  weatherBoost?: boolean  // true → show "Weather boost active"
}
```

### `POST /events`

Body: `{ "title": "Friday crew", "mood": "chill" }` (`title` required, `mood` optional).
Response `201`: `{ "id": "evt_8f3k2m9x" }`

### `GET /events/:id/next`

Called on swipe page load **and on Again** (reroll — no swipe is recorded).
Response `200`: `{ "activity": { ...Activity } }`
`404` — event not found → redirect Home. `204` / empty — no more activities → navigate to Results.

### `POST /events/:id/swipe`

Body: `{ "activityId": "act_...", "action": "like" | "pass" }` (`like` = Tonight, `pass` = Nope).
Response `200`: `{ "ok": true }`
**Again does NOT call this endpoint** — it only calls `GET /next`.

### `GET /events/:id/liked`

Response `200`: `{ "activities": Activity[] }` — all Tonight picks for the event.

### Typed client signatures

```ts
export type SwipeAction = 'like' | 'pass'

createEvent(body: { title: string; mood?: string }): Promise<{ id: string }>
getNextActivity(eventId: string): Promise<{ activity: Activity }>
recordSwipe(eventId: string, body: { activityId: string; action: SwipeAction }): Promise<{ ok: boolean }>
getLikedActivities(eventId: string): Promise<{ activities: Activity[] }>
```

### Error handling

| Status | Meaning | Action |
|--------|---------|--------|
| 400 | Invalid body | Inline error |
| 404 | Unknown event | Redirect Home |
| 422 | Validation | Field errors |
| 5xx | Server error | Retry CTA + toast |
