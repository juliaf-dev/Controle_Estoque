import { Router } from 'express';
import { body } from 'express-validator';
import { FornecedorController } from '../controllers/FornecedorController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Fornecedores
 *   description: Endpoints para gerenciamento de fornecedores
 */

/**
 * @swagger
 * /registrar:
 *   post:
 *     summary: Registra um novo fornecedor
 *     tags: [Fornecedores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - situacao
 *               - email
 *               - telefone
 *               - tempo_entrega
 *             properties:
 *               nome:
 *                 type: string
 *               situacao:
 *                 type: integer
 *                 enum: [0, 1]
 *               email:
 *                 type: string
 *                 format: email
 *               telefone:
 *                 type: string
 *               tempo_entrega:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Fornecedor criado com sucesso
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Token ausente ou inválido
 *       500:
 *         description: Erro interno do servidor
 */
router.post(
  '/registrar',
  authMiddleware,
  [
    body('nome').notEmpty().withMessage('Nome é obrigatório'),
    body('situacao').isInt({ min: 0, max: 1 }).withMessage('Situação deve ser 0 ou 1'),
    body('email').isEmail().withMessage('Email inválido'),
    body('telefone').notEmpty().withMessage('Telefone é obrigatório'),
    body('tempo_entrega').isInt({ min: 1 }).withMessage('Tempo de entrega deve ser um número inteiro positivo'),
  ],
  FornecedorController.registrar
);

/**
 * @swagger
 * /atualizar/{id}:
 *   put:
 *     summary: Atualiza um fornecedor existente
 *     tags: [Fornecedores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do fornecedor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - situacao
 *               - email
 *               - telefone
 *               - tempo_entrega
 *             properties:
 *               nome:
 *                 type: string
 *               situacao:
 *                 type: integer
 *                 enum: [0, 1]
 *               email:
 *                 type: string
 *               telefone:
 *                 type: string
 *               tempo_entrega:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Fornecedor atualizado com sucesso
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Token inválido
 *       404:
 *         description: Fornecedor não encontrado
 *       500:
 *         description: Erro interno
 */
router.put(
  '/atualizar/:id',
  authMiddleware,
  [
    body('nome').notEmpty().withMessage('Nome é obrigatório'),
    body('situacao').isInt({ min: 0, max: 1 }).withMessage('Situação deve ser 0 ou 1'),
    body('email').isEmail().withMessage('Email inválido'),
    body('telefone').notEmpty().withMessage('Telefone é obrigatório'),
    body('tempo_entrega').isInt({ min: 1 }).withMessage('Tempo de entrega deve ser um número inteiro positivo'),
  ],
  FornecedorController.atualizar
);

/**
 * @swagger
 * /apagar/{id}:
 *   delete:
 *     summary: Remove um fornecedor
 *     tags: [Fornecedores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do fornecedor
 *     responses:
 *       200:
 *         description: Fornecedor removido com sucesso
 *       401:
 *         description: Token ausente ou inválido
 *       404:
 *         description: Fornecedor não encontrado
 *       500:
 *         description: Erro interno
 */
router.delete('/apagar/:id', authMiddleware, FornecedorController.apagar);

/**
 * @swagger
 * /listar:
 *   get:
 *     summary: Lista todos os fornecedores
 *     tags: [Fornecedores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de fornecedores retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nome:
 *                     type: string
 *                   situacao:
 *                     type: integer
 *                   email:
 *                     type: string
 *                   telefone:
 *                     type: string
 *                   tempo_entrega:
 *                     type: integer
 *       401:
 *         description: Token inválido
 */
router.get('/listar', authMiddleware, FornecedorController.listar);

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Buscar fornecedor por ID
 *     tags: [Fornecedores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do fornecedor
 *     responses:
 *       200:
 *         description: Fornecedor encontrado
 *       404:
 *         description: Fornecedor não encontrado
 */
router.get('/:id', authMiddleware, FornecedorController.buscarPorId);

export default router;
