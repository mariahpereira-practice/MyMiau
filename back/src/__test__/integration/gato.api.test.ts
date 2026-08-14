import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import request from 'supertest';
import app from '../../app';
import { GatoModel } from '../../models/gato.model';
import { UserModel, type UserRow } from '../../models/user.model';
import { UserRole } from '../../dtos/user.dto';
import { GatoResponseDTO } from '../../dtos/gato.dto';

const requiredAuthMock = jest.fn();

jest.mock('../../middlewares/auth.middleware', () => {
  const { UserRole: ActualUserRole } = jest.requireActual('../../dtos/user.dto') as typeof import('../../dtos/user.dto');

  return {
    requiredAuth: (...args: unknown[]) => requiredAuthMock(...args),
    UserRole: ActualUserRole,
  };
});

describe('Gato API', () => {
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

  const gatoRow: GatoResponseDTO = {
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

  const updatedGatoRow: GatoResponseDTO = {
    ...gatoRow,
    nomeGato: 'Marley Atualizado',
    idadeGato: 3,
    pesoGato: 5,
  };

  const findByIdSpy = jest.spyOn(UserModel, 'findById');
  const findManySpy = jest.spyOn(GatoModel, 'findMany');
  const findGatoByIdSpy = jest.spyOn(GatoModel, 'findGatoByIdGato');
  const createGatoSpy = jest.spyOn(GatoModel, 'createGato');
  const updateGatoSpy = jest.spyOn(GatoModel, 'updateGato');

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
    findByIdSpy.mockResolvedValue(tutorUserRow);
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
    findByIdSpy.mockResolvedValue(catSitterUserRow);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockTutorAuth();
  });

  describe('GET /api/gatos/meus', () => {
    test('ver todos os meus gatos como tutor', async () => {
      findManySpy.mockResolvedValue([gatoRow]);

      const response = await request(app).get('/api/gatos/meus');

      expect(response.status).toBe(200);
      expect(findManySpy).toHaveBeenCalledWith({
        tutorId: tutorUserRow.id,
        searchGato: undefined,
        searchTutor: undefined,
      });
      expect(response.body).toEqual([gatoRow]);
    });

    test('buscar por nome do gato como tutor', async () => {
      findManySpy.mockResolvedValue([gatoRow]);

      const response = await request(app)
        .get('/api/gatos/meus')
        .query({ search: 'mar' });

      expect(response.status).toBe(200);
      expect(findManySpy).toHaveBeenCalledWith({
        tutorId: tutorUserRow.id,
        searchGato: 'mar',
        searchTutor: undefined,
      });
      expect(response.body).toEqual([gatoRow]);
    });

    test('deve retornar lista vazia quando não houver gatos', async () => {
      findManySpy.mockResolvedValue([]);

      const response = await request(app).get('/api/gatos/meus');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
      expect(findManySpy).toHaveBeenCalledWith({
        tutorId: tutorUserRow.id,
        searchGato: undefined,
        searchTutor: undefined,
      });
    });

    test('deve retornar 403 quando o usuário não é tutor', async () => {
      mockCatSitterAuth();

      const response = await request(app).get('/api/gatos/meus');

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ error: 'Você não tem permissão para esta ação.' });
      expect(findManySpy).not.toHaveBeenCalled();
    });
  });

  describe('GET /api/gatos/disponiveis', () => {
    test('ver todos os gatos como catsitter', async () => {
      mockCatSitterAuth();
      findManySpy.mockResolvedValue([gatoRow]);

      const response = await request(app).get('/api/gatos/disponiveis');

      expect(response.status).toBe(200);
      expect(findManySpy).toHaveBeenCalledWith({
        searchGato: undefined,
        searchTutor: undefined,
        disponiveis: true,
      });
      expect(response.body).toEqual([gatoRow]);
    });

    test('buscar por nome do gato ou tutor como catsitter', async () => {
      mockCatSitterAuth();
      findManySpy.mockResolvedValue([gatoRow]);

      const response = await request(app)
        .get('/api/gatos/disponiveis')
        .query({ search: 'mar', searchTutor: 'luc' });

      expect(response.status).toBe(200);
      expect(findManySpy).toHaveBeenCalledWith({
        searchGato: 'mar',
        searchTutor: 'luc',
        disponiveis: true,
      });
      expect(response.body).toEqual([gatoRow]);
    });

    test('deve retornar lista vazia quando não houver gatos disponiveis', async () => {
      mockCatSitterAuth();
      findManySpy.mockResolvedValue([]);

      const response = await request(app).get('/api/gatos/disponiveis');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
      expect(findManySpy).toHaveBeenCalledWith({
        searchGato: undefined,
        searchTutor: undefined,
        disponiveis: true,
      });
    });

    test('deve retornar 403 quando o usuário não é catsitter', async () => {
      const response = await request(app).get('/api/gatos/disponiveis');

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ error: 'Você não tem permissão para esta ação.' });
      expect(findManySpy).not.toHaveBeenCalled();
    });
  });

  describe('POST /api/gatos', () => {
    test('deve criar um gato como tutor', async () => {
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

      const response = await request(app).post('/api/gatos').send(body);

      expect(response.status).toBe(201);
      expect(findManySpy).toHaveBeenCalledWith({
        searchGato: 'Whiskers',
        tutorId: tutorUserRow.id,
      });
      expect(createGatoSpy).toHaveBeenCalledWith({
        nomeGato: 'Whiskers',
        idadeGato: 3,
        pesoGato: 4.5,
        peloGato: 2,
        racaGato: 'Siamese',
        idIcone: 1,
        tutor_id: tutorUserRow.id,
      });
      expect(response.body).toEqual({
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

    test('deve retornar 500 quando faltam campos obrigatórios para criar o gato', async () => {
      const body = {
        idadeGato: 3,
        pesoGato: 4.5,
        peloGato: 2,
        racaGato: 'Siamese',
        idIcone: 1,
      };

      const response = await request(app).post('/api/gatos').send(body);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        statusCode: 500,
        message: 'Todos os campos são obrigatórios para salvar um gato.',
        error: true,
      });
      expect(findManySpy).not.toHaveBeenCalled();
      expect(createGatoSpy).not.toHaveBeenCalled();
    });

    test('deve impedir criar gato duplicado para o mesmo tutor', async () => {
      const body = {
        nomeGato: 'Whiskers',
        idadeGato: 3,
        pesoGato: 4.5,
        peloGato: 2,
        racaGato: 'Siamese',
        idIcone: 1,
        tutor_id: 999,
      };

      findManySpy.mockResolvedValueOnce([gatoRow]);

      const response = await request(app).post('/api/gatos').send(body);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        statusCode: 500,
        message: 'Já existe um gato com esse nome para este tutor.',
        error: true,
      });
      expect(findManySpy).toHaveBeenCalledWith({
        searchGato: 'Whiskers',
        tutorId: tutorUserRow.id,
      });
      expect(createGatoSpy).not.toHaveBeenCalled();
    });

    test('deve ignorar tutor_id enviado no body e usar o usuário autenticado', async () => {
      const body = {
        nomeGato: 'Whiskers',
        idadeGato: 3,
        pesoGato: 4.5,
        peloGato: 2,
        racaGato: 'Siamese',
        idIcone: 1,
        tutor_id: 999,
      };

      findManySpy.mockResolvedValueOnce([]);
      createGatoSpy.mockResolvedValue({
        id: 10,
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

      const response = await request(app).post('/api/gatos').send(body);

      expect(response.status).toBe(201);
      expect(createGatoSpy).toHaveBeenCalledWith(
        expect.objectContaining({ tutor_id: tutorUserRow.id }),
      );
      expect(createGatoSpy).not.toHaveBeenCalledWith(
        expect.objectContaining({ tutor_id: 999 }),
      );
    });

    test('deve retornar 403 quando o usuário não é tutor', async () => {
      mockCatSitterAuth();

      const response = await request(app).post('/api/gatos').send({});

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ error: 'Você não tem permissão para esta ação.' });
      expect(findManySpy).not.toHaveBeenCalled();
      expect(createGatoSpy).not.toHaveBeenCalled();
    });
  });

  describe('PUT /api/gatos/:id', () => {
    test('deve atualizar um gato como tutor', async () => {
      findGatoByIdSpy.mockResolvedValueOnce(gatoRow).mockResolvedValueOnce(updatedGatoRow);
      updateGatoSpy.mockResolvedValue(undefined);

      const response = await request(app)
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

      expect(response.status).toBe(200);
      expect(findGatoByIdSpy).toHaveBeenNthCalledWith(1, 8);
      expect(updateGatoSpy).toHaveBeenCalledWith(8, {
        nomeGato: 'Marley Atualizado',
        idadeGato: 3,
        pesoGato: 5,
        peloGato: 2,
        racaGato: 'Sem Raça Definida',
        idIcone: 5,
        disponivel_para_cuidado: 0,
      });
      expect(response.body).toEqual(updatedGatoRow);
    });

    test('deve retornar 500 quando o id do gato não é encontrado', async () => {
      findGatoByIdSpy.mockResolvedValueOnce(null);

      const response = await request(app)
        .put('/api/gatos/999')
        .send({
          nomeGato: 'Sem gato',
          idadeGato: 1,
          pesoGato: 1,
          peloGato: 1,
          racaGato: 'SRD',
          idIcone: 1,
        });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        statusCode: 500,
        message: 'Gato não encontrado.',
        error: true,
      });
      expect(updateGatoSpy).not.toHaveBeenCalled();
    });

    test('deve retornar 500 quando o usuario não tem permissão para atualizar o gato com o id digitado', async () => {
      const otherUserGato: GatoResponseDTO = {
        ...gatoRow,
        tutor_id: 999,
      };

      findGatoByIdSpy.mockResolvedValueOnce(otherUserGato);

      const response = await request(app)
        .put('/api/gatos/8')
        .send({
          nomeGato: 'Marley Atualizado',
          idadeGato: 3,
          pesoGato: 5,
          peloGato: 2,
          racaGato: 'Sem Raça Definida',
          idIcone: 5,
        });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        statusCode: 500,
        message: 'Você não tem permissão para atualizar este gato.',
        error: true,
      });
      expect(updateGatoSpy).not.toHaveBeenCalled();
    });

    test('deve retornar 500 quando todos os dados vierem como nulo', async () => {
      const invalidGato: GatoResponseDTO = {
        ...gatoRow,
        nomeGato: null as any,
      };

      findGatoByIdSpy.mockResolvedValueOnce(invalidGato);

      const response = await request(app)
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

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        statusCode: 500,
        message: 'Dados do gato inválidos para atualização.',
        error: true,
      });
      expect(updateGatoSpy).not.toHaveBeenCalled();
    });

    test('deve retornar 403 quando o usuário não é tutor', async () => {
      mockCatSitterAuth();

      const response = await request(app).put('/api/gatos/1').send({});

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ error: 'Você não tem permissão para esta ação.' });
      expect(updateGatoSpy).not.toHaveBeenCalled();
    });
  });
});
