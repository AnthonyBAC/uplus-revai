# app-auth

Servicio de autenticación y autorización de U+ Revai.

## Responsabilidad

- Validar sesiones de Supabase Auth
- Registrar nuevos negocios (dueño + negocio + sucursal principal)
- Gestionar trabajadores (crear, asignar rol, editar permisos, remover)
- Gestionar sucursales (CRUD por negocio)
- Consultar roles y endpoints

## Stack

- Next.js 16 (API routes)
- Supabase Auth (identidad y tokens)
- PostgreSQL + Prisma (persistencia)

## RBAC — Roles y permisos

Dos roles definidos en la base de datos:

| Rol | Descripción | Permisos |
|---|---|---|
| `ADMIN` | Dueño del negocio | Todos los endpoints |
| `TRABAJADOR` | Empleado | Solo encuestas + sesión + sucursales |

Los permisos se definen en la tabla `role_endpoint_permissions` (role + endpoint → allowed).  
Cada endpoint debe estar registrado en la tabla `endpoints` con su `key`, `method` y `path`.

## Endpoints

### Auth

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| `POST` | `/api/auth/register` | Usuario autenticado | Registro de nuevo negocio |
| `GET` | `/api/auth/session` | Todos | Perfil + membresías + roles |
| `POST` | `/api/auth/logout` | Todos | Cerrar sesión |

### Miembros (trabajadores)

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| `GET` | `/api/businesses/:id/members` | ADMIN | Listar miembros |
| `POST` | `/api/businesses/:id/members` | ADMIN | Crear trabajador |
| `PATCH` | `/api/businesses/:id/members/:userId` | ADMIN | Editar rol/accesos |
| `DELETE` | `/api/businesses/:id/members/:userId` | ADMIN | Remover trabajador |

### Sucursales

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| `GET` | `/api/branches?businessId=` | Todos | Listar sucursales |
| `POST` | `/api/branches` | ADMIN | Crear sucursal |
| `GET` | `/api/branches/:id` | Todos | Obtener sucursal |
| `PATCH` | `/api/branches/:id` | ADMIN | Editar sucursal |
| `DELETE` | `/api/branches/:id` | ADMIN | Eliminar sucursal |

### Catálogos

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| `GET` | `/api/roles` | Público | Listar roles |
| `GET` | `/api/endpoints` | Público | Listar endpoints y permisos |

## Flujo de registro

1. Frontend llama a Supabase `signUp(email, password)`
2. Supabase crea el auth user y devuelve JWT
3. Frontend hace `POST /api/auth/register` con `{ fullName, businessName, businessSlug }` + JWT
4. Backend crea `app_user` + `business` + `branch` (Principal) + `business_membership` (ADMIN)

## Flujo de creación de trabajador

1. Admin hace `POST /api/businesses/:id/members` con `{ email, fullName }`
2. Backend usa Supabase Admin API para crear el auth user
3. Backend crea `app_user` + `business_membership` (TRABAJADOR)
4. El trabajador puede loguearse y acceder a las encuestas asignadas

## Seed

Ejecutar desde la raíz para poblar roles, endpoints y permisos:

```bash
npm run db:seed
```

## Variables de entorno

Requiere las variables globales del `.env` raíz más:

```env
SUPABASE_URL="https://xxxxxxxxxxxx.supabase.co"
SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."
```
