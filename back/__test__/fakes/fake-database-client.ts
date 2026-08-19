import type { DatabaseClient } from '../../src/repositories/database-client';

export class FakeDatabaseClient implements DatabaseClient {
  readonly calls: Array<{ sql: string; params?: unknown[] }> = [];
  private readonly results: unknown[];

  constructor(results: unknown[] = []) {
    this.results = [...results];
  }

  async query<T = unknown>(sql: string, params?: unknown[]): Promise<T> {
    this.calls.push({ sql, params });
    return this.results.shift() as T;
  }
}
