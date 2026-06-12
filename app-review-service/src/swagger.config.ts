const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'U+ Revai - Review Service API',
    version: '1.0.0',
    description: 'API de gestión de reseñas y sincronización con Google',
  },
  servers: [
    {
      url: 'http://localhost:3003',
      description: 'Servidor de desarrollo',
    },
  ],
  tags: [
    { name: 'reviews', description: 'Gestión de reseñas' },
    { name: 'sync', description: 'Sincronización con Google' },
    { name: 'connections', description: 'Conexiones con plataformas' },
  ],
  paths: {
    '/api/reviews': {
      get: {
        tags: ['reviews'],
        summary: 'Listar reseñas',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'businessId', in: 'query', required: true, schema: { type: 'string' } },
          { name: 'branchId', in: 'query', schema: { type: 'string' } },
          { name: 'source', in: 'query', schema: { type: 'string' } },
          { name: 'rating', in: 'query', schema: { type: 'number' } },
          { name: 'from', in: 'query', schema: { type: 'string', format: 'date' } },
          { name: 'to', in: 'query', schema: { type: 'string', format: 'date' } },
        ],
        responses: {
          '200': { description: 'Lista de reseñas' },
        },
      },
    },
    '/api/reviews/{id}': {
      get: {
        tags: ['reviews'],
        summary: 'Obtener reseña por ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Datos de la reseña' },
          '404': { description: 'Reseña no encontrada' },
        },
      },
      delete: {
        tags: ['reviews'],
        summary: 'Eliminar reseña',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '204': { description: 'Reseña eliminada' },
        },
      },
    },
    '/api/sync': {
      get: {
        tags: ['sync'],
        summary: 'Listar jobs de sincronización',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'businessId', in: 'query', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Lista de jobs' },
        },
      },
      post: {
        tags: ['sync'],
        summary: 'Crear job de sincronización',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['connectionId'],
                properties: {
                  connectionId: { type: 'string' },
                  triggeredBy: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Job creado' },
          '404': { description: 'Conexión no encontrada' },
        },
      },
    },
    '/api/sync/{id}': {
      get: {
        tags: ['sync'],
        summary: 'Obtener job de sincronización por ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Datos del job' },
          '404': { description: 'Job no encontrado' },
        },
      },
    },
    '/api/connections': {
      get: {
        tags: ['connections'],
        summary: 'Listar conexiones',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'businessId', in: 'query', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Lista de conexiones' },
        },
      },
      post: {
        tags: ['connections'],
        summary: 'Crear conexión',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['businessId', 'source', 'externalLocationId'],
                properties: {
                  businessId: { type: 'string' },
                  source: { type: 'string' },
                  externalLocationId: { type: 'string' },
                  tokenExpiresAt: { type: 'string', format: 'date-time' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Conexión creada' },
        },
      },
    },
    '/api/connections/{id}': {
      get: {
        tags: ['connections'],
        summary: 'Obtener conexión por ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Datos de la conexión' },
          '404': { description: 'Conexión no encontrada' },
        },
      },
      patch: {
        tags: ['connections'],
        summary: 'Actualizar conexión',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Conexión actualizada' },
        },
      },
      delete: {
        tags: ['connections'],
        summary: 'Eliminar conexión',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '204': { description: 'Conexión eliminada' },
        },
      },
    },
    '/api/internal/reviews': {
      get: {
        tags: ['reviews'],
        summary: 'Listar reseñas internas',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'businessId', in: 'query', required: true, schema: { type: 'string' } },
          { name: 'branchId', in: 'query', schema: { type: 'string' } },
          { name: 'startDate', in: 'query', schema: { type: 'string', format: 'date' } },
          { name: 'endDate', in: 'query', schema: { type: 'string', format: 'date' } },
        ],
        responses: {
          '200': { description: 'Lista de reseñas' },
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
