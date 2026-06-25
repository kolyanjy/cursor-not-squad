# Quick start

Get Cursor Meetup running locally in a few minutes.

## 1. Start the backend

```bash
cd backend
source .venv/bin/activate   # Windows: .venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

The API is available at `http://localhost:8000`.

Verify it responds:

```bash
curl http://localhost:8000/api/health
# {"status":"ok","message":"API is running"}
```

Interactive API documentation: `http://localhost:8000/docs`

## 2. Start the frontend

In a second terminal:

```bash
cd frontend
npm run dev
```

The app is available at `http://localhost:5173`.

## 3. Confirm end-to-end connectivity

Open `http://localhost:5173` in your browser. The page should display a green status message indicating the API is reachable:

> API is running (ok)

If you see an error instead, ensure the backend is running on port 8000. The Vite dev server proxies `/api` requests to the backend automatically.

## Development workflow

| Service | URL | Hot reload |
|---------|-----|------------|
| Frontend | `http://localhost:5173` | Yes (Vite HMR) |
| Backend | `http://localhost:8000` | Yes (`--reload` flag) |
| API proxy | `/api/*` → `localhost:8000` | N/A |

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| `Failed to reach API` in the UI | Backend not running | Start uvicorn on port 8000 |
| CORS errors in browser console | Origin not in `CORS_ORIGINS` | Add your frontend URL to `backend/.env` |
| `ModuleNotFoundError` | Virtual env not activated | Run `source .venv/bin/activate` |

## Next steps

- [Architecture overview](../architecture/overview.md) — understand how the pieces fit together
- [Backend development](../development/backend.md) — add new API routes
- [Frontend development](../development/frontend.md) — build new UI components
