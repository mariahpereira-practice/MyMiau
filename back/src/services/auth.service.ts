import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model';
import { LoginUserInputDTO, RegisterUserInputDTO, UserRole } from '../dtos/user.dto';

const JWT_SECRET = process.env.JWT_SECRET || 'change_me';

type HttpError = Error & { status: number };

function createHttpError(status: number, message: string): HttpError {
  const error = new Error(message) as HttpError;
  error.status = status;
  return error;
}

function mapPublicUser(user: UserModel) {
  return {
    id: user.id as number,
    username: user.username as string,
    email: user.email as string,
    role: user.role ?? UserRole.TUTOR,
    pontuacao: Number(user.pontuacao ?? 0),
    rankGlobal: user.rankGlobal ?? undefined,
  };
}

export async function registerUser({
  username,
  email,
  password,
  role
}: RegisterUserInputDTO) {
  if (!username || !email || !password) {
    throw createHttpError(400, 'Username, email and password are required.');
  }

  const existingByEmail = await UserModel.findByEmail(email);
  if (existingByEmail) {
    throw createHttpError(409, 'Email already in use.');
  }

  const existingByUsername = await UserModel.findByUsername(username);
  if (existingByUsername) {
    throw createHttpError(409, 'Username already in use.');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = await UserModel.create({
    username,
    email,
    password_hash: passwordHash,
    role: role ?? UserRole.TUTOR,
  });

  const user = {
    id: Number(newUser.insertId),
    username,
    email,
    role: role ?? UserRole.TUTOR,
  };

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' },
  );

  return { user, token, role: role ?? UserRole.TUTOR };
}

export async function loginUser({ identifier, password }: LoginUserInputDTO) {
  if (!identifier || !password) {
    throw createHttpError(400, 'Identifier and password are required.');
  }

  const userRow =
    (await UserModel.findByEmail(identifier)) || (await UserModel.findByUsername(identifier));

  if (!userRow) {
    throw createHttpError(401, 'Invalid credentials.');
  }

  const user = new UserModel({ user: userRow });

  if (!user.passwordHash) {
    throw createHttpError(401, 'Invalid credentials.');
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isValidPassword) {
    throw createHttpError(401, 'Invalid credentials.');
  }

  if (!user.id || !user.email) {
    throw createHttpError(401, 'Invalid credentials.');
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role ?? UserRole.TUTOR },
    JWT_SECRET,
    { expiresIn: '7d' },
  );

  if (user.role === UserRole.CATSITTER) {
    return {
      user: mapPublicUser(user),
      token,
      role: UserRole.CATSITTER,
    };
  } else if (user.role === UserRole.MODERATOR) {
    return {
      user: mapPublicUser(user),
      token,
      role: UserRole.MODERATOR,
    };
  } else if (user.role === UserRole.ADMIN) {
    return {
      user: mapPublicUser(user),
      token,
      role: UserRole.ADMIN,
    };
  } else {
    return {
      user: mapPublicUser(user),
      token,
      role: UserRole.TUTOR,
    };
  }

}
