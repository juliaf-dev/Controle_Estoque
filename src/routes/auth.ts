import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/AuthController';

const router = Router();

/**
 * @swagger
 * /auth/registrar:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - senha
 *               - tipo
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *               tipo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *       400:
 *         description: Erros de validação
 *       500:
 *         description: Erro no servidor
 */
router.post(
  '/registrar',
  [
    body('nome').notEmpty().withMessage('Nome é obrigatório'),
    body('email').isEmail().withMessage('Email inválido'),
    body('senha').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
    body('tipo').notEmpty().withMessage('Tipo de usuário é obrigatório')
  ],
  AuthController.registrar
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza login do usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 *       500:
 *         description: Erro no servidor
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('senha').notEmpty().withMessage('Senha é obrigatória')
  ],
  AuthController.login
);

/**
 * @swagger
 * /auth/recuperar-senha:
 *   post:
 *     summary: Solicita recuperação de senha via e-mail
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Link de recuperação enviado
 *       404:
 *         description: E-mail não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.post(
  '/recuperar-senha',
  [
    body('email').isEmail().withMessage('E-mail inválido')
  ],
  AuthController.solicitarRecuperacaoSenha
);

/**
 * @swagger
 * /auth/resetar-senha:
 *   post:
 *     summary: Reseta a senha do usuário usando token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - novaSenha
 *             properties:
 *               token:
 *                 type: string
 *               novaSenha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso
 *       400:
 *         description: Token inválido ou expirado
 *       500:
 *         description: Erro no servidor
 */
router.post(
  '/resetar-senha',
  [
    body('token').notEmpty().withMessage('Token é obrigatório'),
    body('novaSenha').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres')
  ],
  AuthController.resetarSenha
);

export default router;