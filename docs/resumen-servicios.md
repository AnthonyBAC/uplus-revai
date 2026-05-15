# Resumen de Servicios U+ Revai

## Vista general

U+ Revai es un monorepo con frontend, varios servicios backend por dominio, una base de datos PostgreSQL compartida y un servicio de IA en Python.

Flujo principal real hoy:

`app-frontend -> BFF del frontend -> app-auth / app-analysis-service -> otros servicios`

Flujo de analisis:

`app-analysis-service -> app-ai-service -> app-review-service + app-surveys-service -> app-report-service`

## Servicios

| Servicio | Puerto local | Rol real | Consume | Expone | Archivos clave |
| --- | --- | --- | --- | --- | --- |
| `app-frontend` | `3000` | UI web + BFF | `app-auth`, `app-analysis-service` | paginas Next.js y proxy `/api/*` | `app-frontend/src/app/page.tsx`, `app-frontend/src/app/api/[...service]/route.ts` |
| `app-auth` | `3001` | autenticacion, sesion, RBAC, negocios, miembros, sucursales | Supabase Auth, PostgreSQL | endpoints de auth y administracion | `app-auth/src/lib/auth.ts`, `app-auth/src/lib/permissions.ts` |
| `app-analysis-service` | `3002` | orquestador de dashboard y disparador de IA | `review`, `surveys`, `report`, `ai` | endpoints `/api/analysis/*` | `app-analysis-service/src/app/api/analysis/dashboard/route.ts`, `app-analysis-service/src/app/api/analysis/run/route.ts` |
| `app-review-service` | `3003` | conexiones de plataformas, reseñas y jobs de sync | PostgreSQL | endpoints de reviews, connections y sync | `app-review-service/src/app/api/reviews/route.ts`, `app-review-service/src/app/api/connections/route.ts` |
| `app-report-service` | `3004` | persistencia de analisis y reportes | PostgreSQL | endpoints `/api/analysis` y `/api/reports` | `app-report-service/src/app/api/analysis/route.ts`, `app-report-service/src/app/api/reports/route.ts` |
| `app-surveys-service` | `3005` | encuestas internas y respuestas | PostgreSQL | endpoints `/api/surveys/*` | `app-surveys-service/src/app/api/surveys/route.ts`, `app-surveys-service/src/app/api/surveys/[id]/respond/route.ts` |
| `app-ai-service` | `8000` | pipeline interno de IA | `review`, `surveys`, `report` | `POST /api/v1/analysis/generate` | `app-ai-service/src/api/routes/analysis.py`, `app-ai-service/src/services/analysis_service.py` |
| `packages/auth` | n/a | auth compartida entre servicios | Supabase Auth, PostgreSQL | helpers `requireAuth`, `requireBusinessAccess`, `requireEndpointPermission` | `packages/auth/src/index.ts` |
| `packages/db` | n/a | Prisma client y schema global | PostgreSQL | cliente `prisma` compartido | `packages/db/src/index.ts`, `packages/db/prisma/schema.prisma` |

## Cual es el orquestador

Hay 2 capas de orquestacion:

| Capa | Servicio | Que orquesta |
| --- | --- | --- |
| Orquestador de frontend/dashboard | `app-analysis-service` | agrega datos de reviews, surveys y reports; tambien dispara el servicio de IA |
| Orquestador del pipeline IA | `app-ai-service` | junta reviews + respuestas de encuestas, ejecuta el LLM y publica resultados en reportes |

Si hay que nombrar uno como orquestador principal de negocio visible para el frontend, hoy es `app-analysis-service`.

Archivos donde se ve:

- `app-analysis-service/src/app/api/analysis/dashboard/route.ts`
- `app-analysis-service/src/app/api/analysis/run/route.ts`
- `app-ai-service/src/services/analysis_service.py`

## Como estan conectados

