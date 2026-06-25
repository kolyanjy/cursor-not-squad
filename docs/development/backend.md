# Backend development

The backend is a **Ruby on Rails 8.1 API-only** application located in `backend/`. It exposes a small JSON API and uses PostgreSQL (in Docker) or SQLite (local without Docker) via Active Record.

| Aspect | Value |
|--------|-------|
| Framework | Rails 8.1 (`config.api_only = true`) |
| Ruby | 3.4.9 (see `backend/.ruby-version`) |
| Web server | Puma |
| Database | PostgreSQL 16 (Docker) / SQLite (local fallback) |
| Test framework | RSpec (`rspec-rails`) |
| Background jobs / cache / cable | Solid Queue / Solid Cache / Solid Cable |

---

## Running locally

The recommended way to run the whole stack is Docker from the repo root:

```bash
make up        # db + backend + frontend
```

To run **only** the Rails app inside its container:

```bash
make shell-backend
bin/rails server -b 0.0.0.0 -p 3000
```

### Without Docker (native Ruby)

`config/database.yml` falls back to SQLite when `DB_HOST` is not set, so you can run Rails directly:

```bash
cd backend
bundle install
bin/rails db:prepare      # create + migrate + seed
bin/rails server -p 3000
```

API: **http://localhost:3000**

| Command | Effect |
|---------|--------|
| `bin/rails server -p 3000` | Start Puma on port 3000 (matches the Vite proxy) |
| `bin/rails console` | Interactive console |
| `bin/rails db:prepare` | Create, migrate, and seed the database |

---

## Database

Two models back the sample domain — see [API reference](../api/reference.md):

```
Category (id, name, slug) ──< has_many ──> Activity (id, title, description, category_id)
```

| Task | Command |
|------|---------|
| Run migrations | `bin/rails db:migrate` |
| Seed data | `bin/rails db:seed` |
| Reset (drop + create + migrate + seed) | `bin/rails db:reset` |
| Create + migrate + seed in one step | `bin/rails db:prepare` |

With Docker, use the Make targets which run inside the container:

```bash
make db-prepare   # db:prepare + db:seed
make db-seed      # re-run seeds only
```

Seeds live in `db/seeds.rb` and define 8 categories (`outdoor`, `creative`, `social`, `fitness`, `cooking`, `learning`, `relaxation`, `adventure`), each with ~15 activities. Seeding is idempotent (`find_or_create_by!`).

---

## Adding a new route

1. **Add a model** (if needed) with a migration:

```bash
bin/rails generate model Tag name:string
bin/rails db:migrate
```

2. **Create a controller** in `app/controllers/`. Controllers inherit from `ApplicationController`, which is `ActionController::API`:

```ruby
class TagsController < ApplicationController
  def index
    render json: Tag.all
  end
end
```

3. **Declare the route** in `config/routes.rb`:

```ruby
Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check
  get "activities/random", to: "activities#random", as: :random_activities

  get "tags", to: "tags#index"
end
```

4. **Verify** with curl:

```bash
curl http://localhost:3000/tags
```

---

## Project conventions

- API-only app: controllers inherit from `ActionController::API` (no views, sessions, or cookies by default).
- Render JSON explicitly with `render json:`; this project does not use Jbuilder.
- Keep controllers thin — query through models and scopes (e.g. `Activity.random_for_category`), not raw SQL in the controller.
- Return appropriate status codes on errors, e.g. `render json: { error: "..." }, status: :not_found`.
- Routes are declared explicitly in `config/routes.rb` (no `/api` prefix in this project — the Vite proxy forwards `/api/*`; see notes below).

> **Proxy note:** the frontend calls paths under `/api` and the Vite dev server proxies `/api` to the backend **without stripping the prefix**. The current Rails routes (`/up`, `/activities/random`) are mounted at the root, so frontend requests like `/api/activities/random` would arrive at Rails as `/api/activities/random`. Either add an `/api` scope in `routes.rb` or rewrite the proxy path in `vite.config.ts` when wiring real calls. See [API reference](../api/reference.md).

---

## Code quality

| Tool | Command | Purpose |
|------|---------|---------|
| RuboCop | `bin/rubocop` | Omakase Ruby style |
| Brakeman | `bin/brakeman` | Static security analysis |
| bundler-audit | `bundle exec bundler-audit` | Known-vulnerability check on gems |
| RSpec | `bundle exec rspec` | Test suite |

---

## Dependencies

Gems are managed in `backend/Gemfile`. To add one:

```bash
# add the gem line to Gemfile, then:
bundle install
```

Rebuild the backend image after changing the Gemfile when using Docker:

```bash
make build
```

---

## Related docs

- [API reference](../api/reference.md)
- [Environment variables](environment-variables.md)
- [Architecture overview](../architecture/overview.md)
