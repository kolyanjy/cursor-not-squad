# Product overview

**TonightPick** is a mobile-first web app that helps small groups decide what to do tonight — fast. Users create a lightweight event, swipe through curated activity cards Tinder-style, and pick a winner from the options everyone liked.

---

## Problem statement

Choosing a same-day activity with friends or a partner often devolves into endless back-and-forth: too many options, unclear preferences, and no structured way to converge on one plan before the evening slips away.

TonightPick reduces **decision paralysis** by:

1. **Constraining the choice set** — one card at a time, not an overwhelming list.
2. **Making preference capture frictionless** — swipe Nope / Tonight / Again instead of typing opinions.
3. **Surfacing consensus** — a short list of liked activities and a single “Pick winner” moment.

---

## Target users

| Persona | Description | Primary need |
|---------|-------------|--------------|
| **The Planner** | Organizes the group chat, picks a vibe, starts the session | “Give me something we can agree on in 5 minutes.” |
| **The Participant** | Joins via link, swipes through options on their phone | “Show me good ideas without reading a wall of text.” |
| **The Couple** | Two people deciding on a date night | “Something fun tonight that fits our mood and budget.” |

**Context of use:** same evening, mobile phone in hand, 2–6 people, low patience for forms or dashboards.

---

## Value proposition

| For users | For the product |
|-----------|-----------------|
| Decide in minutes, not hours | Simple 3-screen flow: Home → Swipe → Results |
| Express taste with gestures | Swipe actions map to clear intent (reject / accept / reroll) |
| See only what matters | One activity card, score, tags, and weather boost — no tables or admin UI |

---

## Core user journey

```
Home                    Swipe                         Results
┌──────────────┐       ┌──────────────┐              ┌──────────────┐
│ Event title  │  ──►  │ Activity     │  ──►         │ Liked list   │
│ Mood chips   │       │ card +       │              │ Pick winner  │
│ [ Start ]    │       │ Nope/Tonight │              │              │
└──────────────┘       └──────────────┘              └──────────────┘
```

1. **Create event** — Enter a title (e.g. “Friday crew”) and optional mood.
2. **Swipe** — Review activities one at a time; like, pass, or reroll (limited rerolls).
3. **Results** — Review all “Tonight” picks and choose the final plan.

---

## Scope boundaries (MVP)

**In scope**

- Mobile-first React UI matching the reference design (dark theme, teal accent).
- Three routes: `/`, `/event/:id/swipe`, `/event/:id/results`.
- API client against documented REST endpoints (or mock mode).
- Card transitions, touch-friendly action bar, iPhone safe areas.

**Out of scope (MVP)**

- User accounts and authentication.
- Real-time multi-device sync / WebSockets.
- Admin dashboard, analytics, or data tables.
- Native iOS/Android apps.
- Activity recommendation engine (backend may return mock or static data initially).

---

## Success metrics (MVP)

| Metric | Target | Rationale |
|--------|--------|-----------|
| Time to first swipe | < 30 s | Home screen must be minimal |
| Swipes per session | ≥ 5 | Enough signal to reach Results |
| Touch target compliance | 100% ≥ 48 px | Mobile usability baseline |
| Visual parity with design | High | Primary deliverable for frontend MVP |

---

## Related documentation

- [MVP roadmap](mvp-roadmap.md)
- [UI specification](../design/ui-spec.md)
- [Architecture overview](../architecture/overview.md)
- [API reference](../api/reference.md)
