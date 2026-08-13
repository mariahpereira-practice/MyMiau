import { LoginUserInputDTO, RegisterUserInputDTO } from '../dtos/user.dto';
import { LoginUserAction, RegisterUserAction } from '../models/authAction';

export class AuthService {
  private readonly __jwtSecret = process.env.JWT_SECRET || 'change_me';

  async registerUser(input: RegisterUserInputDTO) {
    const action = new RegisterUserAction(input, this.__jwtSecret);
    return action.run();
  }

  async loginUser(input: LoginUserInputDTO) {
    const action = new LoginUserAction(input, this.__jwtSecret);
    return action.run();
  }
}

export const authService = new AuthService();
