# Cursor Meetup

Full-stack app with a React frontend and Python (FastAPI) backend.

## Project structure

```
.
├── backend/          # Python FastAPI API
│   └── app/
│       ├── api/      # Route handlers
│       ├── core/     # Config, shared utilities
│       └── models/   # Pydantic schemas
└── frontend/         # React + Vite + TypeScript
    └── src/
        ├── api/      # API client
        └── components/
```

## Prerequisites

- Node.js 18+
- Python 3.11+

## Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

## Frontend

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:5173

## Development

The Vite dev server proxies `/api` requests to the backend on port 8000.
