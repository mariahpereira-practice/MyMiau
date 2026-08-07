"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = void 0;
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Token não fornecido.' });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Você não tem permissão para esta ação.' });
        }
        return next();
    };
};
exports.authorizeRoles = authorizeRoles;
//# sourceMappingURL=role.middleware.js.map