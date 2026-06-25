# TonightPick — Implementation Specification

> **Single handoff document for backend and frontend teams.**  
> Same endpoints, same JSON shapes, same user-visible behavior.  
> If this doc and the running app disagree, fix the app to match this doc.

---

## Table of contents

1. [Product summary](#1-product-summary)
2. [Screens and user flows](#2-screens-and-user-flows)
3. [Global product rules](#3-global-product-rules)
4. [API contract](#4-api-contract)
5. [Data models](#5-data-models)
6. [Backend responsibilities](#6-backend-responsibilities)
7. [Frontend responsibilities](#7-frontend-responsibilities)
8. [Environment and local setup](#8-environment-and-local-setup)
9. [Acceptance test](#9-acceptance-test)
10. [Out of scope](#10-out-of-scope)
11. [Definition of done](#11-definition-of-done)

---

## 1. Product summary

**TonightPick** helps people decide what to do tonight by swiping through activity cards — like a dating app, but for evening plans.

**Problem:** After work or school, people have free time but no energy to choose. They scroll feeds, argue in group chats, or postpone the decision.

**Solution:** Show **one idea at a time**, let the user reject or shortlist, then **pick one final plan** from their shortlist.

**Audience:** Solo users, couples, or small groups (group sync is future; MVP is single-device).

**MVP constraints:**
- No accounts or login
- No dashboard, analytics, or admin UI
- Mobile-first browser UX (thumb-friendly, max width ~430px, dark theme)
- Full flow completable in **2–3 minutes**

---

## 2. Screens and user flows

### Screen 1 — Start

**Purpose:** Create an evening session.

| UI element | Behavior |
|------------|----------|
| Title input | Required. Example: "Friday", "Date night" |
| Mood chips (optional) | `home` / `out` / `friends` — at most one selected |
| **Start** button | Creates session and navigates to Swipe |

#### Actions and expected results

| # | User action | Expected result |
|---|-------------|-----------------|
| 1.1 | Opens app | Start screen: title field, mood chips, Start button |
| 1.2 | Taps Start with **empty** title | Session **not** created; user stays on Start; validation message or highlighted field |
| 1.3 | Enters title, optionally picks mood, taps Start | Navigates to **Swipe**; session id in URL (`/event/:id/swipe`) or app state; first card loads; **Again** counter shows **3** if displayed |

---

### Screen 2 — Swipe

**Purpose:** Review one activity at a time and decide.

**Card content (each activity):**
- Large title and short description
- Tags: type (e.g. indoor/outdoor), budget, duration
- Optional: fit **score** (number) and **weather boost** badge
- **TONIGHT MATCH** badge (or equivalent label)
- Rerolls remaining (e.g. "3 rerolls left")

**Bottom actions:**

| Button | Meaning |
|--------|---------|
| **Nope** | Reject — do not shortlist |
| **Tonight** | Like — add to shortlist |
| **Again** | Show a different idea **without** recording Nope or Tonight |

**Again** is limited to **3 per session**. At 0, disable or hide the button.

#### Actions and expected results

| # | User action | Expected result |
|---|-------------|-----------------|
| 2.1 | Lands on Swipe | One card visible; Nope / Tonight / Again buttons; reroll counter if shown |
| 2.2 | Taps **Nope** | Current idea rejected; **different** card appears; rejected idea **never returns**; Again counter **unchanged** |
| 2.3 | Taps **Tonight** | Idea added to liked list; **next** card appears; liked idea **never returns** as a swipe card; Again counter **unchanged** |
| 2.4 | Taps **Again** (rerolls > 0) | **Different** idea shown; no Nope/Tonight recorded; Again counter **decreases by 1** (e.g. 3 → 2); current card will not reappear |
| 2.5 | Rerolls = 0 | **Again** disabled or hidden; only Nope and Tonight available |
| 2.6 | No more ideas left | No new card; show "No more ideas" **or** auto-navigate to **Results**; manual link to Results if needed |

**Routing:** `/event/:id/swipe`

---

### Screen 3 — Results

**Purpose:** Review shortlisted ideas and pick one final plan.

| UI element | Behavior |
|------------|----------|
| Liked list | All ideas marked **Tonight** in this session |
| **Pick one for tonight** | Randomly highlights **one** liked idea as the final plan |
| Back to Swipe | Returns to remaining unseen cards |

**Pick winner is frontend-only** — no API call. Random choice from the liked list.

#### Actions and expected results

| # | User action | Expected result |
|---|-------------|-----------------|
| 3.1 | Opens Results with zero Tonight picks | Empty list; copy like "You haven't picked anything yet"; button back to Swipe |
| 3.2 | Opens Results with 1+ Tonight picks | List of liked cards (title, tags); **Pick one for tonight** button |
| 3.3 | Taps **Pick one for tonight** | **One** random liked idea highlighted; clear copy: "Your plan for tonight: …" |
| 3.4 | Returns to Swipe from Results | Swipe shows **remaining** unseen ideas only; liked ideas still on Results |

**Routing:** `/event/:id/results`

---

### UI → API call map

| UI action | API sequence |
|-----------|--------------|
| Start | `POST /events` |
| Load card | `GET /events/:id/next` |
| Nope | `POST /events/:id/swipe` `{ action: "pass" }` → then `GET /events/:id/next` |
| Tonight | `POST /events/:id/swipe` `{ action: "like" }` → then `GET /events/:id/next` |
| Again | `POST /events/:id/reroll` |
| Results list | `GET /events/:id/liked` |
| Pick winner | **Frontend only** — random from liked list |

---

## 3. Global product rules

| Rule | Behavior |
|------|----------|
| One card at a time | Never show a scrollable list of many ideas on Swipe |
| No repeats in one session | Once shown, passed, or liked — same card does not return |
| Tonight → Results | Every Tonight pick appears on Results |
| Nope → not on Results | Rejected ideas excluded from liked list |
| Again ≠ decision | Again does not add or remove from liked |
| Context-aware picks | Mood, budget, weather influence next card (backend) |
| One session = one evening | Title → swipe → pick a plan |
| No login | Full flow without account |
| Mobile UX | Thumb-friendly; **Tonight** is the largest / primary button |

---

## 4. API contract

### Constants

| Item | Value |
|------|--------|
| Frontend (dev) | `http://localhost:5173` |
| Backend (dev) | `http://localhost:3001` |
| API prefix | **none** — `/events`, `/health` at root |
| Format | JSON (`Content-Type: application/json`) |
| Error shape | `{ "error": "human-readable message" }` |

### `GET /health`

Liveness check.

**Response `200`:**
```json
{ "ok": true }
```

---

### `POST /events`

Create a new evening session.

**Request:**
```json
{
  "title": "Friday night",
  "mood": "out"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | yes | Non-empty after trim |
| `mood` | string | no | `"home"` \| `"out"` \| `"friends"` |

**Response `201`:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Friday night",
  "shareUrl": "http://localhost:5173/event/550e8400-e29b-41d4-a716-446655440000/swipe",
  "rerollsLeft": 3
}
```

| Field | Notes |
|-------|-------|
| `id` | UUID or unique string |
| `shareUrl` | Full URL to Swipe screen for this session |
| `rerollsLeft` | Always `3` on create |

**Response `400`:** invalid body (e.g. missing title) → `{ "error": "..." }`

---

### `GET /events/:id/next`

Return the next activity card for swiping.

**Response `200`:**
```json
{
  "activity": {
    "id": "12",
    "title": "Grab bubble tea and walk 30min",
    "description": "Fits your mood, under budget, good for a short walk.",
    "emoji": "🧋",
    "tags": ["outdoor"],
    "budget": "low",
    "duration": "45 min",
    "score": 91,
    "weatherBoost": true
  }
}
```

**Response `404`:** no more cards available → `{ "error": "No more activities" }` (or equivalent)

**Important:** Always wrap the card in `{ "activity": { ... } }`, never return a bare activity object.

---

### `POST /events/:id/swipe`

Record a swipe decision.

**Request:**
```json
{
  "activityId": "12",
  "action": "like"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `activityId` | string | yes | Must match the currently shown (or last seen) activity |
| `action` | string | yes | `"like"` (Tonight) \| `"pass"` (Nope) |

**Response `200`:**
```json
{
  "ok": true,
  "likedCount": 2,
  "passedCount": 1
}
```

**Response `400`:** unknown event, invalid action, or activity already decided → `{ "error": "..." }`

**Response `404`:** event not found

---

### `POST /events/:id/reroll`

Show another idea without recording Nope or Tonight. Decrements `rerollsLeft`.

**Request:** empty body or `{}`

**Response `200`:**
```json
{
  "activity": {
    "id": "7",
    "title": "Cook pasta and watch a movie",
    "description": "Cozy night in.",
    "emoji": "🍝",
    "tags": ["indoor"],
    "budget": "low",
    "duration": "2 hours",
    "score": 78,
    "weatherBoost": false
  },
  "rerollsLeft": 2
}
```

**Response `400`:** `{ "error": "No rerolls left" }`

**Response `404`:** event not found or no more activities

---

### `GET /events/:id/liked`

Return all activities the user marked Tonight in this session.

**Response `200`:**
```json
{
  "activities": [
    {
      "id": "12",
      "title": "Grab bubble tea and walk 30min",
      "description": "Fits your mood, under budget, good for a short walk.",
      "emoji": "🧋",
      "tags": ["outdoor"],
      "budget": "low",
      "duration": "45 min",
      "score": 91,
      "weatherBoost": true
    }
  ]
}
```

Empty shortlist: `{ "activities": [] }`

**Response `404`:** event not found

---

## 5. Data models

### Activity (catalog item)

Seed catalog on the backend: **at least 30 items**.

```typescript
type Mood = "home" | "out" | "friends";
type Budget = "free" | "low" | "medium";

interface Activity {
  id: string;
  title: string;
  description: string;
  emoji?: string;
  tags: string[];           // e.g. "outdoor", "indoor", "food"
  budget: Budget;
  duration: string;         // display string, e.g. "45 min"
  mood: Mood[];             // which moods this activity fits
}
```

**API response fields** (catalog + runtime scoring):

```typescript
interface ActivityCard extends Activity {
  score: number;            // 0–100, computed per request
  weatherBoost: boolean;    // true when weather bonus applied
}
```

### Event (runtime session state)

Stored server-side per session.

```typescript
interface Event {
  id: string;
  title: string;
  mood?: Mood;
  liked: string[];          // activity ids marked Tonight
  passed: string[];         // activity ids marked Nope
  seen: string[];           // activity ids already shown (incl. rerolls)
  rerollsLeft: number;      // starts at 3
  createdAt: string;        // ISO 8601
}
```

### Budget display mapping (frontend)

| API value | UI label |
|-----------|----------|
| `free` | free |
| `low` | $ |
| `medium` | $$ |

---

## 6. Backend responsibilities

### Must implement

1. All six endpoints: `/health`, `POST /events`, `GET /events/:id/next`, `POST /events/:id/swipe`, `POST /events/:id/reroll`, `GET /events/:id/liked`
2. CORS allowing the frontend origin (dev: `http://localhost:5173`)
3. In-memory or persistent store for events (MVP: in-memory is fine)
4. Activity catalog: JSON file or seed data, **30+ activities**
5. Card selection algorithm on `GET /next` and `POST /reroll`:

   ```
   1. Filter catalog by event.mood if mood is set
   2. Exclude ids in event.liked, event.passed, event.seen
   3. Score each candidate:
      - base random 60–80
      - +15 if mood matches
      - +10 if budget is "free"
      - +20 if weatherBoost applies (stub: fixed rule or simple mock is OK for MVP)
   4. Weighted random pick by score
   5. Append chosen id to event.seen
   6. Return activity with score and weatherBoost
   ```

6. On swipe `like`: append `activityId` to `liked`
7. On swipe `pass`: append `activityId` to `passed`
8. On reroll: decrement `rerollsLeft`, add current card to `seen`, return new card
9. `shareUrl` built from `FRONTEND_URL` env + `/event/{id}/swipe`
10. Consistent error responses: `{ "error": "message" }` with appropriate HTTP status

### Suggested stack

Express (Node) or any framework that exposes the same contract. Port **3001** in dev.

### Smoke test

```bash
# Health
curl http://localhost:3001/health

# Create event
curl -X POST http://localhost:3001/events \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","mood":"out"}'

# Replace EVENT_ID with id from previous response
curl http://localhost:3001/events/EVENT_ID/next

curl -X POST http://localhost:3001/events/EVENT_ID/swipe \
  -H "Content-Type: application/json" \
  -d '{"activityId":"12","action":"like"}'

curl -X POST http://localhost:3001/events/EVENT_ID/reroll

curl http://localhost:3001/events/EVENT_ID/liked
```

---

## 7. Frontend responsibilities

### Must implement

1. **Three screens:** Start → Swipe → Results (routes: `/`, `/event/:id/swipe`, `/event/:id/results`)
2. **API client** using `VITE_API_URL` (or equivalent env) pointing at backend
3. **Mock mode** via `VITE_USE_MOCK=true`: same API function signatures, in-memory implementation for offline UI work
4. All user actions from [Section 2](#2-screens-and-user-flows) with exact expected results
5. **Mobile-first dark UI:** max-width ~430px, large touch targets, Tonight button most prominent
6. Loading and error states for API calls
7. **Pick winner** on Results: client-side random from liked list — no backend call
8. Validation: empty title blocks session creation
9. Again button disabled when `rerollsLeft === 0`
10. Navigate to Results when `GET /next` returns 404 or user opens Results manually

### Suggested stack

Vite + React + TypeScript + Tailwind + `react-router-dom`. Mobile browser target.

### Mock mode reference card

When `VITE_USE_MOCK=true`, use this as the default sample card:

- Title: *Grab bubble tea and walk 30min*
- `weatherBoost: true`
- `score: 91`

### API client pattern

```
createEvent(title, mood?)     → POST /events
getNextCard(eventId)          → GET /events/:id/next
swipe(eventId, activityId, action) → POST /events/:id/swipe
reroll(eventId)               → POST /events/:id/reroll
getLiked(eventId)             → GET /events/:id/liked
```

Frontend should call `getNextCard` after successful `swipe` with action `like` or `pass`.

---

## 8. Environment and local setup

### Frontend `.env`

```env
VITE_API_URL=http://localhost:3001
VITE_USE_MOCK=false
```

Set `VITE_USE_MOCK=true` to develop UI without a running backend.

### Backend `.env`

```env
PORT=3001
CORS_ORIGIN=http://localhost:5173
FRONTEND_URL=http://localhost:5173
```

### Running together

1. Start backend on port **3001**
2. Start frontend on port **5173**
3. Set `VITE_USE_MOCK=false`
4. Run the [7-step acceptance test](#9-acceptance-test) in a mobile browser or narrow viewport

---

## 9. Acceptance test

Manual test — all steps must pass:

```
1. Open app              → Start screen
2. Enter "Friday", Start → Swipe screen, one card visible
3. Tonight on card 1     → card 2 appears
4. Nope on card 2        → card 3 appears
5. Again                 → card 4 appears, rerolls = 2
6. Open Results          → exactly 1 liked item (card 1)
7. Pick one for tonight  → one final plan highlighted
```

If all seven steps pass with live API (`VITE_USE_MOCK=false`), MVP is demo-ready.

---

## 10. Out of scope

Do **not** implement for MVP:

- User accounts, auth, JWT, OAuth
- Admin dashboard or analytics
- Real-time multi-device / group sync
- Calendar integration, maps, push notifications
- `GET /activities/random` or other endpoints outside this spec
- Yearly history, profiles, social features
- Native app store builds (mobile **browser** is the target)

---

## 11. Definition of done

### Backend

- [ ] All endpoints return correct shapes per this doc
- [ ] Smoke test commands pass
- [ ] 30+ activities in catalog
- [ ] Card selection respects mood, seen/liked/passed, scoring, rerolls
- [ ] CORS configured for frontend origin

### Frontend

- [ ] Three screens match [Section 2](#2-screens-and-user-flows)
- [ ] Mock mode and live API mode both work
- [ ] 7-step acceptance test passes in browser
- [ ] Mobile dark UI, no dashboard, no login

### Integration

- [ ] Frontend `VITE_API_URL` points to backend
- [ ] Full user journey: Start → Swipe (Nope / Tonight / Again) → Results → Pick winner
- [ ] No card repeats within one session
- [ ] Again counter starts at 3 and decrements correctly

---

## Quick reference — endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/health` | Liveness |
| POST | `/events` | Create session |
| GET | `/events/:id/next` | Next swipe card |
| POST | `/events/:id/swipe` | Record Nope or Tonight |
| POST | `/events/:id/reroll` | Again — new card, no decision |
| GET | `/events/:id/liked` | Shortlist for Results |

---

*Document version: MVP v1. Shared contract for backend and frontend implementation.*
