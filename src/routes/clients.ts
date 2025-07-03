import { Router } from 'express';
import { body, param, query } from 'express-validator';
import ClienteController from '../controllers/ClienteController';

const router = Router();
const clienteController = new ClienteController();

/**
 * @swagger
 * /clients:
 *   get:
 *     summary: Lista todos os clientes
 *     tags: [Clients]
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
 *         name: search
 *         schema:
 *           type: string
 *         description: Busca textual
 *     responses:
 *       200:
 *         description: Lista de clientes retornada com sucesso
 */
// Listar clientes
router.get('/clients',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Página deve ser um número inteiro positivo'),
    query('limit').optional().isInt({ min: 1 }).withMessage('Limite deve ser um número inteiro positivo'),
    query('search').optional().isString()
  ],
  clienteController.index
);

/**
 * @swagger
 * /clients/{id}:
 *   get:
 *     summary: Busca um cliente por ID
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *       404:
 *         description: Cliente não encontrado
 */
// Buscar cliente por ID
router.get('/clients/:id',
  [param('id').isInt().withMessage('ID deve ser um número inteiro')],
  clienteController.show
);

/**
 * @swagger
 * /clients:
 *   post:
 *     summary: Cria um novo cliente
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               telefone:
 *                 type: string
 *               endereco:
 *                 type: string
 *               cpf:
 *                 type: string
 *               produtos:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso
 *       400:
 *         description: Erros de validação
 */
// Criar cliente
router.post('/clients',
  [
    body('nome').notEmpty().trim().withMessage('Nome é obrigatório')
      .isLength({ min: 2, max: 200 }).withMessage('Nome deve ter entre 2 e 200 caracteres'),
    body('email').isEmail().withMessage('Email deve ser válido'),
    body('telefone').optional().isString().withMessage('Telefone deve ser uma string'),
    body('endereco').optional().isString().withMessage('Endereço deve ser uma string'),
    body('cpf').optional().isString().withMessage('CPF deve ser uma string'),
    body('produtos').optional().isArray().withMessage('Produtos deve ser um array')
  ],
  clienteController.store
);

/**
 * @swagger
 * /clients/{id}:
 *   put:
 *     summary: Atualiza um cliente existente
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               telefone:
 *                 type: string
 *               endereco:
 *                 type: string
 *               cpf:
 *                 type: string
 *               ativo:
 *                 type: boolean
 *               produtos:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Cliente atualizado com sucesso
 *       400:
 *         description: Erros de validação
 *       404:
 *         description: Cliente não encontrado
 */
// Atualizar cliente
router.put('/clients/:id',
  [
    param('id').isInt().withMessage('ID deve ser um número inteiro'),
    body('nome').optional().trim().isLength({ min: 2, max: 200 }).withMessage('Nome deve ter entre 2 e 200 caracteres'),
    body('email').optional().isEmail().withMessage('Email deve ser válido'),
    body('telefone').optional().isString().withMessage('Telefone deve ser uma string'),
    body('endereco').optional().isString().withMessage('Endereço deve ser uma string'),
    body('cpf').optional().isString().withMessage('CPF deve ser uma string'),
    body('ativo').optional().isBoolean().withMessage('Ativo deve ser um valor booleano'),
    body('produtos').optional().isArray().withMessage('Produtos deve ser um array')
  ],
  clienteController.update
);

/**
 * @swagger
 * /clients/{id}:
 *   delete:
 *     summary: Remove um cliente (soft delete)
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Cliente removido com sucesso
 *       404:
 *         description: Cliente não encontrado
 */
// Remover cliente (soft delete)
router.delete('/clients/:id',
  [param('id').isInt().withMessage('ID deve ser um número inteiro')],
  clienteController.delete
);

/**
 * @swagger
 * /clients/{id}/produtos:
 *   post:
 *     summary: Adiciona produtos a um cliente
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - produtos
 *             properties:
 *               produtos:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Produtos adicionados ao cliente com sucesso
 *       400:
 *         description: Erros de validação
 *       404:
 *         description: Cliente não encontrado
 */
// Adicionar produtos a um cliente
router.post('/clients/:id/produtos',
  [
    param('id').isInt().withMessage('ID deve ser um número inteiro'),
    body('produtos').isArray().withMessage('Produtos deve ser um array')
  ],
  clienteController.addProdutos
);

/**
 * @swagger
 * /clients/{id}/produtos:
 *   delete:
 *     summary: Remove produtos de um cliente
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - produtos
 *             properties:
 *               produtos:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Produtos removidos do cliente com sucesso
 *       400:
 *         description: Erros de validação
 *       404:
 *         description: Cliente não encontrado
 */
// Remover produtos de um cliente
router.delete('/clients/:id/produtos',
  [
    param('id').isInt().withMessage('ID deve ser um número inteiro'),
    body('produtos').isArray().withMessage('Produtos deve ser um array')
  ],
  clienteController.removeProdutos
);

export default router; 