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
const user_dto_1 = require("../dtos/user.dto");
const JWT_SECRET = process.env.JWT_SECRET || 'change_me';
function createHttpError(status, message) {
    const error = new Error(message);
    error.status = status;
    return error;
}
function mapPublicUser(user) {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role ?? user_dto_1.UserRole.TUTOR,
        pontuacao: Number(user.pontuacao ?? 0),
        rankGlobal: user.rankGlobal ?? undefined,
    };
}
async function registerUser({ username, email, password, role }) {
    if (!username || !email || !password) {
        throw createHttpError(400, 'Username, email and password are required.');
    }
    const existingByEmail = await user_model_1.UserModel.findByEmail(email);
    if (existingByEmail) {
        throw createHttpError(409, 'Email already in use.');
    }
    const existingByUsername = await user_model_1.UserModel.findByUsername(username);
    if (existingByUsername) {
        throw createHttpError(409, 'Username already in use.');
    }
    const passwordHash = await bcryptjs_1.default.hash(password, 10);
    const newUser = await user_model_1.UserModel.create({
        username,
        email,
        password_hash: passwordHash,
        role: role ?? user_dto_1.UserRole.TUTOR,
    });
    const user = {
        id: Number(newUser.insertId),
        username,
        email,
        role: role ?? user_dto_1.UserRole.TUTOR,
    };
    const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    return { user, token, role: role ?? user_dto_1.UserRole.TUTOR };
}
async function loginUser({ identifier, password }) {
    if (!identifier || !password) {
        throw createHttpError(400, 'Identifier and password are required.');
    }
    const userRow = (await user_model_1.UserModel.findByEmail(identifier)) || (await user_model_1.UserModel.findByUsername(identifier));
    if (!userRow) {
        throw createHttpError(401, 'Invalid credentials.');
    }
    const user = new user_model_1.UserModel({ user: userRow });
    if (!user.passwordHash) {
        throw createHttpError(401, 'Invalid credentials.');
    }
    const isValidPassword = await bcryptjs_1.default.compare(password, user.passwordHash);
    if (!isValidPassword) {
        throw createHttpError(401, 'Invalid credentials.');
    }
    if (!user.id || !user.email) {
        throw createHttpError(401, 'Invalid credentials.');
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role ?? user_dto_1.UserRole.TUTOR }, JWT_SECRET, { expiresIn: '7d' });
    if (user.role === user_dto_1.UserRole.CATSITTER) {
        return {
            user: mapPublicUser(user),
            token,
            role: user_dto_1.UserRole.CATSITTER,
        };
    }
    else if (user.role === user_dto_1.UserRole.MODERATOR) {
        return {
            user: mapPublicUser(user),
            token,
            role: user_dto_1.UserRole.MODERATOR,
        };
    }
    else if (user.role === user_dto_1.UserRole.ADMIN) {
        return {
            user: mapPublicUser(user),
            token,
            role: user_dto_1.UserRole.ADMIN,
        };
    }
    else {
        return {
            user: mapPublicUser(user),
            token,
            role: user_dto_1.UserRole.TUTOR,
        };
    }
}
//# sourceMappingURL=auth.service.js.map