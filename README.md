# U+ Revai

<p>
  <img alt="Branch main" src="https://img.shields.io/badge/main-estable%20y%20documentada-1f6feb?style=for-the-badge" />
  <img alt="Branch dev" src="https://img.shields.io/badge/dev-integracion%20activa-238636?style=for-the-badge" />
  <img alt="Workflow" src="https://img.shields.io/badge/workflow-CI%20por%20rama%20%2B%20deploy%20selectivo-f59e0b?style=for-the-badge" />
</p>

<p>
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-22.x-339933?logo=nodedotjs&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white" />
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16.2.4-111111?logo=nextdotjs&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-19.2.4-149eca?logo=react&logoColor=white" />
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-7.8.0-2d3748?logo=prisma&logoColor=white" />
  <img alt="Supabase" src="https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?logo=supabase&logoColor=white" />
  <img alt="Python" src="https://img.shields.io/badge/Python-3.11%2B-3776ab?logo=python&logoColor=white" />
  <img alt="FastAPI" src="https://img.shields.io/badge/FastAPI-app--ai--service-009688?logo=fastapi&logoColor=white" />
</p>

Monorepo de U+ Revai con servicios Node/Next.js, paquetes internos compartidos (`@uplus/db`, `@uplus/auth`), un servicio de IA en Python/FastAPI y deploys en Vercel controlados por GitHub Actions.

> [!IMPORTANT]
> El flujo oficial del proyecto parte desde la raiz del repo.
> Si vas a trabajar con servicios Node, Prisma, migraciones, generate, variables compartidas o scripts globales, debes hacerlo desde `/uplus-revai`.

## Navegacion Rapida

> [!NOTE]
> Monorepo configurado con npm workspaces. Paquetes internos: `@uplus/db`, `@uplus/auth`.

