"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = void 0;
exports.requiredAuth = requiredAuth;
exports.authorizeRoles = authorizeRoles;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const user_role_1 = require("../types/user-role");
Object.defineProperty(exports, "UserRole", { enumerable: true, get: function () { return user_role_1.UserRole; } });
const JWT_SECRET = process.env.JWT_SECRET || 'change_me';
function normalizeUser(user) {
    const normalized = {
        id: Number(user.id),
        username: user.username,
        email: user.email,
        role: user.role || user_role_1.UserRole.TUTOR,
    };
    if (user.pontuacao !== undefined) {
        normalized.pontuacao = user.pontuacao;
    }
    if (user.rankGlobal !== undefined) {
        normalized.rankGlobal = user.rankGlobal;
    }
    return normalized;
}
async function requiredAuth(req, res, next) {
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
        const user = await (0, user_model_1.findById)(userId);
        if (!user) {
            return res.status(401).json({ error: 'Token inválido ou expirado.' });
        }
        req.user = normalizeUser(user);
        return next();
    }
    catch (_error) {
        return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }
}
function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Token não fornecido.' });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Você não tem permissão para esta ação.' });
        }
        return next();
    };
}
//# sourceMappingURL=auth.middleware.js.map