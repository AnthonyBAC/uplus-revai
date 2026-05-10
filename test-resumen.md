# Test Resumen — U+ Revai

**47 tests** en 5 servicios. Framework: Vitest con `vitest.config.ts` global.

---

## `app-auth` — 10 tests

Archivos: `src/__tests__/roles.test.ts`, `endpoints.test.ts`, `session.test.ts`, `members.test.ts`

### Roles

| # | Test | Verifica | Respuesta esperada |
|---|---|---|---|
| 1 | debe retornar la lista de roles con can_login=true | Prisma devuelve roles activos | `200` — array con `[{ name: "ADMIN", description: "Dueño" }, ...]` |
| 2 | debe retornar 500 si prisma falla | Error de base de datos capturado | `500` — `{ error: "DB error" }` |

### Endpoints

| # | Test | Verifica | Respuesta esperada |
|---|---|---|---|
| 3 | debe retornar endpoints con sus roles permitidos | Prisma devuelve endpoints + permisos anidados | `200` — array con `[{ key: "surveys.list", allowedRoles: ["ADMIN", "TRABAJADOR"] }]` |
| 4 | debe retornar 500 si prisma falla | Error de base de datos capturado | `500` — `{ error: "DB error" }` |

### Session

| # | Test | Verifica | Respuesta esperada |
|---|---|---|---|
| 5 | debe retornar la sesión del usuario autenticado | `requireAuth` mock retorna `AuthContext` | `200` — `{ userId: "user-1", email: "test@test.com", memberships: [...] }` |
| 6 | debe retornar 401 si el token es inválido | `requireAuth` lanza error con status 401 | `401` — `{ error: "Token inválido" }` |

### Members

| # | Test | Verifica | Respuesta esperada |
|---|---|---|---|
| 7 | GET — debe retornar la lista de miembros | `business_memberships.findMany` retorna miembros del negocio | `200` — array con `[{ email: "user@test.com", role: "ADMIN" }]` |
| 8 | GET — debe retornar 500 si prisma falla | Error de base de datos capturado | `500` — `{ error: "DB error" }` |
| 9 | POST — debe crear un trabajador y retornar 201 | Supabase Admin API mock crea usuario + `$transaction` crea `app_users` + `business_memberships` | `201` — `{ email: "worker@test.com", role: "TRABAJADOR" }` |
| 10 | POST — debe retornar 400 si falta email | Validación manual (`!body.email \|\| !body.fullName`) | `400` — `{ error: "email y fullName son requeridos" }` |

---

## `app-surveys-service` — 15 tests

Archivos: `src/__tests__/surveys.test.ts`, `surveyById.test.ts`, `questions.test.ts`, `respond.test.ts`

### Surveys (list + create)

| # | Test | Verifica | Respuesta esperada |
|---|---|---|---|
| 1 | GET — debe retornar 400 si falta businessId | Validación manual | `400` — `{ error: "businessId es requerido" }` |
| 2 | GET — debe retornar surveys con preguntas | `survey.findMany` con `include: { questions }` | `200` — array con `[{ title: "Encuesta 1", questions: [] }]` |
| 3 | GET — debe retornar 401 si auth falla | `requireAuth` lanza error 401 | `401` — `{ error: "Token inválido" }` |
| 4 | POST — debe crear una encuesta con preguntas | `survey.create` con `questions.create` anidado | `201` — `{ title: "Nueva", questions: [...] }` |
| 5 | POST — debe retornar 422 si falta título | Zod `CreateSurveySchema` rechaza `title: ""` | `422` — `{ error: { fieldErrors: { title: ["El título es requerido"] } } }` |

### Survey by ID

| # | Test | Verifica | Respuesta esperada |
|---|---|---|---|
| 6 | GET — debe retornar la encuesta con preguntas | `survey.findUnique` con `include: { questions }` | `200` — `{ title: "Encuesta 1", questions: [...] }` |
| 7 | GET — debe retornar 404 si no existe | `survey.findUnique` retorna `null` | `404` — `{ error: "Encuesta no encontrada" }` |
| 8 | PATCH — debe actualizar el título | `survey.update` aplica `{ title: "Actualizado" }` | `200` — `{ title: "Actualizado" }` |
| 9 | PATCH — debe retornar 404 si no existe | `survey.findUnique` retorna `null` | `404` — `{ error: "Encuesta no encontrada" }` |
| 10 | DELETE — debe eliminar la encuesta | `survey.delete` ejecutado | `204` — sin body |

### Questions

| # | Test | Verifica | Respuesta esperada |
|---|---|---|---|
| 11 | GET — debe listar preguntas | `surveyQuestion.findMany` por `surveyId` | `200` — array con `[{ text: "¿Cómo?", type: "TEXT", order: 1 }]` |
| 12 | POST — debe crear una pregunta | `surveyQuestion.create` con `text`, `type`, `order` | `201` — `{ text: "Nueva pregunta", type: "RATING", order: 2 }` |

### Respond

