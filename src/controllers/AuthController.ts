import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import Usuario from "../models/Usuario";
import { enviarEmailRecuperacao } from '../services/emailService';

export const AuthController = {
  async registrar(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { nome, email, senha, tipo } = req.body;
      const existingUser = await Usuario.findOne({ where: { email } });

      if (existingUser) {
        res.status(409).json({ error: "Email já cadastrado" });
        return;
      }

      const novoUsuario = await Usuario.registrar({ nome, email, senha, tipo });

      const token = jwt.sign(
        { id: novoUsuario.id, email: novoUsuario.email },
        process.env.JWT_SECRET || "default_secret",
        { expiresIn: "1d" }
      );

      res.status(201).json({
        user: {
          id: novoUsuario.id,
          email: novoUsuario.email,
        },
        token,
      });
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  async login(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { email, senha } = req.body;
      const user = await Usuario.findOne({ where: { email } });

      if (!user) {
        res.status(401).json({ error: "Credenciais inválidas" });
        return;
      }

      if (user.tentativas_login > 5) {
        res.status(403).json({ error: "O usuário passou das 5 tentativas de login" });
        return;
      }

      const validPassword = await bcrypt.compare(senha, user.senha);
      if (!validPassword) {
        await Usuario.aumentarTentativasLogin(email);
        res.status(401).json({ error: "Credenciais inválidas" });
        return;
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || "default_secret",
        { expiresIn: "1d" }
      );

      res.json({
        user: {
          id: user.id,
          email: user.email,
        },
        token,
      });
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  async solicitarRecuperacaoSenha(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      const { email } = req.body;
      const token = await Usuario.gerarTokenRecuperacao(email);

      if (!token) {
        res.status(404).json({ error: "E-mail não encontrado" });
        return;
      }

      await enviarEmailRecuperacao(email, token);
      res.json({ message: "Link de recuperação enviado para seu e-mail" });
    } catch (error) {
      console.error("Erro na recuperação de senha:", error);
      res.status(500).json({
        error: "Erro ao processar solicitação",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  },

  async resetarSenha(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      const { token, novaSenha } = req.body;
      const sucesso = await Usuario.resetarSenha(token, novaSenha);

      if (!sucesso) {
        res.status(400).json({ error: "Token inválido ou expirado" });
        return;
      }

      res.json({ message: "Senha redefinida com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao redefinir senha" });
    }
  },
};