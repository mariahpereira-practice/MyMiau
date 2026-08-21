"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const user_dto_1 = require("../../dtos/user.dto");
const user_repository_1 = require("../../repositories/user.repository");
const gato_repository_1 = require("../../repositories/gato.repository");
const tsoa_auth_1 = require("../../middlewares/tsoa-auth");
globals_1.jest.mock('../../middlewares/tsoa-auth', () => ({
    expressAuthentication: globals_1.jest.fn(),
}));
(0, globals_1.describe)('Gato API', () => {
    const tutorUserRow = {
        id: 2,
        username: 'juliana',
        email: 'juliana@email.com',
        role: user_dto_1.UserRole.TUTOR,
        password_hash: 'hashed-password',
    };
    const catSitterUserRow = {
        id: 3,
        username: 'carlos',
        email: 'carlos@email.com',
        role: user_dto_1.UserRole.CATSITTER,
        password_hash: 'hashed-password',
    };
    const gatoRow = {
        id: 8,
        nomeGato: 'Marley',
        idadeGato: 2,
        pesoGato: 4.5,
        peloGato: 2,
        racaGato: 'Sem Raça Definida',
        idIcone: 5,
        tutor_id: 2,
        tutorNome: 'juliana',
        disponivel_para_cuidado: 1,
    };
    const updatedGatoRow = {
        ...gatoRow,
        nomeGato: 'Marley Atualizado',
        idadeGato: 3,
        pesoGato: 5,
    };
    const findByIdSpy = globals_1.jest.spyOn(user_repository_1.userRepository, 'findById');
    const findManySpy = globals_1.jest.spyOn(gato_repository_1.gatoRepository, 'findMany');
    const findGatoByIdSpy = globals_1.jest.spyOn(gato_repository_1.gatoRepository, 'findById');
    const createGatoSpy = globals_1.jest.spyOn(gato_repository_1.gatoRepository, 'create');
    const updateGatoSpy = globals_1.jest.spyOn(gato_repository_1.gatoRepository, 'update');
    const mockTutorAuth = () => {
        globals_1.jest.mocked(tsoa_auth_1.expressAuthentication).mockResolvedValue({
            id: tutorUserRow.id,
            username: tutorUserRow.username,
            email: tutorUserRow.email,
            role: tutorUserRow.role,
            pontuacao: 0,
            rankGlobal: 'No rank',
        });
        findByIdSpy.mockResolvedValue(tutorUserRow);
    };
    const mockCatSitterAuth = () => {
        globals_1.jest.mocked(tsoa_auth_1.expressAuthentication).mockResolvedValue({
            id: catSitterUserRow.id,
            username: catSitterUserRow.username,
            email: catSitterUserRow.email,
            role: catSitterUserRow.role,
            pontuacao: 0,
            rankGlobal: 'No rank',
        });
        findByIdSpy.mockResolvedValue(catSitterUserRow);
    };
    (0, globals_1.beforeEach)(() => {
        globals_1.jest.clearAllMocks();
        mockTutorAuth();
    });
    (0, globals_1.describe)('GET /api/gatos/meus', () => {
        (0, globals_1.test)('ver todos os meus gatos como tutor', async () => {
            findManySpy.mockResolvedValue([gatoRow]);
            const response = await (0, supertest_1.default)(app_1.default).get('/api/gatos/meus');
            (0, globals_1.expect)(response.status).toBe(200);
            (0, globals_1.expect)(findManySpy).toHaveBeenCalledWith({
                tutorId: tutorUserRow.id,
                searchGato: undefined,
                searchTutor: undefined,
            });
            (0, globals_1.expect)(response.body).toEqual([gatoRow]);
        });
        (0, globals_1.test)('buscar por nome do gato como tutor', async () => {
            findManySpy.mockResolvedValue([gatoRow]);
            const response = await (0, supertest_1.default)(app_1.default)
                .get('/api/gatos/meus')
                .query({ search: 'mar' });
            (0, globals_1.expect)(response.status).toBe(200);
            (0, globals_1.expect)(findManySpy).toHaveBeenCalledWith({
                tutorId: tutorUserRow.id,
                searchGato: 'mar',
                searchTutor: undefined,
            });
            (0, globals_1.expect)(response.body).toEqual([gatoRow]);
        });
        (0, globals_1.test)('deve retornar lista vazia quando não houver gatos', async () => {
            findManySpy.mockResolvedValue([]);
            const response = await (0, supertest_1.default)(app_1.default).get('/api/gatos/meus');
            (0, globals_1.expect)(response.status).toBe(200);
            (0, globals_1.expect)(response.body).toEqual([]);
            (0, globals_1.expect)(findManySpy).toHaveBeenCalledWith({
                tutorId: tutorUserRow.id,
                searchGato: undefined,
                searchTutor: undefined,
            });
        });
        (0, globals_1.test)('deve retornar 403 quando o usuário não é tutor', async () => {
            mockCatSitterAuth();
            const response = await (0, supertest_1.default)(app_1.default).get('/api/gatos/meus');
            (0, globals_1.expect)(response.status).toBe(403);
            (0, globals_1.expect)(response.body).toEqual({ error: 'Você não tem permissão para esta ação.' });
            (0, globals_1.expect)(findManySpy).not.toHaveBeenCalled();
        });
    });
    (0, globals_1.describe)('GET /api/gatos/disponiveis', () => {
        (0, globals_1.test)('ver todos os gatos como catsitter', async () => {
            mockCatSitterAuth();
            findManySpy.mockResolvedValue([gatoRow]);
            const response = await (0, supertest_1.default)(app_1.default).get('/api/gatos/disponiveis');
            (0, globals_1.expect)(response.status).toBe(200);
            (0, globals_1.expect)(findManySpy).toHaveBeenCalledWith({
                searchGato: undefined,
                searchTutor: undefined,
                disponiveis: true,
            });
            (0, globals_1.expect)(response.body).toEqual([gatoRow]);
        });
        (0, globals_1.test)('buscar por nome do gato ou tutor como catsitter', async () => {
            mockCatSitterAuth();
            findManySpy.mockResolvedValue([gatoRow]);
            const response = await (0, supertest_1.default)(app_1.default)
                .get('/api/gatos/disponiveis')
                .query({ search: 'mar', searchTutor: 'luc' });
            (0, globals_1.expect)(response.status).toBe(200);
            (0, globals_1.expect)(findManySpy).toHaveBeenCalledWith({
                searchGato: 'mar',
                searchTutor: 'luc',
                disponiveis: true,
            });
            (0, globals_1.expect)(response.body).toEqual([gatoRow]);
        });
        (0, globals_1.test)('deve retornar lista vazia quando não houver gatos disponiveis', async () => {
            mockCatSitterAuth();
            findManySpy.mockResolvedValue([]);
            const response = await (0, supertest_1.default)(app_1.default).get('/api/gatos/disponiveis');
            (0, globals_1.expect)(response.status).toBe(200);
            (0, globals_1.expect)(response.body).toEqual([]);
            (0, globals_1.expect)(findManySpy).toHaveBeenCalledWith({
                searchGato: undefined,
                searchTutor: undefined,
                disponiveis: true,
            });
        });
        (0, globals_1.test)('deve retornar 403 quando o usuário não é catsitter', async () => {
            const response = await (0, supertest_1.default)(app_1.default).get('/api/gatos/disponiveis');
            (0, globals_1.expect)(response.status).toBe(403);
            (0, globals_1.expect)(response.body).toEqual({ error: 'Você não tem permissão para esta ação.' });
            (0, globals_1.expect)(findManySpy).not.toHaveBeenCalled();
        });
    });
    (0, globals_1.describe)('POST /api/gatos', () => {
        (0, globals_1.test)('deve criar um gato como tutor', async () => {
            const body = {
                nomeGato: 'Whiskers',
                idadeGato: 3,
                pesoGato: 4.5,
                peloGato: 2,
                racaGato: 'Siamese',
                idIcone: 1,
                disponivel_para_cuidado: true,
            };
            findManySpy.mockResolvedValueOnce([]);
            createGatoSpy.mockResolvedValue({
                id: 9,
                nomeGato: 'Whiskers',
                idadeGato: 3,
                pesoGato: 4.5,
                peloGato: 2,
                racaGato: 'Siamese',
                idIcone: 1,
                tutor_id: tutorUserRow.id,
                tutorNome: tutorUserRow.username,
                disponivel_para_cuidado: 1,
            });
            const response = await (0, supertest_1.default)(app_1.default).post('/api/gatos').send(body);
            (0, globals_1.expect)(response.status).toBe(201);
            (0, globals_1.expect)(findManySpy).toHaveBeenCalledWith({
                searchGato: 'Whiskers',
                tutorId: tutorUserRow.id,
            });
            (0, globals_1.expect)(createGatoSpy).toHaveBeenCalledWith({
                nomeGato: 'Whiskers',
                idadeGato: 3,
                pesoGato: 4.5,
                peloGato: 2,
                racaGato: 'Siamese',
                idIcone: 1,
                tutor_id: tutorUserRow.id,
            });
            (0, globals_1.expect)(response.body).toEqual({
                id: 9,
                nomeGato: 'Whiskers',
                idadeGato: 3,
                pesoGato: 4.5,
                peloGato: 2,
                racaGato: 'Siamese',
                idIcone: 1,
                tutor_id: tutorUserRow.id,
                tutorNome: tutorUserRow.username,
                disponivel_para_cuidado: 1,
            });
        });
        (0, globals_1.test)('deve retornar 400 quando faltam campos obrigatórios para criar o gato', async () => {
            const body = {
                idadeGato: 3,
                pesoGato: 4.5,
                peloGato: 2,
                racaGato: 'Siamese',
                idIcone: 1,
            };
            const response = await (0, supertest_1.default)(app_1.default).post('/api/gatos').send(body);
            (0, globals_1.expect)(response.status).toBe(400);
            (0, globals_1.expect)(response.body).toMatchObject({ error: true, message: 'Dados inválidos.' });
            (0, globals_1.expect)(response.body.errors).toContain('nomeGato é obrigatório.');
            (0, globals_1.expect)(findManySpy).not.toHaveBeenCalled();
            (0, globals_1.expect)(createGatoSpy).not.toHaveBeenCalled();
        });
        (0, globals_1.test)('deve impedir criar gato duplicado para o mesmo tutor', async () => {
            const body = {
                nomeGato: 'Whiskers',
                idadeGato: 3,
                pesoGato: 4.5,
                peloGato: 2,
                racaGato: 'Siamese',
                idIcone: 1,
            };
            findManySpy.mockResolvedValueOnce([gatoRow]);
            const response = await (0, supertest_1.default)(app_1.default).post('/api/gatos').send(body);
            (0, globals_1.expect)(response.status).toBe(500);
            (0, globals_1.expect)(response.body).toEqual({
                statusCode: 500,
                message: 'Já existe um gato com esse nome para este tutor.',
                error: true,
            });
            (0, globals_1.expect)(findManySpy).toHaveBeenCalledWith({
                searchGato: 'Whiskers',
                tutorId: tutorUserRow.id,
            });
            (0, globals_1.expect)(createGatoSpy).not.toHaveBeenCalled();
        });
        (0, globals_1.test)('deve rejeitar tutor_id enviado no body', async () => {
            const body = {
                nomeGato: 'Whiskers',
                idadeGato: 3,
                pesoGato: 4.5,
                peloGato: 2,
                racaGato: 'Siamese',
                idIcone: 1,
                tutor_id: 999,
            };
            const response = await (0, supertest_1.default)(app_1.default).post('/api/gatos').send(body);
            (0, globals_1.expect)(response.status).toBe(400);
            (0, globals_1.expect)(response.body.errors).toContain('tutor_id não é permitido.');
            (0, globals_1.expect)(createGatoSpy).not.toHaveBeenCalled();
        });
        (0, globals_1.test)('deve retornar 403 quando o usuário não é tutor', async () => {
            mockCatSitterAuth();
            const response = await (0, supertest_1.default)(app_1.default).post('/api/gatos').send({});
            (0, globals_1.expect)(response.status).toBe(403);
            (0, globals_1.expect)(response.body).toEqual({ error: 'Você não tem permissão para esta ação.' });
            (0, globals_1.expect)(findManySpy).not.toHaveBeenCalled();
            (0, globals_1.expect)(createGatoSpy).not.toHaveBeenCalled();
        });
    });
    (0, globals_1.describe)('PUT /api/gatos/:id', () => {
        (0, globals_1.test)('deve atualizar um gato como tutor', async () => {
            findGatoByIdSpy.mockResolvedValueOnce(gatoRow).mockResolvedValueOnce(updatedGatoRow);
            updateGatoSpy.mockResolvedValue(undefined);
            const response = await (0, supertest_1.default)(app_1.default)
                .put('/api/gatos/8')
                .send({
                nomeGato: 'Marley Atualizado',
                idadeGato: 3,
                pesoGato: 5,
                peloGato: 2,
                racaGato: 'Sem Raça Definida',
                idIcone: 5,
                disponivel_para_cuidado: 0,
            });
            (0, globals_1.expect)(response.status).toBe(200);
            (0, globals_1.expect)(findGatoByIdSpy).toHaveBeenNthCalledWith(1, 8);
            (0, globals_1.expect)(updateGatoSpy).toHaveBeenCalledWith(8, {
                nomeGato: 'Marley Atualizado',
                idadeGato: 3,
                pesoGato: 5,
                peloGato: 2,
                racaGato: 'Sem Raça Definida',
                idIcone: 5,
                disponivel_para_cuidado: 0,
            });
            (0, globals_1.expect)(response.body).toEqual(updatedGatoRow);
        });
        (0, globals_1.test)('deve retornar 500 quando o id do gato não é encontrado', async () => {
            findGatoByIdSpy.mockResolvedValueOnce(null);
            const response = await (0, supertest_1.default)(app_1.default)
                .put('/api/gatos/999')
                .send({
                nomeGato: 'Sem gato',
                idadeGato: 1,
                pesoGato: 1,
                peloGato: 1,
                racaGato: 'SRD',
                idIcone: 1,
            });
            (0, globals_1.expect)(response.status).toBe(500);
            (0, globals_1.expect)(response.body).toEqual({
                statusCode: 500,
                message: 'Gato não encontrado.',
                error: true,
            });
            (0, globals_1.expect)(updateGatoSpy).not.toHaveBeenCalled();
        });
        (0, globals_1.test)('deve retornar 500 quando o usuario não tem permissão para atualizar o gato com o id digitado', async () => {
            const otherUserGato = {
                ...gatoRow,
                tutor_id: 999,
            };
            findGatoByIdSpy.mockResolvedValueOnce(otherUserGato);
            const response = await (0, supertest_1.default)(app_1.default)
                .put('/api/gatos/8')
                .send({
                nomeGato: 'Marley Atualizado',
                idadeGato: 3,
                pesoGato: 5,
                peloGato: 2,
                racaGato: 'Sem Raça Definida',
                idIcone: 5,
            });
            (0, globals_1.expect)(response.status).toBe(500);
            (0, globals_1.expect)(response.body).toEqual({
                statusCode: 500,
                message: 'Você não tem permissão para atualizar este gato.',
                error: true,
            });
            (0, globals_1.expect)(updateGatoSpy).not.toHaveBeenCalled();
        });
        (0, globals_1.test)('deve retornar 400 quando todos os dados vierem como nulo', async () => {
            const invalidGato = {
                ...gatoRow,
                nomeGato: null,
            };
            findGatoByIdSpy.mockResolvedValueOnce(invalidGato);
            const response = await (0, supertest_1.default)(app_1.default)
                .put('/api/gatos/8')
                .send({
                nomeGato: null,
                idadeGato: null,
                pesoGato: null,
                peloGato: null,
                racaGato: null,
                idIcone: null,
                disponivel_para_cuidado: null,
            });
            (0, globals_1.expect)(response.status).toBe(400);
            (0, globals_1.expect)(response.body).toMatchObject({ error: true, message: 'Dados inválidos.' });
            (0, globals_1.expect)(updateGatoSpy).not.toHaveBeenCalled();
        });
        (0, globals_1.test)('deve retornar 403 quando o usuário não é tutor', async () => {
            mockCatSitterAuth();
            const response = await (0, supertest_1.default)(app_1.default).put('/api/gatos/1').send({});
            (0, globals_1.expect)(response.status).toBe(403);
            (0, globals_1.expect)(response.body).toEqual({ error: 'Você não tem permissão para esta ação.' });
            (0, globals_1.expect)(updateGatoSpy).not.toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=gato.api.test.js.map