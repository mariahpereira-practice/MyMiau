"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const auth_service_1 = require("../../services/auth.service");
const user_dto_1 = require("../../dtos/user.dto");
globals_1.jest.mock('../../services/auth.service', () => ({
    authService: {
        registerUser: globals_1.jest.fn(),
        loginUser: globals_1.jest.fn(),
    },
}));
(0, globals_1.describe)('Auth API', () => {
    (0, globals_1.beforeEach)(() => {
        globals_1.jest.clearAllMocks();
    });
    (0, globals_1.describe)('POST /api/auth/login', () => {
        (0, globals_1.test)('fazendo login como tutor', async () => {
            const body = {
                identifier: 'juliana@email.com',
                password: 'senha123',
            };
            auth_service_1.authService.loginUser.mockResolvedValue({
                token: 'jwt-login-token',
                role: 'TUTOR',
                user: {
                    id: 2,
                    username: 'juliana',
                    email: 'juliana@email.com',
                    role: 'TUTOR',
                    pontuacao: 0,
                    rankGlobal: 'No rank',
                },
            });
            const response = await (0, supertest_1.default)(app_1.default).post('/api/auth/login').send(body);
            (0, globals_1.expect)(response.status).toBe(200);
            (0, globals_1.expect)(response.body).toHaveProperty('jwt');
            (0, globals_1.expect)(response.body).toHaveProperty('role');
            (0, globals_1.expect)(response.body.user).toEqual({
                id: 2,
                username: 'juliana',
                email: 'juliana@email.com',
                role: 'TUTOR',
                pontuacao: 0,
                rankGlobal: 'No rank',
            });
            (0, globals_1.expect)(auth_service_1.authService.loginUser).toHaveBeenCalledWith(body);
        });
        (0, globals_1.test)('fazendo login como catsitter', async () => {
            const body = {
                identifier: 'heloisa@email.com',
                password: 'senha123',
            };
            auth_service_1.authService.loginUser.mockResolvedValue({
                token: 'jwt-login-token-catsitter',
                role: 'CATSITTER',
                user: {
                    id: 1,
                    username: 'heloisa',
                    email: 'heloisa@email.com',
                    role: 'CATSITTER',
                    pontuacao: 80,
                    rankGlobal: 'No rank',
                },
            });
            const response = await (0, supertest_1.default)(app_1.default).post('/api/auth/login').send(body);
            (0, globals_1.expect)(response.status).toBe(200);
            (0, globals_1.expect)(response.body).toHaveProperty('jwt');
            (0, globals_1.expect)(response.body).toHaveProperty('role');
            (0, globals_1.expect)(response.body.user).toEqual({
                id: 1,
                username: 'heloisa',
                email: 'heloisa@email.com',
                role: 'CATSITTER',
                pontuacao: 80,
                rankGlobal: 'No rank',
            });
            (0, globals_1.expect)(auth_service_1.authService.loginUser).toHaveBeenCalledWith(body);
        });
    });
    (0, globals_1.describe)('POST /api/auth/register', () => {
        (0, globals_1.test)('fazendo registro de um usuario', async () => {
            const body = {
                username: 'novoUsuario',
                email: 'novoUsuario@email.com',
                password: 'senha123',
                role: user_dto_1.UserRole.TUTOR,
            };
            auth_service_1.authService.registerUser.mockResolvedValue({
                token: 'jwt-register-token',
                role: user_dto_1.UserRole.TUTOR,
                user: {
                    id: 999,
                    username: 'novoUsuario',
                    email: 'novoUsuario@email.com',
                    role: 'TUTOR',
                    pontuacao: 0,
                    rankGlobal: 'No rank',
                },
            });
            const response = await (0, supertest_1.default)(app_1.default).post('/api/auth/register').send(body);
            (0, globals_1.expect)(response.status).toBe(200);
            (0, globals_1.expect)(response.body).toHaveProperty('jwt');
            (0, globals_1.expect)(response.body).toHaveProperty('role');
            (0, globals_1.expect)(response.body.user).toEqual({
                id: 999,
                username: 'novoUsuario',
                email: 'novoUsuario@email.com',
                role: 'TUTOR',
                pontuacao: 0,
                rankGlobal: 'No rank',
            });
            (0, globals_1.expect)(auth_service_1.authService.registerUser).toHaveBeenCalledWith(body);
        });
    });
});
//# sourceMappingURL=auth.api.test.js.map