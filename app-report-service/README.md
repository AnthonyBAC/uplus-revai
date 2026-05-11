# app-report-service

Servicio de reportes y análisis de U+ Revai. Almacena resultados de análisis generados por el motor de IA y construye reportes ejecutivos por negocio y período.

## Responsabilidad

- Almacenar resultados de análisis (`AnalysisResult`) generados por `app-ai-service`
- Construir reportes ejecutivos (`Report`) con período definido
- Exponer análisis y reportes para consulta desde el dashboard

## Stack

- Next.js 16 (API routes)
- PostgreSQL + Prisma
- Supabase Auth (validación JWT vía `@global/auth`)

## Autenticación y permisos

Todas las rutas requieren JWT + RBAC:

```
requireAuth → valida JWT Supabase → appUserId
requireBusinessAccess → verifica membresía activa en el negocio
requireEndpointPermission → consulta role_endpoint_permissions
```

| Ruta | Auth | ¿Quién puede? |
|---|---|---|
| `GET /api/analysis` | ✅ JWT | Solo ADMIN |
| `POST /api/analysis` | ✅ JWT | Solo ADMIN |
| `GET /api/reports` | ✅ JWT | Solo ADMIN |
| `POST /api/reports` | ✅ JWT | Solo ADMIN |
| `GET /api/reports/:id` | ✅ JWT | Solo ADMIN |

## Endpoints

### Análisis

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/analysis?businessId=` | Listar análisis (filtrable por sourceType, sentiment) |
| `POST` | `/api/analysis` | Crear resultado de análisis |

### Reportes

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/reports?businessId=` | Listar reportes (filtrable por status) |
| `POST` | `/api/reports` | Crear reporte |
| `GET` | `/api/reports/:id` | Obtener reporte |