| Origen | Destino | Como se conectan | Donde se ve |
| --- | --- | --- | --- |
| `app-frontend` | `app-auth` | via BFF del frontend | `app-frontend/src/app/api/[...service]/route.ts` |
| `app-frontend` | `app-analysis-service` | via BFF del frontend | `app-frontend/src/app/api/[...service]/route.ts` |
| `app-analysis-service` | `app-review-service` | HTTP interno | `app-analysis-service/src/app/api/analysis/dashboard/route.ts` |
| `app-analysis-service` | `app-surveys-service` | HTTP interno | `app-analysis-service/src/app/api/analysis/dashboard/route.ts` |
| `app-analysis-service` | `app-report-service` | HTTP interno | `app-analysis-service/src/app/api/analysis/dashboard/route.ts`, `app-analysis-service/src/app/api/analysis/results/route.ts` |
| `app-analysis-service` | `app-ai-service` | HTTP interno | `app-analysis-service/src/app/api/analysis/run/route.ts` |
| `app-ai-service` | `app-review-service` | HTTP interno | `app-ai-service/src/services/review_client.py` |
| `app-ai-service` | `app-surveys-service` | HTTP interno | `app-ai-service/src/services/survey_client.py` |
| `app-ai-service` | `app-report-service` | HTTP interno | `app-ai-service/src/services/report_client.py` |
| `app-auth`, `review`, `report`, `surveys`, `analysis` | PostgreSQL | Prisma compartido con `@uplus/db` | `packages/db/src/index.ts` |
| `app-auth` y `@uplus/auth` | Supabase Auth | validacion de usuario y tokens | `app-auth/src/lib/supabase.ts`, `packages/auth/src/index.ts` |

## Donde esta el BFF

El BFF esta en:

`app-frontend/src/app/api/[...service]/route.ts`

Ese archivo:

- construye el mapa de rutas con `AUTH_SERVICE_URL` y `ANALYSIS_SERVICE_URL`
- detecta el prefijo de la ruta
- reenvia headers y body al servicio correcto
- devuelve la respuesta del servicio al navegador

Hoy ese proxy solo enruta a:

- `app-auth`: `/api/auth/*`, `/api/roles`, `/api/branches`, `/api/businesses`, `/api/endpoints`
- `app-analysis-service`: `/api/analysis/*`

Importante: hoy el frontend no enruta directo por BFF a `review`, `report` ni `surveys`.

## Que consume el frontend

### Consumo real hoy

| Pantalla o flujo | Que consume | Archivo donde se usa |
| --- | --- | --- |
| Login | `POST /api/auth/login` | `app-frontend/src/app/login/LoginForm.tsx`, `app-frontend/src/lib/auth-client.ts` |
| Registro | `POST /api/auth/signup` | `app-frontend/src/app/register/RegisterForm.tsx`, `app-frontend/src/lib/auth-client.ts` |
| Recuperacion | `POST /api/auth/forgot-password`, `POST /api/auth/reset-password` | `app-frontend/src/app/forgot-password/ForgotPasswordForm.tsx`, `app-frontend/src/app/reset-password/ResetPasswordForm.tsx`, `app-frontend/src/lib/auth-client.ts` |
| Sesion | `GET /api/auth/session`, `POST /api/auth/refresh`, `POST /api/auth/logout` | `app-frontend/src/hooks/useSession.ts`, `app-frontend/src/services/http/client.ts`, `app-frontend/src/components/dashboard/shell/Topbar.tsx` |
| Onboarding del negocio | `POST /api/auth/register` | `app-frontend/src/app/onboarding/page.tsx`, `app-frontend/src/lib/auth-client.ts` |
| Dashboard resumen | `GET /api/analysis/dashboard?businessId=...` | `app-frontend/src/app/dashboard/page.tsx`, `app-frontend/src/hooks/useDashboard.ts`, `app-frontend/src/services/analysis/dashboard.ts` |
| Dashboard resenas | `GET /api/analysis/reviews?businessId=...` | `app-frontend/src/app/dashboard/resenas/page.tsx`, `app-frontend/src/hooks/useReviews.ts`, `app-frontend/src/services/analysis/reviews.ts` |

### Estructura real del frontend

