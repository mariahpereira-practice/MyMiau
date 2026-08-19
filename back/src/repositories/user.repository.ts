import db from '../config/database';
import { UserRole } from '../dtos/user.dto';
import type { UserRow } from '../models/user.model';
import type { DatabaseClient } from './database-client';

export interface CreateUserRepositoryInput {
  username: string;
  email: string;
  password_hash: string;
  role: UserRole;
}

type InsertResult = {
  insertId: number | string;
};

export interface UserRepository {
  findByEmail(email: string): Promise<UserRow | null>;
  findByUsername(username: string): Promise<UserRow | null>;
  findById(id: number): Promise<UserRow | null>;
  create(data: CreateUserRepositoryInput): Promise<InsertResult>;
}

export class MariaDbUserRepository implements UserRepository {
  constructor(private readonly database: DatabaseClient = db) {}

  async findByEmail(email: string): Promise<UserRow | null> {
    const rows = await this.database.query<UserRow[]>(
      'SELECT * FROM users WHERE email = ? LIMIT 1',
      [email],
    );
    return rows[0] ?? null;
  }

  async findByUsername(username: string): Promise<UserRow | null> {
    const rows = await this.database.query<UserRow[]>(
      'SELECT * FROM users WHERE username = ? LIMIT 1',
      [username],
    );
    return rows[0] ?? null;
  }

  async findById(id: number): Promise<UserRow | null> {
    const rows = await this.database.query<UserRow[]>(
      'SELECT id, username, email, role, pontuacao, rankGlobal, password_hash FROM users WHERE id = ? LIMIT 1',
      [id],
    );
    return rows[0] ?? null;
  }

  async create(data: CreateUserRepositoryInput): Promise<InsertResult> {
    return this.database.query<InsertResult>(
      'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [data.username, data.email, data.password_hash, data.role],
    );
  }
}

export const userRepository: UserRepository = new MariaDbUserRepository();
