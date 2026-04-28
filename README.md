# U+ Revai

<p>
  <img alt="Branch main" src="https://img.shields.io/badge/main-estable%20y%20documentada-1f6feb?style=for-the-badge" />
  <img alt="Branch dev" src="https://img.shields.io/badge/dev-integracion%20activa-238636?style=for-the-badge" />
  <img alt="Workflow" src="https://img.shields.io/badge/workflow-global%20desde%20raiz-f59e0b?style=for-the-badge" />
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

Monorepo de U+ Revai con servicios Node/Next.js, un servicio de IA en Python/FastAPI y una configuracion global de Prisma en la raiz.

> [!IMPORTANT]
> El flujo oficial del proyecto parte desde la raiz del repo.
> Si vas a trabajar con servicios Node, Prisma, migraciones, generate, variables compartidas o scripts globales, debes hacerlo desde `/uplus-revai`.

## Navegacion Rapida

- [Stack Base](#stack-base)
- [Herramientas Globales](#herramientas-globales)
- [Dependencias Base](#dependencias-base)
- [Servicios](#servicios)
- [AGENTS Por Servicio](#agents-por-servicio)
- [Diagrama](#diagrama)
- [Instalacion Inicial](#instalacion-inicial)
- [Prisma Global](#prisma-global)
- [Flujo De Ramas](#flujo-de-ramas)
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
| `prisma.config.ts` | configuracion oficial de Prisma CLI |
| `supabase/schema.prisma` | schema global de la base de datos |
| `supabase/migrations/` | migraciones SQL globales |
| `supabase/generated/` | cliente Prisma generado |
| `.env.example` | plantilla oficial de variables globales |
| `.env` | variables locales reales |
| `.gitignore` | reglas globales de archivos ignorados |
| `.prettierrc.json` | formato global del repo |
| `test-prisma.ts` | prueba simple de conexion a PostgreSQL |

> [!IMPORTANT]
> Si alguien necesita cambiar la estructura de la base de datos, el archivo correcto es `supabase/schema.prisma`.
> No se modifica el cliente generado dentro de `supabase/generated/`.

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

#### Paso 6. Generar el cliente Prisma

```bash
npm run db:generate
```

#### Paso 7. Probar la conexion a la base de datos

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

---

## Prisma Global

Toda la configuracion Prisma vive en la raiz y en `supabase/`.

### Schema

Si vas a cambiar la estructura de la base de datos, el archivo correcto es:

```text
supabase/schema.prisma
```

### Migraciones

```text
supabase/migrations/
```

### Cliente generado

```text
supabase/generated/prisma/
```

### Versionado

Se versiona:

- `supabase/schema.prisma`
- `supabase/migrations/`
- `prisma.config.ts`

No se versiona:

- `supabase/generated/`

### Si cambias el schema

1. modificar `supabase/schema.prisma`
2. correr `npm run db:generate`
3. correr `npm run db:migrate`

### Si otra persona ya hizo cambios

1. actualizar tu rama con cambios remotos
2. correr `npm run db:pull`
3. revisar `supabase/schema.prisma`
4. correr `npm run db:generate`
5. si te toca seguir evolucionando el schema, crear una nueva migracion con `npm run db:migrate`

> [!IMPORTANT]
> Todos los comandos Prisma se corren desde la raiz del repo.

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
> npm run db:generate
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
> supabase/schema.prisma
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

### Base de datos

| Script | Descripcion |
| --- | --- |
| `npm run db:generate` | genera el cliente Prisma desde `supabase/schema.prisma` |
| `npm run db:migrate` | crea y aplica una nueva migracion en desarrollo |
| `npm run db:migrate:deploy` | aplica migraciones existentes |
| `npm run db:migrate:reset` | resetea la base en desarrollo |
| `npm run db:pull` | trae cambios de la base de datos al schema local |
| `npm run db:push` | empuja el schema sin crear migracion |
| `npm run db:studio` | abre Prisma Studio |
| `npm run db:test` | valida la conexion a PostgreSQL usando `DIRECT_URL` |