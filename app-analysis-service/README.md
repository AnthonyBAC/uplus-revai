# app-analysis-service (BFF)

Backend For Frontend de U+ Revai. Orquesta las llamadas del frontend hacia los microservicios.

## Responsabilidad

- Recibir peticiones autenticadas desde el frontend
- Agregar datos de reviews, encuestas y reportes para el dashboard
- Exponer módulos separados de insights y mejoras desde `analysis`

## Stack

- Next.js 16 (API routes)
- Supabase Auth (validación JWT vía `@global/auth`)

## Autenticación y permisos

Todas las rutas requieren JWT + RBAC. El BFF reenvía el JWT del usuario a los servicios internos.

| Ruta | Auth | Permiso |
|---|---|---|
| `GET /api/analysis/dashboard` | ✅ JWT+RBAC | ADMIN |
| `GET /api/analysis/reviews` | ✅ JWT+RBAC | ADMIN |
| `GET /api/analysis/insights` | ✅ JWT+RBAC | ADMIN |
| `GET /api/analysis/improvements` | ✅ JWT+RBAC | ADMIN |

## Endpoints

### Módulos

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/analysis/dashboard?businessId=` | Datos agregados de reviews, encuestas y reportes |
| `GET` | `/api/analysis/reviews?businessId=` | Reseñas del negocio vía `review-service` |
| `GET` | `/api/analysis/insights?businessId=` | Tendencias y temas derivados de reseñas y análisis |
| `GET` | `/api/analysis/improvements?businessId=` | Acciones sugeridas derivadas de análisis negativos |

## Flujo

```
Frontend
  │ JWT
  ▼
BFF (app-analysis-service)
  ├── GET /api/analysis/dashboard     ──► review + survey + report (en paralelo)
  ├── GET /api/analysis/reviews       ──► review-service
  ├── GET /api/analysis/insights      ──► review-service + report-service
  └── GET /api/analysis/improvements  ──► review-service + report-service
```
