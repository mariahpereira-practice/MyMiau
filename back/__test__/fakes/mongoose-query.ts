import { jest } from '@jest/globals';

// mockResolvedValue exige um retorno declarado como Promise; com `any` o jest
// infere `never` e recusa qualquer valor.
type QueryFn = (...args: any[]) => any;
type PromiseFn = (...args: any[]) => Promise<any>;

// Mongoose encadeia: find(...).sort(...).select(...).lean(). Cada elo devolve o
// proprio objeto ate o lean(), que resolve o resultado.
export function mockQuery(result: unknown) {
  const chain = {
    sort: jest.fn(() => chain),
    select: jest.fn(() => chain),
    lean: jest.fn(async () => result),
  };
  return chain;
}

export type MongooseModelMock = {
  find: jest.Mock<QueryFn>;
  findOne: jest.Mock<QueryFn>;
  findById: jest.Mock<QueryFn>;
  create: jest.Mock<PromiseFn>;
  updateOne: jest.Mock<PromiseFn>;
};

export function createModelMock(): MongooseModelMock {
  return {
    find: jest.fn<QueryFn>(),
    findOne: jest.fn<QueryFn>(),
    findById: jest.fn<QueryFn>(),
    create: jest.fn<PromiseFn>(),
    updateOne: jest.fn<PromiseFn>(),
  };
}
