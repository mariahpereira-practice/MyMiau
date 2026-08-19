import { describe, expect, jest, test } from '@jest/globals';
import type { Request, Response } from 'express';
import { validateBody } from '../../../validators/validate-body.middleware';

const makeResponse = () => {
  const response = {
    status: jest.fn(),
    json: jest.fn(),
  } as unknown as Response;

  (response.status as jest.Mock).mockReturnValue(response);
  return response;
};

describe('validateBody', () => {
  test('retorna 400 e não chama next quando o body é inválido', () => {
    const response = makeResponse();
    const next = jest.fn();
    const middleware = validateBody(() => ['campo inválido.']);

    middleware(
      { body: {} } as Request,
      response,
      next,
    );

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      error: true,
      message: 'Dados inválidos.',
      errors: ['campo inválido.'],
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('chama next quando o body é válido', () => {
    const response = makeResponse();
    const next = jest.fn();
    const validator = jest.fn((_body: unknown) => []);
    const middleware = validateBody(validator);
    const body = { nome: 'Marley' };

    middleware(
      { body } as Request,
      response,
      next,
    );

    expect(validator).toHaveBeenCalledWith(body);
    expect(next).toHaveBeenCalledTimes(1);
    expect(response.status).not.toHaveBeenCalled();
    expect(response.json).not.toHaveBeenCalled();
  });
});
