import { Router } from 'express';
import { body, param } from 'express-validator';
import CategoryController from '../controllers/CategoryController';

const router = Router();
const categoryController = new CategoryController();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Lista todas as categorias ativas
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Lista de categorias retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       nome:
 *                         type: string
 *                       descricao:
 *                         type: string
 *                       ativo:
 *                         type: boolean
 *                 total:
 *                   type: integer
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/categories', categoryController.index);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Busca uma categoria específica por ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria
 *     responses:
 *       200:
 *         description: Categoria encontrada
 *       404:
 *         description: Categoria não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/categories/:id', 
  [
    param('id').isInt().withMessage('ID deve ser um número inteiro')
  ],
  categoryController.show
);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Cria uma nova categoria
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome da categoria
 *               descricao:
 *                 type: string
 *                 description: Descrição da categoria (opcional)
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 *       400:
 *         description: Erros de validação
 *       409:
 *         description: Categoria com este nome já existe
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/categories', 
  [
    body('nome').notEmpty().trim().withMessage('Nome é obrigatório')
      .isLength({ min: 2, max: 100 }).withMessage('Nome deve ter entre 2 e 100 caracteres'),
    body('descricao').optional().trim().isLength({ max: 500 }).withMessage('Descrição deve ter no máximo 500 caracteres')
  ],
  categoryController.store
);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Atualiza uma categoria existente
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome da categoria
 *               descricao:
 *                 type: string
 *                 description: Descrição da categoria
 *               ativo:
 *                 type: boolean
 *                 description: Status da categoria
 *     responses:
 *       200:
 *         description: Categoria atualizada com sucesso
 *       400:
 *         description: Erros de validação
 *       404:
 *         description: Categoria não encontrada
 *       409:
 *         description: Categoria com este nome já existe
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/categories/:id', 
  [
    param('id').isInt().withMessage('ID deve ser um número inteiro'),
    body('nome').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Nome deve ter entre 2 e 100 caracteres'),
    body('descricao').optional().trim().isLength({ max: 500 }).withMessage('Descrição deve ter no máximo 500 caracteres'),
    body('ativo').optional().isBoolean().withMessage('Ativo deve ser um valor booleano')
  ],
  categoryController.update
);
/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Remove uma categoria (soft delete)
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria
 *     responses:
 *       200:
 *         description: Categoria removida com sucesso
 *       404:
 *         description: Categoria não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/categories/:id', 
  [
    param('id').isInt().withMessage('ID deve ser um número inteiro')
  ],
  categoryController.delete
);

export default router; 