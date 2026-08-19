import { describe, expect, test } from '@jest/globals';
import { UserRole } from '../../../src/dtos/user.dto';
import { MariaDbUserRepository } from '../../../src/repositories/user.repository';
import { FakeDatabaseClient } from '../../fakes/fake-database-client';

describe('MariaDbUserRepository', () => {
  const user = {
    id: 1,
    username: 'juliana',
    email: 'juliana@email.com',
    role: UserRole.TUTOR,
    password_hash: 'hash',
  };

  test('findByEmail busca usuário pelo e-mail', async () => {
    const database = new FakeDatabaseClient([[user]]);
    const repository = new MariaDbUserRepository(database);

    await expect(repository.findByEmail(user.email)).resolves.toEqual(user);
    expect(database.calls[0]).toEqual({
      sql: 'SELECT * FROM users WHERE email = ? LIMIT 1',
      params: [user.email],
    });
  });

  test('findByUsername busca usuário pelo nome', async () => {
    const database = new FakeDatabaseClient([[user]]);
    const repository = new MariaDbUserRepository(database);

    await expect(repository.findByUsername(user.username)).resolves.toEqual(user);
    expect(database.calls[0].params).toEqual([user.username]);
    expect(database.calls[0].sql).toContain('WHERE username = ?');
  });

  test('findById busca usuário pelo id', async () => {
    const database = new FakeDatabaseClient([[user]]);
    const repository = new MariaDbUserRepository(database);

    await expect(repository.findById(user.id)).resolves.toEqual(user);
    expect(database.calls[0].params).toEqual([user.id]);
    expect(database.calls[0].sql).toContain('WHERE id = ?');
  });

  test('create insere usuário e retorna insertId', async () => {
    const database = new FakeDatabaseClient([{ insertId: 10 }]);
    const repository = new MariaDbUserRepository(database);
    const input = {
      username: user.username,
      email: user.email,
      password_hash: user.password_hash,
      role: user.role,
    };

    await expect(repository.create(input)).resolves.toEqual({ insertId: 10 });
    expect(database.calls[0]).toEqual({
      sql: 'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
      params: [input.username, input.email, input.password_hash, input.role],
    });
  });
});
