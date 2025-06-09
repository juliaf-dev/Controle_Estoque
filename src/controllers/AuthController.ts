// src/controllers/AuthController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario';
import { validationResult } from 'express-validator';
import { enviarEmailRecuperacao } from '../services/emailService';

export const registrar = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    try {
        const { nome, email, senha, tipo } = req.body;
        const usuario = await Usuario.registrar({ nome, email, senha, tipo });
        res.status(201).json(usuario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    try {
        const { email, senha } = req.body;
        const usuario = await Usuario.findOne({ where: { email } });
        
        if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
            res.status(401).json({ error: 'Credenciais inválidas' });
            return;
        }

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
};

export const solicitarRecuperacaoSenha = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    try {
        const { email } = req.body;
        const token = await Usuario.gerarTokenRecuperacao(email);

        if (!token) {
            res.status(404).json({ error: 'E-mail não encontrado' });
            return;
        }

        await enviarEmailRecuperacao(email, token);
        res.json({ message: 'Código de recuperação enviado para seu e-mail' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao processar solicitação' });
    }
};

export const resetarSenha = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    try {
        const { token, novaSenha } = req.body;
        const sucesso = await Usuario.resetarSenha(token, novaSenha);

        if (!sucesso) {
            res.status(400).json({ error: 'Token inválido ou expirado' });
            return;
        }

        res.json({ message: 'Senha redefinida com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao redefinir senha' });
    }
};