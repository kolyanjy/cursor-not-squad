# Quick start

Get TonightPick running locally in under five minutes.

---

## Prerequisites

- **Node.js** 20 or later
- **npm** 10 or later

No backend is required if you use mock mode.

---

## 1. Install dependencies

```bash
cd frontend
npm install
```

Add the router when implementing routes (if not yet installed):

```bash
npm install react-router-dom
```

---

## 2. Configure environment

Create `frontend/.env.local`:

```env
VITE_USE_MOCK=true
VITE_API_URL=http://localhost:3001
```

See [Environment variables](../development/environment-variables.md) for details.

---

## 3. Start the dev server

```bash
npm run dev
```

Open **http://localhost:5173**

---

## 4. Verify the flow

| Step | URL | Action |
|------|-----|--------|
| Home | `/` | Enter event title, tap **Start** |
| Swipe | `/event/:id/swipe` | Nope / Tonight / Again on activity cards |
| Results | `/event/:id/results` | View liked activities, **Pick winner** |

With mock mode, sample activities include the reference card: *Grab bubble tea and walk 30min*.

---

## Production build

```bash
npm run build
npm run preview
```

---

## Next steps

- [UI specification](../design/ui-spec.md) — pixel-level design targets
- [MVP roadmap](../product/mvp-roadmap.md) — implementation phases
- [Frontend development](../development/frontend.md) — code conventions
