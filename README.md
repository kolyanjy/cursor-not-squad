# Cursor Meetup

Full-stack app with a React frontend and Python (FastAPI) backend.

## Documentation

Full project documentation lives in [`docs/`](docs/README.md):

| Section | Link |
|---------|------|
| Quick start | [docs/getting-started/quick-start.md](docs/getting-started/quick-start.md) |
| Architecture | [docs/architecture/overview.md](docs/architecture/overview.md) |
| Development | [docs/development/backend.md](docs/development/backend.md) |
| API reference | [docs/api/reference.md](docs/api/reference.md) |
| Deployment | [docs/deployment/overview.md](docs/deployment/overview.md) |

## Quick start

**Backend** (port 8000):

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend** (port 5173):

```bash
cd frontend
npm install
npm run dev
```

- App: http://localhost:5173
- API docs: http://localhost:8000/docs
