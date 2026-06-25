.DEFAULT_GOAL := start

COMPOSE := docker compose
DOCKER_READY := ./scripts/docker-ready.sh

.PHONY: help docker-ready start up up-d down stop logs restart build ps clean setup \
        shell-backend shell-frontend db-prepare db-seed

help: ## Show available commands
	@grep -E '^[a-zA-Z0-9_-]+.*:.*?## .*$$' $(MAKEFILE_LIST) | sort -u | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-18s\033[0m %s\n", $$1, $$2}'

docker-ready: ## Ensure Docker daemon is running (auto-starts Docker Desktop on macOS)
	@bash $(DOCKER_READY)

start up: docker-ready ## Start db + backend + frontend (one command)
	@echo ""
	@echo "  App:      http://localhost:5173"
	@echo "  API:      http://localhost:3000"
	@echo "  Postgres: localhost:5433"
	@echo ""
	$(COMPOSE) up --build

up-d start-d: docker-ready ## Start all services in the background
	@echo ""
	@echo "  App:      http://localhost:5173"
	@echo "  API:      http://localhost:3000"
	@echo "  Postgres: localhost:5433"
	@echo ""
	$(COMPOSE) up --build -d
	@echo "Services started. Run 'make logs' to follow output."

down stop: ## Stop all services
	@$(COMPOSE) down 2>/dev/null || true

restart: down up-d ## Restart all services in the background

logs: docker-ready ## Follow logs from all services
	$(COMPOSE) logs -f

build: docker-ready ## Build Docker images without starting
	$(COMPOSE) build

ps: docker-ready ## Show running services
	$(COMPOSE) ps

setup: docker-ready build up-d db-prepare ## First-time setup: build, start, prepare DB
	@echo "Setup complete."

db-prepare: docker-ready ## Run migrations and seeds in backend container
	$(COMPOSE) exec backend bin/rails db:prepare
	$(COMPOSE) exec backend bin/rails db:seed

db-seed: docker-ready ## Re-run database seeds
	$(COMPOSE) exec backend bin/rails db:seed

shell-backend: docker-ready ## Open bash shell in backend container
	$(COMPOSE) exec backend bash

shell-frontend: docker-ready ## Open sh shell in frontend container
	$(COMPOSE) exec frontend sh

clean: docker-ready ## Stop services and remove volumes (resets DB)
	$(COMPOSE) down -v
