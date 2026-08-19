import { LoginUserInputDTO, RegisterUserInputDTO } from '../dtos/user.dto';
import { LoginUserAction, RegisterUserAction } from '../models/authAction';
import { userRepository, UserRepository } from '../repositories/user.repository';

export class AuthService {
  private readonly __jwtSecret = process.env.JWT_SECRET || 'change_me';

  constructor(private readonly repository: UserRepository = userRepository) {}

  async registerUser(input: RegisterUserInputDTO) {
    const action = new RegisterUserAction(input, this.__jwtSecret, this.repository);
    return action.run();
  }

  async loginUser(input: LoginUserInputDTO) {
    const action = new LoginUserAction(input, this.__jwtSecret, this.repository);
    return action.run();
  }
}

export const authService = new AuthService();
