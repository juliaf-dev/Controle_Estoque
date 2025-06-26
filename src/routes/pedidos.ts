import { Router } from 'express';
import { body } from 'express-validator';
import { PedidoController } from '../controllers/PedidoController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Pedidos
 *   description: Operações relacionadas aos pedidos
 */

/**
 * @swagger
 * /pedidos/registrar:
 *   post:
 *     summary: Registrar um novo pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - codigo
 *               - nome
 *               - valor
 *               - tipo
 *               - produto_id
 *               - cliente_id
 *             properties:
 *               codigo:
 *                 type: integer
 *               nome:
 *                 type: string
 *               valor:
 *                 type: number
 *               tipo:
 *                 type: string
 *               produto_id:
 *                 type: integer
 *               cliente_id:
 *                 type: integer
 *               data_entrega:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Pedido registrado com sucesso
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Token inválido ou não fornecido
 */
router.post('/registrar', authMiddleware, [
  body('codigo').isInt().withMessage('Código deve ser um número inteiro'),
  body('nome').notEmpty().withMessage('Nome é obrigatório'),
  body('valor').isFloat().withMessage('Valor deve ser um número'),
  body('tipo').notEmpty().withMessage('Tipo é obrigatório'),
  body('produto_id').isInt().withMessage('Produto ID deve ser um número inteiro'),
  body('cliente_id').isInt().withMessage('Cliente ID deve ser um número inteiro'),
], PedidoController.registrar);

/**
 * @swagger
 * /pedidos/atualizar/{id}:
 *   put:
 *     summary: Atualizar um pedido existente
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do pedido
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               valor:
 *                 type: number
 *               tipo:
 *                 type: string
 *               produto_id:
 *                 type: integer
 *               cliente_id:
 *                 type: integer
 *               data_entrega:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Pedido atualizado com sucesso
 *       404:
 *         description: Pedido não encontrado
 */
router.put('/atualizar/:id', authMiddleware, [
  body('nome').optional().notEmpty().withMessage('Nome não pode ser vazio'),
  body('valor').optional().isFloat().withMessage('Valor deve ser um número'),
  body('tipo').optional().notEmpty().withMessage('Tipo não pode ser vazio'),
  body('produto_id').optional().isInt().withMessage('Produto ID deve ser um número'),
  body('cliente_id').optional().isInt().withMessage('Cliente ID deve ser um número'),
], PedidoController.atualizar);

/**
 * @swagger
 * /pedidos/apagar/{id}:
 *   delete:
 *     summary: Apagar um pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do pedido
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pedido apagado com sucesso
 *       404:
 *         description: Pedido não encontrado
 */
router.delete('/apagar/:id', authMiddleware, PedidoController.apagar);

/**
 * @swagger
 * /pedidos:
 *   get:
 *     summary: Listar todos os pedidos
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   codigo:
 *                     type: integer
 *                   nome:
 *                     type: string
 *                   valor:
 *                     type: number
 *                   tipo:
 *                     type: string
 *                   produto_id:
 *                     type: integer
 *                   cliente_id:
 *                     type: integer
 *                   data_entrega:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.get('/listar', authMiddleware, PedidoController.listar);
router.get('/:id', authMiddleware, PedidoController.buscarPorId);

export default router;
