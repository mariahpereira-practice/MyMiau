"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const database_1 = __importDefault(require("../config/database"));
const user_dto_1 = require("../dtos/user.dto");
class UserModel {
    constructor(data) {
        this.__userRow = data.user;
    }
    get id() {
        return this.__userRow?.id || null;
    }
    get username() {
        return this.__userRow?.username || null;
    }
    get email() {
        return this.__userRow?.email || null;
    }
    get role() {
        return this.__userRow?.role || null;
    }
    get pontuacao() {
        return this.__userRow?.pontuacao || null;
    }
    get rankGlobal() {
        return this.__userRow?.rankGlobal || null;
    }
    get passwordHash() {
        return this.__userRow?.password_hash || null;
    }
    toProfileResponse() {
        if (!this.__userRow) {
            return null;
        }
        const profile = {
            id: this.id,
            username: this.username,
            email: this.email,
            role: this.role ?? user_dto_1.UserRole.TUTOR,
        };
        if (this.pontuacao !== null) {
            profile.pontuacao = this.pontuacao;
        }
        if (this.rankGlobal !== null) {
            profile.rankGlobal = this.rankGlobal;
        }
        return profile;
    }
    static __normalizeUser(row) {
        if (!row) {
            return null;
        }
        return {
            ...row,
            id: Number(row.id),
            role: row.role || user_dto_1.UserRole.TUTOR,
        };
    }
    static async findByEmail(email) {
        const rows = await database_1.default.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
        return UserModel.__normalizeUser(rows[0] ?? null);
    }
    static async findByUsername(username) {
        const rows = await database_1.default.query('SELECT * FROM users WHERE username = ? LIMIT 1', [username]);
        return UserModel.__normalizeUser(rows[0] ?? null);
    }
    static async findById(id) {
        const rows = await database_1.default.query('SELECT id, username, email, role, pontuacao, rankGlobal, password_hash FROM users WHERE id = ? LIMIT 1', [id]);
        return UserModel.__normalizeUser(rows[0] ?? null);
    }
    static async create({ username, email, password_hash, role, }) {
        const result = await database_1.default.query('INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)', [username, email, password_hash, role]);
        return result;
    }
}
exports.UserModel = UserModel;
//# sourceMappingURL=user.model.js.map