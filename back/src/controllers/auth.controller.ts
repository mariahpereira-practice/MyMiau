import { NextFunction, Request, Response } from 'express';
import { AuthService, authService } from '../services/auth.service';
import { LoginUserInputDTO, RegisterUserInputDTO } from '../dtos/user.dto';

export class AuthController {
  constructor(private readonly service: AuthService = authService) {}

  register = async (
    req: Request<{}, {}, RegisterUserInputDTO>,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const input: RegisterUserInputDTO = req.body;
      const { user, token, role: registeredRole } = await this.service.registerUser(input);
      return res.json({ jwt: token, user, role: registeredRole });
    } catch (error) {
      next(error);
    }
  };

  login = async (
    req: Request<{}, {}, LoginUserInputDTO>,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const input: LoginUserInputDTO = req.body;
      const { user, token, role: loggedInRole } = await this.service.loginUser(input);
      return res.json({ jwt: token, user, role: loggedInRole });
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
