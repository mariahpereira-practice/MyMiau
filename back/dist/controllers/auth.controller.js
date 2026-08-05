"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const auth_service_1 = require("../services/auth.service");
const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const { user, token } = await (0, auth_service_1.registerUser)({ username, email, password });
        return res.json({ jwt: token, user });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { identifier, password } = req.body;
        const { user, token } = await (0, auth_service_1.loginUser)({ identifier, password });
        return res.json({ jwt: token, user });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
//# sourceMappingURL=auth.controller.js.map