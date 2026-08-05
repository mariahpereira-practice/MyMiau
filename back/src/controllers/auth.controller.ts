import { NextFunction, Request, Response } from 'express';
import { loginUser, registerUser } from '../services/auth.service';
import { UserRole } from '../middlewares/auth.middleware';

interface UserPayload {
  username: string;
  email: string;
  password: string;
  role?: UserRole;
}

export const register = async (
  req: Request<{}, {}, UserPayload>,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const { username, email, password, role } = req.body;
    const input = role == undefined ? { username, email, password } : { username, email, password, role };
    const { user, token, role: registeredRole } = await registerUser(input);
    return res.json({ jwt: token, user, role: registeredRole });
  } catch (error) {
    next(error);
  }
}

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const { identifier, password } = req.body;
    const { user, token, role: loggedInRole } = await loginUser({ identifier, password });
    return res.json({ jwt: token, user, role: loggedInRole });
  } catch (error) {
    next(error);
  }
}
