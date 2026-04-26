PYTHON ?= python3
VENV := .venv
VENV_PYTHON := $(VENV)/bin/python
VENV_PIP := $(VENV)/bin/pip
UVICORN := $(VENV)/bin/uvicorn
APP_MODULE := src.main:app
HOST ?= 0.0.0.0
PORT ?= 8000
DOCKER ?= docker
COMPOSE ?= docker compose

.PHONY: help setup venv install env dev run health clean docker-build docker-up docker-down docker-logs

help:
	@echo "Targets disponibles:"
	@echo "  make setup   -> crea .venv, instala dependencias y crea .env si no existe"
	@echo "  make dev     -> levanta FastAPI en modo reload"
	@echo "  make run     -> levanta FastAPI sin reload"
	@echo "  make health  -> prueba el endpoint /health"
	@echo "  make docker-build -> construye la imagen Docker"
	@echo "  make docker-up    -> levanta el servicio con docker compose"
	@echo "  make docker-down  -> detiene el servicio Docker"
	@echo "  make docker-logs  -> muestra logs del contenedor"
	@echo "  make clean   -> elimina .venv"

setup: venv install env

venv:
	@if [[ ! -d $(VENV) ]]; then $(PYTHON) -m venv $(VENV); fi

install: venv
	@$(VENV_PIP) install -e .

env:
	@if [[ ! -f .env ]]; then cp env.example .env; fi

dev: venv
	@$(UVICORN) $(APP_MODULE) --reload --host $(HOST) --port $(PORT)

run: venv
	@$(UVICORN) $(APP_MODULE) --host $(HOST) --port $(PORT)

health:
	@curl -s http://127.0.0.1:$(PORT)/health

docker-build:
	@$(DOCKER) build -t app-ai-service:local .

docker-up:
	@$(COMPOSE) up --build

docker-down:
	@$(COMPOSE) down

docker-logs:
	@$(COMPOSE) logs -f app-ai-service

clean:
	@rm -rf $(VENV)

