const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'U+ Revai - Auth Service API',
    version: '1.0.0',
    description: 'API de autenticación y autorización del sistema U+ Revai',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor de desarrollo',
    },
  ],
  tags: [
    { name: 'auth', description: 'Endpoints de autenticación' },
    { name: 'businesses', description: 'Gestión de negocios' },
    { name: 'branches', description: 'Gestión de sucursales' },
    { name: 'roles', description: 'Gestión de roles' },
    { name: 'endpoints', description: 'Gestión de endpoints' },
  ],
  paths: {
    '/api/auth/login': {
      post: {
        tags: ['auth'],
        summary: 'Iniciar sesión',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Sesión iniciada correctamente' },
          '401': { description: 'Credenciales inválidas' },
        },
      },
    },
    '/api/auth/signup': {
      post: {
        tags: ['auth'],
        summary: 'Registrar nuevo usuario',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' },
                  fullName: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Usuario registrado correctamente' },
          '409': { description: 'El usuario ya existe' },
        },
      },
    },
    '/api/auth/session': {
      get: {
        tags: ['auth'],
        summary: 'Obtener sesión actual',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Datos de la sesión' },
          '401': { description: 'Token no proporcionado o inválido' },
        },
      },
    },
    '/api/auth/logout': {
      post: {
        tags: ['auth'],
        summary: 'Cerrar sesión',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Sesión cerrada correctamente' },
        },
      },
    },
    '/api/auth/forgot-password': {
      post: {
        tags: ['auth'],
        summary: 'Solicitar recuperación de contraseña',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
                properties: {
                  email: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Si el correo existe, se envió el enlace' },
        },
      },
    },
    '/api/auth/reset-password': {
      post: {
        tags: ['auth'],
        summary: 'Restablecer contraseña',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['accessToken', 'newPassword'],
                properties: {
                  accessToken: { type: 'string' },
                  refreshToken: { type: 'string' },
                  newPassword: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Contraseña actualizada correctamente' },
          '401': { description: 'Token inválido o expirado' },
        },
      },
    },
    '/api/auth/refresh': {
      post: {
        tags: ['auth'],
        summary: 'Refrescar token de sesión',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['refreshToken'],
                properties: {
                  refreshToken: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Nuevo token generado' },
          '401': { description: 'Refresh token inválido' },
        },
      },
    },
    '/api/auth/register': {
      post: {
        tags: ['auth'],
        summary: 'Registrar negocio y membresía',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['fullName', 'businessName', 'businessSlug'],
                properties: {
                  fullName: { type: 'string' },
                  businessName: { type: 'string' },
                  businessSlug: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Negocio y membresía creados' },
          '400': { description: 'Datos requeridos faltantes' },
        },
      },
    },
    '/api/businesses/{id}/members': {
      get: {
        tags: ['businesses'],
        summary: 'Listar miembros de un negocio',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Lista de miembros' },
          '403': { description: 'Sin acceso' },
        },
      },
      post: {
        tags: ['businesses'],
        summary: 'Agregar miembro a un negocio',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'fullName'],
                properties: {
                  email: { type: 'string' },
                  fullName: { type: 'string' },
                  role: { type: 'string' },
                  branchIds: { type: 'array', items: { type: 'string' } },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Miembro creado' },
        },
      },
    },
    '/api/businesses/{id}/members/{userId}': {
      patch: {
        tags: ['businesses'],
        summary: 'Actualizar miembro de un negocio',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'userId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Miembro actualizado' },
          '404': { description: 'Miembro no encontrado' },
        },
      },
      delete: {
        tags: ['businesses'],
        summary: 'Eliminar miembro de un negocio',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'userId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Miembro eliminado' },
        },
      },
    },
    '/api/branches': {
      get: {
        tags: ['branches'],
        summary: 'Listar sucursales por negocio',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'businessId', in: 'query', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Lista de sucursales' },
        },
      },
      post: {
        tags: ['branches'],
        summary: 'Crear sucursal',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['businessId', 'name', 'slug'],
                properties: {
                  businessId: { type: 'string' },
                  name: { type: 'string' },
                  slug: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Sucursal creada' },
        },
      },
    },
    '/api/branches/{id}': {
      get: {
        tags: ['branches'],
        summary: 'Obtener sucursal por ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Datos de la sucursal' },
          '404': { description: 'Sucursal no encontrada' },
        },
      },
      patch: {
        tags: ['branches'],
        summary: 'Actualizar sucursal',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Sucursal actualizada' },
          '404': { description: 'Sucursal no encontrada' },
        },
      },
      delete: {
        tags: ['branches'],
        summary: 'Eliminar sucursal',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Sucursal eliminada' },
          '404': { description: 'Sucursal no encontrada' },
        },
      },
    },
    '/api/roles': {
      get: {
        tags: ['roles'],
        summary: 'Listar roles disponibles',
        responses: {
          '200': { description: 'Lista de roles' },
        },
      },
    },
    '/api/endpoints': {
      get: {
        tags: ['endpoints'],
        summary: 'Listar endpoints y sus permisos',
        responses: {
          '200': { description: 'Lista de endpoints' },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

export const generateSwaggerDocument = () => swaggerDocument;
