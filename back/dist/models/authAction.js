"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserAction = exports.RegisterUserAction = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_dto_1 = require("../dtos/user.dto");
const action_1 = require("./action");
const user_model_1 = require("./user.model");
const user_repository_1 = require("../repositories/user.repository");
class AuthAction extends action_1.Action {
    constructor(jwtSecret, userRepository = userRepository) {
        super();
        this.userRepository = userRepository;
        this.jwtSecret = jwtSecret;
    }
    createHttpError(status, message) {
        const error = new Error(message);
        error.status = status;
        return error;
    }
}
class RegisterUserAction extends AuthAction {
    constructor(input, jwtSecret, repository = user_repository_1.userRepository) {
        super(jwtSecret, repository);
        this.input = input;
    }
    async run() {
        const { username, email, password, role } = this.input;
        if (!username || !email || !password) {
            throw this.createHttpError(400, 'Username, email and password are required.');
        }
        const existingByEmail = await this.userRepository.findByEmail(email);
        if (existingByEmail) {
            throw this.createHttpError(409, 'Email already in use.');
        }
        const existingByUsername = await this.userRepository.findByUsername(username);
        if (existingByUsername) {
            throw this.createHttpError(409, 'Username already in use.');
        }
        const userRole = role ?? user_dto_1.UserRole.TUTOR;
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        const newUser = await this.userRepository.create({
            username,
            email,
            password_hash: passwordHash,
            role: userRole,
        });
        const user = {
            id: Number(newUser.insertId),
            username,
            email,
            role: userRole,
        };
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, this.jwtSecret, { expiresIn: '7d' });
        return { user, token, role: userRole };
    }
}
exports.RegisterUserAction = RegisterUserAction;
class LoginUserAction extends AuthAction {
    constructor(input, jwtSecret, repository = user_repository_1.userRepository) {
        super(jwtSecret, repository);
        this.input = input;
    }
    mapPublicUser(user) {
        const mappedUser = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role ?? user_dto_1.UserRole.TUTOR,
            pontuacao: Number(user.pontuacao ?? 0),
        };
        if (user.rankGlobal !== null) {
            mappedUser.rankGlobal = user.rankGlobal;
        }
        return mappedUser;
    }
    async run() {
        const { identifier, password } = this.input;
        if (!identifier || !password) {
            throw this.createHttpError(400, 'Identifier and password are required.');
        }
        const userRow = (await this.userRepository.findByEmail(identifier)) || (await this.userRepository.findByUsername(identifier));
        if (!userRow) {
            throw this.createHttpError(401, 'Invalid credentials.');
        }
        const user = new user_model_1.UserModel({ user: userRow });
        if (!user.passwordHash) {
            throw this.createHttpError(401, 'Invalid credentials.');
        }
        const isValidPassword = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isValidPassword) {
            throw this.createHttpError(401, 'Invalid credentials.');
        }
        if (!user.id || !user.email) {
            throw this.createHttpError(401, 'Invalid credentials.');
        }
        const resolvedRole = user.role ?? user_dto_1.UserRole.TUTOR;
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: resolvedRole }, this.jwtSecret, { expiresIn: '7d' });
        return {
            user: this.mapPublicUser(user),
            token,
            role: resolvedRole,
        };
    }
}
exports.LoginUserAction = LoginUserAction;
//# sourceMappingURL=authAction.js.map