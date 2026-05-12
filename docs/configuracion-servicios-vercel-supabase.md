# Configuracion De Servicios, Vercel y Supabase

Documento operativo para dejar el monorepo conectado entre servicios, con URLs reales de Vercel, variables por app, endpoints disponibles y observaciones del orquestador.

## 1. Supabase

Proyecto detectado:

- `SUPABASE_URL`: `https://pnsvxtfdakpzaaarcrsd.supabase.co`
- `SUPABASE_PROJECT_REF`: `pnsvxtfdakpzaaarcrsd`

Variables que debes configurar desde Supabase:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- `DIRECT_URL`

Regla importante:

- `SUPABASE_SERVICE_ROLE_KEY` solo backend
- `SUPABASE_ANON_KEY` se usa para validar JWT en todos los servicios Node que consumen `@uplus/auth`
- `DATABASE_URL` es la conexion pooled para runtime
- `DIRECT_URL` es para migraciones Prisma

## 2. URLs Reales De Produccion En Vercel

No hay custom domains configurados. Hoy debes usar las `Latest Production URL`.

| Servicio | URL de produccion | Project ID Vercel | Secret GitHub Actions |
| --- | --- | --- | --- |
| `app-auth` | `https://app-auth-uplusrevais-projects.vercel.app` | `prj_68eDgp2kxzvUUZ8PbKuOsS19QzxX` | `VERCEL_PROJECT_ID_APP_AUTH` |
| `app-analysis-service` | `https://app-analysis-service-uplusrevais-projects.vercel.app` | `prj_sBGx9alST08zfhG9bjjODRBDgTyo` | `VERCEL_PROJECT_ID_ANALYSIS` |
| `app-review-service` | `https://app-review-service-uplusrevais-projects.vercel.app` | `prj_CwNH4sM3nlpkWmz5EwhVcTzgSoNL` | `VERCEL_PROJECT_ID_REVIEW` |
| `app-report-service` | `https://app-report-service.vercel.app` | `prj_tb5nIghd3cJUu01U3T4BOX2AMzJN` | `VERCEL_PROJECT_ID_REPORT` |
| `app-surveys-service` | `https://app-surveys-service-uplusrevais-projects.vercel.app` | `prj_5fhTtaPiDXAeWiYrxqFpFPE0Sq9w` | `VERCEL_PROJECT_ID_SURVEYS` |
| `app-frontend` | `https://app-frontend-rho-murex.vercel.app` | `prj_gMCDFbaSoxd3x3CRYWGdHj8MypvP` | `VERCEL_PROJECT_ID_FRONTEND` |

## 3. URLs Locales

Segun el `package.json` raiz:

| Servicio | Puerto local | Base URL |
| --- | --- | --- |
| `app-frontend` | `3000` | `http://localhost:3000` |
| `app-auth` | `3001` | `http://localhost:3001` |
| `app-analysis-service` | `3002` | `http://localhost:3002` |
| `app-review-service` | `3003` | `http://localhost:3003` |
| `app-report-service` | `3004` | `http://localhost:3004` |
| `app-surveys-service` | `3005` | `http://localhost:3005` |
| `app-ai-service` | `8000` | `http://localhost:8000` |

## 4. Variables Por Servicio

### 4.1 Root `.env` local

Usa estas variables para desarrollo local desde la raiz:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
SUPABASE_URL="https://pnsvxtfdakpzaaarcrsd.supabase.co"
SUPABASE_ANON_KEY="<anon-key>"
SUPABASE_SERVICE_ROLE_KEY="<service-role-key>"

AUTH_SERVICE_URL="http://localhost:3001"
ANALYSIS_SERVICE_URL="http://localhost:3002"
REVIEW_SERVICE_URL="http://localhost:3003"
REPORT_SERVICE_URL="http://localhost:3004"
SURVEYS_SERVICE_URL="http://localhost:3005"
AI_SERVICE_URL="http://localhost:8000"
FRONTEND_URL="http://localhost:3000"

