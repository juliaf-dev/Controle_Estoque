import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { Usuario } from '../models/Usuario';
// Interface para o usuário
interface User {
  id: number;
  email: string;
  password: string;
}

// Simulação de banco de dados (substitua por sua implementação real)
let users: User[] = [];

export class AuthController {
  /**
   * Registra um novo usuário
   * @route POST /auth/register
   */
  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Valida os dados da requisição
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { nome, email, senha, tipo } = req.body;

      const novoUsuario = await Usuario.registrar({ nome, email, senha, tipo });

      // Gera o token JWT
      const token = jwt.sign(
        { id: novoUsuario.id, email: novoUsuario.email },
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: '1d' }
      );

      res.status(201).json({
        user: {
          id: novoUsuario.id,
          email: novoUsuario.email,
        },
        token,
      });
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  /**
   * Autentica um usuário
   * @route POST /auth/login
   */
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Valida os dados da requisição
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { email, password } = req.body;

      // Busca o usuário
      const user = users.find(user => user.email === email);
      if (!user) {
        res.status(401).json({ error: 'Credenciais inválidas' });
        return;
      }

      // Verifica a senha
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        res.status(401).json({ error: 'Credenciais inválidas' });
        return;
      }

      // Gera o token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: '1d' }
      );

      res.json({
        user: {
          id: user.id,
          email: user.email,
        },
        token,
      });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
} 