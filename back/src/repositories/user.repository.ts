import { UserRole } from '../dtos/user.dto';
import type { UserRow } from '../models/user.model';

export interface CreateUserRepositoryInput {
  username: string;
  email: string;
  password_hash: string;
  role: UserRole;
}

export type InsertResult = {
  insertId: string;
};

export interface UserRepository {
  findByEmail(email: string): Promise<UserRow | null>;
  findByUsername(username: string): Promise<UserRow | null>;
  findById(id: string): Promise<UserRow | null>;
  create(data: CreateUserRepositoryInput): Promise<InsertResult>;
}
