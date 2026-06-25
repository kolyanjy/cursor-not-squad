# TonightPick

Mobile-first web app for deciding **what to do tonight**. Create an event, swipe through activity cards, and pick a winner from the options you loved.

---

## Documentation

Full documentation lives in [`docs/`](docs/README.md):

| Section | Link |
|---------|------|
| Product overview | [docs/product/overview.md](docs/product/overview.md) |
| MVP roadmap | [docs/product/mvp-roadmap.md](docs/product/mvp-roadmap.md) |
| UI specification | [docs/design/ui-spec.md](docs/design/ui-spec.md) |
| Architecture | [docs/architecture/overview.md](docs/architecture/overview.md) |
| API reference | [docs/api/reference.md](docs/api/reference.md) |
| Frontend guide | [docs/development/frontend.md](docs/development/frontend.md) |

---

## Quick start

**Frontend** (port 5173):

```bash
cd frontend
npm install
npm run dev
```

**Mock mode** — create `frontend/.env.local`:

```env
VITE_USE_MOCK=true
VITE_API_URL=http://localhost:3001
```

App: http://localhost:5173

---

## MVP scope

- **In:** Home → Swipe → Results flow, dark mobile UI, API client + mock mode
- **Out:** Auth, dashboard, real-time sync, native apps (post-MVP)

---

## Tech stack

| Layer | Stack |
|-------|--------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS 4, react-router-dom |
| API (contract) | REST on `VITE_API_URL` (default `:3001`) |
| Icons | lucide-react |
