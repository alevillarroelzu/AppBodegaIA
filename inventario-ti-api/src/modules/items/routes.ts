import { Router } from 'express'
import * as c from './controller'

export const itemsRouter = Router()

/**
 * @openapi
 * /api/items:
 *   get:
 *     tags: [Items]
 *     summary: Listar todos los ítems
 *     description: Obtiene una lista paginada de ítems con soporte para búsqueda
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Cantidad de registros por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Búsqueda por código o nombre
 *     responses:
 *       200:
 *         description: Lista de ítems exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Item'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
itemsRouter.get('/', c.list)

/**
 * @openapi
 * /api/items:
 *   post:
 *     tags: [Items]
 *     summary: Crear un nuevo ítem
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - name
 *             properties:
 *               code:
 *                 type: string
 *                 example: LAP-001
 *               name:
 *                 type: string
 *                 example: Laptop Dell Latitude 7420
 *               stock:
 *                 type: integer
 *                 default: 0
 *               minStock:
 *                 type: integer
 *                 default: 0
 *               locationId:
 *                 type: string
 *                 nullable: true
 *               supplierId:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Ítem creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       409:
 *         description: Código duplicado
 */
itemsRouter.post('/', c.create)

/**
 * @openapi
 * /api/items/{id}:
 *   get:
 *     tags: [Items]
 *     summary: Obtener un ítem por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del ítem
 *     responses:
 *       200:
 *         description: Ítem encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
itemsRouter.get('/:id', c.get)

/**
 * @openapi
 * /api/items/{id}:
 *   put:
 *     tags: [Items]
 *     summary: Actualizar un ítem
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               name:
 *                 type: string
 *               stock:
 *                 type: integer
 *               minStock:
 *                 type: integer
 *               locationId:
 *                 type: string
 *                 nullable: true
 *               supplierId:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Ítem actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
itemsRouter.put('/:id', c.update)

/**
 * @openapi
 * /api/items/{id}:
 *   delete:
 *     tags: [Items]
 *     summary: Eliminar un ítem
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Ítem eliminado exitosamente
 *       400:
 *         description: No se puede eliminar (tiene movimientos asociados)
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
itemsRouter.delete('/:id', c.remove)
