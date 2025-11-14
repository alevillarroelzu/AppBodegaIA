import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { Express } from 'express'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AppBodegaIA - API de Inventario TI',
      version: '1.1.0',
      description: 'Sistema de gestión de inventario para equipos de tecnología de información',
      contact: {
        name: 'Soporte API',
        email: 'soporte@appbodegaia.com',
      },
      license: {
        name: 'ISC',
      },
    },
    servers: [
      {
        url: 'http://localhost:8090',
        description: 'Servidor de desarrollo',
      },
      {
        url: 'https://api.appbodegaia.com',
        description: 'Servidor de producción',
      },
    ],
    tags: [
      {
        name: 'Items',
        description: 'Gestión de ítems de inventario',
      },
      {
        name: 'Locations',
        description: 'Gestión de ubicaciones físicas',
      },
      {
        name: 'Suppliers',
        description: 'Gestión de proveedores',
      },
      {
        name: 'Movements',
        description: 'Registro y consulta de movimientos de inventario',
      },
      {
        name: 'Health',
        description: 'Verificación de salud del sistema',
      },
    ],
    components: {
      schemas: {
        Item: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'clx1234567890' },
            code: { type: 'string', example: 'LAP-001' },
            name: { type: 'string', example: 'Laptop Dell Latitude 7420' },
            stock: { type: 'integer', example: 15 },
            minStock: { type: 'integer', example: 5 },
            locationId: { type: 'string', nullable: true, example: 'clx9876543210' },
            supplierId: { type: 'string', nullable: true, example: 'clx5555555555' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            location: {
              type: 'object',
              nullable: true,
              properties: {
                id: { type: 'string' },
                name: { type: 'string', example: 'Bodega Principal' },
              },
            },
            supplier: {
              type: 'object',
              nullable: true,
              properties: {
                id: { type: 'string' },
                name: { type: 'string', example: 'Dell Technologies' },
              },
            },
          },
        },
        Location: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'clx9876543210' },
            name: { type: 'string', example: 'Bodega Principal' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Supplier: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'clx5555555555' },
            name: { type: 'string', example: 'Dell Technologies' },
            email: { type: 'string', nullable: true, example: 'ventas@dell.com' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Movement: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'clx7777777777' },
            type: { type: 'string', enum: ['IN', 'OUT', 'ADJ'], example: 'IN' },
            itemId: { type: 'string', example: 'clx1234567890' },
            quantity: { type: 'integer', example: 10 },
            note: { type: 'string', nullable: true, example: 'Compra para nuevos empleados' },
            createdAt: { type: 'string', format: 'date-time' },
            item: {
              type: 'object',
              properties: {
                code: { type: 'string', example: 'LAP-001' },
                name: { type: 'string', example: 'Laptop Dell Latitude 7420' },
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Error description' },
            error: { type: 'string', example: 'Error details' },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 50 },
            total: { type: 'integer', example: 100 },
            totalPages: { type: 'integer', example: 2 },
            hasMore: { type: 'boolean', example: true },
          },
        },
      },
      responses: {
        NotFound: {
          description: 'Recurso no encontrado',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Registro no encontrado' },
                },
              },
            },
          },
        },
        ValidationError: {
          description: 'Error de validación',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Validation error' },
                  errors: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        path: { type: 'string', example: 'code' },
                        message: { type: 'string', example: 'Código es requerido' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        ServerError: {
          description: 'Error interno del servidor',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
            },
          },
        },
      },
    },
  },
  apis: ['./src/modules/*/routes.ts', './src/app.ts'],
}

const swaggerSpec = swaggerJsdoc(options)

export const setupSwagger = (app: Express) => {
  // Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'AppBodegaIA - API Docs',
  }))

  // JSON spec
  app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })
}
