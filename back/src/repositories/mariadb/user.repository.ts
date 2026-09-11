import db from '../../config/databaseMariaDB';
import type { UserRow } from '../../models/user.model';
import type { DatabaseClient } from '../database-client';
import type {
  CreateUserRepositoryInput,
  InsertResult,
  UserRepository,
} from '../user.repository';

// O SQL guarda ids numericos; os contratos usam string.
type UserSqlRow = Omit<UserRow, 'id'> & { id: number };

function toUserRow(row: UserSqlRow): UserRow {
  return { ...row, id: String(row.id) };
}

export class MariaDbUserRepository implements UserRepository {
  constructor(private readonly database: DatabaseClient = db) {}

  async findByEmail(email: string): Promise<UserRow | null> {
    const rows = await this.database.query<UserSqlRow[]>(
      'SELECT * FROM users WHERE email = ? LIMIT 1',
      [email],
    );
    return rows[0] ? toUserRow(rows[0]) : null;
  }

  async findByUsername(username: string): Promise<UserRow | null> {
    const rows = await this.database.query<UserSqlRow[]>(
      'SELECT * FROM users WHERE username = ? LIMIT 1',
      [username],
    );
    return rows[0] ? toUserRow(rows[0]) : null;
  }

  async findById(id: string): Promise<UserRow | null> {
    const rows = await this.database.query<UserSqlRow[]>(
      'SELECT id, username, email, role, pontuacao, rankGlobal, password_hash FROM users WHERE id = ? LIMIT 1',
      [Number(id)],
    );
    return rows[0] ? toUserRow(rows[0]) : null;
  }

  async create(data: CreateUserRepositoryInput): Promise<InsertResult> {
    const result = await this.database.query<{ insertId: number | string }>(
      'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [data.username, data.email, data.password_hash, data.role],
    );
    return { insertId: String(result.insertId) };
  }
}

export const mariaDbUserRepository: UserRepository = new MariaDbUserRepository();