| # | Test | Verifica | Respuesta esperada |
|---|---|---|---|
| 13 | POST — debe registrar respuesta con capturedByUserId del token | `surveyResponse.create` recibe `capturedByUserId` desde `auth.appUserId` | `201` — `{ capturedByUserId: "user-1", answers: [...] }` |
| 14 | POST — debe retornar 409 si la encuesta no está activa | `survey.isActive === false` | `409` — `{ error: "Esta encuesta no está activa" }` |
| 15 | POST — debe retornar 404 si la encuesta no existe | `survey.findUnique` retorna `null` | `404` — `{ error: "Encuesta no encontrada" }` |

---

## `app-review-service` — 8 tests

Archivo: `src/__tests__/routes.test.ts`

### Routes

| # | Test | Verifica | Respuesta esperada |
|---|---|---|---|
| 1 | GET /reviews — debe retornar reviews filtradas | `review.findMany` con filtros por `businessId`, `rating`, etc. | `200` — array con `[{ content: "Bueno", rating: 5 }]` |
| 2 | GET /reviews — debe retornar 400 si validación falla | Zod `ListReviewsQuerySchema` rechaza sin `businessId` | `400` — `{ error: { fieldErrors: { businessId: [...] } } }` |
| 3 | GET /connections — debe retornar conexiones | `businessPlatformConnection.findMany` por `businessId` | `200` — array (vacío o con datos) |
| 4 | GET /connections — debe retornar 400 sin businessId | Validación manual | `400` — `{ error: "businessId es requerido" }` |
| 5 | POST /connections — debe crear conexión | `businessPlatformConnection.create` con datos de Google | `201` — `{ id: "c1" }` |
| 6 | GET /sync — debe retornar jobs | `reviewSyncJob.findMany` por `businessId`, últimos 20 | `200` — array |
| 7 | GET /sync — debe retornar 400 sin businessId | Validación manual | `400` — `{ error: "businessId es requerido" }` |
| 8 | POST /sync — debe crear job de sync | `reviewSyncJob.create` con `connectionId` y `triggeredBy` = `auth.appUserId` | `201` — `{ id: "job1", status: "PENDING" }` |

---

## `app-report-service` — 8 tests

Archivo: `src/__tests__/routes.test.ts`

### Routes

| # | Test | Verifica | Respuesta esperada |
|---|---|---|---|
| 1 | GET /analysis — debe retornar resultados de análisis | `analysisResult.findMany` con filtros por `businessId`, `sourceType`, `sentiment` | `200` — array con `[{ summary: "Resumen" }]` |
| 2 | GET /analysis — debe retornar 400 si falta businessId | Zod `ListAnalysisQuerySchema` rechaza sin `businessId` | `400` — `{ error: { fieldErrors: { businessId: [...] } } }` |
| 3 | POST /analysis — debe crear analysis result | `analysisResult.create` con `sourceType`, `sentiment`, `summary`, `keywords` | `201` — `{ id: "a-new" }` |
| 4 | GET /reports — debe retornar reportes | `report.findMany` por `businessId`, `branchId`, `status` | `200` — array con `[{ title: "Reporte Q1" }]` |
| 5 | GET /reports — debe retornar 400 sin businessId | Zod rechaza | `400` — error de validación |
| 6 | POST /reports — debe crear reporte | `report.create` con `title`, `periodStart`, `periodEnd` | `201` — `{ title: "Reporte Mayo" }` |
| 7 | GET /reports/:id — debe retornar reporte por ID | `report.findUnique` retorna el reporte | `200` — `{ title: "Reporte" }` |
| 8 | GET /reports/:id — debe retornar 404 si no existe | `report.findUnique` retorna `null` | `404` — `{ error: "Reporte no encontrado" }` |

---

## `app-analysis-service` (BFF) — 6 tests

Archivo: `src/__tests__/routes.test.ts`

### Routes

| # | Test | Verifica | Respuesta esperada |
|---|---|---|---|
| 1 | POST /analysis/run — debe orquestar análisis y retornar resultado de IA | `fetch` mock simula `POST /api/v1/analysis/generate` del AI service | `200` — `{ ok: true, itemsAnalyzed: 10 }` |
| 2 | POST /analysis/run — debe retornar 400 si falta businessId | Validación manual | `400` — `{ error: "businessId es requerido" }` |
| 3 | POST /analysis/run — debe retornar error si IA falla | `fetch` mock retorna `ok: false` con status 500 | `500` — `{ error: "Error del servicio IA: Internal error" }` |
| 4 | GET /analysis/results — debe consultar resultados desde report-service | `fetch` mock simula `GET /api/analysis?businessId=` | `200` — array con `[{ summary: "Resumen" }]` |
| 5 | GET /dashboard — debe agregar datos de reviews, surveys y reports | 3 llamadas `fetch` en `Promise.all` | `200` — `{ reviews: 1, surveys: 1, reports: 1 }` |
| 6 | GET /dashboard — debe retornar 400 si falta businessId | Validación manual | `400` — `{ error: "businessId es requerido" }` |
