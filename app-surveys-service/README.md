# app-surveys-service

Servicio de encuestas internas de U+ Revai. Permite crear encuestas con preguntas personalizables y registrar respuestas capturadas dentro del local por el personal.

## Responsabilidad

- Definir encuestas con preguntas (TEXT, RATING, SINGLE_CHOICE, MULTIPLE_CHOICE)
- Registrar respuestas de clientes capturadas desde tablet u otro dispositivo
- Vincular respuestas a `businessId`, `branchId` y automáticamente al trabajador autenticado (`capturedByUserId`)

## Stack

- Next.js 16 (API routes)
- PostgreSQL + Prisma
- Supabase Auth (validación JWT vía `@global/auth`)

## Autenticación y permisos

Todas las rutas de escritura requieren token JWT en header `Authorization: Bearer <token>`.

El sistema consulta la tabla `role_endpoint_permissions` para validar que el rol del usuario tenga el permiso correspondiente al endpoint.

```
requireAuth → valida JWT contra Supabase → busca app_user por email
requireBusinessAccess → verifica membresía activa en el negocio
requireEndpointPermission → consulta role_endpoint_permissions por role + method + path
```

| Ruta | Auth | ¿Quién puede? |
|---|---|---|
| `GET /api/surveys` | ✅ JWT | ADMIN o TRABAJADOR |
| `POST /api/surveys` | ✅ JWT | Solo ADMIN |
| `GET /api/surveys/:id` | ✅ JWT | ADMIN o TRABAJADOR |
| `PATCH /api/surveys/:id` | ✅ JWT | Solo ADMIN |
| `DELETE /api/surveys/:id` | ✅ JWT | Solo ADMIN |
| `GET /api/surveys/:id/questions` | ✅ JWT | ADMIN o TRABAJADOR |
| `POST /api/surveys/:id/questions` | ✅ JWT | Solo ADMIN |
| `PATCH /api/surveys/:id/questions/:questionId` | ✅ JWT | Solo ADMIN |
| `DELETE /api/surveys/:id/questions/:questionId` | ✅ JWT | Solo ADMIN |
| `POST /api/surveys/:id/respond` | ✅ JWT | ADMIN o TRABAJADOR |
| `GET /api/surveys/:id/responses` | ✅ JWT | ADMIN o TRABAJADOR |

> `POST /api/surveys/:id/respond` registra automáticamente al trabajador autenticado en `capturedByUserId`. No se acepta desde el body.

## Endpoints

### Encuestas

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/surveys?businessId=` | Listar encuestas por negocio |
| `POST` | `/api/surveys` | Crear encuesta con preguntas |
| `GET` | `/api/surveys/:id` | Obtener encuesta |
| `PATCH` | `/api/surveys/:id` | Editar encuesta (título, activo) |
| `DELETE` | `/api/surveys/:id` | Eliminar encuesta |

### Preguntas

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/surveys/:id/questions` | Listar preguntas de una encuesta |
| `POST` | `/api/surveys/:id/questions` | Agregar pregunta a encuesta existente |
| `PATCH` | `/api/surveys/:id/questions/:questionId` | Editar pregunta |
| `DELETE` | `/api/surveys/:id/questions/:questionId` | Eliminar pregunta |

### Respuestas

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/surveys/:id/respond` | Registrar respuesta de cliente |
| `GET` | `/api/surveys/:id/responses` | Listar respuestas de una encuesta |

### Ejemplo: responder encuesta

```bash
curl -X POST http://localhost:3005/api/surveys/{id}/respond \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "businessId": "...",
    "answers": [
      { "questionId": "...", "value": "Excelente" },
      { "questionId": "...", "value": "5" }
    ]
  }'
```

El `capturedByUserId` se extrae automáticamente del JWT, no se envía en el body.

## Tipos de pregunta

| Tipo | Descripción |
|---|---|
| `TEXT` | Respuesta de texto libre |
| `RATING` | Valoración numérica |
| `SINGLE_CHOICE` | Selección única |
| `MULTIPLE_CHOICE` | Selección múltiple |
