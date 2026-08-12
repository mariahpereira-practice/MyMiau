import { NextFunction, Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { LoginUserInputDTO, RegisterUserInputDTO } from '../dtos/user.dto';

export const register = async (
  req: Request<{}, {}, RegisterUserInputDTO>,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const input: RegisterUserInputDTO = req.body;
    const { user, token, role: registeredRole } = await authService.registerUser(input);
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
    const input: LoginUserInputDTO = req.body;
    const { user, token, role: loggedInRole } = await authService.loginUser(input);
    return res.json({ jwt: token, user, role: loggedInRole });
  } catch (error) {
    next(error);
  }
}