| Capa | Responsabilidad | Archivos |
| --- | --- | --- |
| Layout global | fuentes, metadata y `globals.css` | `app-frontend/src/app/layout.tsx` |
| Landing | home publica del producto | `app-frontend/src/app/page.tsx`, `app-frontend/src/components/landing/*` |
| Auth UI | pantallas de login, register, forgot, reset, onboarding | `app-frontend/src/app/login/*`, `app-frontend/src/app/register/*`, `app-frontend/src/app/forgot-password/*`, `app-frontend/src/app/reset-password/*`, `app-frontend/src/app/onboarding/page.tsx` |
| Dashboard layout | proteccion de ruta, sesion y shell interna | `app-frontend/src/app/dashboard/layout.tsx` |
| Dashboard shell | sidebar, topbar, toast, estructura principal | `app-frontend/src/components/dashboard/shell/*` |
| Screens | vistas de resumen, reseñas, insights, mejoras y local | `app-frontend/src/components/dashboard/screens/*` |
| UI base | `Card`, `Btn`, `Badge`, `Kpi`, `Field` | `app-frontend/src/components/dashboard/ui/*` |
| Primitives | iconos y piezas simples | `app-frontend/src/components/dashboard/primitives/*` |
| Estado y consumo | hooks, session storage y cliente HTTP | `app-frontend/src/hooks/*`, `app-frontend/src/lib/*`, `app-frontend/src/services/*` |

### Componentes principales del frontend

| Componente | Funcion | Como se usa |
| --- | --- | --- |
| `PageShell` | layout base de marketing con header/main/footer | lo usa `app-frontend/src/app/page.tsx` |
| `SiteHeader` | header de marketing o modo simple | lo usa `app-frontend/src/app/page.tsx` |
| `SiteFooter` | footer publico | lo usa `app-frontend/src/app/page.tsx` |
| `MainContent` | arma la landing con hero + preview + barra inferior | lo usa `app-frontend/src/app/page.tsx` |
| `HeroSection` | mensaje principal y CTAs | lo usa `app-frontend/src/components/landing/MainContent.tsx` |
| `DashboardPreview` | preview visual mock del producto | lo usa `app-frontend/src/components/landing/MainContent.tsx` |
| `AuthLayout` | layout compartido de pantallas de auth | lo usan `LoginForm`, `RegisterForm`, `OnboardingPage` |
| `DashboardShell` | cascaron interno del dashboard | lo usa `app-frontend/src/app/dashboard/layout.tsx` |
| `Sidebar` | navegacion lateral del dashboard | lo usa `DashboardShell` |
| `Topbar` | breadcrumb, selector de negocio, logout, notificaciones | lo usa `DashboardShell` |
| `ResumenScreen` | renderiza KPIs, reseñas recientes y reportes | la usa `app-frontend/src/app/dashboard/page.tsx` |
| `ResenasScreen` | renderiza filtros y listado de reseñas | la usa `app-frontend/src/app/dashboard/resenas/page.tsx` |
| `InsightsScreen` | vista de insights, hoy sin data real | la usa `app-frontend/src/app/dashboard/insights/page.tsx` |
| `MejorasScreen` | vista de acciones sugeridas, hoy local/mock | la usa `app-frontend/src/app/dashboard/mejoras/page.tsx` |
| `LocalScreen` | vista de datos del local, integraciones y equipo | la usa `app-frontend/src/app/dashboard/local/page.tsx` |
| `ReviewCard` | tarjeta de reseña reutilizable | la usan `ResumenScreen` y `ResenasScreen` |

### Como se utiliza el frontend internamente

1. `app-frontend/src/app/layout.tsx` monta fuentes, metadata y estilos globales.
2. `app-frontend/src/app/page.tsx` arma la home publica usando `PageShell`, `SiteHeader`, `MainContent` y `SiteFooter`.
3. Login y register usan `AuthLayout` para compartir estructura visual.
4. `app-frontend/src/app/dashboard/layout.tsx` valida sesion con `useSession`.
5. Si la sesion es valida, monta `BusinessProvider` y luego `DashboardShell`.
6. Cada pagina del dashboard consume un hook especifico y pasa la data a una screen presentacional.
7. Las screens usan componentes UI chicos como `Card`, `Btn`, `Kpi`, `Badge` y `ReviewCard`.

### Hooks y estado del frontend

| Hook o pieza | Funcion | Archivo |
| --- | --- | --- |
| `useSession` | carga la sesion actual y refresca token si vence | `app-frontend/src/hooks/useSession.ts` |
| `useDashboard` | consulta resumen agregado del dashboard | `app-frontend/src/hooks/useDashboard.ts` |
| `useReviews` | consulta reseñas del dashboard | `app-frontend/src/hooks/useReviews.ts` |
| `BusinessContext` | guarda el `businessId` activo en `localStorage` | `app-frontend/src/components/dashboard/BusinessContext.tsx` |
| `lib/session.ts` | guarda `accessToken` y `refreshToken` en `localStorage` | `app-frontend/src/lib/session.ts` |
| `services/http/client.ts` | cliente HTTP comun con retry por refresh | `app-frontend/src/services/http/client.ts` |

