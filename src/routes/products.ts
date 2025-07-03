import { Router } from 'express';
import { body, param, query } from 'express-validator';
import ProductController from '../controllers/ProductController';
const router = Router();
const productController = new ProductController();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Lista todos os produtos
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Página para paginação
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limite de itens por página
 *       - in: query
 *         name: categoria_id
 *         schema:
 *           type: integer
 *         description: Filtrar por categoria
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Busca textual
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso
 */
// Listar produtos
router.get('/products',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Página deve ser um número inteiro positivo'),
    query('limit').optional().isInt({ min: 1 }).withMessage('Limite deve ser um número inteiro positivo'),
    query('categoria_id').optional().isInt().withMessage('Categoria deve ser um número inteiro'),
    query('search').optional().isString()
  ],
  productController.index
);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Busca um produto por ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto encontrado
 *       404:
 *         description: Produto não encontrado
 */
// Buscar produto por ID
router.get('/products/:id',
  [param('id').isInt().withMessage('ID deve ser um número inteiro')],
  productController.show
);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - categoria_id
 *               - quantidade_estoque
 *               - valor
 *             properties:
 *               nome:
 *                 type: string
 *               categoria_id:
 *                 type: integer
 *               quantidade_estoque:
 *                 type: integer
 *               valor:
 *                 type: number
 *               descricao:
 *                 type: string
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *       400:
 *         description: Erros de validação
 */
// Criar produto
router.post('/products',
  [
    body('nome').notEmpty().isString().withMessage('Nome é obrigatório'),
    body('categoria_id').isInt().withMessage('Categoria é obrigatória e deve ser inteira'),
    body('quantidade_estoque').isInt({ min: 0 }).withMessage('Quantidade deve ser um número inteiro >= 0'),
    body('valor').isDecimal().withMessage('Valor é obrigatório e deve ser decimal'),
    body('descricao').optional().isString()
  ],
  productController.store
);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Atualiza um produto existente
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               categoria_id:
 *                 type: integer
 *               quantidade_estoque:
 *                 type: integer
 *               valor:
 *                 type: number
 *               descricao:
 *                 type: string
 *               ativo:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *       400:
 *         description: Erros de validação
 *       404:
 *         description: Produto não encontrado
 */
// Atualizar produto
router.put('/products/:id',
  [
    param('id').isInt().withMessage('ID deve ser um número inteiro'),
    body('nome').optional().isString(),
    body('categoria_id').optional().isInt(),
    body('quantidade_estoque').optional().isInt({ min: 0 }),
    body('valor').optional().isDecimal(),
    body('descricao').optional().isString(),
    body('ativo').optional().isBoolean()
  ],
  productController.update
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Remove um produto (soft delete)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto removido com sucesso
 *       404:
 *         description: Produto não encontrado
 */
// Remover produto (soft delete)
router.delete('/products/:id',
  [param('id').isInt().withMessage('ID deve ser um número inteiro')],
  productController.delete
);

/**
 * @swagger
 * /products/{id}/estoque:
 *   patch:
 *     summary: Atualiza o estoque de um produto
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantidade
 *               - tipo
 *             properties:
 *               quantidade:
 *                 type: integer
 *               tipo:
 *                 type: string
 *                 enum: [entrada, saida]
 *     responses:
 *       200:
 *         description: Estoque atualizado com sucesso
 *       400:
 *         description: Erros de validação
 *       404:
 *         description: Produto não encontrado
 */
// Atualizar estoque
router.patch('/products/:id/estoque',
  [
    param('id').isInt().withMessage('ID deve ser um número inteiro'),
    body('quantidade').isInt().withMessage('Quantidade é obrigatória e deve ser inteira'),
    body('tipo').isIn(['entrada', 'saida']).withMessage('Tipo deve ser "entrada" ou "saida"')
  ],
  productController.updateStock
);

/**
 * @swagger
 * /products/low-stock:
 *   get:
 *     summary: Lista produtos com estoque baixo
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *         description: Limite de produtos retornados
 *     responses:
 *       200:
 *         description: Lista de produtos com estoque baixo retornada com sucesso
 */
// Produtos com estoque baixo
router.get('/products/low-stock',
  [query('limite').optional().isInt({ min: 0 })],
  productController.lowStock
);

/**
 * @swagger
 * /products/{id}/fornecedores:
 *   get:
 *     summary: Lista fornecedores de um produto
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Lista de fornecedores retornada com sucesso
 *       404:
 *         description: Produto não encontrado
 */
// Buscar fornecedores de um produto
router.get('/products/:id/fornecedores',
  [param('id').isInt().withMessage('ID deve ser um número inteiro')],
  productController.getProductSuppliers
);

export default router; 