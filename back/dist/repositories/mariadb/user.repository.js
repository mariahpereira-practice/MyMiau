"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mariaDbUserRepository = exports.MariaDbUserRepository = void 0;
const databaseMariaDB_1 = __importDefault(require("../../config/databaseMariaDB"));
function toUserRow(row) {
    return { ...row, id: String(row.id) };
}
class MariaDbUserRepository {
    constructor(database = databaseMariaDB_1.default) {
        this.database = database;
    }
    async findByEmail(email) {
        const rows = await this.database.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
        return rows[0] ? toUserRow(rows[0]) : null;
    }
    async findByUsername(username) {
        const rows = await this.database.query('SELECT * FROM users WHERE username = ? LIMIT 1', [username]);
        return rows[0] ? toUserRow(rows[0]) : null;
    }
    async findById(id) {
        const rows = await this.database.query('SELECT id, username, email, role, pontuacao, rankGlobal, password_hash FROM users WHERE id = ? LIMIT 1', [Number(id)]);
        return rows[0] ? toUserRow(rows[0]) : null;
    }
    async create(data) {
        const result = await this.database.query('INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)', [data.username, data.email, data.password_hash, data.role]);
        return { insertId: String(result.insertId) };
    }
}
exports.MariaDbUserRepository = MariaDbUserRepository;
exports.mariaDbUserRepository = new MariaDbUserRepository();
//# sourceMappingURL=user.repository.js.map