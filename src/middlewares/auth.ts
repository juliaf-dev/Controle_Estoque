import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Interface para o payload do token
export interface TokenPayload {
  id: number;
  email: string;
  iat: number;
  exp: number;
}

// Middleware para verificar o token de autenticação
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401).json({ error: 'Token não fornecido' });
    return;
  }

  const token = authorization.replace('Bearer', '').trim();

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    const { id, email } = data as TokenPayload;

    req.userId = id;
    req.userEmail = email;

    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};
