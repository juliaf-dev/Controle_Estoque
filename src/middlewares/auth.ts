import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Interface para o payload do token
interface TokenPayload {
  id: number;
  email: string;
  iat: number;
  exp: number;
}

// Middleware para verificar o token de autenticação
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  // Verifica se o token foi fornecido
  if (!authorization) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  // Remove o prefixo 'Bearer ' do token
  const token = authorization.replace('Bearer', '').trim();

  try {
    // Verifica e decodifica o token
    const data = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    const { id, email } = data as TokenPayload;

    // Adiciona os dados do usuário à requisição
    req.userId = id;
    req.userEmail = email;

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}; 