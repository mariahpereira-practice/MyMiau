import 'dotenv/config';
import mariadb from './databaseMariaDB';
import { connectMongoDB } from './databaseMongoDB';

export type DatabaseDriver = 'mariadb' | 'mongodb';

// ========== UNICO LUGAR QUE DECIDE O BANCO ==========
// Troque aqui (ou defina DB_DRIVER no .env).
const DEFAULT_DRIVER: DatabaseDriver = 'mongodb';
// ====================================================

function resolveDriver(): DatabaseDriver {
  const value = process.env.DB_DRIVER?.trim().toLowerCase();

  if (!value) {
    return DEFAULT_DRIVER;
  }

  if (value !== 'mariadb' && value !== 'mongodb') {
    throw new Error(`DB_DRIVER invalido: "${value}". Use "mariadb" ou "mongodb".`);
  }

  return value;
}

export const DATABASE_DRIVER: DatabaseDriver = resolveDriver();

export async function connectDatabase(): Promise<void> {
  if (DATABASE_DRIVER === 'mongodb') {
    await connectMongoDB();
    console.log('Banco ativo: MongoDB');
    return;
  }

  const conn = await mariadb.pool.getConnection();
  conn.release();
  console.log('Banco ativo: MariaDB');
}
