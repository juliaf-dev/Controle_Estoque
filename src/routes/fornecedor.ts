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
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Fornecedor Teste
 *               situacao:
 *                 type: integer
 *                 enum: [0, 1]
 *                 example: 1
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
  ],
  FornecedorController.registrar
);

/**
 * @swagger
 * /atualizar/{id}:
 *   put:
 *     summary: Atualiza um fornecedor
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
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Nome Atualizado
 *               situacao:
 *                 type: integer
 *                 enum: [0, 1]
 *                 example: 1
 *     responses:
 *       200:
 *         description: Fornecedor atualizado com sucesso
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Token ausente ou inválido
 *       404:
 *         description: Fornecedor não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put(
  '/atualizar/:id',
  authMiddleware,
  [
    body('nome').notEmpty().withMessage('Nome é obrigatório'),
    body('situacao').isInt({ min: 0, max: 1 }).withMessage('Situação deve ser 0 ou 1'),
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
 *         description: ID do fornecedor a ser removido
 *     responses:
 *       200:
 *         description: Fornecedor removido com sucesso
 *       401:
 *         description: Token ausente ou inválido
 *       404:
 *         description: Fornecedor não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/apagar/:id', authMiddleware, FornecedorController.apagar);

/**
 * @swagger
 * /fornecedores:
 *   get:
 *     summary: Listar todos os fornecedores
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
 *                     description: 0 = inativo, 1 = ativo
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.get('/listar', authMiddleware, FornecedorController.listar);


export default router;