### Libs y clientes internos que usa el frontend

| Lib o cliente | Para que sirve | Archivo |
| --- | --- | --- |
| `auth-client` | cliente de auth del frontend; concentra `login`, `signup`, `logout`, `getSession`, `refresh`, `registerBusiness`, `forgotPassword`, `resetPassword` y updates de cuenta | `app-frontend/src/lib/auth-client.ts` |
| `session` | wrapper de `localStorage` para persistir `accessToken` y `refreshToken` | `app-frontend/src/lib/session.ts` |
| `services/http/client` | `apiFetch` con header `Authorization` automatico y retry cuando recibe `401` | `app-frontend/src/services/http/client.ts` |
| `services/analysis/dashboard` | cliente especifico del dashboard resumen | `app-frontend/src/services/analysis/dashboard.ts` |
| `services/analysis/reviews` | cliente especifico del dashboard de reseñas | `app-frontend/src/services/analysis/reviews.ts` |
| `api/client` | cliente alternativo generico con `NEXT_PUBLIC_API_URL`; parece legado o poco usado en el flujo principal | `app-frontend/src/api/client.ts` |
| `api/analysis` | cliente alternativo para analisis; no es el que usan hoy las pantallas principales | `app-frontend/src/api/analysis.ts` |
| `api/reviews` | cliente alternativo para reviews; no es el que usan hoy las pantallas principales | `app-frontend/src/api/reviews.ts` |

### Como se conectan esas libs en el frontend

1. `LoginForm` llama `login()` desde `app-frontend/src/lib/auth-client.ts`.
2. `auth-client` pega al BFF del frontend en rutas `/api/auth/*`.
3. Al autenticarse, `app-frontend/src/lib/session.ts` guarda tokens en `localStorage`.
4. `app-frontend/src/hooks/useSession.ts` usa `getSession()` y `refresh()` desde `auth-client`.
5. `app-frontend/src/services/http/client.ts` toma el token desde `session.ts` y lo manda en cada request.
6. `useDashboard` y `useReviews` usan `services/analysis/*`, que a su vez usan `services/http/client.ts`.
7. Ese cliente pega al BFF `app-frontend/src/app/api/[...service]/route.ts`, que reenvia la request a `app-auth` o `app-analysis-service`.

### Hooks que aun no estan realmente conectados al backend

| Hook o pantalla | Estado real | Archivo |
| --- | --- | --- |
| `useInsights` | placeholder, devuelve `null` | `app-frontend/src/hooks/useInsights.ts` |
| `useActions` | solo estado local en memoria | `app-frontend/src/hooks/useActions.ts` |
| `useLocal` | datos locales/mock en memoria | `app-frontend/src/hooks/useLocal.ts` |
| `src/api/analysis.ts` y `src/api/reviews.ts` | parecen cliente viejo, no son los que usan las pantallas principales | `app-frontend/src/api/analysis.ts`, `app-frontend/src/api/reviews.ts` |

## Librerias y stack del frontend

Frontend usa principalmente:

- `Next.js 16`
- `React 19`
- `antd`
- `lucide-react`
- `motion`

Se ve en:

- `app-frontend/package.json`
- `app-frontend/src/app/layout.tsx`
- `app-frontend/src/components/auth/AuthLayout.tsx`
- `app-frontend/src/components/landing/HeroSection.tsx`

En practica, el frontend trabaja con hooks propios, `fetch`, `localStorage` y el BFF interno; no hay un cliente global tipo React Query o Redux.

## Auth y seguridad

Esta es la parte mas importante del proyecto hoy.

### Como funciona la autenticacion

1. El usuario hace `signup` o `login` contra `app-auth`.
2. `app-auth` usa Supabase Auth para crear o validar la sesion.
3. Con el JWT, el backend consulta Supabase `auth.getUser(token)`.
4. Luego busca al usuario interno en `app_users` por email.
5. Desde ahi arma el contexto de membresias por negocio, rol y sucursales.