NEXT_PUBLIC_AUTH_SERVICE_URL="http://localhost:3001"
NEXT_PUBLIC_REVIEW_SERVICE_URL="http://localhost:3003"
NEXT_PUBLIC_ANALYSIS_SERVICE_URL="http://localhost:3002"
NEXT_PUBLIC_REPORT_SERVICE_URL="http://localhost:3004"
NEXT_PUBLIC_SURVEYS_SERVICE_URL="http://localhost:3005"
```

### 4.2 `app-frontend`

Variables necesarias en Vercel:

```env
NEXT_PUBLIC_AUTH_SERVICE_URL="https://app-auth-uplusrevais-projects.vercel.app"
NEXT_PUBLIC_REVIEW_SERVICE_URL="https://app-review-service-uplusrevais-projects.vercel.app"
NEXT_PUBLIC_ANALYSIS_SERVICE_URL="https://app-analysis-service-uplusrevais-projects.vercel.app"
NEXT_PUBLIC_REPORT_SERVICE_URL="https://app-report-service.vercel.app"
NEXT_PUBLIC_SURVEYS_SERVICE_URL="https://app-surveys-service-uplusrevais-projects.vercel.app"
```

### 4.3 `app-auth`

Variables necesarias en Vercel:

```env
DATABASE_URL="<supabase pooled>"
SUPABASE_URL="https://pnsvxtfdakpzaaarcrsd.supabase.co"
SUPABASE_ANON_KEY="<anon-key>"
SUPABASE_SERVICE_ROLE_KEY="<service-role-key>"
```

### 4.4 `app-review-service`

Variables necesarias en Vercel:

```env
DATABASE_URL="<supabase pooled>"
SUPABASE_URL="https://pnsvxtfdakpzaaarcrsd.supabase.co"
SUPABASE_ANON_KEY="<anon-key>"
```

### 4.5 `app-surveys-service`

Variables necesarias en Vercel:

```env
DATABASE_URL="<supabase pooled>"
SUPABASE_URL="https://pnsvxtfdakpzaaarcrsd.supabase.co"
SUPABASE_ANON_KEY="<anon-key>"
```

### 4.6 `app-report-service`

Variables necesarias en Vercel:

```env
DATABASE_URL="<supabase pooled>"
SUPABASE_URL="https://pnsvxtfdakpzaaarcrsd.supabase.co"
SUPABASE_ANON_KEY="<anon-key>"
```

### 4.7 `app-analysis-service`

Variables necesarias en Vercel:

```env
DATABASE_URL="<supabase pooled>"
SUPABASE_URL="https://pnsvxtfdakpzaaarcrsd.supabase.co"
SUPABASE_ANON_KEY="<anon-key>"

REVIEW_SERVICE_URL="https://app-review-service-uplusrevais-projects.vercel.app"
SURVEYS_SERVICE_URL="https://app-surveys-service-uplusrevais-projects.vercel.app"
REPORT_SERVICE_URL="https://app-report-service.vercel.app"
AI_SERVICE_URL="<url real de app-ai-service>"
```

### 4.8 `app-ai-service` (orquestador)

Si corre local:

```env
APP_NAME="app-ai-service"
APP_ENV="development"
APP_HOST="0.0.0.0"
APP_PORT="8000"

REVIEW_SERVICE_URL="http://localhost:3003"
SURVEYS_SERVICE_URL="http://localhost:3005"
REPORT_SERVICE_URL="http://localhost:3004"

INTERNAL_SERVICE_TOKEN=""
AI_PROVIDER="gemini"
AI_MODEL="gemini-2.5-flash"
AI_API_KEY="<tu-api-key>"
```

Si corre remoto y debe hablar con Vercel:

```env
REVIEW_SERVICE_URL="https://app-review-service-uplusrevais-projects.vercel.app"
SURVEYS_SERVICE_URL="https://app-surveys-service-uplusrevais-projects.vercel.app"
REPORT_SERVICE_URL="https://app-report-service.vercel.app"
```

## 5. Inventario De Endpoints

### 5.1 `app-auth`

Base URL:

- local: `http://localhost:3001`
- prod: `https://app-auth-uplusrevais-projects.vercel.app`

