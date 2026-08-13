import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { LoginUserInputDTO, RegisterUserInputDTO, UserRole } from '../dtos/user.dto';
import { Action } from './action';
import { UserModel } from './user.model';

type HttpError = Error & { status: number };

export type AuthActionResult = {
  user: {
    id: number;
    username: string;
    email: string;
    role: UserRole;
    pontuacao?: number;
    rankGlobal?: string;
  };
  token: string;
  role: UserRole;
};

abstract class AuthAction<TResult = void> extends Action<TResult> {
  protected readonly jwtSecret: string;

  constructor(jwtSecret: string) {
    super();
    this.jwtSecret = jwtSecret;
  }

  protected createHttpError(status: number, message: string): HttpError {
    const error = new Error(message) as HttpError;
    error.status = status;
    return error;
  }
}

export class RegisterUserAction extends AuthAction<AuthActionResult> {
  private readonly input: RegisterUserInputDTO;

  constructor(input: RegisterUserInputDTO, jwtSecret: string) {
    super(jwtSecret);
    this.input = input;
  }

  async run(): Promise<AuthActionResult> {
    const { username, email, password, role } = this.input;

    if (!username || !email || !password) {
      throw this.createHttpError(400, 'Username, email and password are required.');
    }

    const existingByEmail = await UserModel.findByEmail(email);
    if (existingByEmail) {
      throw this.createHttpError(409, 'Email already in use.');
    }

    const existingByUsername = await UserModel.findByUsername(username);
    if (existingByUsername) {
      throw this.createHttpError(409, 'Username already in use.');
    }

    const userRole = role ?? UserRole.TUTOR;
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
      username,
      email,
      password_hash: passwordHash,
      role: userRole,
    });

    const user = {
      id: Number(newUser.insertId),
      username,
      email,
      role: userRole,
    };

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      this.jwtSecret,
      { expiresIn: '7d' },
    );

    return { user, token, role: userRole };
  }
}

export class LoginUserAction extends AuthAction<AuthActionResult> {
  private readonly input: LoginUserInputDTO;

  constructor(input: LoginUserInputDTO, jwtSecret: string) {
    super(jwtSecret);
    this.input = input;
  }

  private mapPublicUser(user: UserModel): AuthActionResult['user'] {
    const mappedUser: AuthActionResult['user'] = {
      id: user.id as number,
      username: user.username as string,
      email: user.email as string,
      role: user.role ?? UserRole.TUTOR,
      pontuacao: Number(user.pontuacao ?? 0),
    };

    if (user.rankGlobal !== null) {
      mappedUser.rankGlobal = user.rankGlobal;
    }

    return mappedUser;
  }

  async run(): Promise<AuthActionResult> {
    const { identifier, password } = this.input;

    if (!identifier || !password) {
      throw this.createHttpError(400, 'Identifier and password are required.');
    }

    const userRow =
      (await UserModel.findByEmail(identifier)) || (await UserModel.findByUsername(identifier));

    if (!userRow) {
      throw this.createHttpError(401, 'Invalid credentials.');
    }

    const user = new UserModel({ user: userRow });

    if (!user.passwordHash) {
      throw this.createHttpError(401, 'Invalid credentials.');
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw this.createHttpError(401, 'Invalid credentials.');
    }

    if (!user.id || !user.email) {
      throw this.createHttpError(401, 'Invalid credentials.');
    }

    const resolvedRole = user.role ?? UserRole.TUTOR;
    const token = jwt.sign(
      { id: user.id, email: user.email, role: resolvedRole },
      this.jwtSecret,
      { expiresIn: '7d' },
    );

    return {
      user: this.mapPublicUser(user),
      token,
      role: resolvedRole,
    };
  }
}