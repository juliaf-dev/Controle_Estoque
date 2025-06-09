// src/routes/auth.ts
import { Router } from 'express';
import { body } from 'express-validator';
import { 
    registrar, 
    login, 
    solicitarRecuperacaoSenha, 
    resetarSenha 
} from '../controllers/AuthController';

const router = Router();

router.post(
    '/registrar',
    [
        body('nome').notEmpty().withMessage('Nome é obrigatório'),
        body('email').isEmail().withMessage('Email inválido'),
        body('senha').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
        body('tipo').notEmpty().withMessage('Tipo de usuário é obrigatório')
    ],
    registrar
);

router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Email inválido'),
        body('senha').notEmpty().withMessage('Senha é obrigatória')
    ],
    login
);

router.post(
    '/recuperar-senha',
    [
        body('email').isEmail().withMessage('E-mail inválido')
    ],
    solicitarRecuperacaoSenha
);

router.post(
    '/resetar-senha',
    [
        body('token').notEmpty().withMessage('Token é obrigatório'),
        body('novaSenha').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres')
    ],
    resetarSenha
);
export default router;