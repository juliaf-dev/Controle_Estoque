import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import Usuario from "../models/Usuario";
import { log } from "console";

export class AuthController {
  register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
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
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { email, senha } = req.body; // Alterado para "senha"

      const user = await Usuario.findOne({ where: { email } });
      if (!user) {
        res.status(401).json({ error: "Credenciais inválidas" });
        return;
      }

      if (user.tentativas_login > 5) {
        res.status(403).json({ error: "O usuario passou das 5 tentativas de login" });
        return;
      }

      const validPassword = await bcrypt.compare(senha, user.senha);
      if (!validPassword) {
        Usuario.aumentarTentativasLogin(email);
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
  };
}
