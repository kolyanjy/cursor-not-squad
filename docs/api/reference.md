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

These six endpoints power the TonightPick swipe product. The backend must implement them (or the frontend uses `VITE_USE_MOCK=true` to skip the network entirely).

**Base URL (dev):** `http://localhost:3001` · **Content-Type:** `application/json` · **Error shape:** `{ "error": "message" }`

> Full handoff spec (screens, scoring algorithm, acceptance test, definition of done): [`IMPLEMENTATION.md`](../../IMPLEMENTATION.md)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/health` | Liveness check |
| `POST` | `/events` | Create a new swipe session |
| `GET` | `/events/:id/next` | Fetch the next activity card |
| `POST` | `/events/:id/swipe` | Record a like or pass |
| `POST` | `/events/:id/reroll` | Again — new card without recording a decision |
| `GET` | `/events/:id/liked` | List all liked activities |

### Data models

```ts
type Mood   = 'home' | 'out' | 'friends'
type Budget = 'free' | 'low' | 'medium'

// Catalog item (stored on backend)
interface Activity {
  id: string
  title: string
  description: string
  emoji?: string
  tags: string[]      // e.g. ["outdoor", "food"]
  budget: Budget
  duration: string    // display string e.g. "45 min"
  mood: Mood[]        // which moods this activity fits
}

// API response shape (catalog + runtime scoring)
interface ActivityCard extends Activity {
  score: number         // 0–100, computed per request
  weatherBoost: boolean
}

// Session state (stored server-side)
interface Event {
  id: string
  title: string
  mood?: Mood
  liked: string[]       // activity ids marked Tonight
  passed: string[]      // activity ids marked Nope
  seen: string[]        // all shown ids (incl. rerolls)
  rerollsLeft: number   // starts at 3
  createdAt: string     // ISO 8601
}
```

Budget display: `free` → "free" · `low` → "$" · `medium` → "$$"

### `GET /health`

Response `200`: `{ "ok": true }`

### `POST /events`

Body: `{ "title": "Friday night", "mood": "out" }` (`title` required; `mood` optional — `home | out | friends`).

Response `201`:
```json
{ "id": "uuid", "title": "Friday night", "shareUrl": "http://localhost:5173/event/uuid/swipe", "rerollsLeft": 3 }
```

Response `400`: missing/empty title.

### `GET /events/:id/next`

Response `200`: `{ "activity": { ...ActivityCard } }` — always wrapped, never a bare object.
Response `404`: no more cards or event not found → navigate to Results.

### `POST /events/:id/swipe`

Body: `{ "activityId": "12", "action": "like" | "pass" }` (`like` = Tonight, `pass` = Nope).
Response `200`: `{ "ok": true, "likedCount": 2, "passedCount": 1 }`
Response `400`: unknown event, invalid action, or activity already decided.

### `POST /events/:id/reroll`

**Again** — shows a different card without recording Nope or Tonight. Decrements `rerollsLeft`.

Request: empty body or `{}`
Response `200`: `{ "activity": { ...ActivityCard }, "rerollsLeft": 2 }`
Response `400`: `{ "error": "No rerolls left" }`
Response `404`: event not found or no more activities.

### `GET /events/:id/liked`

Response `200`: `{ "activities": ActivityCard[] }` — all Tonight picks for the session.
Response `404`: event not found.

### Typed client signatures

```ts
createEvent(body: { title: string; mood?: Mood }): Promise<{ id: string; shareUrl: string; rerollsLeft: number }>
getNextActivity(eventId: string): Promise<{ activity: ActivityCard }>
recordSwipe(eventId: string, body: { activityId: string; action: 'like' | 'pass' }): Promise<{ ok: boolean; likedCount: number; passedCount: number }>
reroll(eventId: string): Promise<{ activity: ActivityCard; rerollsLeft: number }>
getLikedActivities(eventId: string): Promise<{ activities: ActivityCard[] }>
```

### Error handling

| Status | Meaning | Action |
|--------|---------|--------|
| 400 | Invalid body | Inline error |
| 404 | Unknown event | Redirect Home |
| 5xx | Server error | Retry CTA + toast |
