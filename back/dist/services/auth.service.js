"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const user_role_1 = require("../types/user-role");
const JWT_SECRET = process.env.JWT_SECRET || 'change_me';
function createHttpError(status, message) {
    const error = new Error(message);
    error.status = status;
    return error;
}
function mapPublicUser(user) {
    return {
        id: Number(user.id),
        username: user.username,
        email: user.email,
        role: user.role || user_role_1.UserRole.TUTOR,
        pontuacao: Number(user.pontuacao ?? 0),
        rankGlobal: user.rankGlobal,
    };
}
async function registerUser({ username, email, password, }) {
    if (!username || !email || !password) {
        throw createHttpError(400, 'Username, email and password are required.');
    }
    const existingByEmail = await (0, user_model_1.findByEmail)(email);
    if (existingByEmail) {
        throw createHttpError(409, 'Email already in use.');
    }
    const existingByUsername = await (0, user_model_1.findByUsername)(username);
    if (existingByUsername) {
        throw createHttpError(409, 'Username already in use.');
    }
    const passwordHash = await bcryptjs_1.default.hash(password, 10);
    const newUser = await (0, user_model_1.createUser)({
        username,
        email,
        password_hash: passwordHash,
        role: user_role_1.UserRole.TUTOR,
    });
    const user = {
        id: Number(newUser.insertId),
        username,
        email,
        role: user_role_1.UserRole.TUTOR,
    };
    const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    return { user, token };
}
async function loginUser({ identifier, password }) {
    if (!identifier || !password) {
        throw createHttpError(400, 'Identifier and password are required.');
    }
    const user = (await (0, user_model_1.findByEmail)(identifier)) || (await (0, user_model_1.findByUsername)(identifier));
    if (!user) {
        throw createHttpError(401, 'Invalid credentials.');
    }
    const isValidPassword = await bcryptjs_1.default.compare(password, user.password_hash);
    if (!isValidPassword) {
        throw createHttpError(401, 'Invalid credentials.');
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role || user_role_1.UserRole.TUTOR }, JWT_SECRET, { expiresIn: '7d' });
    return {
        user: mapPublicUser(user),
        token,
    };
}
//# sourceMappingURL=auth.service.js.map