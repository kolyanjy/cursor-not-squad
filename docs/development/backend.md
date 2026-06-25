# Backend development

The backend is a [FastAPI](https://fastapi.tiangolo.com/) application located in `backend/`.

## Running locally

```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

| Flag | Effect |
|------|--------|
| `--reload` | Restart on file changes |
| `--port 8000` | Listen on port 8000 (matches Vite proxy) |

## Adding a new route

1. **Define a response schema** in `app/models/schemas.py`:

```python
from pydantic import BaseModel

class ItemResponse(BaseModel):
    id: int
    name: str
```

2. **Create a route module** in `app/api/routes/`:

```python
from fastapi import APIRouter
from app.models.schemas import ItemResponse

router = APIRouter(tags=["items"])

@router.get("/items/{item_id}", response_model=ItemResponse)
def get_item(item_id: int) -> ItemResponse:
    return ItemResponse(id=item_id, name=f"Item {item_id}")
```

3. **Register the router** in `app/main.py`:

```python
from app.api.routes import health, items

app.include_router(health.router, prefix="/api")
app.include_router(items.router, prefix="/api")
```

4. **Verify** at `http://localhost:8000/docs` — the new endpoint appears in the interactive Swagger UI.

## Configuration

Settings are managed by the `Settings` class in `app/core/config.py`. All values can be overridden via environment variables or a `.env` file. See [Environment variables](environment-variables.md).

## Project conventions

- Route modules live under `app/api/routes/` and export an `APIRouter` instance.
- All API routes are mounted under the `/api` prefix.
- Use Pydantic models for every request body and response.
- Keep route handlers thin; move business logic to dedicated service modules as the app grows.

## Dependencies

Managed in `backend/requirements.txt`. To add a new package:

```bash
pip install <package>
pip freeze > requirements.txt
```

## Related docs

- [API reference](../api/reference.md)
- [Environment variables](environment-variables.md)
