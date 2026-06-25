# API reference

Base URL: `http://localhost:8000` (development)

All application endpoints are prefixed with `/api`. Interactive documentation is available at `/docs` (Swagger UI) and `/redoc` (ReDoc) when the server is running.

## Authentication

No authentication is required for current endpoints.

## Endpoints

### `GET /`

Root endpoint. Returns a welcome message.

**Response** `200 OK`

```json
{
  "message": "Cursor Meetup API"
}
```

---

### `GET /api/health`

Health check endpoint. Used by the frontend to verify backend connectivity.

**Response** `200 OK`

| Field | Type | Description |
|-------|------|-------------|
| `status` | `string` | Service status (`"ok"`) |
| `message` | `string` | Human-readable status message |

```json
{
  "status": "ok",
  "message": "API is running"
}
```

**Example**

```bash
curl http://localhost:8000/api/health
```

**Frontend client**

```typescript
import { fetchHealth } from '../api/client'

const health = await fetchHealth()
// { status: "ok", message: "API is running" }
```

## Error responses

FastAPI returns standard HTTP error codes:

| Status | Meaning |
|--------|---------|
| `404` | Route not found |
| `422` | Validation error (malformed request body or parameters) |
| `500` | Internal server error |

Validation errors include a detailed JSON body describing which fields failed validation.

## Schema definitions

Pydantic models are defined in `backend/app/models/schemas.py`:

```python
class HealthResponse(BaseModel):
    status: str
    message: str
```

TypeScript equivalents are defined alongside API client functions in `frontend/src/api/client.ts`.
