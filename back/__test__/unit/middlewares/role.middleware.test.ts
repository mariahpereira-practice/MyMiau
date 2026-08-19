import { describe, expect, jest, test } from '@jest/globals';
import type { Request, Response } from 'express';
import { authorizeRoles } from '../../../src/middlewares/role.middleware';
import { UserRole } from '../../../src/dtos/user.dto';

const makeResponse = () => {
  const response = { status: jest.fn(), json: jest.fn() } as unknown as Response;
  (response.status as jest.Mock).mockReturnValue(response);
  return response;
};

describe('authorizeRoles', () => {
  test('retorna 401 quando request não possui usuário', () => {
    const response = makeResponse();
    const next = jest.fn();

    authorizeRoles(UserRole.TUTOR)({} as Request, response, next);

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({ error: 'Token não fornecido.' });
    expect(next).not.toHaveBeenCalled();
  });

  test('retorna 403 quando role não é permitida', () => {
    const response = makeResponse();
    const next = jest.fn();
    const request = { user: { role: UserRole.CATSITTER } } as Request;

    authorizeRoles(UserRole.TUTOR)(request, response, next);

    expect(response.status).toHaveBeenCalledWith(403);
    expect(response.json).toHaveBeenCalledWith({ error: 'Você não tem permissão para esta ação.' });
    expect(next).not.toHaveBeenCalled();
  });

  test('chama next quando role é permitida', () => {
    const response = makeResponse();
    const next = jest.fn();
    const request = { user: { role: UserRole.TUTOR } } as Request;

    authorizeRoles(UserRole.TUTOR, UserRole.ADMIN)(request, response, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(response.status).not.toHaveBeenCalled();
  });
});
