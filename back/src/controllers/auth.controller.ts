import { NextFunction, Request, Response } from 'express';
import { AuthService, authService } from '../services/auth.service';
import { LoginUserInputDTO, RegisterUserInputDTO } from '../dtos/user.dto';
import { Body, Controller, Post, Route, SuccessResponse, Middlewares } from 'tsoa';
import { UserResponseDTO, UserRole } from '../dtos/user.dto';
import { validateBody } from '../validators/validate-body.middleware';
import { validateLoginUser, validateRegisterUser } from '../validators/dto.validators';

interface AuthResponseDTO {
  jwt: string;
  user: UserResponseDTO;
  role: UserRole;
}

@Route('auth')
export class AuthController extends Controller {
  constructor(private readonly service: AuthService = authService) {
    super();
  }

  async handlerRegister(
    req: Request<{}, {}, RegisterUserInputDTO>,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const result = await this.register(req.body);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async handlerLogin(
    req: Request<{}, {}, LoginUserInputDTO>,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const result = await this.login(req.body);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  @Post('/login')
  @Middlewares(validateBody(validateLoginUser))
  @SuccessResponse('200', 'Login realizado com sucesso')
  async login(@Body() input: LoginUserInputDTO): Promise<AuthResponseDTO> {
    const { user, token, role } = await this.service.loginUser(input);
    return { jwt: token, user, role };
  }

  @Post('/register')
  @Middlewares(validateBody(validateRegisterUser))
  @SuccessResponse('200', 'Usuário registrado com sucesso')
  async register(@Body() input: RegisterUserInputDTO): Promise<AuthResponseDTO> {
    const { user, token, role } = await this.service.registerUser(input);
    return { jwt: token, user, role };
  }
}

export const authController = new AuthController();
