const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'U+ Revai - Analysis Service API',
    version: '1.0.0',
    description: 'API de análisis de reseñas con Gemini AI',
  },
  servers: [
    {
      url: 'http://localhost:3002',
      description: 'Servidor de desarrollo',
    },
  ],
  tags: [
    { name: 'analysis', description: 'Endpoints de análisis' },
  ],
  paths: {
    '/api/analysis/reviews': {
      get: {
        tags: ['analysis'],
        summary: 'Proxy de reseñas para análisis',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'businessId', in: 'query', required: true, schema: { type: 'string' } },
          { name: 'branchId', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Lista de reseñas' },
        },
      },
    },
    '/api/analysis/insights': {
      get: {
        tags: ['analysis'],
        summary: 'Obtener insights de reseñas',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'businessId', in: 'query', required: true, schema: { type: 'string' } },
          { name: 'branchId', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Insights de tendencias y temas' },
        },
      },
    },
    '/api/analysis/dashboard': {
      get: {
        tags: ['analysis'],
        summary: 'Obtener datos de dashboard',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'businessId', in: 'query', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Datos agregados para dashboard' },
        },
      },
    },
    '/api/analysis/improvements': {
      get: {
        tags: ['analysis'],
        summary: 'Obtener sugerencias de mejora',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'businessId', in: 'query', required: true, schema: { type: 'string' } },
          { name: 'branchId', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Acciones de mejora sugeridas' },
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