Archivos:

- `app-auth/src/app/api/auth/signup/route.ts`
- `app-auth/src/app/api/auth/login/route.ts`
- `app-auth/src/app/api/auth/session/route.ts`
- `app-auth/src/lib/auth.ts`
- `app-auth/src/lib/supabase.ts`
- `packages/auth/src/index.ts`

### Como funciona la autorizacion

1. Se valida que el usuario pertenezca al `businessId` con `business_memberships`.
2. Se obtiene el rol (`ADMIN` o `TRABAJADOR`).
3. Se valida permiso por endpoint en `role_endpoint_permissions` + `endpoints`.
4. Si corresponde, se limita el acceso por sucursal con `user_branch_accesses`.

Archivos:

- `app-auth/src/lib/permissions.ts`
- `packages/auth/src/index.ts`
- `seed.ts`

### Que protege a cada servicio

Los servicios `analysis`, `review`, `report` y `surveys` usan helpers compartidos de `@uplus/auth`:

- `requireAuth`
- `requireBusinessAccess`
- `requireEndpointPermission`

### Seguridad real hoy

- El `SUPABASE_SERVICE_ROLE_KEY` solo se usa en backend, sobre todo en `app-auth`.
- El frontend guarda `accessToken` y `refreshToken` en `localStorage`.
- El BFF del frontend reenvia el header `Authorization` al backend.
- Las llamadas entre servicios, en la practica, usan el JWT del usuario final reenviado entre servicios.
- Existe `INTERNAL_SERVICE_TOKEN` en configuracion, pero el flujo actual de codigo no depende de el.

## APIs que utiliza el proyecto

### APIs realmente integradas hoy

| API | Uso real |
| --- | --- |
| Supabase Auth API | login, signup, refresh, logout, reset password, validacion JWT. Se ve en `app-auth/src/lib/supabase.ts` y `packages/auth/src/index.ts` |
| APIs internas HTTP entre servicios | comunicacion entre frontend, analysis, ai, review, surveys y report. Se ve en `app-frontend/src/app/api/[...service]/route.ts`, `app-analysis-service/src/app/api/analysis/*`, `app-ai-service/src/services/*` |

### APIs previstas o modeladas, pero no implementadas completamente hoy

| API | Estado real |
| --- | --- |
| Google Business Profile API | modelada en `packages/db/prisma/schema.prisma` y validaciones de `app-review-service/src/lib/validations/review.ts`, pero no vi cliente real de Google ni sync real aun |
| Gemini / OpenAI / Anthropic | configuradas en `app-ai-service/src/core/config.py`, pero el proveedor real no esta implementado; hoy se usa `app-ai-service/src/services/llm/mock.py` via `app-ai-service/src/services/llm/factory.py` |

## Endpoints disponibles

### app-auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/session`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `POST /api/auth/register`
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

### app-analysis-service

- `GET /api/analysis/dashboard`
- `GET /api/analysis/reviews`
- `GET /api/analysis/results`
- `POST /api/analysis/run`

### app-review-service

- `GET /api/reviews`
- `GET /api/reviews/:id`
- `DELETE /api/reviews/:id`
- `GET /api/connections`
- `POST /api/connections`
- `GET /api/connections/:id`
- `PATCH /api/connections/:id`
- `DELETE /api/connections/:id`
- `GET /api/sync`
- `POST /api/sync`
- `GET /api/sync/:id`
- `GET /api/internal/reviews`

### app-surveys-service

- `GET /api/surveys`
- `POST /api/surveys`
- `GET /api/surveys/:id`
- `PATCH /api/surveys/:id`
- `DELETE /api/surveys/:id`
- `GET /api/surveys/:id/questions`
- `POST /api/surveys/:id/questions`
- `PATCH /api/surveys/:id/questions/:questionId`
- `DELETE /api/surveys/:id/questions/:questionId`
- `POST /api/surveys/:id/respond`
- `GET /api/surveys/:id/responses`

### app-report-service

- `GET /api/analysis`
- `POST /api/analysis`
- `GET /api/reports`
- `POST /api/reports`
- `GET /api/reports/:id`

### app-ai-service

- `GET /health`
- `POST /api/v1/analysis/generate`

## Tablas y como estan conectadas

### Auth y multi-tenant

