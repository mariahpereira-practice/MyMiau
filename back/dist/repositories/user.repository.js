"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = exports.MariaDbUserRepository = void 0;
const database_1 = __importDefault(require("../config/database"));
class MariaDbUserRepository {
    constructor(database = database_1.default) {
        this.database = database;
    }
    async findByEmail(email) {
        const rows = await this.database.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
        return rows[0] ?? null;
    }
    async findByUsername(username) {
        const rows = await this.database.query('SELECT * FROM users WHERE username = ? LIMIT 1', [username]);
        return rows[0] ?? null;
    }
    async findById(id) {
        const rows = await this.database.query('SELECT id, username, email, role, pontuacao, rankGlobal, password_hash FROM users WHERE id = ? LIMIT 1', [id]);
        return rows[0] ?? null;
    }
    async create(data) {
        return this.database.query('INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)', [data.username, data.email, data.password_hash, data.role]);
    }
}
exports.MariaDbUserRepository = MariaDbUserRepository;
exports.userRepository = new MariaDbUserRepository();
//# sourceMappingURL=user.repository.js.map