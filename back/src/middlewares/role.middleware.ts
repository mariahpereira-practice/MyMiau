import type { Request, Response, NextFunction } from 'express';
import { UserRole } from '../dtos/user.dto';

export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): Response | void => {
    if (!req.user) {
      return res.status(401).json({ error: 'Token não fornecido.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Você não tem permissão para esta ação.' });
    }

    return next();
  };
}