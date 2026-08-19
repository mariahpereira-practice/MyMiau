import { describe, expect, test } from '@jest/globals';
import { MariaDbTarefaRepository } from '../../../src/repositories/tarefa.repository';
import { FakeDatabaseClient } from '../../fakes/fake-database-client';

describe('MariaDbTarefaRepository', () => {
  const tarefa = {
    idTarefa: 9,
    gato_id: 7,
    descricao: 'Escovar o gato',
    pontos: 10,
    status: 'PENDENTE' as const,
    concluida_por: null,
    concluida_em: null,
  };

  test('findMany lista tarefas do gato', async () => {
    const database = new FakeDatabaseClient([[tarefa]]);
    const repository = new MariaDbTarefaRepository(database);

    await expect(repository.findMany(tarefa.gato_id)).resolves.toEqual([tarefa]);
    expect(database.calls[0]).toEqual({
      sql: 'SELECT * FROM tarefas t WHERE t.gato_id = ? ORDER BY t.idTarefa DESC',
      params: [tarefa.gato_id],
    });
  });

  test('findMany retorna lista vazia quando não há tarefas', async () => {
    const database = new FakeDatabaseClient([[]]);
    const repository = new MariaDbTarefaRepository(database);

    await expect(repository.findMany(999)).resolves.toEqual([]);
    expect(database.calls[0].params).toEqual([999]);
  });

  test('findById busca tarefa pelo id', async () => {
    const database = new FakeDatabaseClient([[tarefa]]);
    const repository = new MariaDbTarefaRepository(database);

    await expect(repository.findById(tarefa.idTarefa)).resolves.toEqual(tarefa);
    expect(database.calls[0].params).toEqual([tarefa.idTarefa]);
    expect(database.calls[0].sql).toContain('WHERE t.idTarefa = ?');
  });

  test('findById retorna undefined quando não encontra tarefa', async () => {
    const database = new FakeDatabaseClient([[]]);
    const repository = new MariaDbTarefaRepository(database);

    await expect(repository.findById(999)).resolves.toBeUndefined();
  });

  test('create insere uma tarefa', async () => {
    const database = new FakeDatabaseClient([{ insertId: 11 }]);
    const repository = new MariaDbTarefaRepository(database);
    const input = {
      descricao: tarefa.descricao,
      pontos: tarefa.pontos,
      status: tarefa.status,
      concluida_por: null,
      concluida_em: new Date('2026-01-01T00:00:00Z'),
      gato_id: tarefa.gato_id,
    };

    await expect(repository.create(input)).resolves.toEqual({ insertId: 11 });
    expect(database.calls[0].sql).toContain('INSERT INTO tarefas');
    expect(database.calls[0].params).toEqual([
      input.descricao,
      input.pontos,
      input.status,
      input.concluida_por,
      input.concluida_em,
      input.gato_id,
    ]);
  });

  test('delete remove uma tarefa', async () => {
    const database = new FakeDatabaseClient([undefined]);
    const repository = new MariaDbTarefaRepository(database);

    await repository.delete(tarefa.idTarefa);

    expect(database.calls[0]).toEqual({
      sql: 'DELETE FROM tarefas WHERE idTarefa = ?',
      params: [tarefa.idTarefa],
    });
  });

  test('update altera descrição, pontos e status', async () => {
    const database = new FakeDatabaseClient([undefined]);
    const repository = new MariaDbTarefaRepository(database);
    const update = {
      descricao: 'Dar remédio',
      pontos: 15,
      status: 'PENDENTE' as const,
    };

    await repository.update(tarefa.idTarefa, update);

    expect(database.calls[0].sql).toContain('UPDATE tarefas SET descricao = ?, pontos = ?, status = ?');
    expect(database.calls[0].params).toEqual([
      update.descricao,
      update.pontos,
      update.status,
      tarefa.idTarefa,
    ]);
  });

  test('updateStatus conclui tarefa e registra catsitter', async () => {
    const database = new FakeDatabaseClient([undefined]);
    const repository = new MariaDbTarefaRepository(database);

    await repository.updateStatus(tarefa.idTarefa, 3);

    expect(database.calls[0].sql).toContain("UPDATE tarefas SET status = 'CONCLUIDA'");
    expect(database.calls[0].params).toEqual([expect.any(Date), 3, tarefa.idTarefa]);
  });

  test('addPoints atualiza pontuação do catsitter', async () => {
    const database = new FakeDatabaseClient([undefined]);
    const repository = new MariaDbTarefaRepository(database);

    await repository.addPoints(3, tarefa.pontos);

    expect(database.calls[0]).toEqual({
      sql: 'UPDATE users SET pontuacao = pontuacao + ? WHERE id = ?',
      params: [tarefa.pontos, 3],
    });
  });
});
