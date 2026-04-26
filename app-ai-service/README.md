# app-ai-service

Servicio de IA para U+ Revai.

Su responsabilidad es consumir datos desde `app-review-service` y `app-surveys-service`, procesarlos con el proveedor LLM configurado y enviar el resultado consolidado a `app-report-service`.

## Flujo oficial del equipo

El flujo oficial del equipo para `app-ai-service` es Docker.

Ese debe ser el camino por defecto para levantar el servicio, porque evita diferencias de version de Python, dependencias locales y problemas de setup entre maquinas.

El flujo con `.venv` se mantiene solo como opcion secundaria para desarrollo rapido o debugging local.

## Convencion de carpeta

`app-ai-service` debe quedarse como una carpeta raiz del workspace, igual que el resto de servicios.

Eso mantiene consistente la estructura del repo:

- `app-auth`
- `app-review-service`
- `app-surveys-service`
- `app-report-service`
- `app-analysis-service`
- `app-ai-service`

Lo que si conviene mantener local al servicio es el entorno virtual de Python.

La convencion recomendada es esta:

```text
app-ai-service/
  .venv/
  src/
  env.example
  pyproject.toml
```

No se recomienda dejar `.venv` en la raiz del workspace, porque ese entorno pertenece a este servicio y no al repo completo.

## Setup para alguien del equipo

### 1. Clonar y ubicarse en `dev`

```bash
git clone git@github.com:AnthonyBAC/uplus-revai.git
cd uplus-revai
git switch dev || git switch -c dev --track origin/dev
git pull origin dev
```

### 2. Crear rama de trabajo

```bash
git switch -c feature/app-ai-service-<tu-tarea>
```

### 3. Entrar al servicio

```bash
cd app-ai-service
```

### 4. Instalar Prettier en el editor

Antes de empezar a tocar archivos del repo, instalar en VS Code la extension `Prettier - Code formatter` de `esbenp.prettier-vscode`.

Cada carpeta `app-*` ya tiene su propio archivo `.prettierrc.json`, asi que la extension tomara la configuracion local del servicio donde estes trabajando.

En `app-ai-service`, Prettier sirve sobre todo para Markdown, YAML, JSON y archivos de configuracion. Para formateo de Python se puede definir otra herramienta mas adelante si el equipo la necesita.

### 5. Flujo oficial: Docker

```bash
cp env.example .env
docker compose up --build
```

El servicio quedara expuesto en `http://localhost:8000`.

Si `review`, `surveys` y `report` siguen corriendo fuera de Docker en tu maquina local, dentro del `.env` conviene usar URLs con `host.docker.internal` en vez de `localhost`.

### 6. Opcion local: crear entorno virtual dentro del servicio

```bash
python -m venv .venv
source .venv/bin/activate
```

### 7. Instalar dependencias

```bash
pip install -e .
```

### 8. Crear archivo local de entorno

```bash
cp env.example .env
```

### 9. Ajustar variables necesarias

Minimo esperado en `.env`:

- `REVIEW_SERVICE_URL`
- `SURVEYS_SERVICE_URL`
- `REPORT_SERVICE_URL`
- `AI_PROVIDER`
- `AI_MODEL`
- `AI_API_KEY`
- `INTERNAL_SERVICE_TOKEN` si los servicios internos usan autenticacion entre servicios

### 10. Levantar el servicio

```bash
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

## Setup rapido con Makefile

Si prefieren un flujo mas corto, dentro de `app-ai-service` pueden usar:

```bash
make docker-up
```

Targets utiles:

- `make setup`: crea `.venv`, instala dependencias y crea `.env` si no existe.
- `make dev`: levanta el servicio en modo reload.
- `make run`: levanta el servicio sin reload.
- `make health`: consulta `GET /health`.
- `make docker-build`: construye la imagen Docker local.
- `make docker-up`: levanta el servicio con `docker compose up --build`.
- `make docker-down`: detiene el servicio Docker.
- `make docker-logs`: sigue los logs del contenedor.
- `make clean`: elimina `.venv`.

### 11. Validar que responde

```bash
curl http://localhost:8000/health
```

Respuesta esperada:

```json
{
    "ok": true,
    "service": "app-ai-service",
    "message": "FastAPI AI service is running."
}
```

## Flujo esperado

```text
app-review-service + app-surveys-service -> app-ai-service -> app-report-service
```

## Notas operativas

- Docker es la opcion mas consistente para onboarding de equipo y para evitar diferencias de entorno entre maquinas.
- El flujo con `.venv` sigue siendo util para desarrollo rapido cuando alguien quiere iterar sin rebuild de contenedor.
- Prettier debe estar instalado en el editor del equipo para mantener consistencia en Markdown, JSON, YAML y archivos frontend del repo.
- Si alguien del equipo ya tiene un `.venv` en la raiz del repo, no hace falta versionarlo ni compartirlo.
- Lo correcto es recrear el entorno dentro de `app-ai-service/.venv` o usar `make setup` dentro del servicio.
- Si mas adelante aparecen otros servicios Python, cada uno deberia tener su propio `.venv` o se deberia definir una estrategia comun de tooling para Python.
