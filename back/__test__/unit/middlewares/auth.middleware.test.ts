import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { requiredAuth } from '../../../src/middlewares/auth.middleware';
import { userRepository } from '../../../src/repositories/user.repository';
import { UserRole } from '../../../src/dtos/user.dto';

jest.mock('jsonwebtoken', () => ({
  __esModule: true,
  default: { verify: jest.fn() },
}));

const makeResponse = () => {
  const response = { status: jest.fn(), json: jest.fn() } as unknown as Response;
  (response.status as jest.Mock).mockReturnValue(response);
  return response;
};

const makeRequest = (authorization?: string) => ({
  headers: authorization === undefined ? {} : { authorization },
}) as Request;

describe('requiredAuth', () => {
  const verifyMock = jwt.verify as jest.Mock;
  const findByIdMock = jest.spyOn(userRepository, 'findById');
  const user = {
    id: 7,
    username: 'juliana',
    email: 'juliana@email.com',
    role: UserRole.TUTOR,
    pontuacao: 10,
    rankGlobal: 'A',
    password_hash: 'hash',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('retorna 401 sem Authorization', async () => {
    const response = makeResponse();
    const next = jest.fn();

    await requiredAuth(makeRequest(), response, next);

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({ error: 'Token não fornecido.' });
    expect(next).not.toHaveBeenCalled();
  });

  test('retorna 401 quando Authorization não usa Bearer', async () => {
    const response = makeResponse();
    const next = jest.fn();

    await requiredAuth(makeRequest('Basic abc'), response, next);

    expect(response.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('retorna 401 quando Bearer não possui token', async () => {
    const response = makeResponse();
    const next = jest.fn();

    await requiredAuth(makeRequest('Bearer '), response, next);

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({ error: 'Token inválido ou expirado.' });
  });

  test('retorna 401 quando JWT é inválido', async () => {
    verifyMock.mockImplementation(() => { throw new Error('invalid token'); });
    const response = makeResponse();
    const next = jest.fn();

    await requiredAuth(makeRequest('Bearer invalid'), response, next);

    expect(verifyMock).toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('retorna 401 quando JWT não possui id válido', async () => {
    verifyMock.mockReturnValue({ email: user.email });
    const response = makeResponse();
    const next = jest.fn();

    await requiredAuth(makeRequest('Bearer token'), response, next);

    expect(findByIdMock).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(401);
  });

  test('retorna 401 quando usuário não existe', async () => {
    verifyMock.mockReturnValue({ id: user.id });
    findByIdMock.mockResolvedValue(null);
    const response = makeResponse();
    const next = jest.fn();

    await requiredAuth(makeRequest('Bearer token'), response, next);

    expect(findByIdMock).toHaveBeenCalledWith(user.id);
    expect(response.status).toHaveBeenCalledWith(401);
  });

  test('carrega usuário no request e chama next para token válido', async () => {
    verifyMock.mockReturnValue({ id: user.id });
    findByIdMock.mockResolvedValue(user);
    const request = makeRequest('Bearer valid-token');
    const response = makeResponse();
    const next = jest.fn();

    await requiredAuth(request, response, next);

    expect(request.user).toEqual({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      pontuacao: user.pontuacao,
      rankGlobal: user.rankGlobal,
    });
    expect(next).toHaveBeenCalledTimes(1);
    expect(response.status).not.toHaveBeenCalled();
  });
});
