.PHONY: help setup build build-images up down logs status clean restart ssh

help:
	@echo ""
	@echo "  ☁️  CloudLab — Make Commands"
	@echo ""
	@echo "  make setup          Full first-time setup (build everything + start)"
	@echo "  make build-images   Build Node/Python/Fullstack workspace images"
	@echo "  make build          Build frontend + backend Docker images"
	@echo "  make up             Start all services"
	@echo "  make down           Stop all services"
	@echo "  make logs           Tail all logs"
	@echo "  make status         Show running containers"
	@echo "  make restart        Restart all services"
	@echo "  make clean          Remove all containers + volumes (DESTRUCTIVE)"
	@echo "  make ssh            Shell into backend container"
	@echo ""

setup: ## Full first-time setup
	@echo "==> Copying .env files..."
	@cp -n backend/.env.example backend/.env 2>/dev/null && echo "  Created backend/.env" || echo "  backend/.env already exists"
	@cp -n frontend/.env.local.example frontend/.env.local 2>/dev/null && echo "  Created frontend/.env.local" || echo "  frontend/.env.local already exists"
	@echo ""
	@echo "==> Building workspace images (this takes 10-20 min first time)..."
	$(MAKE) build-images
	@echo ""
	@echo "==> Building app images..."
	$(MAKE) build
	@echo ""
	@echo "==> Starting services..."
	$(MAKE) up

build-images:
	@echo "Building Node.js workspace..."
	docker build -t cloudlab-node:latest ./docker-environments/node
	@echo "Building Python workspace..."
	docker build -t cloudlab-python:latest ./docker-environments/python
	@echo "Building Full Stack workspace..."
	docker build -t cloudlab-fullstack:latest ./docker-environments/fullstack
	@echo "✅ All workspace images built!"

build:
	docker-compose build --no-cache

up:
	docker-compose up -d
	@echo ""
	@echo "  ✅ CloudLab is running!"
	@echo "  → Open:  http://localhost"
	@echo "  → Login: admin@cloudlab.local / cloudlab123"
	@echo ""

down:
	docker-compose down

logs:
	docker-compose logs -f

logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend

status:
	@echo "=== Core services ==="
	@docker-compose ps
	@echo ""
	@echo "=== Workspace containers ==="
	@docker ps --filter "name=cloudlab-ws-" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || echo "  None"

restart:
	docker-compose restart

clean:
	docker-compose down -v --remove-orphans
	@docker ps -q --filter "name=cloudlab-ws-" | xargs -r docker rm -f || true
	@docker volume ls -q --filter "name=cloudlab-data-" | xargs -r docker volume rm || true
	@echo "✅ Cleaned up all CloudLab containers and volumes"

ssh:
	docker-compose exec backend sh
