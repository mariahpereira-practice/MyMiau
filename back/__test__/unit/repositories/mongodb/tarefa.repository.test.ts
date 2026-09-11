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
const { MongoDBTarefaRepository } = require('../../../../src/repositories/mongodb/tarefa.repository');

describe('MongoDBTarefaRepository', () => {
  const gatoId = new Types.ObjectId('65f1a0020000000000000001');
  const tarefaId = new Types.ObjectId('65f1a0030000000000000001');
  const outraTarefaId = new Types.ObjectId('65f1a0030000000000000002');
  const catSitterId = new Types.ObjectId('65f1a0010000000000000001');

  const tarefaDoc = {
    _id: tarefaId,
    descricao: 'Escovar o gato',
    pontos: 10,
    status: 'PENDENTE' as const,
    concluida_por: null,
    concluida_em: null,
  };

  const tarefaResponse = {
    idTarefa: tarefaId.toString(),
    gato_id: gatoId.toString(),
    descricao: 'Escovar o gato',
    pontos: 10,
    status: 'PENDENTE',
    concluida_por: null,
    concluida_em: null,
  };

  const repository = new MongoDBTarefaRepository();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('findMany devolve as tarefas embutidas do gato, da mais recente para a mais antiga', async () => {
    gatoModelMock.findById.mockReturnValue(
      mockQuery({ _id: gatoId, tarefas: [tarefaDoc, { ...tarefaDoc, _id: outraTarefaId }] }),
    );

    const result = await repository.findMany(gatoId.toString());

    expect(result).toHaveLength(2);
    expect(result[0].idTarefa).toBe(outraTarefaId.toString());
    expect(result[1]).toEqual(tarefaResponse);
    expect(gatoModelMock.findById).toHaveBeenCalledWith(gatoId.toString());
  });

  test('findMany retorna vazio quando o gato não existe', async () => {
    gatoModelMock.findById.mockReturnValue(mockQuery(null));

    await expect(repository.findMany(gatoId.toString())).resolves.toEqual([]);
  });

  test('findMany retorna vazio sem consultar quando o id não é um ObjectId', async () => {
    await expect(repository.findMany('abc')).resolves.toEqual([]);
    expect(gatoModelMock.findById).not.toHaveBeenCalled();
  });

  test('findById localiza a tarefa dentro do array do gato', async () => {
    gatoModelMock.findOne.mockReturnValue(
      mockQuery({ _id: gatoId, tarefas: [{ ...tarefaDoc, _id: outraTarefaId }, tarefaDoc] }),
    );

    await expect(repository.findById(tarefaId.toString())).resolves.toEqual(tarefaResponse);
    expect(gatoModelMock.findOne).toHaveBeenCalledWith({ 'tarefas._id': tarefaId });
  });

  test('findById converte concluida_por em string', async () => {
    gatoModelMock.findOne.mockReturnValue(
      mockQuery({
        _id: gatoId,
        tarefas: [{ ...tarefaDoc, status: 'CONCLUIDA', concluida_por: catSitterId }],
      }),
    );

    await expect(repository.findById(tarefaId.toString())).resolves.toEqual({
      ...tarefaResponse,
      status: 'CONCLUIDA',
      concluida_por: catSitterId.toString(),
    });
  });

  test('findById retorna undefined quando não encontra', async () => {
    gatoModelMock.findOne.mockReturnValue(mockQuery(null));

    await expect(repository.findById(tarefaId.toString())).resolves.toBeUndefined();
  });

  test('findById retorna undefined sem consultar quando o id não é um ObjectId', async () => {
    await expect(repository.findById('abc')).resolves.toBeUndefined();
    expect(gatoModelMock.findOne).not.toHaveBeenCalled();
  });

  test('create faz $push da tarefa no gato pai', async () => {
    gatoModelMock.updateOne.mockResolvedValue({ matchedCount: 1 });
    const concluidaEm = new Date('2026-01-01T00:00:00Z');

    const result = await repository.create({
      descricao: 'Dar banho',
      pontos: 10,
      status: 'PENDENTE',
      concluida_por: catSitterId.toString(),
      concluida_em: concluidaEm,
      gato_id: gatoId.toString(),
    });

    expect(Types.ObjectId.isValid(result.insertId)).toBe(true);
    const [filtro, update] = gatoModelMock.updateOne.mock.calls[0] as [any, any];
    expect(filtro).toEqual({ _id: gatoId.toString() });
    expect(update.$push.tarefas).toEqual(
      expect.objectContaining({
        descricao: 'Dar banho',
        pontos: 10,
        status: 'PENDENTE',
        concluida_por: catSitterId,
        concluida_em: concluidaEm,
      }),
    );
  });

  test('create falha quando o gato não existe', async () => {
    gatoModelMock.updateOne.mockResolvedValue({ matchedCount: 0 });

    await expect(
      repository.create({
        descricao: 'Dar banho',
        pontos: 10,
        status: 'PENDENTE',
        concluida_por: null,
        concluida_em: new Date(),
        gato_id: gatoId.toString(),
      }),
    ).rejects.toThrow('Gato não encontrado para criar a tarefa.');
  });

  test('create falha quando o gato_id não é um ObjectId', async () => {
    await expect(
      repository.create({
        descricao: 'Dar banho',
        pontos: 10,
        status: 'PENDENTE',
        concluida_por: null,
        concluida_em: new Date(),
        gato_id: 'abc',
      }),
    ).rejects.toThrow('Gato não encontrado para criar a tarefa.');
    expect(gatoModelMock.updateOne).not.toHaveBeenCalled();
  });

  test('delete faz $pull da tarefa', async () => {
    gatoModelMock.updateOne.mockResolvedValue({ matchedCount: 1 });

    await repository.delete(tarefaId.toString());

    expect(gatoModelMock.updateOne).toHaveBeenCalledWith(
      { 'tarefas._id': tarefaId },
      { $pull: { tarefas: { _id: tarefaId } } },
    );
  });

  test('update usa o operador posicional', async () => {
    gatoModelMock.updateOne.mockResolvedValue({ matchedCount: 1 });

    await repository.update(tarefaId.toString(), {
      descricao: 'Dar remédio',
      pontos: 15,
      status: 'PENDENTE',
    });

    expect(gatoModelMock.updateOne).toHaveBeenCalledWith(
      { 'tarefas._id': tarefaId },
      {
        $set: {
          'tarefas.$.descricao': 'Dar remédio',
          'tarefas.$.pontos': 15,
          'tarefas.$.status': 'PENDENTE',
        },
      },
    );
  });

  test('updateStatus conclui a tarefa e registra o catsitter', async () => {
    gatoModelMock.updateOne.mockResolvedValue({ matchedCount: 1 });

    await repository.updateStatus(tarefaId.toString(), catSitterId.toString());

    expect(gatoModelMock.updateOne).toHaveBeenCalledWith(
      { 'tarefas._id': tarefaId },
      {
        $set: {
          'tarefas.$.status': 'CONCLUIDA',
          'tarefas.$.concluida_em': expect.any(Date),
          'tarefas.$.concluida_por': catSitterId,
        },
      },
    );
  });

  test('updateStatus não consulta quando algum id é inválido', async () => {
    await repository.updateStatus('abc', catSitterId.toString());
    await repository.updateStatus(tarefaId.toString(), 'abc');

    expect(gatoModelMock.updateOne).not.toHaveBeenCalled();
  });

  test('addPoints incrementa a pontuação na colecao de usuarios', async () => {
    userModelMock.updateOne.mockResolvedValue({ matchedCount: 1 });

    await repository.addPoints(catSitterId.toString(), 15);

    expect(userModelMock.updateOne).toHaveBeenCalledWith(
      { _id: catSitterId.toString() },
      { $inc: { pontuacao: 15 } },
    );
  });

  test('addPoints não consulta quando o id não é um ObjectId', async () => {
    await repository.addPoints('abc', 15);

    expect(userModelMock.updateOne).not.toHaveBeenCalled();
  });
});
