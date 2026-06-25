# API reference

TonightPick exposes a small REST API for event lifecycle and swipe actions. The frontend MVP consumes these endpoints via `VITE_API_URL` or simulates them in mock mode.

**Base URL (development):** `http://localhost:3001`  
**Content-Type:** `application/json`

---

## Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/events` | Create a new event |
| `GET` | `/events/:id/next` | Get the next activity to swipe |
| `POST` | `/events/:id/swipe` | Record a like or pass |
| `GET` | `/events/:id/liked` | List all liked activities for an event |

---

## Data models

### Activity

```typescript
interface Activity {
  id: string
  title: string
  description: string
  emoji?: string
  tags: string[]
  budget: 'free' | 'low' | 'medium'
  duration: string        // e.g. "45 min"
  score?: number          // 70–95 typical; shown in UI
  weatherBoost?: boolean    // if true, show "Weather boost active"
}
```

### Budget display mapping (frontend)

| API value | UI pill |
|-----------|---------|
| `free` | `free` |
| `low` | `$` |
| `medium` | `$$` |

---

## Endpoints

### Create event

`POST /events`

Creates an event session and returns its identifier.

**Request body**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | `string` | Yes | Event name (e.g. “Friday crew”) |
| `mood` | `string` | No | Selected mood chip value |

**Example request**

```json
{
  "title": "Friday crew",
  "mood": "chill"
}
```

**Response** `201 Created`

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Event UUID or opaque ID |

```json
{
  "id": "evt_8f3k2m9x"
}
```

**Frontend usage**

```typescript
const { id } = await createEvent({ title: 'Friday crew', mood: 'chill' })
navigate(`/event/${id}/swipe`)
```

---

### Get next activity

`GET /events/:id/next`

Returns the next activity card for swiping. Used on initial swipe load and on **Again** (reroll without recording pass/like).

**Path parameters**

| Name | Description |
|------|-------------|
| `id` | Event ID from create event |

**Response** `200 OK`

```json
{
  "activity": {
    "id": "act_bubble_tea_walk",
    "title": "Grab bubble tea and walk 30min",
    "description": "Pick up drinks nearby, then stroll the waterfront trail while the weather holds.",
    "emoji": "🧋",
    "tags": ["Outdoor"],
    "budget": "low",
    "duration": "45 min",
    "score": 82,
    "weatherBoost": true
  }
}
```

**Errors**

| Status | When |
|--------|------|
| `404` | Event not found |
| `204` or empty | No more activities (frontend should navigate to Results or show end state) |

---

### Record swipe

`POST /events/:id/swipe`

Persists a user decision for the current activity.

**Path parameters**

| Name | Description |
|------|-------------|
| `id` | Event ID |

**Request body**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `activityId` | `string` | Yes | ID of the activity being swiped |
| `action` | `"like" \| "pass"` | Yes | `like` = Tonight; `pass` = Nope |

**Example — Tonight (like)**

```json
{
  "activityId": "act_bubble_tea_walk",
  "action": "like"
}
```

**Example — Nope (pass)**

```json
{
  "activityId": "act_bubble_tea_walk",
  "action": "pass"
}
```

**Response** `200 OK`

```json
{
  "ok": true
}
```

**Notes**

- **Again** does **not** call this endpoint; it only calls `GET .../next`.
- After a successful like or pass, the frontend fetches the next activity (or relies on a follow-up `GET .../next`).

---

### Get liked activities

`GET /events/:id/liked`

Returns all activities the user marked as Tonight (liked) for this event.

**Path parameters**

| Name | Description |
|------|-------------|
| `id` | Event ID |

**Response** `200 OK`

```json
{
  "activities": [
    {
      "id": "act_bubble_tea_walk",
      "title": "Grab bubble tea and walk 30min",
      "description": "Pick up drinks nearby, then stroll the waterfront trail.",
      "tags": ["Outdoor"],
      "budget": "low",
      "duration": "45 min",
      "score": 82,
      "weatherBoost": true
    }
  ]
}
```

---

## Mock mode

When `VITE_USE_MOCK=true`, the frontend implements the same function signatures without network I/O:

| Behavior | Mock implementation |
|----------|---------------------|
| Create event | Generate random `id`, store empty session |
| Next activity | Rotate through sample activities; include reference screenshot activity |
| Swipe | Append to liked list if `like`; ignore if `pass` |
| Liked | Return in-memory liked array for event |

Sample mock activity should match the design reference:

- **Title:** Grab bubble tea and walk 30min  
- **Tags:** Outdoor, `$`, ~45 min  
- **weatherBoost:** `true`  
- **score:** 82 (or random 70–95)

---

## Error handling

| Status | Meaning | Frontend action |
|--------|---------|-----------------|
| `400` | Invalid body | Show inline error |
| `404` | Unknown event | Redirect to Home |
| `422` | Validation error | Show field errors |
| `5xx` | Server error | Retry CTA + toast |

---

## TypeScript client (reference)

```typescript
export type SwipeAction = 'like' | 'pass'

export function createEvent(body: { title: string; mood?: string }): Promise<{ id: string }>
export function getNextActivity(eventId: string): Promise<{ activity: Activity }>
export function recordSwipe(
  eventId: string,
  body: { activityId: string; action: SwipeAction }
): Promise<{ ok: boolean }>
export function getLikedActivities(eventId: string): Promise<{ activities: Activity[] }>
```

---

## Related documentation

- [Architecture overview](../architecture/overview.md)
- [UI specification](../design/ui-spec.md)
- [Environment variables](../development/environment-variables.md)
