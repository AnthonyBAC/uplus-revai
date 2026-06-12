const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'U+ Revai - Surveys Service API',
    version: '1.0.0',
    description: 'API de encuestas internas',
  },
  servers: [
    {
      url: 'http://localhost:3005',
      description: 'Servidor de desarrollo',
    },
  ],
  tags: [
    { name: 'surveys', description: 'Gestión de encuestas' },
    { name: 'questions', description: 'Gestión de preguntas' },
    { name: 'responses', description: 'Respuestas de encuestas' },
  ],
  paths: {
    '/api/surveys': {
      get: {
        tags: ['surveys'],
        summary: 'Listar encuestas',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'businessId', in: 'query', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Lista de encuestas' },
        },
      },
      post: {
        tags: ['surveys'],
        summary: 'Crear encuesta',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['businessId', 'title', 'questions'],
                properties: {
                  businessId: { type: 'string' },
                  branchId: { type: 'string' },
                  title: { type: 'string' },
                  questions: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        text: { type: 'string' },
                        type: { type: 'string' },
                        order: { type: 'number' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Encuesta creada' },
        },
      },
    },
    '/api/surveys/{id}': {
      get: {
        tags: ['surveys'],
        summary: 'Obtener encuesta por ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Datos de la encuesta' },
          '404': { description: 'Encuesta no encontrada' },
        },
      },
      patch: {
        tags: ['surveys'],
        summary: 'Actualizar encuesta',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Encuesta actualizada' },
        },
      },
      delete: {
        tags: ['surveys'],
        summary: 'Eliminar encuesta',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '204': { description: 'Encuesta eliminada' },
        },
      },
    },
    '/api/surveys/{id}/questions': {
      get: {
        tags: ['questions'],
        summary: 'Listar preguntas de una encuesta',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Lista de preguntas' },
        },
      },
      post: {
        tags: ['questions'],
        summary: 'Crear pregunta',
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
                required: ['text', 'type', 'order'],
                properties: {
                  text: { type: 'string' },
                  type: { type: 'string' },
                  order: { type: 'number' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Pregunta creada' },
        },
      },
    },
    '/api/surveys/{id}/questions/{questionId}': {
      patch: {
        tags: ['questions'],
        summary: 'Actualizar pregunta',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'questionId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Pregunta actualizada' },
        },
      },
      delete: {
        tags: ['questions'],
        summary: 'Eliminar pregunta',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'questionId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '204': { description: 'Pregunta eliminada' },
        },
      },
    },
    '/api/surveys/{id}/responses': {
      get: {
        tags: ['responses'],
        summary: 'Listar respuestas de una encuesta',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Lista de respuestas' },
        },
      },
    },
    '/api/surveys/{id}/respond': {
      post: {
        tags: ['responses'],
        summary: 'Responder una encuesta',
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
                required: ['businessId', 'answers'],
                properties: {
                  businessId: { type: 'string' },
                  branchId: { type: 'string' },
                  answers: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        questionId: { type: 'string' },
                        value: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Respuesta registrada' },
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
