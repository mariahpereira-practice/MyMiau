import { EventEmitter } from 'node:events';
import { afterEach, describe, expect, jest, test } from '@jest/globals';
import type { Request, Response } from 'express';
import { requestLogger } from '../../../src/middlewares/request-logger.middleware';

const makeResponse = (statusCode: number) => {
  const response = new EventEmitter() as Response;
  response.statusCode = statusCode;
  return response;
};

describe('requestLogger', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('registra requisição autenticada quando a resposta termina', () => {
    const response = makeResponse(200);
    const next = jest.fn();
    const logSpy = jest.spyOn(console, 'info').mockImplementation(() => undefined);
    const request = {
        method: 'GET',
        originalUrl: '/api/gatos/meus',
        user: { id: 7 },
    } as unknown as Request;

    requestLogger(request, response, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(logSpy).not.toHaveBeenCalled();

    response.emit('finish');

    expect(logSpy).toHaveBeenCalledTimes(1);
    const firstCall = logSpy.mock.calls[0]!;
    const log = JSON.parse(firstCall[0] as string) as Record<string, unknown>;
    expect(log).toMatchObject({
      method: 'GET',
      url: '/api/gatos/meus',
      status: 200,
      userId: 7,
    });
    expect(typeof log.durationMs).toBe('number');
    expect(log).not.toHaveProperty('authorization');
    expect(log).not.toHaveProperty('body');
  });

  test('registra userId nulo para requisição anônima', () => {
    const response = makeResponse(401);
    const next = jest.fn();
    const logSpy = jest.spyOn(console, 'info').mockImplementation(() => undefined);
    const request = {
      method: 'POST',
      originalUrl: '/api/auth/login',
    } as Request;

    requestLogger(request, response, next);
    response.emit('finish');
    const firstCall = logSpy.mock.calls[0]!;
    const log = JSON.parse(firstCall[0] as string) as Record<string, unknown>;
    expect(log).toMatchObject({
      method: 'POST',
      url: '/api/auth/login',
      status: 401,
      userId: null,
    });
  });
});
