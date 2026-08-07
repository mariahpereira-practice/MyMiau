"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const auth_service_1 = require("../services/auth.service");
const register = async (req, res, next) => {
    try {
        const input = req.body;
        const { user, token, role: registeredRole } = await (0, auth_service_1.registerUser)(input);
        return res.json({ jwt: token, user, role: registeredRole });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const input = req.body;
        const { user, token, role: loggedInRole } = await (0, auth_service_1.loginUser)(input);
        return res.json({ jwt: token, user, role: loggedInRole });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
//# sourceMappingURL=auth.controller.js.map