- [Stack Base](#stack-base)
- [Herramientas Globales](#herramientas-globales)
- [Dependencias Base](#dependencias-base)
- [Servicios](#servicios)
- [AGENTS Por Servicio](#agents-por-servicio)
- [Flujo De Ramas](#flujo-de-ramas)
- [CI/CD Y Deploy](#cicd-y-deploy)
- [Documentacion De La API Swagger](#documentacion-de-la-api-swagger)
- [Diagrama](#diagrama)
- [Instalacion Inicial](#instalacion-inicial)
- [Prisma Global](#prisma-global)
- [Resumen Rapido](#resumen-rapido)
- [Scripts Globales](#scripts-globales)

---

## Stack Base

### Stack Node

| Herramienta | Version base | Uso |
| --- | --- | --- |
| Node.js | `22.x` | runtime de servicios Node |
| npm workspaces | raiz del repo | instalacion y scripts globales |
| TypeScript | `^5` | tipado y tooling |
| Next.js | `16.2.4` | apps frontend y backend Node |
| React | `19.2.4` | UI y apps Next |
| Prisma | `^7.8.0` | schema, migraciones y cliente |
| PostgreSQL / Supabase | compartido | base de datos central |

### Stack IA

| Herramienta | Version base | Uso |
| --- | --- | --- |
| Python | `3.11+` | runtime de `app-ai-service` |
| FastAPI | `>=0.115.0` | API del servicio de IA |
| Uvicorn | `>=0.32.0` | servidor ASGI |
| Docker | recomendado | entorno consistente de equipo |

---

## Herramientas Globales

Piezas globales que el equipo debe tomar como referencia oficial:

| Archivo o carpeta | Rol |
| --- | --- |
| `package.json` | scripts globales y workspaces Node |
| `packages/db/` | paquete `@uplus/db` (Prisma client + export) |
| `packages/auth/` | paquete `@uplus/auth` (autenticacion compartida) |
| `packages/db/prisma/schema.prisma` | schema global de la base de datos |
| `packages/db/prisma/migrations/` | migraciones SQL globales |
| `packages/db/generated/` | cliente Prisma generado (no se versiona) |
| `prisma.config.ts` | configuracion oficial de Prisma CLI |
| `.env.example` | plantilla oficial de variables globales |
| `.env` | variables locales reales |
| `.gitignore` | reglas globales de archivos ignorados |
| `.prettierrc.json` | formato global del repo |
| `vitest.config.ts` | configuracion centralizada de tests |
| `test-prisma.ts` | prueba simple de conexion a PostgreSQL |

> [!IMPORTANT]
> Si alguien necesita cambiar la estructura de la base de datos, el archivo correcto es `packages/db/prisma/schema.prisma`.
> No se modifica el cliente generado dentro de `packages/db/generated/`.

---

## Dependencias Base

### Runtime raiz

| Paquete | Version | Uso |
| --- | --- | --- |
| `@auth/prisma-adapter` | `^2.11.2` | integracion Auth + Prisma |
| `@prisma/adapter-pg` | `^7.8.0` | adapter Prisma para PostgreSQL |
| `@prisma/client` | `^7.8.0` | cliente Prisma |
| `pg` | `^8.20.0` | conexion directa a PostgreSQL |

### Dev raiz

| Paquete | Version | Uso |
| --- | --- | --- |
| `prisma` | `^7.8.0` | Prisma CLI |
| `tsx` | `^4.21.0` | ejecucion de scripts TS |
| `typescript` | `^5` | compilacion y tipos |
| `dotenv` | `^17.4.2` | carga de variables de entorno |
| `dotenv-cli` | `^8.0.0` | inyecta el `.env` raiz en scripts `dev:*` de workspaces |
| `@types/node` | `^20` | tipos de Node |
| `@types/pg` | `^8` | tipos de PostgreSQL |

### Base IA

| Paquete | Version | Uso |
| --- | --- | --- |
| `fastapi` | `>=0.115.0,<1.0.0` | API HTTP |
| `httpx` | `>=0.28.0,<1.0.0` | cliente HTTP |
| `pydantic-settings` | `>=2.6.0,<3.0.0` | configuracion por entorno |
| `uvicorn[standard]` | `>=0.32.0,<1.0.0` | servidor local |

---

## Servicios

| Servicio | Perfil | Stack | Estado |
| --- | --- | --- | --- |
| `app-auth` | backend | Next.js + Prisma | activo |
| `app-analysis-service` | backend | Next.js | activo |
| `app-frontend` | frontend | Next.js | activo |
| `app-report-service` | backend | Next.js | activo |
| `app-review-service` | backend | Next.js | activo |
| `app-surveys-service` | backend | Next.js | activo |
| `app-ai-service` | backend IA | FastAPI + Python | activo |

> [!IMPORTANT]
> Todos los servicios Node se manejan desde la raiz con `npm workspaces`.
> No hace falta entrar a cada servicio para instalar dependencias Node.

---

## AGENTS Por Servicio

Antes de tocar un servicio, revisar primero su `AGENTS.md`:

- `app-analysis-service/AGENTS.md`
- `app-ai-service/AGENTS.md`
- `app-auth/AGENTS.md`
- `app-frontend/AGENTS.md`
- `app-report-service/AGENTS.md`
- `app-review-service/AGENTS.md`
- `app-surveys-service/AGENTS.md`

---

## Flujo De Ramas

Orden recomendado:

1. trabajar desde `dev`
2. crear `feature/...`
3. desarrollar en tu rama
4. actualizar tu rama con `dev` antes de abrir PR
5. abrir PR hacia `dev`

> [!IMPORTANT]
> Actualizar tu rama antes de subir cambios:
>
> ```bash
> git switch dev
> git pull origin dev
> git switch feature/<nombre-de-tu-rama>
> git merge dev
> ```
>
> Regla de `main`:
>
> - `main` no es para trabajo diario.
> - `main` solo recibe cambios ya revisados.

---

## CI/CD Y Deploy

Flujo actual del repositorio:

1. PR hacia `dev` ejecuta `.github/workflows/ci-pr-dev.yml`.
2. PR `dev -> main` ejecuta `.github/workflows/vercel-preview.yml`.
3. `push` a `main` ejecuta `.github/workflows/vercel-production.yml`.

Reglas importantes:

- El deploy a Vercel se hace solo desde GitHub Actions.
- Cada proyecto de Vercel debe tener su `Root Directory` configurado en su carpeta de app (`app-auth`, `app-frontend`, etc.).
- Cada app Node tiene su `vercel.json` con `"git": { "deploymentEnabled": false }` para evitar auto-deploy por Git Integration.
- Preview y production usan `dorny/paths-filter` para desplegar solo apps afectadas por los cambios.
- Si falta un `VERCEL_PROJECT_ID_*`, el workflow hace skip del deploy de esa app para evitar fallback al proyecto raiz `uplus-revai`.

Secrets esperados en GitHub Actions:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID_APP_AUTH`
- `VERCEL_PROJECT_ID_ANALYSIS`
- `VERCEL_PROJECT_ID_REVIEW`
- `VERCEL_PROJECT_ID_REPORT`
- `VERCEL_PROJECT_ID_SURVEYS`
- `VERCEL_PROJECT_ID_FRONTEND`

---

## Documentacion De La API Swagger

Cada servicio expone su documentacion interactiva OpenAPI/Swagger en la ruta `/docs`.
El spec OpenAPI en formato JSON esta disponible en `/api/docs` para integracion con otras herramientas (generadores de clientes, importers a Postman, etc.).

| Servicio | URL Produccion (Swagger UI) | Spec JSON | Descripcion |
| --- | --- | --- | --- |
| `app-auth` | https://app-auth-uplusrevais-projects.vercel.app/docs | [/api/docs](https://app-auth-uplusrevais-projects.vercel.app/api/docs) | Autenticacion y autorizacion |
| `app-analysis-service` | https://app-analysis-service-uplusrevais-projects.vercel.app/docs | [/api/docs](https://app-analysis-service-uplusrevais-projects.vercel.app/api/docs) | Analisis de resenas con IA |
| `app-review-service` | https://app-review-service-uplusrevais-projects.vercel.app/docs | [/api/docs](https://app-review-service-uplusrevais-projects.vercel.app/api/docs) | Gestion de resenas y sincronizacion con Google |
| `app-report-service` | https://app-report-service.vercel.app/docs | [/api/docs](https://app-report-service.vercel.app/api/docs) | Generacion de reportes ejecutivos |
| `app-surveys-service` | https://app-surveys-service-uplusrevais-projects.vercel.app/docs | [/api/docs](https://app-surveys-service-uplusrevais-projects.vercel.app/api/docs) | Encuestas internas |
| `app-frontend` | https://app-frontend-rho-murex.vercel.app | - | Dashboard (no expone Swagger) |

Endpoints organizados por tags en cada UI:

- **app-auth**: `auth`, `businesses`, `branches`, `roles`, `endpoints`
- **app-review-service**: `reviews`, `sync`, `connections`
- **app-analysis-service**: `analysis`
- **app-report-service**: `reports`, `analysis`
- **app-surveys-service**: `surveys`, `questions`, `responses`

> [!NOTE]
> **Acceso local durante desarrollo**
> Cada servicio expone su Swagger en `http://localhost:<puerto>/docs` al levantarlo con los scripts `dev:*` desde la raiz.
> Ver la seccion [Servicios](#servicios) para los puertos de cada uno.

> [!IMPORTANT]
> Las URLs de Vercel mostradas arriba apuntan a la documentacion Swagger de cada backend.
> El frontend (`app-frontend`) es la UI de la aplicacion y no expone Swagger.

---

## Diagrama

Diagrama base del proyecto:

![Diagrama de arquitectura](docs/u_revai.drawio.svg)

Flujo alto nivel:

```text
app-review-service + app-surveys-service -> app-ai-service -> app-report-service
```

---

## Instalacion Inicial

Secuencia recomendada para empezar a trabajar.

#### Paso 1. Clonar el repositorio

```bash
git clone git@github.com:AnthonyBAC/uplus-revai.git
cd uplus-revai
```

#### Paso 2. Posicionarte en `dev`

```bash
git switch dev || git switch -c dev --track origin/dev
git pull origin dev
```

#### Paso 3. Crear tu rama de trabajo

```bash
git switch -c feature/<nombre-de-tu-rama>
```

#### Paso 4. Configurar variables de entorno globales

Antes de instalar o ejecutar cosas, deja listo el `.env` global:

```bash
cp .env.example .env
```

Variables clave a revisar:

- `DATABASE_URL`
- `DIRECT_URL`
- `AUTH_SERVICE_URL`
- `ANALYSIS_SERVICE_URL`
- `REVIEW_SERVICE_URL`
- `REPORT_SERVICE_URL`
- `SURVEYS_SERVICE_URL`
- `FRONTEND_URL`
- `NEXT_PUBLIC_*`

> [!IMPORTANT]
> `.env` no se sube al repositorio.
> `.env.example` si se sube.

#### Paso 5. Instalar dependencias globales

```bash
npm install
```

> [!IMPORTANT]
> Este comando instala las dependencias de todos los servicios Node desde la raiz.

#### Paso 6. Probar la conexion a la base de datos

> [!NOTE]
> El cliente Prisma ya se genero automaticamente al correr `npm install`. No necesitas correr `db:generate` manualmente.

```bash
npm run db:test
```

Respuesta esperada:

```bash
Conexion OK con PostgreSQL: [ { now: ... } ]
```

#### Paso extra. En caso de que vayas a levantar uno de los servicios localmente

##### Puedes levantar servicios locales con estos comandos

```bash
npm run dev:frontend
npm run dev:auth
npm run dev:analysis
npm run dev:report
npm run dev:review
npm run dev:surveys
```

> [!IMPORTANT]
> `app-ai-service` usa Python y tiene flujo separado. Su instalacion local no forma parte del flujo global Node de arriba.

> [!NOTE]
> **Por que cada script usa `dotenv -e .env --`**
>
> npm workspaces cambia el directorio de trabajo al interior de cada servicio al correr scripts.
> Eso hace que Next.js no encuentre el `.env` de la raiz, ya que lo busca en el directorio actual.
>
> Para resolverlo, todos los scripts `dev:*` usan `dotenv-cli` con la flag `-e .env` apuntando al `.env` de la raiz:
>
> ```bash
> dotenv -e .env -- npm run dev --workspace=app-review-service -- -p 3003
> ```
>
> Esto inyecta las variables del `.env` raiz al proceso antes de que Next.js arranque.
> Por eso **no hay `.env` por servicio** en los servicios Node — todos comparten el `.env` global desde la raiz.
>
> La unica excepcion es `app-ai-service`, que tiene su propio `.env` porque es un proceso Python independiente (no es un workspace Node).

#### Paso extra. Si vas a trabajar en `app-ai-service`

El flujo oficial del equipo para `app-ai-service` es Docker. La opcion con `.venv` queda como alternativa para desarrollo o debugging local.

##### Opcion recomendada: Docker

```bash
cd app-ai-service
cp env.example .env
docker compose up --build
```

El servicio quedara disponible en:

```text
http://localhost:8000
```

Variables minimas a revisar dentro de `app-ai-service/.env`:

- `REVIEW_SERVICE_URL`
- `SURVEYS_SERVICE_URL`
- `REPORT_SERVICE_URL`
- `AI_PROVIDER`
- `AI_MODEL`
- `AI_API_KEY`
- `INTERNAL_SERVICE_TOKEN` si hay autenticacion entre servicios

> [!IMPORTANT]
> Si los otros servicios corren fuera de Docker en tu maquina, dentro de `app-ai-service/.env` puede convenir usar `host.docker.internal` en lugar de `localhost`.

##### Opcion local: `.venv`

```bash
cd app-ai-service
cp env.example .env
python -m venv .venv
source .venv/bin/activate
pip install -e .
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

##### Validacion rapida

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

---

## Prisma Global

Toda la configuracion Prisma vive en `packages/db/`.

### Schema

Si vas a cambiar la estructura de la base de datos, el archivo correcto es:

```text
packages/db/prisma/schema.prisma
```

### Migraciones

```text
packages/db/prisma/migrations/
```

### Cliente generado

```text
packages/db/generated/
```

> [!NOTE]
> El cliente Prisma se **genera automaticamente** al correr `npm install` gracias a un script `postinstall` en `packages/db`.
> No es necesario correr `npm run db:generate` manualmente despues de instalar.

### Versionado

Se versiona:

- `packages/db/prisma/schema.prisma`
- `packages/db/prisma/migrations/`
- `prisma.config.ts`

No se versiona:

- `packages/db/generated/`

### Si cambias el schema

1. modificar `packages/db/prisma/schema.prisma`
2. correr `npm run db:generate`
3. correr `npm run db:migrate`

### Si otra persona ya hizo cambios

1. actualizar tu rama con cambios remotos
2. correr `npm run db:pull`
3. revisar `packages/db/prisma/schema.prisma`
4. correr `npm install` (regenera el cliente Prisma automaticamente)
5. si te toca seguir evolucionando el schema, crear una nueva migracion con `npm run db:migrate`

> [!IMPORTANT]
> Todos los comandos Prisma se corren desde la raiz del repo.

---

## Resumen Rapido

> [!IMPORTANT]
> Si quieres la secuencia minima para empezar, usa este orden:
>
> ```bash
> git clone git@github.com:AnthonyBAC/uplus-revai.git
> cd uplus-revai
> git switch dev || git switch -c dev --track origin/dev
> git pull origin dev
> git switch -c feature/<tu-rama>
> cp .env.example .env
> npm install
> npm run db:test
> ```
>
> Si pasaste el test de conexion, el siguiente paso recomendado es sincronizar tu schema local con la base antes de empezar a tocar estructura:
>
> ```bash
> npm run db:pull
> ```
>
> Despues de eso ya puedes empezar a modificar el schema en:
>
> ```text
> packages/db/prisma/schema.prisma
> ```
>
> Y si luego quieres dejar listos tus cambios de base de datos, el flujo es este:
>
> ```bash
> npm run db:generate
> npm run db:migrate
> ```
>
> Despues de eso, ya puedes levantar el servicio que vas a trabajar.

---

## Scripts Globales

### Desarrollo

| Script | Descripcion |
| --- | --- |
| `npm run dev:auth` | levanta `app-auth` en desarrollo |
| `npm run dev:frontend` | levanta `app-frontend` en desarrollo |
| `npm run dev:analysis` | levanta `app-analysis-service` en desarrollo |
| `npm run dev:report` | levanta `app-report-service` en desarrollo |
| `npm run dev:review` | levanta `app-review-service` en desarrollo |
| `npm run dev:surveys` | levanta `app-surveys-service` en desarrollo |

### Calidad

| Script | Descripcion |
| --- | --- |
| `npm run lint` | ejecuta lint en todos los workspaces disponibles |
| `npm run build` | ejecuta build en todos los workspaces disponibles |

### Tests

| Script | Descripcion |
| --- | --- |
| `npm run test` | ejecuta todos los tests |
| `npm run test:auth` | tests de `app-auth` |
| `npm run test:surveys` | tests de `app-surveys-service` |
| `npm run test:review` | tests de `app-review-service` |
| `npm run test:report` | tests de `app-report-service` |
| `npm run test:analysis` | tests de `app-analysis-service` (BFF) |

| Servicio | Tests |
| --- | --- |
| `app-auth` | 10 |
| `app-surveys-service` | 15 |
| `app-review-service` | 8 |
| `app-report-service` | 8 |
| `app-analysis-service` | 6 |
| **Total** | **47** |

Los tests usan Vitest con configuracion global en `vitest.config.ts` (workspace projects).
No se duplica la configuracion por servicio.

### Base de datos

| Script | Descripcion |
| --- | --- |
| `npm run db:generate` | regenera el cliente Prisma manualmente si es necesario |
| `npm run db:migrate` | crea y aplica una nueva migracion en desarrollo |
| `npm run db:migrate:deploy` | aplica migraciones existentes |
| `npm run db:migrate:reset` | resetea la base en desarrollo |
| `npm run db:pull` | trae cambios de la base de datos al schema local |
| `npm run db:push` | empuja el schema sin crear migracion |
| `npm run db:studio` | abre Prisma Studio |
| `npm run db:test` | valida la conexion a PostgreSQL usando `DIRECT_URL` |

---

## Estructura del monorepo

```
uplus-revai/
├── package.json                   ← npm workspaces + scripts globales
├── package-lock.json              ← lockfile unico del monorepo
├── prisma.config.ts               ← configuracion Prisma CLI
├── vitest.config.ts               ← configuracion centralizada de tests
├── tsconfig.json                  ← TypeScript base
├── seed.ts                        ← seed de endpoints y roles
├── test-prisma.ts                 ← prueba de conexion DB
├── README.md                      ← documentacion principal del monorepo
├── .github/workflows/
│   ├── ci-pr-dev.yml              ← lint + test + build en PR hacia dev
│   ├── vercel-preview.yml         ← preview Vercel en PR dev -> main
│   └── vercel-production.yml      ← production Vercel en push a main
│
├── packages/                      ← paquetes internos compartidos
│   ├── db/                        ← @uplus/db
│   │   ├── package.json
│   │   ├── src/index.ts           ← exporta prisma + Prisma + RoleName
│   │   └── prisma/
│   │       ├── schema.prisma      ← schema central de la BD
│   │       └── migrations/        ← historial de migraciones
│   └── auth/                      ← @uplus/auth
│       ├── package.json
│       └── src/index.ts           ← getUserFromToken, requireAuth, etc.
│
├── app-auth/                      ← auth + autorizacion (puerto 3001)
│   ├── package.json
│   ├── tsconfig.json
│   ├── vercel.json                ← Vercel sin auto-deploy por Git
│   ├── next.config.ts             ← transpilePackages: [@uplus/*]
│   └── src/
│       ├── lib/auth.ts            ← requireAuth local (con membresias)
│       ├── lib/permissions.ts     ← requirePermission
│       ├── types/index.ts
│       └── app/api/               ← endpoints REST
│
├── app-analysis-service/          ← orquestacion + dashboard (puerto 3002)
│   ├── vercel.json                ← Vercel sin auto-deploy por Git
│   └── src/app/api/
│       ├── dashboard/route.ts
│       ├── analysis/insights/route.ts
│       ├── analysis/improvements/route.ts
│       └── analysis/reviews/route.ts
│
├── app-review-service/            ← reseñas Google (puerto 3003)
│   ├── package.json
│   ├── vercel.json                ← Vercel sin auto-deploy por Git
│   ├── next.config.ts
│   └── src/app/api/
│       ├── reviews/
│       ├── connections/
│       ├── sync/
│       └── internal/
│
├── app-report-service/            ← reportes ejecutivos (puerto 3004)
│   ├── vercel.json                ← Vercel sin auto-deploy por Git
│   └── src/app/api/
│       ├── reports/
│       └── analysis/
│
├── app-surveys-service/           ← encuestas internas (puerto 3005)
│   ├── vercel.json                ← Vercel sin auto-deploy por Git
│   └── src/app/api/surveys/
│       ├── [id]/
│       │   ├── route.ts
│       │   ├── questions/
│       │   ├── respond/
│       │   └── responses/
│       └── route.ts
│
├── app-frontend/                  ← dashboard frontend (puerto 3000)
│   ├── vercel.json                ← Vercel sin auto-deploy por Git
│   └── src/
│
└── app-ai-service/                ← IA con FastAPI + Python (puerto 8000)
    ├── pyproject.toml
    ├── Dockerfile
    └── src/main.py
```
