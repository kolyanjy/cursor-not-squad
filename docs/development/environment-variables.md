# Environment variables

The backend loads configuration from environment variables and an optional `.env` file in the `backend/` directory.

## Backend variables

| Variable | Default | Description |
|----------|---------|-------------|
| `APP_NAME` | `Cursor Meetup API` | Application title (shown in OpenAPI docs) |
| `DEBUG` | `true` | Enable debug mode |
| `CORS_ORIGINS` | `http://localhost:5173` | Comma-separated list of allowed frontend origins |

## Setup

```bash
cd backend
cp .env.example .env
```

Example `.env` file:

```env
APP_NAME=Cursor Meetup API
DEBUG=true
CORS_ORIGINS=http://localhost:5173
```

## CORS origins

`CORS_ORIGINS` accepts a comma-separated list when multiple origins are needed:

```env
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

The value is parsed into a Python list by Pydantic Settings. Ensure every frontend URL that calls the API directly (not through a proxy) is included.

## Production notes

- Set `DEBUG=false` in production.
- Restrict `CORS_ORIGINS` to your actual frontend domain(s).
- Never commit `.env` files with secrets. The `.env.example` file documents required keys without real values.

## How it works

Settings are defined in `app/core/config.py` using `pydantic-settings`:

```python
class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = "Cursor Meetup API"
    debug: bool = True
    cors_origins: list[str] = ["http://localhost:5173"]
```

Environment variable names are case-insensitive and map to field names automatically (`APP_NAME` → `app_name`).
