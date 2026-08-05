import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findByEmail, findByUsername, type UserRow } from '../models/user.model';
import { UserRole } from '../types/user-role';

const JWT_SECRET = process.env.JWT_SECRET || 'change_me';

type RegisterInput = {
  username?: string;
  email?: string;
  password?: string;
  role?: UserRole;
};

type LoginInput = {
  identifier?: string;
  password?: string;
};

type HttpError = Error & { status: number };

function createHttpError(status: number, message: string): HttpError {
  const error = new Error(message) as HttpError;
  error.status = status;
  return error;
}

function mapPublicUser(user: UserRow) {
  return {
    id: Number(user.id),
    username: user.username,
    email: user.email,
    role: (user.role as UserRole) || UserRole.TUTOR,
    pontuacao: Number(user.pontuacao ?? 0),
    rankGlobal: user.rankGlobal,
  };
}

export async function registerUser({
  username,
  email,
  password,
  role
}: RegisterInput) {
  if (!username || !email || !password) {
    throw createHttpError(400, 'Username, email and password are required.');
  }

  const existingByEmail = await findByEmail(email);
  if (existingByEmail) {
    throw createHttpError(409, 'Email already in use.');
  }

  const existingByUsername = await findByUsername(username);
  if (existingByUsername) {
    throw createHttpError(409, 'Username already in use.');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = await createUser({
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

export async function loginUser({ identifier, password }: LoginInput) {
  if (!identifier || !password) {
    throw createHttpError(400, 'Identifier and password are required.');
  }

  const user =
    (await findByEmail(identifier)) || (await findByUsername(identifier));

  if (!user) {
    throw createHttpError(401, 'Invalid credentials.');
  }

  const isValidPassword = await bcrypt.compare(password, user.password_hash);
  if (!isValidPassword) {
    throw createHttpError(401, 'Invalid credentials.');
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: (user.role as UserRole) || UserRole.TUTOR },
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
