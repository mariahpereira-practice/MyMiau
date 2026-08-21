import { NextFunction, Request, Response } from 'express';
import { UserRole } from '../dtos/user.dto';
import { authenticateUser } from './authenticator';

export const requiredAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    req.user = await authenticateUser(req);
    return next();
  } catch (error) {
    const authError = error as Error & { status?: number };
    return res.status(authError.status || 401).json({ error: authError.message });
  }
}

export { UserRole };
