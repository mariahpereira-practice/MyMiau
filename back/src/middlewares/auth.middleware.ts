import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { findById, type UserRow } from '../models/user.model';
import { UserRole } from '../types/user-role';

const JWT_SECRET = process.env.JWT_SECRET || 'change_me';

export type AuthenticatedUser = {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  pontuacao?: number | string;
  rankGlobal?: string;
};

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthenticatedUser;
  }
}

function normalizeUser(user: UserRow): AuthenticatedUser {
  const normalized: AuthenticatedUser = {
    id: Number(user.id),
    username: user.username,
    email: user.email,
    role: (user.role as UserRole) || UserRole.TUTOR,
  };

  if (user.pontuacao !== undefined) {
    normalized.pontuacao = user.pontuacao;
  }

  if (user.rankGlobal !== undefined) {
    normalized.rankGlobal = user.rankGlobal;
  }

  return normalized;
}

export const requiredAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload & {
      id?: unknown;
      role?: unknown;
    };

    const userId = Number(payload.id);
    if (!payload.id || Number.isNaN(userId)) {
      return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }

    const user = await findById(userId);
    if (!user) {
      return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }

    req.user = normalizeUser(user);
    return next();
  } catch (_error) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};

export { UserRole };
