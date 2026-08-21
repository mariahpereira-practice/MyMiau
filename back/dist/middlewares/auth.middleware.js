"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = exports.requiredAuth = void 0;
const user_dto_1 = require("../dtos/user.dto");
Object.defineProperty(exports, "UserRole", { enumerable: true, get: function () { return user_dto_1.UserRole; } });
const authenticator_1 = require("./authenticator");
const requiredAuth = async (req, res, next) => {
    try {
        req.user = await (0, authenticator_1.authenticateUser)(req);
        return next();
    }
    catch (error) {
        const authError = error;
        return res.status(authError.status || 401).json({ error: authError.message });
    }
};
exports.requiredAuth = requiredAuth;
//# sourceMappingURL=auth.middleware.js.map