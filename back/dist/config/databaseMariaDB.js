"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mariadb_1 = __importDefault(require("mariadb"));
function requireEnv(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}
let pool;
function getPool() {
    if (!pool) {
        pool = mariadb_1.default.createPool({
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
async function query(sql, params) {
    let conn;
    try {
        conn = await getPool().getConnection();
        const res = await conn.query(sql, params);
        return res;
    }
    finally {
        conn?.release();
    }
}
exports.default = {
    get pool() {
        return getPool();
    },
    query,
};
//# sourceMappingURL=databaseMariaDB.js.map