"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATABASE_DRIVER = void 0;
exports.connectDatabase = connectDatabase;
require("dotenv/config");
const databaseMariaDB_1 = __importDefault(require("./databaseMariaDB"));
const databaseMongoDB_1 = require("./databaseMongoDB");
// ========== UNICO LUGAR QUE DECIDE O BANCO ==========
// Troque aqui (ou defina DB_DRIVER no .env).
const DEFAULT_DRIVER = 'mongodb';
// ====================================================
function resolveDriver() {
    const value = process.env.DB_DRIVER?.trim().toLowerCase();
    if (!value) {
        return DEFAULT_DRIVER;
    }
    if (value !== 'mariadb' && value !== 'mongodb') {
        throw new Error(`DB_DRIVER invalido: "${value}". Use "mariadb" ou "mongodb".`);
    }
    return value;
}
exports.DATABASE_DRIVER = resolveDriver();
async function connectDatabase() {
    if (exports.DATABASE_DRIVER === 'mongodb') {
        await (0, databaseMongoDB_1.connectMongoDB)();
        console.log('Banco ativo: MongoDB');
        return;
    }
    const conn = await databaseMariaDB_1.default.pool.getConnection();
    conn.release();
    console.log('Banco ativo: MariaDB');
}
//# sourceMappingURL=database.js.map