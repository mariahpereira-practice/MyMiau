import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { Types } from 'mongoose';
import { createModelMock, mockQuery } from '../../../fakes/mongoose-query';

const gatoModelMock = createModelMock();
const userModelMock = createModelMock();

jest.mock('../../../../src/repositories/mongodb/schemas/gato.schema', () => ({
  GatoSchemaModel: gatoModelMock,
}));

jest.mock('../../../../src/repositories/mongodb/schemas/user.schema', () => ({
  UserSchemaModel: userModelMock,
}));

// require depois do jest.mock: um import seria içado acima da definicao do mock.
const { MongoDBRepository } = require('../../../../src/repositories/mongodb/gato.repository');

describe('MongoDBRepository (gatos)', () => {
  const gatoId = new Types.ObjectId('65f1a0020000000000000001');
  const tutorId = new Types.ObjectId('65f1a0010000000000000002');

  const gatoDoc = {
    _id: gatoId,
    nomeGato: 'Mingau',
    idadeGato: 2,
    pesoGato: 4.1,
    peloGato: 1,
    racaGato: 'Angorá',
    idIcone: 1,
    tutor_id: tutorId,
    disponivel_para_cuidado: 1 as const,
    tarefas: [],
  };

  const gatoResponse = {
    id: gatoId.toString(),
    nomeGato: 'Mingau',
    idadeGato: 2,
    pesoGato: 4.1,
    peloGato: 1,
    racaGato: 'Angorá',
    idIcone: 1,
    tutor_id: tutorId.toString(),
    tutorNome: 'juliana',
    disponivel_para_cuidado: 1,
  };

  const repository = new MongoDBRepository();

  const mockTutorLookup = () =>
    userModelMock.find.mockReturnValue(mockQuery([{ _id: tutorId, username: 'juliana' }]));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('findMany resolve o tutorNome com uma unica consulta de usuarios', async () => {
    gatoModelMock.find.mockReturnValue(mockQuery([gatoDoc, { ...gatoDoc, _id: new Types.ObjectId() }]));
    mockTutorLookup();

    const result = await repository.findMany();

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(gatoResponse);
    // Dois gatos do mesmo tutor: o lookup deduplica e nao dispara N+1.
    expect(userModelMock.find).toHaveBeenCalledTimes(1);
    expect(userModelMock.find).toHaveBeenCalledWith({ _id: { $in: [tutorId.toString()] } });
  });

  test('findMany filtra por tutor, disponibilidade e nome', async () => {
    gatoModelMock.find.mockReturnValue(mockQuery([gatoDoc]));
    mockTutorLookup();

    await repository.findMany({
      tutorId: tutorId.toString(),
      disponiveis: true,
      searchGato: 'Min',
    });

    expect(gatoModelMock.find).toHaveBeenCalledWith({
      tutor_id: tutorId,
      disponivel_para_cuidado: 1,
      nomeGato: { $regex: 'Min', $options: 'i' },
    });
  });

  test('findMany escapa metacaracteres da busca', async () => {
    gatoModelMock.find.mockReturnValue(mockQuery([]));
    userModelMock.find.mockReturnValue(mockQuery([]));

    await repository.findMany({ searchGato: 'a+(b)' });

    expect(gatoModelMock.find).toHaveBeenCalledWith({
      nomeGato: { $regex: 'a\\+\\(b\\)', $options: 'i' },
    });
  });

  test('findMany retorna vazio quando o tutorId não é um ObjectId', async () => {
    await expect(repository.findMany({ tutorId: 'nao-e-objectid' })).resolves.toEqual([]);
    expect(gatoModelMock.find).not.toHaveBeenCalled();
  });

  test('findMany busca por nome do tutor antes de filtrar os gatos', async () => {
    userModelMock.find
      .mockReturnValueOnce(mockQuery([{ _id: tutorId }]))
      .mockReturnValueOnce(mockQuery([{ _id: tutorId, username: 'juliana' }]));
    gatoModelMock.find.mockReturnValue(mockQuery([gatoDoc]));

    await repository.findMany({ searchTutor: 'jul' });

    expect(userModelMock.find).toHaveBeenNthCalledWith(1, {
      username: { $regex: 'jul', $options: 'i' },
    });
    expect(gatoModelMock.find).toHaveBeenCalledWith({ tutor_id: { $in: [tutorId] } });
  });

  test('findById mapeia o documento encontrado', async () => {
    gatoModelMock.findById.mockReturnValue(mockQuery(gatoDoc));
    mockTutorLookup();

    await expect(repository.findById(gatoId.toString())).resolves.toEqual(gatoResponse);
    expect(gatoModelMock.findById).toHaveBeenCalledWith(gatoId.toString());
  });

  test('findById devolve tutorNome vazio quando o tutor não existe mais', async () => {
    gatoModelMock.findById.mockReturnValue(mockQuery(gatoDoc));
    userModelMock.find.mockReturnValue(mockQuery([]));

    await expect(repository.findById(gatoId.toString())).resolves.toEqual({
      ...gatoResponse,
      tutorNome: '',
    });
  });

  test('findById retorna null sem consultar quando o id não é um ObjectId', async () => {
    await expect(repository.findById('123')).resolves.toBeNull();
    expect(gatoModelMock.findById).not.toHaveBeenCalled();
  });

  test('findById retorna null quando não encontra', async () => {
    gatoModelMock.findById.mockReturnValue(mockQuery(null));

    await expect(repository.findById(gatoId.toString())).resolves.toBeNull();
  });

  test('create grava o tutor como ObjectId e devolve o gato criado', async () => {
    gatoModelMock.create.mockResolvedValue({ _id: gatoId });
    gatoModelMock.findById.mockReturnValue(mockQuery(gatoDoc));
    mockTutorLookup();

    const result = await repository.create({
      nomeGato: 'Mingau',
      idadeGato: 2,
      pesoGato: 4.1,
      peloGato: 1,
      racaGato: 'Angorá',
      idIcone: 1,
      tutor_id: tutorId.toString(),
    });

    expect(result).toEqual(gatoResponse);
    expect(gatoModelMock.create).toHaveBeenCalledWith(
      expect.objectContaining({ tutor_id: tutorId, disponivel_para_cuidado: 0, tarefas: [] }),
    );
  });

  test('create falha quando o registro criado não pode ser recuperado', async () => {
    gatoModelMock.create.mockResolvedValue({ _id: gatoId });
    gatoModelMock.findById.mockReturnValue(mockQuery(null));

    await expect(
      repository.create({
        nomeGato: 'Mingau',
        idadeGato: 2,
        pesoGato: 4.1,
        peloGato: 1,
        racaGato: 'Angorá',
        idIcone: 1,
        tutor_id: tutorId.toString(),
      }),
    ).rejects.toThrow('Failed to create gato.');
  });

  test('update aplica $set nos campos do gato', async () => {
    gatoModelMock.updateOne.mockResolvedValue({ matchedCount: 1 });

    const update = {
      nomeGato: 'Mingau atualizado',
      idadeGato: 3,
      pesoGato: 5,
      peloGato: 2,
      racaGato: 'Persa',
      idIcone: 2,
      disponivel_para_cuidado: 0 as const,
    };

    await repository.update(gatoId.toString(), update);

    expect(gatoModelMock.updateOne).toHaveBeenCalledWith(
      { _id: gatoId.toString() },
      { $set: update },
    );
  });

  test('update não consulta quando o id não é um ObjectId', async () => {
    await repository.update('abc', {
      nomeGato: 'x',
      idadeGato: 1,
      pesoGato: 1,
      peloGato: 1,
      racaGato: 'x',
      idIcone: 1,
      disponivel_para_cuidado: 1,
    });

    expect(gatoModelMock.updateOne).not.toHaveBeenCalled();
  });
});
