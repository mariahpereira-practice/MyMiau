"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const authAction_1 = require("../models/authAction");
const user_repository_1 = require("../repositories/user.repository");
class AuthService {
    constructor(repository = user_repository_1.userRepository) {
        this.repository = repository;
        this.__jwtSecret = process.env.JWT_SECRET || 'change_me';
    }
    async registerUser(input) {
        const action = new authAction_1.RegisterUserAction(input, this.__jwtSecret, this.repository);
        return action.run();
    }
    async loginUser(input) {
        const action = new authAction_1.LoginUserAction(input, this.__jwtSecret, this.repository);
        return action.run();
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
//# sourceMappingURL=auth.service.js.map