# UI specification

TonightPick follows a **mobile-first**, dark-themed interface optimized for one-handed use. Desktop renders the same experience centered at ~430 px width — no separate dashboard layout.

---

## Design principles

1. **One decision at a time** — A single activity card dominates the swipe screen.
2. **Thumb-zone actions** — Primary controls sit in a fixed bottom bar.
3. **Scannable metadata** — Tags, budget, and duration as pills; score and weather as footer hints.
4. **Confident typography** — Large display titles; muted secondary text for descriptions and meta.

---

## Color system

| Token | Value | Usage |
|-------|-------|--------|
| `bg-app` | `#0a0a0f` or `slate-950` | Page background with subtle gradient |
| `bg-card` | `slate-900` / `slate-800` | Center activity card |
| `accent-primary` | `#4FD1C5` / `teal-400` | Tonight button, TONIGHT MATCH border |
| `text-primary` | `white` | Titles, primary labels |
| `text-muted` | grey (`slate-400` range) | Descriptions, meta, reroll pill |
| `action-nope` | red icon on dark circle | Pass action |
| `action-again` | orange icon on dark circle | Reroll action |

---

## Typography

| Element | Style |
|---------|--------|
| Activity title | `font-black`, tight leading, large display size |
| Description | Regular weight, muted white/grey, paragraph spacing below title |
| Badges | Uppercase, small, tracking-wide (`TONIGHT MATCH`) |
| Action labels | Small caption under circular buttons (Nope / Tonight / Again) |

---

## Layout constraints

| Rule | Value |
|------|--------|
| Max content width | ~430 px, horizontally centered on desktop |
| Card radius | `rounded-3xl` (~32 px) |
| Card height | Full viewport minus bottom action bar |
| Min touch target | 48 × 48 px |
| Tonight button | Largest circle in action row (center) |
| Safe area | Padding for iPhone notch/home indicator |

---

## Screen: Home (`/`)

**Purpose:** Create an event and enter the swipe flow.

```
┌─────────────────────────────┐
│                             │
│   [ Event title input ]     │
│                             │
│   Mood chips (optional)     │
│   [ Chill ] [ Active ] ...  │
│                             │
│                             │
│   ┌─────────────────────┐   │
│   │       Start         │   │  ← teal primary CTA
│   └─────────────────────┘   │
│                             │
└─────────────────────────────┘
```

| Element | Behavior |
|---------|----------|
| Title input | Required for meaningful events; placeholder e.g. “Friday crew” |
| Mood chips | Optional; sent as `mood` on `POST /events` |
| Start | Creates event, navigates to `/event/:id/swipe` |

**Visual:** Minimal chrome — no nav bars, no tables. Same dark gradient as other screens.

---

## Screen: Swipe (`/event/:id/swipe`)

**Purpose:** Review and decide on activities one card at a time.

### Card structure

```
┌─────────────────────────────┐
│ TONIGHT MATCH    3 rerolls  │  ← header badges
├─────────────────────────────┤
│                             │
│  Grab bubble tea and        │  ← activity.title (huge bold)
│  walk 30min                 │
│                             │
│  Description paragraph...   │  ← activity.description (muted)
│                             │
│  [Outdoor] [$] [~45 min]    │  ← tag pills row
│                             │
│                             │
│ Weather boost    Score 82   │  ← footer (weather conditional)
└─────────────────────────────┘

┌─────────────────────────────┐
│  (Nope)   (Tonight)  (Again)│  ← fixed bottom bar
└─────────────────────────────┘
```

### Header badges

| Badge | Position | Style | Content |
|-------|----------|-------|---------|
| Tonight Match | Left | Teal border + teal uppercase text | Static label |
| Rerolls | Right | Grey pill | `{n} rerolls left` (default 3) |

### Tag pills row

Render in order:

1. Each item in `activity.tags` (e.g. `Outdoor`)
2. Budget pill: `free` → “free”, `low` → `$`, `medium` → `$$`
3. Duration pill: prefix `~` if not present (e.g. `~45 min`)

Pills: dark grey background, `rounded-full`, compact padding.

### Card footer

| Element | Condition | Content |
|---------|-----------|---------|
| Weather boost | `activity.weatherBoost === true` | “Weather boost active” (left) |
| Score | Always | “Score {activity.score}” (right); mock 70–95 if missing |

### Bottom action bar

Fixed to viewport bottom, safe-area aware.

| Button | Size | Icon | Action |
|--------|------|------|--------|
| Nope | Small circle | Red X | `POST /events/:id/swipe` `{ action: "pass" }` |
| Tonight | **Large** circle | Heart, solid teal fill | `POST .../swipe` `{ action: "like" }` → next card |
| Again | Small circle | Orange refresh | `GET /events/:id/next` only; decrement rerolls; disabled at 0 |

**Animation:** On next activity, card fades/slides out and new card enters (direction optional; prefer subtle horizontal slide + opacity).

---

## Screen: Results (`/event/:id/results`)

**Purpose:** Show all liked activities and finalize a winner.

```
┌─────────────────────────────┐
│  Liked tonight              │
│                             │
│  ┌─────────────────────┐    │
│  │ Activity card 1     │    │
│  └─────────────────────┘    │
│  ┌─────────────────────┐    │
│  │ Activity card 2     │    │
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │
│  │    Pick winner      │    │  ← teal CTA
│  └─────────────────────┘    │
└─────────────────────────────┘
```

| State | UI |
|-------|-----|
| Has likes | Scrollable list of compact activity cards |
| No likes | Empty state + CTA to return to swipe |
| Pick winner | Teal button; MVP may highlight selection locally |

---

## Component inventory (recommended)

| Component | Responsibility |
|-----------|----------------|
| `AppShell` | Max-width container, gradient bg, safe areas |
| `HomePage` | Title, moods, Start |
| `SwipePage` | Card stack + action bar orchestration |
| `ActivityCard` | Header, body, footer for one activity |
| `TagPill` | Reusable pill for tags/budget/duration |
| `SwipeActionBar` | Nope / Tonight / Again buttons |
| `ResultsPage` | Liked list + Pick winner |
| `Badge` | Tonight Match / reroll counter variants |

---

## Icons

Use **lucide-react** (already in stack) or equivalent:

| Action | Icon suggestion |
|--------|-----------------|
| Nope | `X` (red) |
| Tonight | `Heart` (white on teal) |
| Again | `RefreshCw` (orange) |

---

## Accessibility

- All action buttons have visible text labels below icons.
- Focus visible on keyboard navigation (desktop QA).
- Card title as heading (`h1` or `h2` per page).
- Disabled Again button when rerolls = 0 with clear visual state.

---

## Related documentation

- [Product overview](../product/overview.md)
- [Frontend development](../development/frontend.md)
- [API reference](../api/reference.md)
