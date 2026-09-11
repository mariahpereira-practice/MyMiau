import 'dotenv/config';
import mariadb, { Pool, PoolConnection } from 'mariadb';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

let pool: Pool | undefined;

function getPool(): Pool {
  if (!pool) {
    pool = mariadb.createPool({
      host: requireEnv('DB_HOST'),
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
      user: requireEnv('DB_USER'),
      password: requireEnv('DB_PASSWORD'),
      database: requireEnv('DB_NAME'),
      connectionLimit: process.env.DB_CONN_LIMIT
        ? Number(process.env.DB_CONN_LIMIT)
        : 10,
    });
  }

  return pool;
}

async function query<T = unknown>(sql: string, params?: unknown[]): Promise<T> {
  let conn: PoolConnection | undefined;

  try {
    conn = await getPool().getConnection();
    const res = await conn.query(sql, params);
    return res as T;
  } finally {
    conn?.release();
  }
}

export default {
  get pool(): Pool {
    return getPool();
  },
  query,
};
