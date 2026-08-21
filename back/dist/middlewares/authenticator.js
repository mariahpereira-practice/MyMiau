"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = authenticateUser;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const user_repository_1 = require("../repositories/user.repository");
const JWT_SECRET = process.env.JWT_SECRET || 'change_me';
async function authenticateUser(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw Object.assign(new Error('Token não fornecido.'), { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        throw Object.assign(new Error('Token inválido ou expirado.'), { status: 401 });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const userId = Number(payload.id);
        if (!payload.id || Number.isNaN(userId)) {
            throw new Error('Token inválido ou expirado.');
        }
        const user = await user_repository_1.userRepository.findById(userId);
        if (!user) {
            throw new Error('Token inválido ou expirado.');
        }
        const normalizedUser = new user_model_1.UserModel({ user }).toProfileResponse();
        if (!normalizedUser) {
            throw new Error('Token inválido ou expirado.');
        }
        return normalizedUser;
    }
    catch (_error) {
        throw Object.assign(new Error('Token inválido ou expirado.'), { status: 401 });
    }
}
//# sourceMappingURL=authenticator.js.map