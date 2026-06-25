# Installation

This guide walks through cloning the repository and installing dependencies for both the backend and frontend.

## Clone the repository

```bash
git clone <repository-url>
cd cursor-not-squad
```

## Backend setup

Create a virtual environment and install Python dependencies:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### Configure environment variables

Copy the example environment file and adjust values as needed:

```bash
cp .env.example .env
```

See [Environment variables](../development/environment-variables.md) for a full reference.

## Frontend setup

From the project root:

```bash
cd frontend
npm install
```

## Verify installation

| Check | Command | Expected result |
|-------|---------|-----------------|
| Backend deps | `pip list` (with venv active) | `fastapi`, `uvicorn`, `pydantic-settings` listed |
| Frontend deps | `npm ls react` | React version resolved without errors |

## Next steps

Continue to [Quick start](quick-start.md) to run the application.
