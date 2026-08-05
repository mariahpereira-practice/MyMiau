import db from '../config/database';
import { UserRole } from '../types/user-role';

export type UserRow = {
  id: number | string;
  username: string;
  email: string;
  password_hash: string;
  role: UserRole | string;
  pontuacao?: number | string;
  rankGlobal?: string;
  [key: string]: unknown;
};

type InsertResult = {
  insertId: number | string;
};

function normalizeUser(row: UserRow | null): UserRow | null {
  if (!row) {
    return null;
  }

  return {
    ...row,
    id: Number(row.id),
    role: (row.role as UserRole) || UserRole.TUTOR,
  };
}

export async function findByEmail(email: string): Promise<UserRow | null> {
  const rows = await db.query<UserRow[]>(
    'SELECT * FROM users WHERE email = ? LIMIT 1',
    [email],
  );
  return normalizeUser(rows[0] ?? null);
}

export async function findByUsername(username: string): Promise<UserRow | null> {
  const rows = await db.query<UserRow[]>(
    'SELECT * FROM users WHERE username = ? LIMIT 1',
    [username],
  );
  return normalizeUser(rows[0] ?? null);
}

export async function findById(id: number): Promise<UserRow | null> {
  const rows = await db.query<UserRow[]>(
    'SELECT id, username, email, role, pontuacao, rankGlobal, password_hash FROM users WHERE id = ? LIMIT 1',
    [id],
  );
  return normalizeUser(rows[0] ?? null);
}

export async function createUser({
  username,
  email,
  password_hash,
  role,
}: {
  username: string;
  email: string;
  password_hash: string;
  role: UserRole;
}): Promise<InsertResult> {
  const result = await db.query<InsertResult>(
    'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
    [username, email, password_hash, role],
  );
  return result;
}