| Tabla | Se conecta con |
| --- | --- |
| `app_users` | `business_memberships`, `user_branch_accesses`, `survey_responses` |
| `businesses` | `branches`, `business_memberships` |
| `branches` | `businesses`, `user_branch_accesses` |
| `roles` | `business_memberships`, `role_endpoint_permissions` |
| `endpoints` | `role_endpoint_permissions` |
| `business_memberships` | `app_users`, `businesses`, `roles`, `user_branch_accesses` |
| `user_branch_accesses` | `business_memberships`, `branches`, `app_users` |

Relacion simple:

`app_users -> business_memberships -> businesses -> branches`

`business_memberships -> roles -> role_endpoint_permissions -> endpoints`

`business_memberships -> user_branch_accesses -> branches`

### Surveys

| Tabla | Se conecta con |
| --- | --- |
| `surveys` | `survey_questions`, `survey_responses` |
| `survey_questions` | `surveys`, `survey_answers` |
| `survey_responses` | `surveys`, `survey_answers`, `app_users` por `capturedByUserId` |
| `survey_answers` | `survey_responses`, `survey_questions` |

### Reviews

| Tabla | Se conecta con |
| --- | --- |
| `business_platform_connections` | `reviews`, `review_sync_jobs` |
| `reviews` | `business_platform_connections` |
| `review_sync_jobs` | `business_platform_connections` |

### Analisis y reportes

| Tabla | Se conecta con |
| --- | --- |
| `analysis_results` | relacion logica por `businessId`, `branchId`, `sourceType`, `sourceId` |
| `reports` | relacion logica por `businessId` y `branchId` |

Importante: `analysis_results` y `reports` estan conectadas por claves de negocio y periodo a nivel de aplicacion; no vi relaciones Prisma directas entre esas tablas y `reviews` o `survey_responses`.

## Como funciona el proyecto en realidad

1. El usuario entra por `app-frontend`.
2. El frontend llama a `app-auth` por el BFF para login, sesion y onboarding.
3. El frontend guarda tokens y contexto activo del negocio en `localStorage`.
4. Para dashboard, el frontend consume `app-analysis-service` por el BFF.
5. `app-analysis-service` valida auth/RBAC y luego consulta `review`, `surveys` y `report`.
6. Si se pide correr analisis, `app-analysis-service` llama a `app-ai-service`.
7. `app-ai-service` obtiene reviews internas y respuestas de encuestas, analiza cada item y publica resultados en `app-report-service`.
8. Luego el frontend consulta esos resultados a traves de `app-analysis-service`.

Archivos del flujo:

- frontend: `app-frontend/src/app/dashboard/page.tsx`, `app-frontend/src/services/analysis/dashboard.ts`
- BFF: `app-frontend/src/app/api/[...service]/route.ts`
- auth: `app-auth/src/app/api/auth/session/route.ts`
- analysis: `app-analysis-service/src/app/api/analysis/dashboard/route.ts`, `app-analysis-service/src/app/api/analysis/run/route.ts`
- ai: `app-ai-service/src/services/analysis_service.py`
- reviews: `app-review-service/src/app/api/internal/reviews/route.ts`
- surveys: `app-surveys-service/src/app/api/surveys/route.ts`, `app-surveys-service/src/app/api/surveys/[id]/responses/route.ts`
- reports: `app-report-service/src/app/api/analysis/route.ts`, `app-report-service/src/app/api/reports/route.ts`

## Observaciones importantes del estado actual

- El BFF del frontend hoy solo cubre `auth` y `analysis`.
- El dashboard actual consume solo auth + analysis; no vi pantallas principales consumiendo `review`, `report` o `surveys` directo.
- `useInsights`, `useActions` y `useLocal` aun no representan integracion backend real.
- `app-ai-service` hoy funciona con proveedor mock si no hay `AI_API_KEY`.
- El codigo de `app-ai-service` intenta hacer `PATCH /api/reports/:id`, pero en `app-report-service` no vi ese endpoint implementado.
- El frontend de settings intenta usar `/api/auth/profile`, `/api/auth/email` y `/api/auth/password`, pero esos endpoints no existen hoy en `app-auth` ni en el BFF.
- La integracion real con Google Reviews todavia parece incompleta: existe el modelo de conexiones y sync, pero no el cliente de Google en el codigo revisado.
