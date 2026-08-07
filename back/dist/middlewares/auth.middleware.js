"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = exports.requiredAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const user_dto_1 = require("../dtos/user.dto");
Object.defineProperty(exports, "UserRole", { enumerable: true, get: function () { return user_dto_1.UserRole; } });
const JWT_SECRET = process.env.JWT_SECRET || 'change_me';
const requiredAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token não fornecido.' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const userId = Number(payload.id);
        if (!payload.id || Number.isNaN(userId)) {
            return res.status(401).json({ error: 'Token inválido ou expirado.' });
        }
        const user = await user_model_1.UserModel.findById(userId);
        if (!user) {
            return res.status(401).json({ error: 'Token inválido ou expirado.' });
        }
        const userInstance = new user_model_1.UserModel({ user });
        const normalizedUser = userInstance.toProfileResponse();
        if (!normalizedUser) {
            return res.status(401).json({ error: 'Token inválido ou expirado.' });
        }
        req.user = normalizedUser;
        return next();
    }
    catch (_error) {
        return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }
};
exports.requiredAuth = requiredAuth;
//# sourceMappingURL=auth.middleware.js.map