const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'U+ Revai - Report Service API',
    version: '1.0.0',
    description: 'API de generación de reportes',
  },
  servers: [
    {
      url: 'http://localhost:3004',
      description: 'Servidor de desarrollo',
    },
  ],
  tags: [
    { name: 'reports', description: 'Gestión de reportes' },
    { name: 'analysis', description: 'Análisis para reportes' },
  ],
  paths: {
    '/api/reports': {
      get: {
        tags: ['reports'],
        summary: 'Listar reportes',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'businessId', in: 'query', required: true, schema: { type: 'string' } },
          { name: 'branchId', in: 'query', schema: { type: 'string' } },
          { name: 'status', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Lista de reportes' },
        },
      },
      post: {
        tags: ['reports'],
        summary: 'Crear reporte',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['businessId', 'title', 'periodStart', 'periodEnd'],
                properties: {
                  businessId: { type: 'string' },
                  branchId: { type: 'string' },
                  title: { type: 'string' },
                  periodStart: { type: 'string', format: 'date' },
                  periodEnd: { type: 'string', format: 'date' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Reporte creado' },
        },
      },
    },
    '/api/reports/{id}': {
      get: {
        tags: ['reports'],
        summary: 'Obtener reporte por ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Datos del reporte' },
          '404': { description: 'Reporte no encontrado' },
        },
      },
    },
    '/api/analysis': {
      get: {
        tags: ['analysis'],
        summary: 'Listar resultados de análisis',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'businessId', in: 'query', required: true, schema: { type: 'string' } },
          { name: 'branchId', in: 'query', schema: { type: 'string' } },
          { name: 'sourceType', in: 'query', schema: { type: 'string' } },
          { name: 'sentiment', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Lista de resultados' },
        },
      },
      post: {
        tags: ['analysis'],
        summary: 'Crear resultado de análisis',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['businessId', 'sourceType', 'sourceId', 'sentiment', 'summary', 'keywords'],
                properties: {
                  businessId: { type: 'string' },
                  branchId: { type: 'string' },
                  sourceType: { type: 'string' },
                  sourceId: { type: 'string' },
                  sentiment: { type: 'string' },
                  summary: { type: 'string' },
                  keywords: { type: 'array', items: { type: 'string' } },
                  periodMonth: { type: 'string', format: 'date' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Análisis creado' },
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
