.DEFAULT_GOAL := start

COMPOSE := docker compose

.PHONY: help start up up-d down stop logs restart build ps clean setup \
        shell-backend shell-frontend db-prepare db-seed

help: ## Show available commands
	@grep -E '^[a-zA-Z0-9_-]+.*:.*?## .*$$' $(MAKEFILE_LIST) | sort -u | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-18s\033[0m %s\n", $$1, $$2}'

start up: ## Start db + backend + frontend (one command)
	@echo ""
	@echo "  App:      http://localhost:5173"
	@echo "  API:      http://localhost:3000"
	@echo "  Postgres: localhost:5432"
	@echo ""
	$(COMPOSE) up --build

up-d start-d: ## Start all services in the background
	@echo ""
	@echo "  App:      http://localhost:5173"
	@echo "  API:      http://localhost:3000"
	@echo "  Postgres: localhost:5432"
	@echo ""
	$(COMPOSE) up --build -d
	@echo "Services started. Run 'make logs' to follow output."

down stop: ## Stop all services
	$(COMPOSE) down

restart: down up-d ## Restart all services in the background

logs: ## Follow logs from all services
	$(COMPOSE) logs -f

build: ## Build Docker images without starting
	$(COMPOSE) build

ps: ## Show running services
	$(COMPOSE) ps

setup: build up-d db-prepare ## First-time setup: build, start, prepare DB
	@echo "Setup complete."

db-prepare: ## Run migrations and seeds in backend container
	$(COMPOSE) exec backend bin/rails db:prepare
	$(COMPOSE) exec backend bin/rails db:seed

db-seed: ## Re-run database seeds
	$(COMPOSE) exec backend bin/rails db:seed

shell-backend: ## Open bash shell in backend container
	$(COMPOSE) exec backend bash

shell-frontend: ## Open sh shell in frontend container
	$(COMPOSE) exec frontend sh

clean: ## Stop services and remove volumes (resets DB)
	$(COMPOSE) down -v
