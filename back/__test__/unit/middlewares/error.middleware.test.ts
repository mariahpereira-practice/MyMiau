import { afterEach, describe, expect, jest, test } from '@jest/globals';
import type { Request, Response } from 'express';
import errorHandler from '../../../src/middlewares/error.middleware';

const makeResponse = () => {
  const response = { status: jest.fn(), json: jest.fn() } as unknown as Response;
  (response.status as jest.Mock).mockReturnValue(response);
  return response;
};

describe('errorHandler', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('retorna erro HTTP com status e mensagem', () => {
    const response = makeResponse();
    const logSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const error = Object.assign(new Error('Falha de validação'), { status: 422 });

    errorHandler(error, {} as Request, response, jest.fn());

    expect(logSpy).toHaveBeenCalledWith(error);
    expect(response.status).toHaveBeenCalledWith(422);
    expect(response.json).toHaveBeenCalledWith({
      statusCode: 422,
      message: 'Falha de validação',
      error: true,
    });
  });

  test('usa 500 e mensagem padrão quando erro não possui detalhes', () => {
    const response = makeResponse();
    jest.spyOn(console, 'error').mockImplementation(() => undefined);

    errorHandler({} as Error, {} as Request, response, jest.fn());

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({
      statusCode: 500,
      message: 'Internal Server Error',
      error: true,
    });
  });

  test('inclui metadados SQL quando presentes', () => {
    const response = makeResponse();
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const error = {
      status: 409,
      message: 'Database conflict',
      code: 'ER_DUP_ENTRY',
      errno: 1062,
      sqlState: '23000',
    };

    errorHandler(error, {} as Request, response, jest.fn());

    expect(response.json).toHaveBeenCalledWith({
      statusCode: 409,
      message: 'Database conflict',
      error: true,
      code: 'ER_DUP_ENTRY',
      errno: 1062,
      sqlState: '23000',
    });
  });
});
