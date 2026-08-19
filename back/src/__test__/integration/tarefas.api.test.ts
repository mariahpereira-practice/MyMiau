import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import request from 'supertest';
import app from '../../app';
import { GatoResponseDTO } from '../../dtos/gato.dto';
import { TarefaResponseDTO } from '../../dtos/tarefa.dto';
import { UserRole } from '../../dtos/user.dto';
import { GatoModel } from '../../models/gato.model';
import { TarefaModel } from '../../models/tarefa.model';
import { UserModel, type UserRow } from '../../models/user.model';

const requiredAuthMock = jest.fn();

jest.mock('../../middlewares/auth.middleware', () => {
  const { UserRole: ActualUserRole } = jest.requireActual('../../dtos/user.dto') as typeof import('../../dtos/user.dto');

  return {
    requiredAuth: (...args: unknown[]) => requiredAuthMock(...args),
    UserRole: ActualUserRole,
  };
});

describe('Tarefa API', () => {
  const tutorUserRow: UserRow = {
    id: 2,
    username: 'juliana',
    email: 'juliana@email.com',
    role: UserRole.TUTOR,
    password_hash: 'hashed-password',
  };

  const catSitterUserRow: UserRow = {
    id: 3,
    username: 'carlos',
    email: 'carlos@email.com',
    role: UserRole.CATSITTER,
    password_hash: 'hashed-password',
  };

  const gatoTutorRow: GatoResponseDTO = {
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

  const gatoDeOutroTutorRow: GatoResponseDTO = {
    ...gatoTutorRow,
    tutor_id: 999,
    tutorNome: 'outroTutor',
  };

  const gatoIndisponivelRow: GatoResponseDTO = {
    ...gatoTutorRow,
    disponivel_para_cuidado: 0,
  };

  const tarefaRow: TarefaResponseDTO = {
    idTarefa: 7,
    gato_id: gatoTutorRow.id,
    descricao: 'Escovar o gato',
    pontos: 10,
    status: 'PENDENTE',
    concluida_por: null,
    concluida_em: null,
  };

  const tarefaConcluidaRow: TarefaResponseDTO = {
    ...tarefaRow,
    status: 'CONCLUIDA',
  };

  const tarefaDeOutroGatoRow: TarefaResponseDTO = {
    ...tarefaRow,
    gato_id: 999,
  };

  const userFindByIdSpy = jest.spyOn(UserModel, 'findById');
  const gatoFindByIdSpy = jest.spyOn(GatoModel, 'findGatoByIdGato');
  const tarefaFindManySpy = jest.spyOn(TarefaModel, 'findMany');
  const tarefaFindByIdSpy = jest.spyOn(TarefaModel, 'findTarefaById');
  const tarefaCreateSpy = jest.spyOn(TarefaModel, 'createTarefa');
  const tarefaDeleteSpy = jest.spyOn(TarefaModel, 'deletarTarefa');
  const tarefaUpdateSpy = jest.spyOn(TarefaModel, 'updateTarefa');
  const updateStatusSpy = jest.spyOn(TarefaModel.prototype, 'updateStatusTarefa');
  const updatePontuacaoSpy = jest.spyOn(TarefaModel.prototype, 'updatePontuacaoCatSitter');

  const mockTutorAuth = () => {
    requiredAuthMock.mockImplementation((req: any, _res: any, next: any) => {
      req.user = {
        id: tutorUserRow.id,
        username: tutorUserRow.username,
        email: tutorUserRow.email,
        role: tutorUserRow.role,
        pontuacao: 0,
        rankGlobal: 'No rank',
      };
      next();
    });
    userFindByIdSpy.mockResolvedValue(tutorUserRow);
  };

  const mockCatSitterAuth = () => {
    requiredAuthMock.mockImplementation((req: any, _res: any, next: any) => {
      req.user = {
        id: catSitterUserRow.id,
        username: catSitterUserRow.username,
        email: catSitterUserRow.email,
        role: catSitterUserRow.role,
        pontuacao: 0,
        rankGlobal: 'No rank',
      };
      next();
    });
    userFindByIdSpy.mockResolvedValue(catSitterUserRow);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockTutorAuth();
  });

  describe('GET /api/tarefas/:idGato', () => {
    test('ver todas as tarefas de um gato especifico como tutor', async () => {
      gatoFindByIdSpy.mockResolvedValueOnce(gatoTutorRow);
      tarefaFindManySpy.mockResolvedValueOnce([tarefaRow]);

      const response = await request(app).get(`/api/tarefas/${gatoTutorRow.id}`);

      expect(response.status).toBe(200);
      expect(gatoFindByIdSpy).toHaveBeenCalledWith(gatoTutorRow.id);
      expect(tarefaFindManySpy).toHaveBeenCalledWith({ idGato: gatoTutorRow.id });
      expect(response.body).toEqual({ tarefas: [tarefaRow] });
    });

    test('retornar erro se visualizar tarefas de gato especifico que não existe', async () => {
      gatoFindByIdSpy.mockResolvedValueOnce(null);

      const response = await request(app).get(`/api/tarefas/${gatoTutorRow.id}`);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        statusCode: 500,
        message: 'Gato não encontrado.',
        error: true,
      });
      expect(tarefaFindManySpy).not.toHaveBeenCalled();
    });

    test('ver todas as tarefas de um gato especifico como catsitter', async () => {
      mockCatSitterAuth();
      gatoFindByIdSpy.mockResolvedValueOnce(gatoTutorRow);
      tarefaFindManySpy.mockResolvedValueOnce([tarefaRow]);

      const response = await request(app).get(`/api/tarefas/${gatoTutorRow.id}`);

      expect(response.status).toBe(200);
      expect(gatoFindByIdSpy).toHaveBeenCalledWith(gatoTutorRow.id);
      expect(tarefaFindManySpy).toHaveBeenCalledWith({ idGato: gatoTutorRow.id });
      expect(response.body).toEqual({ tarefas: [tarefaRow] });
    });

    test('retornar erro se visualizar tarefas de um gato especifico sem disponibilidade como catsitter', async () => {
      mockCatSitterAuth();
      gatoFindByIdSpy.mockResolvedValueOnce(gatoIndisponivelRow);

      const response = await request(app).get(`/api/tarefas/${gatoTutorRow.id}`);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        statusCode: 500,
        message: 'Gato não disponível para cuidado.',
        error: true,
      });
      expect(tarefaFindManySpy).not.toHaveBeenCalled();
    });

    test('retornar erro se visualizar tarefas de gato especifico que o tutor não possui permissão', async () => {
      gatoFindByIdSpy.mockResolvedValueOnce(gatoDeOutroTutorRow);

      const response = await request(app).get(`/api/tarefas/${gatoTutorRow.id}`);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        statusCode: 500,
        message: 'Você não tem permissão para visualizar as tarefas deste gato.',
        error: true,
      });
      expect(tarefaFindManySpy).not.toHaveBeenCalled();
    });
  });

  describe('POST /api/tarefas/tarefa/:idGato', () => {
    test('criar uma nova tarefa como tutor', async () => {
      gatoFindByIdSpy.mockResolvedValueOnce(gatoTutorRow);
      tarefaCreateSpy.mockResolvedValueOnce({ insertId: 11 });

      const response = await request(app)
        .post(`/api/tarefas/tarefa/${gatoTutorRow.id}`)
        .send({ descricao: 'Escovar o gato', pontos: 5 });

      expect(response.status).toBe(201);
      expect(gatoFindByIdSpy).toHaveBeenCalledWith(gatoTutorRow.id);
      expect(tarefaCreateSpy).toHaveBeenCalledWith({
        gato_id: gatoTutorRow.id,
        descricao: 'Escovar o gato',
        pontos: 5,
        status: 'PENDENTE',
        concluida_por: tutorUserRow.id,
        concluida_em: expect.any(Date),
      });
      expect(response.body).toEqual({ message: 'Tarefa registrada com sucesso!' });
    });

    test('retornar erro ao criar uma nova tarefa como catsitter', async () => {
      mockCatSitterAuth();

      const response = await request(app)
        .post(`/api/tarefas/tarefa/${gatoTutorRow.id}`)
        .send({ descricao: 'Escovar o gato', pontos: 5 });

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ error: 'Você não tem permissão para esta ação.' });
      expect(gatoFindByIdSpy).not.toHaveBeenCalled();
      expect(tarefaCreateSpy).not.toHaveBeenCalled();
    });

    test('retornar erro ao criar uma nova tarefa para gato que não existe', async () => {
      gatoFindByIdSpy.mockResolvedValueOnce(null);

      const response = await request(app)
        .post(`/api/tarefas/tarefa/${gatoTutorRow.id}`)
        .send({ descricao: 'Escovar o gato', pontos: 5 });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        statusCode: 500,
        message: 'Gato não encontrado.',
        error: true,
      });
      expect(tarefaCreateSpy).not.toHaveBeenCalled();
    });

    test('retornar erro ao criar uma nova tarefa para gato sem permissão', async () => {
      gatoFindByIdSpy.mockResolvedValueOnce(gatoDeOutroTutorRow);

      const response = await request(app)
        .post(`/api/tarefas/tarefa/${gatoTutorRow.id}`)
        .send({ descricao: 'Escovar o gato', pontos: 5 });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        statusCode: 500,
        message: 'Você não tem permissão para criar tarefas para este gato.',
        error: true,
      });
      expect(tarefaCreateSpy).not.toHaveBeenCalled();
    });

    test('retornar 400 ao criar uma nova tarefa sem descricao e pontos obrigatorios', async () => {
      const response = await request(app)
        .post(`/api/tarefas/tarefa/${gatoTutorRow.id}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({ error: true, message: 'Dados inválidos.' });
      expect(response.body.errors).toEqual(expect.arrayContaining([
        'descricao é obrigatória.',
        'pontos deve ser um número positivo.',
      ]));
    });
  });

  describe('DELETE /api/tarefas/tarefa/:idGato/:idTarefa', () => {
    test('deletar uma tarefa especifica como tutor', async () => {
      gatoFindByIdSpy.mockResolvedValueOnce(gatoTutorRow);
      tarefaFindByIdSpy.mockResolvedValueOnce(tarefaRow);
      tarefaDeleteSpy.mockResolvedValueOnce(undefined);

      const response = await request(app)
        .delete(`/api/tarefas/tarefa/${gatoTutorRow.id}/${tarefaRow.idTarefa}`)
        .send();

      expect(response.status).toBe(200);
      expect(gatoFindByIdSpy).toHaveBeenCalledWith(gatoTutorRow.id);
      expect(tarefaFindByIdSpy).toHaveBeenCalledWith(tarefaRow.idTarefa);
      expect(tarefaDeleteSpy).toHaveBeenCalledWith(tarefaRow.idTarefa);
      expect(response.body).toEqual({ message: 'Tarefa deletada com sucesso!' });
    });

    test('retornar erro ao deletar uma tarefa especifica como catsitter', async () => {
      mockCatSitterAuth();

      const response = await request(app)
        .delete(`/api/tarefas/tarefa/${gatoTutorRow.id}/${tarefaRow.idTarefa}`)
        .send();

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ error: 'Você não tem permissão para esta ação.' });
      expect(tarefaDeleteSpy).not.toHaveBeenCalled();
    });

    test('retornar erro ao deletar uma tarefa especifica que não existe', async () => {
      gatoFindByIdSpy.mockResolvedValueOnce(gatoTutorRow);
      tarefaFindByIdSpy.mockResolvedValueOnce(undefined);

      const response = await request(app)
        .delete(`/api/tarefas/tarefa/${gatoTutorRow.id}/${tarefaRow.idTarefa}`)
        .send();

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        statusCode: 500,
        message: 'Tarefa não encontrada.',
        error: true,
      });
      expect(tarefaDeleteSpy).not.toHaveBeenCalled();
    });

    test('retornar erro ao deletar uma tarefa especifica de gato que não existe', async () => {
      gatoFindByIdSpy.mockResolvedValueOnce(null);

      const response = await request(app)
        .delete(`/api/tarefas/tarefa/${gatoTutorRow.id}/${tarefaRow.idTarefa}`)
        .send();

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        statusCode: 500,
        message: 'Gato não encontrado.',
        error: true,
      });
      expect(tarefaDeleteSpy).not.toHaveBeenCalled();
    });

    test('retornar erro ao deletar uma tarefa especifica de gato que não possui permissão', async () => {
      gatoFindByIdSpy.mockResolvedValueOnce(gatoDeOutroTutorRow);

      const response = await request(app)
        .delete(`/api/tarefas/tarefa/${gatoTutorRow.id}/${tarefaRow.idTarefa}`)
        .send();

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        statusCode: 500,
        message: 'Você não tem permissão para deletar tarefas deste gato.',
        error: true,
      });
      expect(tarefaDeleteSpy).not.toHaveBeenCalled();
    });

    test('retornar erro ao deletar uma tarefa especifica que não pertence ao gato especifico', async () => {
      gatoFindByIdSpy.mockResolvedValueOnce(gatoTutorRow);
      tarefaFindByIdSpy.mockResolvedValueOnce(tarefaDeOutroGatoRow);

      const response = await request(app)
        .delete(`/api/tarefas/tarefa/${gatoTutorRow.id}/${tarefaRow.idTarefa}`)
        .send();

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        statusCode: 500,
        message: 'A tarefa não pertence a este gato.',
        error: true,
      });
      expect(tarefaDeleteSpy).not.toHaveBeenCalled();
    });
  });

  describe('PUT /api/tarefas/tarefa/:idGato/:idTarefa', () => {
    test('atualizar uma tarefa como tutor', async () => {
      gatoFindByIdSpy.mockResolvedValueOnce(gatoTutorRow);
      tarefaFindByIdSpy.mockResolvedValueOnce(tarefaRow);
      tarefaUpdateSpy.mockResolvedValueOnce(undefined);

      const response = await request(app)
        .put(`/api/tarefas/tarefa/${gatoTutorRow.id}/${tarefaRow.idTarefa}`)
        .send({
          descricao: 'Escovar o gato atualizado',
          pontos: 20,
          status: 'CONCLUIDA',
        });

      expect(response.status).toBe(201);
      expect(gatoFindByIdSpy).toHaveBeenCalledWith(gatoTutorRow.id);
      expect(tarefaFindByIdSpy).toHaveBeenCalledWith(tarefaRow.idTarefa);
      expect(tarefaUpdateSpy).toHaveBeenCalledWith(
        {
          descricao: 'Escovar o gato atualizado',
          pontos: 20,
          status: 'CONCLUIDA',
        },
        tarefaRow.idTarefa,
      );
      expect(response.body).toEqual({ message: 'Tarefa atualizada com sucesso!' });
    });

    test('atualizar uma tarefa como catsitter, onde aqui se altera apenas o status e a pontuacao do catsitter sobe', async () => {
      mockCatSitterAuth();
      tarefaFindByIdSpy.mockResolvedValueOnce(tarefaRow);
      updateStatusSpy.mockResolvedValueOnce(undefined);
      updatePontuacaoSpy.mockResolvedValueOnce(undefined);

      const response = await request(app)
        .put(`/api/tarefas/tarefa/${gatoTutorRow.id}/${tarefaRow.idTarefa}`)
        .send({});

      expect(response.status).toBe(200);
      expect(tarefaFindByIdSpy).toHaveBeenCalledWith(tarefaRow.idTarefa);
      expect(updateStatusSpy).toHaveBeenCalledWith(tarefaRow.idTarefa, catSitterUserRow.id);
      expect(updatePontuacaoSpy).toHaveBeenCalledWith(catSitterUserRow.id, tarefaRow.pontos);
      expect(response.body).toEqual({ message: 'Status da tarefa atualizado com sucesso!' });
    });

    test('retornar erro ao atualizar uma tarefa que não existe', async () => {
      gatoFindByIdSpy.mockResolvedValueOnce(gatoTutorRow);
      tarefaFindByIdSpy.mockResolvedValueOnce(undefined);

      const response = await request(app)
        .put(`/api/tarefas/tarefa/${gatoTutorRow.id}/${tarefaRow.idTarefa}`)
        .send({
          descricao: 'Escovar o gato atualizado',
          pontos: 20,
          status: 'CONCLUIDA',
        });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        statusCode: 500,
        message: 'Tarefa não encontrada.',
        error: true,
      });
      expect(tarefaUpdateSpy).not.toHaveBeenCalled();
    });

    test('retornar erro ao atualizar uma tarefa de gato que não existe', async () => {
      gatoFindByIdSpy.mockResolvedValueOnce(null);

      const response = await request(app)
        .put(`/api/tarefas/tarefa/${gatoTutorRow.id}/${tarefaRow.idTarefa}`)
        .send({
          descricao: 'Escovar o gato atualizado',
          pontos: 20,
          status: 'CONCLUIDA',
        });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        statusCode: 500,
        message: 'Gato não encontrado.',
        error: true,
      });
      expect(tarefaUpdateSpy).not.toHaveBeenCalled();
    });

    test('retornar erro ao atualizar uma tarefa de gato que não possui permissão', async () => {
      gatoFindByIdSpy.mockResolvedValueOnce(gatoDeOutroTutorRow);

      const response = await request(app)
        .put(`/api/tarefas/tarefa/${gatoTutorRow.id}/${tarefaRow.idTarefa}`)
        .send({
          descricao: 'Escovar o gato atualizado',
          pontos: 20,
          status: 'CONCLUIDA',
        });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        statusCode: 500,
        message: 'Você não tem permissão para atualizar tarefas deste gato.',
        error: true,
      });
      expect(tarefaUpdateSpy).not.toHaveBeenCalled();
    });

    test('retornar erro ao atualizar uma tarefa que não pertence ao gato especifico', async () => {
      gatoFindByIdSpy.mockResolvedValueOnce(gatoTutorRow);
      tarefaFindByIdSpy.mockResolvedValueOnce(tarefaDeOutroGatoRow);

      const response = await request(app)
        .put(`/api/tarefas/tarefa/${gatoTutorRow.id}/${tarefaRow.idTarefa}`)
        .send({
          descricao: 'Escovar o gato atualizado',
          pontos: 20,
          status: 'CONCLUIDA',
        });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        statusCode: 500,
        message: 'A tarefa não pertence a este gato.',
        error: true,
      });
      expect(tarefaUpdateSpy).not.toHaveBeenCalled();
    });

    test('retornar erro ao atualizar uma tarefa com dados invalidos', async () => {
      gatoFindByIdSpy.mockResolvedValueOnce(gatoTutorRow);
      tarefaFindByIdSpy.mockResolvedValueOnce({
        ...tarefaRow,
        descricao: null as any,
      });

      const response = await request(app)
        .put(`/api/tarefas/tarefa/${gatoTutorRow.id}/${tarefaRow.idTarefa}`)
        .send({});

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        statusCode: 500,
        message: 'Dados da tarefa inválidos para atualização.',
        error: true,
      });
      expect(tarefaUpdateSpy).not.toHaveBeenCalled();
    });

    test('retornar erro ao concluir uma tarefa como catsitter que não existe', async () => {
      mockCatSitterAuth();
      tarefaFindByIdSpy.mockResolvedValueOnce(undefined);

      const response = await request(app)
        .put(`/api/tarefas/tarefa/${gatoTutorRow.id}/${tarefaRow.idTarefa}`)
        .send({});

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        statusCode: 500,
        message: 'Tarefa não encontrada.',
        error: true,
      });
      expect(updateStatusSpy).not.toHaveBeenCalled();
      expect(updatePontuacaoSpy).not.toHaveBeenCalled();
    });

    test('retornar erro ao concluir uma tarefa como catsitter que já foi concluida antes', async () => {
      mockCatSitterAuth();
      tarefaFindByIdSpy.mockResolvedValueOnce(tarefaConcluidaRow);

      const response = await request(app)
        .put(`/api/tarefas/tarefa/${gatoTutorRow.id}/${tarefaRow.idTarefa}`)
        .send({});

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        statusCode: 500,
        message: 'A tarefa já foi concluída.',
        error: true,
      });
      expect(updateStatusSpy).not.toHaveBeenCalled();
      expect(updatePontuacaoSpy).not.toHaveBeenCalled();
    });

    test('retornar erro ao concluir uma tarefa como catsitter sem pontuação', async () => {
      mockCatSitterAuth();
      tarefaFindByIdSpy.mockResolvedValueOnce({
        ...tarefaRow,
        pontos: null as any,
      });

      const response = await request(app)
        .put(`/api/tarefas/tarefa/${gatoTutorRow.id}/${tarefaRow.idTarefa}`)
        .send({});

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        statusCode: 500,
        message: 'Tarefa inválida para atualização de pontuação.',
        error: true,
      });
      expect(updateStatusSpy).not.toHaveBeenCalled();
      expect(updatePontuacaoSpy).not.toHaveBeenCalled();
    });

    test('pontuacao de catsitter deve aumentar baseado nos pontos da sua tarefa concluida', async () => {
      mockCatSitterAuth();
      tarefaFindByIdSpy.mockResolvedValueOnce(tarefaRow);
      updateStatusSpy.mockResolvedValueOnce(undefined);
      updatePontuacaoSpy.mockResolvedValueOnce(undefined);

      const response = await request(app)
        .put(`/api/tarefas/tarefa/${gatoTutorRow.id}/${tarefaRow.idTarefa}`)
        .send({});

      expect(response.status).toBe(200);
      expect(updateStatusSpy).toHaveBeenCalledWith(tarefaRow.idTarefa, catSitterUserRow.id);
      expect(updatePontuacaoSpy).toHaveBeenCalledWith(catSitterUserRow.id, tarefaRow.pontos);
      expect(response.body).toEqual({ message: 'Status da tarefa atualizado com sucesso!' });
    });
  });
});
