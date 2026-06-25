# Prerequisites

Before setting up Cursor Meetup, ensure your development environment meets the following requirements. The **recommended** path runs everything in Docker, so most local tooling is optional.

## Recommended (Docker workflow)

| Tool | Version | Purpose |
|------|---------|---------|
| [Docker](https://www.docker.com/) | with Compose v2 | Runs db + backend + frontend |
| [Make](https://www.gnu.org/software/make/) | any recent | Convenience targets (`make up`, etc.) |
| [Git](https://git-scm.com/) | any recent | Version control |

With Docker you do **not** need Ruby, Node, or PostgreSQL installed locally. On macOS, `make` auto-starts Docker Desktop via `scripts/docker-ready.sh`.

## Optional (native, no Docker)

Only needed if you want to run a service directly on your machine.

| Tool | Version | Purpose |
|------|---------|---------|
| [Ruby](https://www.ruby-lang.org/) | 3.4.9 (see `backend/.ruby-version`) | Run the Rails backend natively |
| [Bundler](https://bundler.io/) | bundled with Ruby | Backend gem management |
| [Node.js](https://nodejs.org/) | 22 (matches `frontend/Dockerfile.dev`) | Run the Vite frontend natively |
| [npm](https://www.npmjs.com/) | bundled with Node.js | Frontend package management |
| [PostgreSQL](https://www.postgresql.org/) | 16 | Only if not using the Dockerized db (Rails falls back to SQLite otherwise) |

> A modern editor such as [Cursor](https://cursor.com/) or VS Code, and [curl](https://curl.se/) / [httpie](https://httpie.io/) for manual API testing, are handy but not required.

## Verify your setup

**Docker path:**

```bash
docker --version
docker compose version
make --version
```

**Native path (optional):**

```bash
ruby --version    # ruby 3.4.9
node --version    # v22.x
```

## Next steps

- [Installation](installation.md) — clone the repo and install dependencies
- [Quick start](quick-start.md) — run all services and verify the app works
