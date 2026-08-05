"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findByEmail = findByEmail;
exports.findByUsername = findByUsername;
exports.findById = findById;
exports.createUser = createUser;
const database_1 = __importDefault(require("../config/database"));
const user_role_1 = require("../types/user-role");
function normalizeUser(row) {
    if (!row) {
        return null;
    }
    return {
        ...row,
        id: Number(row.id),
        role: row.role || user_role_1.UserRole.TUTOR,
    };
}
async function findByEmail(email) {
    const rows = await database_1.default.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    return normalizeUser(rows[0] ?? null);
}
async function findByUsername(username) {
    const rows = await database_1.default.query('SELECT * FROM users WHERE username = ? LIMIT 1', [username]);
    return normalizeUser(rows[0] ?? null);
}
async function findById(id) {
    const rows = await database_1.default.query('SELECT id, username, email, role, pontuacao, rankGlobal, password_hash FROM users WHERE id = ? LIMIT 1', [id]);
    return normalizeUser(rows[0] ?? null);
}
async function createUser({ username, email, password_hash, role, }) {
    const result = await database_1.default.query('INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)', [username, email, password_hash, role]);
    return result;
}
//# sourceMappingURL=user.model.js.map