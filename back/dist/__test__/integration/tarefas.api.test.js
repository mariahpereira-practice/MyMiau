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
const tarefa_repository_1 = require("../../repositories/tarefa.repository");
const tsoa_auth_1 = require("../../middlewares/tsoa-auth");
globals_1.jest.mock('../../middlewares/tsoa-auth', () => ({
    expressAuthentication: globals_1.jest.fn(),
}));
(0, globals_1.describe)('Tarefa API', () => {
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
    const gatoTutorRow = {
        id: 8,
        nomeGato: 'Marley',
        idadeGato: 2,
        pesoGato: 4.5,
        peloGato: 2,
        racaGato: 'Sem Raça Definida',
        idIcone: 5,
        tutor_id: tutorUserRow.id,
        tutorNome: tutorUserRow.username,
        disponivel_para_cuidado: 1,
    };
    const gatoDeOutroTutorRow = {
        ...gatoTutorRow,
        tutor_id: 999,
        tutorNome: 'outroTutor',
    };
    const gatoIndisponivelRow = {
        ...gatoTutorRow,
        disponivel_para_cuidado: 0,
    };
    const tarefaRow = {
        idTarefa: 7,
        gato_id: gatoTutorRow.id,
        descricao: 'Escovar o gato',
        pontos: 10,
        status: 'PENDENTE',
        concluida_por: null,
        concluida_em: null,
    };
    const tarefaConcluidaRow = {
        ...tarefaRow,
        status: 'CONCLUIDA',
    };
    const tarefaDeOutroGatoRow = {
        ...tarefaRow,
        gato_id: 999,
    };
    const userFindByIdSpy = globals_1.jest.spyOn(user_repository_1.userRepository, 'findById');
    const gatoFindByIdSpy = globals_1.jest.spyOn(gato_repository_1.gatoRepository, 'findById');
    const tarefaFindManySpy = globals_1.jest.spyOn(tarefa_repository_1.tarefaRepository, 'findMany');
    const tarefaFindByIdSpy = globals_1.jest.spyOn(tarefa_repository_1.tarefaRepository, 'findById');
    const tarefaCreateSpy = globals_1.jest.spyOn(tarefa_repository_1.tarefaRepository, 'create');
    const tarefaDeleteSpy = globals_1.jest.spyOn(tarefa_repository_1.tarefaRepository, 'delete');
    const tarefaUpdateSpy = globals_1.jest.spyOn(tarefa_repository_1.tarefaRepository, 'update');
    const updateStatusSpy = globals_1.jest.spyOn(tarefa_repository_1.tarefaRepository, 'updateStatus');
    const updatePontuacaoSpy = globals_1.jest.spyOn(tarefa_repository_1.tarefaRepository, 'addPoints');
    const mockTutorAuth = () => {
        globals_1.jest.mocked(tsoa_auth_1.expressAuthentication).mockResolvedValue({
            id: tutorUserRow.id,
            username: tutorUserRow.username,
            email: tutorUserRow.email,
            role: tutorUserRow.role,
            pontuacao: 0,
            rankGlobal: 'No rank',
        });
        userFindByIdSpy.mockResolvedValue(tutorUserRow);
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
        userFindByIdSpy.mockResolvedValue(catSitterUserRow);
    };
    (0, globals_1.beforeEach)(() => {
        globals_1.jest.clearAllMocks();
        mockTutorAuth();
    });
    (0, globals_1.describe)('GET /api/tarefas/:idGato', () => {
        (0, globals_1.test)('ver todas as tarefas de um gato especifico como tutor', async () => {
            gatoFindByIdSpy.mockResolvedValueOnce(gatoTutorRow);
            tarefaFindManySpy.mockResolvedValueOnce([tarefaRow]);
            const response = await (0, supertest_1.default)(app_1.default).get(`/api/tarefas/${gatoTutorRow.id}`);
            (0, globals_1.expect)(response.status).toBe(200);
            (0, globals_1.expect)(gatoFindByIdSpy).toHaveBeenCalledWith(gatoTutorRow.id);
            (0, globals_1.expect)(tarefaFindManySpy).toHaveBeenCalledWith(gatoTutorRow.id);
            (0, globals_1.expect)(response.body).toEqual({ tarefas: [tarefaRow] });
        });
        (0, globals_1.test)('retornar erro se visualizar tarefas de gato especifico que não existe', async () => {
            gatoFindByIdSpy.mockResolvedValueOnce(null);
            const response = await (0, supertest_1.default)(app_1.default).get(`/api/tarefas/${gatoTutorRow.id}`);
            (0, globals_1.expect)(response.status).toBe(500);
            (0, globals_1.expect)(response.body).toEqual({
                statusCode: 500,
                message: 'Gato não encontrado.',
                error: true,
            });
            (0, globals_1.expect)(tarefaFindManySpy).not.toHaveBeenCalled();
        });
        (0, globals_1.test)('ver todas as tarefas de um gato especifico como catsitter', async () => {
            mockCatSitterAuth();
            gatoFindByIdSpy.mockResolvedValueOnce(gatoTutorRow);
            tarefaFindManySpy.mockResolvedValueOnce([tarefaRow]);
            const response = await (0, supertest_1.default)(app_1.default).get(`/api/tarefas/${gatoTutorRow.id}`);
            (0, globals_1.expect)(response.status).toBe(200);
            (0, globals_1.expect)(gatoFindByIdSpy).toHaveBeenCalledWith(gatoTutorRow.id);
            (0, globals_1.expect)(tarefaFindManySpy).toHaveBeenCalledWith(gatoTutorRow.id);
            (0, globals_1.expect)(response.body).toEqual({ tarefas: [tarefaRow] });
        });
        (0, globals_1.test)('retornar erro se visualizar tarefas de um gato especifico sem disponibilidade como catsitter', async () => {
            mockCatSitterAuth();
            gatoFindByIdSpy.mockResolvedValueOnce(gatoIndisponivelRow);
            const response = await (0, supertest_1.default)(app_1.default).get(`/api/tarefas/${gatoTutorRow.id}`);
            (0, globals_1.expect)(response.status).toBe(500);
            (0, globals_1.expect)(response.body).toEqual({
                statusCode: 500,
                message: 'Gato não disponível para cuidado.',
                error: true,
            });
            (0, globals_1.expect)(tarefaFindManySpy).not.toHaveBeenCalled();
        });
        (0, globals_1.test)('retornar erro se visualizar tarefas de gato especifico que o tutor não possui permissão', async () => {
            gatoFindByIdSpy.mockResolvedValueOnce(gatoDeOutroTutorRow);
            const response = await (0, supertest_1.default)(app_1.default).get(`/api/tarefas/${gatoTutorRow.id}`);
            (0, globals_1.expect)(response.status).toBe(500);
            (0, globals_1.expect)(response.body).toEqual({
                statusCode: 500,
                message: 'Você não tem permissão para visualizar as tarefas deste gato.',
                error: true,
            });
            (0, globals_1.expect)(tarefaFindManySpy).not.toHaveBeenCalled();
        });
    });
    (0, globals_1.describe)('POST /api/tarefas/tarefa/:idGato', () => {
        (0, globals_1.test)('criar uma nova tarefa como tutor', async () => {
            gatoFindByIdSpy.mockResolvedValueOnce(gatoTutorRow);
            tarefaCreateSpy.mockResolvedValueOnce({ insertId: 11 });
            const response = await (0, supertest_1.default)(app_1.default)
                .post(`/api/tarefas/tarefa/${gatoTutorRow.id}`)
                .send({ descricao: 'Escovar o gato', pontos: 5 });
            (0, globals_1.expect)(response.status).toBe(201);
            (0, globals_1.expect)(gatoFindByIdSpy).toHaveBeenCalledWith(gatoTutorRow.id);
            (0, globals_1.expect)(tarefaCreateSpy).toHaveBeenCalledWith({
                gato_id: gatoTutorRow.id,
                descricao: 'Escovar o gato',
                pontos: 5,
                status: 'PENDENTE',
                concluida_por: tutorUserRow.id,
                concluida_em: globals_1.expect.any(Date),
            });
            (0, globals_1.expect)(response.body).toEqual({ message: 'Tarefa registrada com sucesso!' });
        });
        (0, globals_1.test)('retornar erro ao criar uma nova tarefa como catsitter', async () => {
            mockCatSitterAuth();
            const response = await (0, supertest_1.default)(app_1.default)
                .post(`/api/tarefas/tarefa/${gatoTutorRow.id}`)
                .send({ descricao: 'Escovar o gato', pontos: 5 });
            (0, globals_1.expect)(response.status).toBe(403);
            (0, globals_1.expect)(response.body).toEqual({ error: 'Você não tem permissão para esta ação.' });
            (0, globals_1.expect)(gatoFindByIdSpy).not.toHaveBeenCalled();
            (0, globals_1.expect)(tarefaCreateSpy).not.toHaveBeenCalled();
        });
        (0, globals_1.test)('retornar erro ao criar uma nova tarefa para gato que não existe', async () => {
            gatoFindByIdSpy.mockResolvedValueOnce(null);
            const response = await (0, supertest_1.default)(app_1.default)
                .post(`/api/tarefas/tarefa/${gatoTutorRow.id}`)
                .send({ descricao: 'Escovar o gato', pontos: 5 });
            (0, globals_1.expect)(response.status).toBe(500);
            (0, globals_1.expect)(response.body).toEqual({
                statusCode: 500,
                message: 'Gato não encontrado.',
                error: true,
            });
            (0, globals_1.expect)(tarefaCreateSpy).not.toHaveBeenCalled();
        });
        (0, globals_1.test)('retornar erro ao criar uma nova tarefa para gato sem permissão', async () => {
            gatoFindByIdSpy.mockResolvedValueOnce(gatoDeOutroTutorRow);
            const response = await (0, supertest_1.default)(app_1.default)
                .post(`/api/tarefas/tarefa/${gatoTutorRow.id}`)
                .send({ descricao: 'Escovar o gato', pontos: 5 });
            (0, globals_1.expect)(response.status).toBe(500);
            (0, globals_1.expect)(response.body).toEqual({
                statusCode: 500,
                message: 'Você não tem permissão para criar tarefas para este gato.',
                error: true,
            });
            (0, globals_1.expect)(tarefaCreateSpy).not.toHaveBeenCalled();
        });
        (0, globals_1.test)('retornar 400 ao criar uma nova tarefa sem descricao e pontos obrigatorios', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post(`/api/tarefas/tarefa/${gatoTutorRow.id}`)
                .send({});
            (0, globals_1.expect)(response.status).toBe(400);
            (0, globals_1.expect)(response.body).toMatchObject({ error: true, message: 'Dados inválidos.' });
            (0, globals_1.expect)(response.body.errors).toEqual(globals_1.expect.arrayContaining([
                'descricao é obrigatória.',
                'pontos deve ser um número positivo.',
            ]));
        });
    });
    (0, globals_1.describe)('DELETE /api/tarefas/tarefa/:idGato/:idTarefa', () => {
        (0, globals_1.test)('deletar uma tarefa especifica como tutor', async () => {
            gatoFindByIdSpy.mockResolvedValueOnce(gatoTutorRow);
            tarefaFindByIdSpy.mockResolvedValueOnce(tarefaRow);
            tarefaDeleteSpy.mockResolvedValueOnce(undefined);
            const response = await (0, supertest_1.default)(app_1.default)
                .delete(`/api/tarefas/tarefa/${gatoTutorRow.id}/${tarefaRow.idTarefa}`)
                .send();
            (0, globals_1.expect)(response.status).toBe(200);
            (0, globals_1.expect)(gatoFindByIdSpy).toHaveBeenCalledWith(gatoTutorRow.id);
            (0, globals_1.expect)(tarefaFindByIdSpy).toHaveBeenCalledWith(tarefaRow.idTarefa);
            (0, globals_1.expect)(tarefaDeleteSpy).toHaveBeenCalledWith(tarefaRow.idTarefa);
            (0, globals_1.expect)(response.body).toEqual({ message: 'Tarefa deletada com sucesso!' });
        });
        (0, globals_1.test)('retornar erro ao deletar uma tarefa especifica como catsitter', async () => {
            mockCatSitterAuth();
            const response = await (0, supertest_1.default)(app_1.default)
                .delete(`/api/tarefas/tarefa/${gatoTutorRow.id}/${tarefaRow.idTarefa}`)
                .send();
            (0, globals_1.expect)(response.status).toBe(403);
            (0, globals_1.expect)(response.body).toEqual({ error: 'Você não tem permissão para esta ação.' });
            (0, globals_1.expect)(tarefaDeleteSpy).not.toHaveBeenCalled();
        });
        (0, globals_1.test)('retornar erro ao deletar uma tarefa especifica que não existe', async () => {
            gatoFindByIdSpy.mockResolvedValueOnce(gatoTutorRow);
            tarefaFindByIdSpy.mockResolvedValueOnce(undefined);
            const response = await (0, supertest_1.default)(app_1.default)
                .delete(`/api/tarefas/tarefa/${gatoTutorRow.id}/${tarefaRow.idTarefa}`)
                .send();
            (0, globals_1.expect)(response.status).toBe(500);
            (0, globals_1.expect)(response.body).toEqual({
                statusCode: 500,
                message: 'Tarefa não encontrada.',
                error: true,
            });
            (0, globals_1.expect)(tarefaDeleteSpy).not.toHaveBeenCalled();
        });
        (0, globals_1.test)('retornar erro ao deletar uma tarefa especifica de gato que não existe', async () => {
            gatoFindByIdSpy.mockResolvedValueOnce(null);
            const response = await (0, supertest_1.default)(app_1.default)
                .delete(`/api/tarefas/tarefa/${gatoTutorRow.id}/${tarefaRow.idTarefa}`)
                .send();
            (0, globals_1.expect)(response.status).toBe(500);
            (0, globals_1.expect)(response.body).toEqual({
                statusCode: 500,
                message: 'Gato não encontrado.',
                error: true,
            });
            (0, globals_1.expect)(tarefaDeleteSpy).not.toHaveBeenCalled();
        });
        (0, globals_1.test)('retornar erro ao deletar uma tarefa especifica de gato que não possui permissão', async () => {
            gatoFindByIdSpy.mockResolvedValueOnce(gatoDeOutroTutorRow);
            const response = await (0, supertest_1.default)(app_1.default)
                .delete(`/api/tarefas/tarefa/${gatoTutorRow.id}/${tarefaRow.idTarefa}`)
                .send();
            (0, globals_1.expect)(response.status).toBe(500);
            (0, globals_1.expect)(response.body).toEqual({
                statusCode: 500,
                message: 'Você não tem permissão para deletar tarefas deste gato.',
                error: true,
            });
            (0, globals_1.expect)(tarefaDeleteSpy).not.toHaveBeenCalled();
        });
        (0, globals_1.test)('retornar erro ao deletar uma tarefa especifica que não pertence ao gato especifico', async () => {
            gatoFindByIdSpy.mockResolvedValueOnce(gatoTutorRow);
            tarefaFindByIdSpy.mockResolvedValueOnce(tarefaDeOutroGatoRow);
            const response = await (0, supertest_1.default)(app_1.default)
                .delete(`/api/tarefas/tarefa/${gatoTutorRow.id}/${tarefaRow.idTarefa}`)
                .send();
            (0, globals_1.expect)(response.status).toBe(500);
            (0, globals_1.expect)(response.body).toEqual({
                statusCode: 500,
                message: 'A tarefa não pertence a este gato.',
                error: true,
            });
            (0, globals_1.expect)(tarefaDeleteSpy).not.toHaveBeenCalled();
        });
    });
    (0, globals_1.describe)('PUT /api/tarefas/tarefa/:idGato/:idTarefa', () => {
        (0, globals_1.test)('atualizar uma tarefa como tutor', async () => {
            gatoFindByIdSpy.mockResolvedValueOnce(gatoTutorRow);
            tarefaFindByIdSpy.mockResolvedValueOnce(tarefaRow);
            tarefaUpdateSpy.mockResolvedValueOnce(undefined);
            const response = await (0, supertest_1.default)(app_1.default)
                .put(`/api/tarefas/tarefa/${gatoTutorRow.id}/${tarefaRow.idTarefa}`)
                .send({
                descricao: 'Escovar o gato atualizado',
                pontos: 20,
                status: 'CONCLUIDA',
            });
            (0, globals_1.expect)(response.status).toBe(201);
            (0, globals_1.expect)(gatoFindByIdSpy).toHaveBeenCalledWith(gatoTutorRow.id);
            (0, globals_1.expect)(tarefaFindByIdSpy).toHaveBeenCalledWith(tarefaRow.idTarefa);
            (0, globals_1.expect)(tarefaUpdateSpy).toHaveBeenCalledWith(tarefaRow.idTarefa, {
                descricao: 'Escovar o gato atualizado',
                pontos: 20,
                status: 'CONCLUIDA',
            });
            (0, globals_1.expect)(response.body).toEqual({ message: 'Tarefa atualizada com sucesso!' });
        });
        (0, globals_1.test)('atualizar uma tarefa como catsitter, onde aqui se altera apenas o status e a pontuacao do catsitter sobe', async () => {
            mockCatSitterAuth();
            tarefaFindByIdSpy.mockResolvedValueOnce(tarefaRow);
            updateStatusSpy.mockResolvedValueOnce(undefined);
            updatePontuacaoSpy.mockResolvedValueOnce(undefined);
            const response = await (0, supertest_1.default)(app_1.default)
                .put(`/api/tarefas/tarefa/${gatoTutorRow.id}/${tarefaRow.idTarefa}`)
                .send({});
            (0, globals_1.expect)(response.status).toBe(200);
            (0, globals_1.expect)(tarefaFindByIdSpy).toHaveBeenCalledWith(tarefaRow.idTarefa);
            (0, globals_1.expect)(updateStatusSpy).toHaveBeenCalledWith(tarefaRow.idTarefa, catSitterUserRow.id);
            (0, globals_1.expect)(updatePontuacaoSpy).toHaveBeenCalledWith(catSitterUserRow.id, tarefaRow.pontos);
            (0, globals_1.expect)(response.body).toEqual({ message: 'Status da tarefa atualizado com sucesso!' });
        });
        (0, globals_1.test)('retornar erro ao atualizar uma tarefa que não existe', async () => {
            gatoFindByIdSpy.mockResolvedValueOnce(gatoTutorRow);
            tarefaFindByIdSpy.mockResolvedValueOnce(undefined);
            const response = await (0, supertest_1.default)(app_1.default)
                .put(`/api/tarefas/tarefa/${gatoTutorRow.id}/${tarefaRow.idTarefa}`)
                .send({
                descricao: 'Escovar o gato atualizado',
                pontos: 20,
                status: 'CONCLUIDA',
            });
            (0, globals_1.expect)(response.status).toBe(500);
            (0, globals_1.expect)(response.body).toEqual({
                statusCode: 500,
                message: 'Tarefa não encontrada.',
                error: true,
            });
            (0, globals_1.expect)(tarefaUpdateSpy).not.toHaveBeenCalled();
        });
        (0, globals_1.test)('retornar erro ao atualizar uma tarefa de gato que não existe', async () => {
            gatoFindByIdSpy.mockResolvedValueOnce(null);
            const response = await (0, supertest_1.default)(app_1.default)
                .put(`/api/tarefas/tarefa/${gatoTutorRow.id}/${tarefaRow.idTarefa}`)
                .send({
                descricao: 'Escovar o gato atualizado',
                pontos: 20,
                status: 'CONCLUIDA',
            });
            (0, globals_1.expect)(response.status).toBe(500);
            (0, globals_1.expect)(response.body).toEqual({
                statusCode: 500,
                message: 'Gato não encontrado.',
                error: true,
            });
            (0, globals_1.expect)(tarefaUpdateSpy).not.toHaveBeenCalled();
        });
        (0, globals_1.test)('retornar erro ao atualizar uma tarefa de gato que não possui permissão', async () => {
            gatoFindByIdSpy.mockResolvedValueOnce(gatoDeOutroTutorRow);
            const response = await (0, supertest_1.default)(app_1.default)
                .put(`/api/tarefas/tarefa/${gatoTutorRow.id}/${tarefaRow.idTarefa}`)
                .send({
                descricao: 'Escovar o gato atualizado',
                pontos: 20,
                status: 'CONCLUIDA',
            });
            (0, globals_1.expect)(response.status).toBe(500);
            (0, globals_1.expect)(response.body).toEqual({
                statusCode: 500,
                message: 'Você não tem permissão para atualizar tarefas deste gato.',
                error: true,
            });
            (0, globals_1.expect)(tarefaUpdateSpy).not.toHaveBeenCalled();
        });
        (0, globals_1.test)('retornar erro ao atualizar uma tarefa que não pertence ao gato especifico', async () => {
            gatoFindByIdSpy.mockResolvedValueOnce(gatoTutorRow);
            tarefaFindByIdSpy.mockResolvedValueOnce(tarefaDeOutroGatoRow);
            const response = await (0, supertest_1.default)(app_1.default)
                .put(`/api/tarefas/tarefa/${gatoTutorRow.id}/${tarefaRow.idTarefa}`)
                .send({
                descricao: 'Escovar o gato atualizado',
                pontos: 20,
                status: 'CONCLUIDA',
            });
            (0, globals_1.expect)(response.status).toBe(500);
            (0, globals_1.expect)(response.body).toEqual({
                statusCode: 500,
                message: 'A tarefa não pertence a este gato.',
                error: true,
            });
            (0, globals_1.expect)(tarefaUpdateSpy).not.toHaveBeenCalled();
        });
        (0, globals_1.test)('retornar erro ao atualizar uma tarefa com dados invalidos', async () => {
            gatoFindByIdSpy.mockResolvedValueOnce(gatoTutorRow);
            tarefaFindByIdSpy.mockResolvedValueOnce({
                ...tarefaRow,
                descricao: null,
            });
            const response = await (0, supertest_1.default)(app_1.default)
                .put(`/api/tarefas/tarefa/${gatoTutorRow.id}/${tarefaRow.idTarefa}`)
                .send({});
            (0, globals_1.expect)(response.status).toBe(500);
            (0, globals_1.expect)(response.body).toEqual({
                statusCode: 500,
                message: 'Dados da tarefa inválidos para atualização.',
                error: true,
            });
            (0, globals_1.expect)(tarefaUpdateSpy).not.toHaveBeenCalled();
        });
        (0, globals_1.test)('retornar erro ao concluir uma tarefa como catsitter que não existe', async () => {
            mockCatSitterAuth();
            tarefaFindByIdSpy.mockResolvedValueOnce(undefined);
            const response = await (0, supertest_1.default)(app_1.default)
                .put(`/api/tarefas/tarefa/${gatoTutorRow.id}/${tarefaRow.idTarefa}`)
                .send({});
            (0, globals_1.expect)(response.status).toBe(500);
            (0, globals_1.expect)(response.body).toEqual({
                statusCode: 500,
                message: 'Tarefa não encontrada.',
                error: true,
            });
            (0, globals_1.expect)(updateStatusSpy).not.toHaveBeenCalled();
            (0, globals_1.expect)(updatePontuacaoSpy).not.toHaveBeenCalled();
        });
        (0, globals_1.test)('retornar erro ao concluir uma tarefa como catsitter que já foi concluida antes', async () => {
            mockCatSitterAuth();
            tarefaFindByIdSpy.mockResolvedValueOnce(tarefaConcluidaRow);
            const response = await (0, supertest_1.default)(app_1.default)
                .put(`/api/tarefas/tarefa/${gatoTutorRow.id}/${tarefaRow.idTarefa}`)
                .send({});
            (0, globals_1.expect)(response.status).toBe(500);
            (0, globals_1.expect)(response.body).toEqual({
                statusCode: 500,
                message: 'A tarefa já foi concluída.',
                error: true,
            });
            (0, globals_1.expect)(updateStatusSpy).not.toHaveBeenCalled();
            (0, globals_1.expect)(updatePontuacaoSpy).not.toHaveBeenCalled();
        });
        (0, globals_1.test)('retornar erro ao concluir uma tarefa como catsitter sem pontuação', async () => {
            mockCatSitterAuth();
            tarefaFindByIdSpy.mockResolvedValueOnce({
                ...tarefaRow,
                pontos: null,
            });
            const response = await (0, supertest_1.default)(app_1.default)
                .put(`/api/tarefas/tarefa/${gatoTutorRow.id}/${tarefaRow.idTarefa}`)
                .send({});
            (0, globals_1.expect)(response.status).toBe(500);
            (0, globals_1.expect)(response.body).toEqual({
                statusCode: 500,
                message: 'Tarefa inválida para atualização de pontuação.',
                error: true,
            });
            (0, globals_1.expect)(updateStatusSpy).not.toHaveBeenCalled();
            (0, globals_1.expect)(updatePontuacaoSpy).not.toHaveBeenCalled();
        });
        (0, globals_1.test)('pontuacao de catsitter deve aumentar baseado nos pontos da sua tarefa concluida', async () => {
            mockCatSitterAuth();
            tarefaFindByIdSpy.mockResolvedValueOnce(tarefaRow);
            updateStatusSpy.mockResolvedValueOnce(undefined);
            updatePontuacaoSpy.mockResolvedValueOnce(undefined);
            const response = await (0, supertest_1.default)(app_1.default)
                .put(`/api/tarefas/tarefa/${gatoTutorRow.id}/${tarefaRow.idTarefa}`)
                .send({});
            (0, globals_1.expect)(response.status).toBe(200);
            (0, globals_1.expect)(updateStatusSpy).toHaveBeenCalledWith(tarefaRow.idTarefa, catSitterUserRow.id);
            (0, globals_1.expect)(updatePontuacaoSpy).toHaveBeenCalledWith(catSitterUserRow.id, tarefaRow.pontos);
            (0, globals_1.expect)(response.body).toEqual({ message: 'Status da tarefa atualizado com sucesso!' });
        });
    });
});
//# sourceMappingURL=tarefas.api.test.js.map