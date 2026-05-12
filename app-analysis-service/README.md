# app-analysis-service (BFF)

Backend For Frontend de U+ Revai. Orquesta las llamadas del frontend hacia los microservicios y el motor de IA.

## Responsabilidad

- Recibir peticiones autenticadas desde el frontend
- Orquestar análisis: enviar datos al motor de IA y reenviar resultados a reportes
- Consultar resultados de análisis desde `app-report-service`
- Agregar datos de reviews, encuestas y reportes para el dashboard

## Stack

- Next.js 16 (API routes)
- Supabase Auth (validación JWT vía `@global/auth`)

## Autenticación y permisos

Todas las rutas requieren JWT + RBAC. El BFF reenvía el JWT del usuario a los servicios internos.

| Ruta | Auth | Permiso |
|---|---|---|
| `POST /api/analysis/run` | ✅ JWT+RBAC | ADMIN |
| `GET /api/analysis/results` | ✅ JWT+RBAC | ADMIN |
| `GET /api/dashboard` | ✅ JWT+RBAC | ADMIN |

## Endpoints

### Análisis

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/analysis/run` | Ejecutar análisis completo vía `app-ai-service` |
| `GET` | `/api/analysis/results?businessId=` | Consultar resultados desde `app-report-service` |

### Dashboard

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/dashboard?businessId=` | Datos agregados de reviews, encuestas y reportes |

## Flujo

```
Frontend
  │ JWT
  ▼
BFF (app-analysis-service)
  ├── POST /api/analysis/run  ──► app-ai-service (FastAPI :8000)
  │                                ├── GET  /api/internal/reviews  (review-service)
  │                                ├── GET  /api/surveys           (survey-service)
  │                                ├── IA (Gemini)
  │                                └── POST /api/reports + analysis (report-service)
  │
  ├── GET /api/analysis/results ──► app-report-service
  │
  └── GET /api/dashboard ──► review + survey + report (en paralelo)
```