Endpoints:

- `GET /api/auth/session`
- `POST /api/auth/register`
- `POST /api/auth/logout`
- `GET /api/roles`
- `GET /api/endpoints`
- `GET /api/branches`
- `POST /api/branches`
- `GET /api/branches/:id`
- `PATCH /api/branches/:id`
- `DELETE /api/branches/:id`
- `GET /api/businesses/:id/members`
- `POST /api/businesses/:id/members`
- `PATCH /api/businesses/:id/members/:userId`
- `DELETE /api/businesses/:id/members/:userId`
- `GET /api/example`

### 5.2 `app-analysis-service`

Base URL:

- local: `http://localhost:3002`
- prod: `https://app-analysis-service-uplusrevais-projects.vercel.app`

Endpoints:

- `GET /api/dashboard`
- `POST /api/analysis/run`
- `GET /api/analysis/results`
- `GET /api/example`

### 5.3 `app-review-service`

Base URL:

- local: `http://localhost:3003`
- prod: `https://app-review-service-uplusrevais-projects.vercel.app`

Endpoints:

- `GET /api/sync`
- `POST /api/sync`
- `GET /api/sync/:id`
- `GET /api/reviews`
- `GET /api/reviews/:id`
- `DELETE /api/reviews/:id`
- `GET /api/connections`
- `POST /api/connections`
- `GET /api/connections/:id`
- `PATCH /api/connections/:id`
- `DELETE /api/connections/:id`
- `GET /api/internal/reviews`
- `GET /api/example`

### 5.4 `app-report-service`

Base URL:

- local: `http://localhost:3004`
- prod: `https://app-report-service.vercel.app`

Endpoints:

- `GET /api/reports`
- `POST /api/reports`
- `GET /api/reports/:id`
- `GET /api/analysis`
- `POST /api/analysis`
- `GET /api/example`

### 5.5 `app-surveys-service`

Base URL:

- local: `http://localhost:3005`
- prod: `https://app-surveys-service-uplusrevais-projects.vercel.app`

Endpoints:

- `GET /api/surveys`
- `POST /api/surveys`
- `GET /api/surveys/:id`
- `PATCH /api/surveys/:id`
- `DELETE /api/surveys/:id`
- `GET /api/surveys/:id/responses`
- `POST /api/surveys/:id/respond`
- `GET /api/surveys/:id/questions`
- `POST /api/surveys/:id/questions`
- `PATCH /api/surveys/:id/questions/:questionId`
- `DELETE /api/surveys/:id/questions/:questionId`

### 5.6 `app-ai-service`

Base URL:

- local: `http://localhost:8000`
- prod: define tu URL real si lo vas a desplegar fuera de Vercel

Endpoints:

- `GET /health`
- `POST /api/v1/analysis/generate`

## 6. Flujo Entre Servicios (Orquestador)

### Flujo actual esperado

1. `app-frontend` llama a `app-analysis-service`
2. `app-analysis-service` llama a `app-ai-service`
3. `app-ai-service` consume:
   - `app-review-service -> GET /api/internal/reviews`
   - `app-surveys-service -> GET /api/surveys`
   - `app-surveys-service -> GET /api/surveys/:id/responses`
   - `app-report-service -> POST /api/reports`
   - `app-report-service -> POST /api/analysis`
   - `app-report-service -> PATCH /api/reports/:id` esperado por el cliente Python

### Importante sobre auth entre servicios

Hoy los servicios Node NO aceptan un `INTERNAL_SERVICE_TOKEN` propio.

