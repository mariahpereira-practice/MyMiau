export interface DatabaseClient {
  query<T = unknown>(sql: string, params?: unknown[]): Promise<T>;
}
