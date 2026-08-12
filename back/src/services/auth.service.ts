import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model';
import { LoginUserInputDTO, RegisterUserInputDTO, UserRole } from '../dtos/user.dto';

type HttpError = Error & { status: number };

export class AuthService {
  private readonly __jwtSecret = process.env.JWT_SECRET || 'change_me';

  private __createHttpError(status: number, message: string): HttpError {
    const error = new Error(message) as HttpError;
    error.status = status;
    return error;
  }

  private __mapPublicUser(user: UserModel) {
    return {
      id: user.id as number,
      username: user.username as string,
      email: user.email as string,
      role: user.role ?? UserRole.TUTOR,
      pontuacao: Number(user.pontuacao ?? 0),
      rankGlobal: user.rankGlobal ?? undefined,
    };
  }

  async registerUser({ username, email, password, role }: RegisterUserInputDTO) {
    if (!username || !email || !password) {
      throw this.__createHttpError(400, 'Username, email and password are required.');
    }

    const existingByEmail = await UserModel.findByEmail(email);
    if (existingByEmail) {
      throw this.__createHttpError(409, 'Email already in use.');
    }

    const existingByUsername = await UserModel.findByUsername(username);
    if (existingByUsername) {
      throw this.__createHttpError(409, 'Username already in use.');
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
      this.__jwtSecret,
      { expiresIn: '7d' },
    );

    return { user, token, role: userRole };
  }

  async loginUser({ identifier, password }: LoginUserInputDTO) {
    if (!identifier || !password) {
      throw this.__createHttpError(400, 'Identifier and password are required.');
    }

    const userRow =
      (await UserModel.findByEmail(identifier)) || (await UserModel.findByUsername(identifier));

    if (!userRow) {
      throw this.__createHttpError(401, 'Invalid credentials.');
    }

    const user = new UserModel({ user: userRow });

    if (!user.passwordHash) {
      throw this.__createHttpError(401, 'Invalid credentials.');
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw this.__createHttpError(401, 'Invalid credentials.');
    }

    if (!user.id || !user.email) {
      throw this.__createHttpError(401, 'Invalid credentials.');
    }

    const resolvedRole = user.role ?? UserRole.TUTOR;
    const token = jwt.sign(
      { id: user.id, email: user.email, role: resolvedRole },
      this.__jwtSecret,
      { expiresIn: '7d' },
    );

    return {
      user: this.__mapPublicUser(user),
      token,
      role: resolvedRole,
    };
  }
}

export const authService = new AuthService();
