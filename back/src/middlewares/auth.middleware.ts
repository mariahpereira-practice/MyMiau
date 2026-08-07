import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserModel } from '../models/user.model';
import { AuthTokenPayloadDTO, UserRole } from '../dtos/user.dto';

const JWT_SECRET = process.env.JWT_SECRET || 'change_me';

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
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload & AuthTokenPayloadDTO;

    const userId = Number(payload.id);
    if (!payload.id || Number.isNaN(userId)) {
      return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }

    const userInstance = new UserModel({ user });
    const normalizedUser = userInstance.toProfileResponse();
    if (!normalizedUser) {
      return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }

    req.user = normalizedUser;
    return next();
  } catch (_error) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};

export { UserRole };
