# MVP roadmap

This roadmap defines phases from zero to a shippable **TonightPick** frontend MVP. Backend integration is contract-first; the frontend can ship independently using mock mode.

---

## Phase overview

| Phase | Goal | Exit criteria |
|-------|------|---------------|
| **0 — Foundation** | Project scaffold and design tokens | Vite + React + TS + Tailwind running; theme tokens documented |
| **1 — Home** | Event creation entry point | `/` with title input, mood chips, Start CTA |
| **2 — Swipe** | Core interaction loop | `/event/:id/swipe` with card UI and three actions |
| **3 — Results** | Consensus view | `/event/:id/results` with liked list and Pick winner |
| **4 — API & mock** | Data layer | Typed client, `VITE_USE_MOCK`, env-based base URL |
| **5 — Polish** | Production-feel UX | Animations, reroll limits, safe areas, desktop max-width |

---

## Phase 0 — Foundation

**Deliverables**

- [ ] Vite + React 19 + TypeScript + Tailwind CSS 4
- [ ] `react-router-dom` with three route shells
- [ ] Folder structure: `pages/`, `components/`, `api/`, `types/`, `hooks/`
- [ ] Design tokens: background `#0a0a0f`, card slate-900/800, accent `#4FD1C5`
- [ ] App shell: max-width ~430 px centered, dark gradient background

**Dependencies:** None.

---

## Phase 1 — Home (`/`)

**Deliverables**

- [ ] Event title text input
- [ ] Mood chip selector (optional, multi or single — align with API `mood?`)
- [ ] Primary **Start** CTA (teal, full-width or prominent)
- [ ] On submit: `POST /events` → navigate to `/event/:id/swipe`

**Acceptance**

- Empty title blocked or validated before submit.
- Loading and error states on create event.

---

## Phase 2 — Swipe (`/event/:id/swipe`)

**Deliverables**

- [ ] Fetch next activity: `GET /events/:id/next`
- [ ] Card layout per [UI spec](../design/ui-spec.md):
  - Header: `TONIGHT MATCH` badge + reroll counter
  - Body: title, description, tag pills (tags + budget + duration)
  - Footer: weather boost (conditional) + score
- [ ] Fixed bottom action bar:
  - **Nope** → `POST .../swipe` with `action: "pass"`
  - **Tonight** → `POST .../swipe` with `action: "like"`, then next card
  - **Again** → `GET .../next` without swipe; decrement rerolls (default 3, disable at 0)
- [ ] Card fade/slide animation on next activity

**Acceptance**

- Touch targets ≥ 48 px; Tonight button largest (center).
- Reroll counter persists for the session (client state unless API adds rerolls later).

---

## Phase 3 — Results (`/event/:id/results`)

**Deliverables**

- [ ] `GET /events/:id/liked` → list of liked activities
- [ ] Compact card rows reusing activity metadata (title, tags, score)
- [ ] **Pick winner** teal CTA (MVP: local selection or navigation — no extra API required unless extended)
- [ ] Link or button back to swipe if list is empty

**Acceptance**

- Empty state when no likes yet.
- Visual consistency with swipe screen (same dark theme and accent).

---

## Phase 4 — API layer & mock mode

**Deliverables**

- [ ] `VITE_API_URL` (default `http://localhost:3001`)
- [ ] `VITE_USE_MOCK=true` → in-memory sample activities matching reference screenshot
- [ ] Typed `Activity` model and API functions in `src/api/`
- [ ] Unified error handling and loading states

**Mock sample (reference)**

- Title: *"Grab bubble tea and walk 30min"*
- Tags: Outdoor, `$`, ~45 min
- `weatherBoost: true`, `score: 70–95`

---

## Phase 5 — Polish & ship

**Deliverables**

- [ ] iPhone safe-area padding (`env(safe-area-inset-*)`)
- [ ] Smooth transitions (CSS or lightweight motion library if needed)
- [ ] Accessibility: button labels, focus rings, semantic headings
- [ ] Production build verified (`npm run build`)
- [ ] README and docs cross-linked

---

## Post-MVP (future)

| Initiative | Description |
|------------|-------------|
| **Live backend** | FastAPI/Node service implementing full event + swipe persistence |
| **Group sync** | Shared event room; aggregate likes across participants |
| **Smart ranking** | Score, weather boost, and mood-aware recommendations |
| **Location & time** | Geo-filtered activities, “open now” signals |
| **Share link** | Invite others to swipe the same event |

---

## Timeline suggestion

| Week | Focus |
|------|--------|
| 1 | Phases 0–1 (scaffold + Home) |
| 2 | Phase 2 (Swipe — highest complexity) |
| 3 | Phases 3–4 (Results + API/mock) |
| 4 | Phase 5 (polish, QA on real devices) |

Adjust based on team size; Swipe UI is the critical path.

---

## Related documentation

- [Product overview](overview.md)
- [UI specification](../design/ui-spec.md)
- [Frontend development](../development/frontend.md)
