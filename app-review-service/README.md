# app-review-service

Servicio de reseñas de U+ Revai. Sincroniza, almacena y consulta reseñas externas (Google Reviews) por negocio y sucursal.

## Responsabilidad

- Gestionar conexiones a plataformas de reseñas (Google Business Profile)
- Sincronizar reseñas desde plataformas externas
- Almacenar y consultar reseñas normalizadas
- Exponer endpoint interno para `app-ai-service`

## Stack

- Next.js 16 (API routes)
- PostgreSQL + Prisma
- Supabase Auth (validación JWT)

## Autenticación y permisos

Todas las rutas requieren token JWT en header `Authorization: Bearer <token>`, excepto `/api/internal/*`.

```
requireAuth → valida JWT contra Supabase → busca app_user
requireBusinessAccess → verifica membresía activa en el negocio
requireEndpointPermission → consulta role_endpoint_permissions por role + method + path
```

| Ruta | Auth | ¿Quién puede? |
|---|---|---|
| `GET /api/reviews` | ✅ JWT | Solo ADMIN |
| `GET /api/reviews/:id` | ✅ JWT | Solo ADMIN |
| `DELETE /api/reviews/:id` | ✅ JWT | Solo ADMIN |
| `GET /api/connections` | ✅ JWT | Solo ADMIN |
| `POST /api/connections` | ✅ JWT | Solo ADMIN |
| `GET /api/connections/:id` | ✅ JWT | Solo ADMIN |
| `PATCH /api/connections/:id` | ✅ JWT | Solo ADMIN |
| `DELETE /api/connections/:id` | ✅ JWT | Solo ADMIN |
| `GET /api/sync` | ✅ JWT | Solo ADMIN |
| `POST /api/sync` | ✅ JWT | Solo ADMIN |
| `GET /api/sync/:id` | ✅ JWT | Solo ADMIN |
| `GET /api/internal/reviews` | ✅ JWT | Solo ADMIN |

## Endpoints

### Reseñas

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/reviews?businessId=&from=&to=` | Listar reseñas con filtros |
| `GET` | `/api/reviews/:id` | Obtener reseña |
| `DELETE` | `/api/reviews/:id` | Eliminar reseña |

### Conexiones

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/connections?businessId=` | Listar conexiones |
| `POST` | `/api/connections` | Crear conexión a plataforma |
| `GET` | `/api/connections/:id` | Obtener conexión + últimos syncs |
| `PATCH` | `/api/connections/:id` | Actualizar conexión |
| `DELETE` | `/api/connections/:id` | Eliminar conexión |

### Sincronización

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/sync?businessId=` | Listar jobs de sync |
| `POST` | `/api/sync` | Disparar sync |
| `GET` | `/api/sync/:id` | Estado de sync |

### Interno

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/internal/reviews` | Datos para `app-ai-service` |
