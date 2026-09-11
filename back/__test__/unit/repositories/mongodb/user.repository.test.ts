import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { Types } from 'mongoose';
import { UserRole } from '../../../../src/dtos/user.dto';
import { createModelMock, mockQuery } from '../../../fakes/mongoose-query';

const userModelMock = createModelMock();

jest.mock('../../../../src/repositories/mongodb/schemas/user.schema', () => ({
  UserSchemaModel: userModelMock,
}));

// require depois do jest.mock: um import seria içado acima da definicao do mock.
const { MongoDBUserRepository } = require('../../../../src/repositories/mongodb/user.repository');

describe('MongoDBUserRepository', () => {
  const userId = new Types.ObjectId('65f1a0010000000000000001');
  const userDoc = {
    _id: userId,
    username: 'juliana',
    email: 'juliana@email.com',
    password_hash: 'hash',
    role: UserRole.TUTOR,
    pontuacao: 10,
    rankGlobal: 'Ouro',
  };

  const userRow = {
    id: '65f1a0010000000000000001',
    username: 'juliana',
    email: 'juliana@email.com',
    role: UserRole.TUTOR,
    pontuacao: 10,
    rankGlobal: 'Ouro',
    password_hash: 'hash',
  };

  const repository = new MongoDBUserRepository();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('findByEmail converte o _id em string', async () => {
    userModelMock.findOne.mockReturnValue(mockQuery(userDoc));

    await expect(repository.findByEmail(userRow.email)).resolves.toEqual(userRow);
    expect(userModelMock.findOne).toHaveBeenCalledWith({ email: userRow.email });
  });

  test('findByEmail retorna null quando não encontra', async () => {
    userModelMock.findOne.mockReturnValue(mockQuery(null));

    await expect(repository.findByEmail('missing@email.com')).resolves.toBeNull();
  });

  test('findByUsername busca pelo username', async () => {
    userModelMock.findOne.mockReturnValue(mockQuery(userDoc));

    await expect(repository.findByUsername('juliana')).resolves.toEqual(userRow);
    expect(userModelMock.findOne).toHaveBeenCalledWith({ username: 'juliana' });
  });

  test('findById busca pelo _id', async () => {
    userModelMock.findById.mockReturnValue(mockQuery(userDoc));

    await expect(repository.findById(userRow.id)).resolves.toEqual(userRow);
    expect(userModelMock.findById).toHaveBeenCalledWith(userRow.id);
  });

  test('findById retorna null sem consultar quando o id não é um ObjectId', async () => {
    await expect(repository.findById('nao-e-objectid')).resolves.toBeNull();
    expect(userModelMock.findById).not.toHaveBeenCalled();
  });

  test('create devolve o _id gerado como insertId', async () => {
    userModelMock.create.mockResolvedValue({ _id: userId });

    const input = {
      username: 'nova',
      email: 'nova@email.com',
      password_hash: 'hash',
      role: UserRole.CATSITTER,
    };

    await expect(repository.create(input)).resolves.toEqual({ insertId: userRow.id });
    expect(userModelMock.create).toHaveBeenCalledWith({
      ...input,
      pontuacao: 0,
      rankGlobal: '',
    });
  });
});