Hoy aceptan un `Authorization: Bearer <supabase-user-jwt>` y validan eso via `@uplus/auth` + `SUPABASE_ANON_KEY`.

Eso significa que el flujo real hoy funciona asi:

1. el frontend o caller manda JWT de usuario a `app-analysis-service`
2. `app-analysis-service` reenvia ese mismo bearer a `app-ai-service`
3. `app-ai-service` reusa ese token para llamar review/surveys/report
4. review/surveys/report lo validan contra Supabase

En otras palabras:

- el orquestador hoy depende del JWT del usuario
- `INTERNAL_SERVICE_TOKEN` hoy no alcanza por si solo para los servicios Node

## 7. Bloqueos Reales Detectados

### Bloqueo 1: falta `PATCH /api/reports/:id`

`app-ai-service` llama:

- `PATCH /api/reports/:id`

Pero hoy `app-report-service/src/app/api/reports/[id]/route.ts` solo expone:

- `GET /api/reports/:id`

Resultado:

- el orquestador no puede cerrar el reporte en `READY` o `FAILED`

### Bloqueo 2: auth interna incompleta

El código Python soporta `INTERNAL_SERVICE_TOKEN`, pero los servicios Node no lo verifican.

Si tu compañero quiere dejar servicio-a-servicio puro, tiene dos caminos:

1. mantener el JWT de usuario end-to-end como está hoy
2. implementar auth interna real en review/report/surveys para aceptar `INTERNAL_SERVICE_TOKEN`

## 8. Qué Debe Quedar Configurado En Vercel

### GitHub Secrets

```txt
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID_APP_AUTH=prj_68eDgp2kxzvUUZ8PbKuOsS19QzxX
VERCEL_PROJECT_ID_ANALYSIS=prj_sBGx9alST08zfhG9bjjODRBDgTyo
VERCEL_PROJECT_ID_REVIEW=prj_CwNH4sM3nlpkWmz5EwhVcTzgSoNL
VERCEL_PROJECT_ID_REPORT=prj_tb5nIghd3cJUu01U3T4BOX2AMzJN
VERCEL_PROJECT_ID_SURVEYS=prj_5fhTtaPiDXAeWiYrxqFpFPE0Sq9w
VERCEL_PROJECT_ID_FRONTEND=prj_gMCDFbaSoxd3x3CRYWGdHj8MypvP
```

### Variables cruzadas para producción

Estas son las que normalmente deben compartirse entre apps:

```txt
AUTH_SERVICE_URL=https://app-auth-uplusrevais-projects.vercel.app
ANALYSIS_SERVICE_URL=https://app-analysis-service-uplusrevais-projects.vercel.app
REVIEW_SERVICE_URL=https://app-review-service-uplusrevais-projects.vercel.app
REPORT_SERVICE_URL=https://app-report-service.vercel.app
SURVEYS_SERVICE_URL=https://app-surveys-service-uplusrevais-projects.vercel.app
FRONTEND_URL=https://app-frontend-rho-murex.vercel.app
AI_SERVICE_URL=<url real donde corra app-ai-service>
```

## 9. Comandos Útiles Que Se Usaron

Para sacar esto desde Vercel CLI:

```bash
npx vercel whoami
npx vercel project ls
npx vercel project inspect app-auth
npx vercel project inspect app-analysis-service
npx vercel project inspect app-review-service
npx vercel project inspect app-report-service
npx vercel project inspect app-surveys-service
npx vercel project inspect app-frontend
```

## 10. Recomendación Operativa

Para dejar todo listo a tu compañero:

1. Cargar en Vercel las variables de Supabase en todos los backends
2. Cargar en `app-frontend` todos los `NEXT_PUBLIC_*`
3. Definir `AI_SERVICE_URL` real en `app-analysis-service`
4. Resolver el `PATCH /api/reports/:id`
5. Decidir si el orquestador seguirá con JWT de usuario o si se implementará auth interna real con `INTERNAL_SERVICE_TOKEN`
