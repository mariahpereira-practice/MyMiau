import { describe, expect, test } from '@jest/globals';
import { MariaDbGatoRepository } from '../../../src/repositories/gato.repository';
import { FakeDatabaseClient } from '../../fakes/fake-database-client';

describe('MariaDbGatoRepository', () => {
  const gato = {
    id: 7,
    nomeGato: 'Marley',
    idadeGato: 3,
    pesoGato: 4.5,
    peloGato: 2,
    racaGato: 'Siamese',
    idIcone: 1,
    tutor_id: 2,
    tutorNome: 'juliana',
    disponivel_para_cuidado: 1 as const,
  };

  const createInput = {
    nomeGato: gato.nomeGato,
    idadeGato: gato.idadeGato,
    pesoGato: gato.pesoGato,
    peloGato: gato.peloGato,
    racaGato: gato.racaGato,
    idIcone: gato.idIcone,
    tutor_id: gato.tutor_id,
  };

  test('findMany lista gatos aplicando filtros', async () => {
    const database = new FakeDatabaseClient([[gato]]);
    const repository = new MariaDbGatoRepository(database);

    await expect(repository.findMany({
      tutorId: 2,
      disponiveis: true,
      searchGato: 'Mar',
      searchTutor: 'jul',
    })).resolves.toEqual([gato]);
    expect(database.calls[0].sql).toContain('g.tutor_id = ?');
    expect(database.calls[0].sql).toContain('g.disponivel_para_cuidado = 1');
    expect(database.calls[0].sql).toContain('g.nomeGato');
    expect(database.calls[0].sql).toContain('u.username');
    expect(database.calls[0].params).toEqual([2, '%Mar%', '%jul%']);
  });

  test('findMany lista gatos sem filtros', async () => {
    const database = new FakeDatabaseClient([[gato]]);
    const repository = new MariaDbGatoRepository(database);

    await expect(repository.findMany()).resolves.toEqual([gato]);
    expect(database.calls[0].params).toEqual([]);
  });

  test('findMany filtra por nome do gato', async () => {
    const database = new FakeDatabaseClient([[gato]]);
    const repository = new MariaDbGatoRepository(database);

    await repository.findMany({ searchGato: 'Whiskers' });

    expect(database.calls[0].sql).toContain('LOWER(g.nomeGato) LIKE LOWER(?)');
    expect(database.calls[0].params).toEqual(['%Whiskers%']);
  });

  test('findMany filtra por nome do tutor', async () => {
    const database = new FakeDatabaseClient([[gato]]);
    const repository = new MariaDbGatoRepository(database);

    await repository.findMany({ searchTutor: 'John' });

    expect(database.calls[0].sql).toContain('LOWER(u.username) LIKE LOWER(?)');
    expect(database.calls[0].params).toEqual(['%John%']);
  });

  test('findMany filtra por disponibilidade', async () => {
    const database = new FakeDatabaseClient([[gato]]);
    const repository = new MariaDbGatoRepository(database);

    await repository.findMany({ disponiveis: true });

    expect(database.calls[0].sql).toContain('g.disponivel_para_cuidado = 1');
    expect(database.calls[0].params).toEqual([]);
  });

  test('findById busca gato pelo id', async () => {
    const database = new FakeDatabaseClient([[gato]]);
    const repository = new MariaDbGatoRepository(database);

    await expect(repository.findById(gato.id)).resolves.toEqual(gato);
    expect(database.calls[0].params).toEqual([gato.id]);
    expect(database.calls[0].sql).toContain('WHERE g.id = ?');
  });

  test('findById retorna null quando não encontra gato', async () => {
    const database = new FakeDatabaseClient([[]]);
    const repository = new MariaDbGatoRepository(database);

    await expect(repository.findById(999)).resolves.toBeNull();
  });

  test('create insere gato e busca o registro criado', async () => {
    const database = new FakeDatabaseClient([{ insertId: gato.id }, [gato]]);
    const repository = new MariaDbGatoRepository(database);

    await expect(repository.create(createInput)).resolves.toEqual(gato);
    expect(database.calls[0].sql).toContain('INSERT INTO gatos');
    expect(database.calls[0].params).toEqual([
      createInput.nomeGato,
      createInput.idadeGato,
      createInput.pesoGato,
      createInput.peloGato,
      createInput.racaGato,
      createInput.idIcone,
      createInput.tutor_id,
    ]);
    expect(database.calls[1].params).toEqual([gato.id]);
  });

  test('create falha quando o registro criado não pode ser recuperado', async () => {
    const database = new FakeDatabaseClient([{ insertId: 99 }, []]);
    const repository = new MariaDbGatoRepository(database);

    await expect(repository.create(createInput)).rejects.toThrow('Failed to create gato.');
  });

  test('update altera os dados do gato', async () => {
    const database = new FakeDatabaseClient([undefined]);
    const repository = new MariaDbGatoRepository(database);
    const update = {
      nomeGato: 'Marley atualizado',
      idadeGato: 4,
      pesoGato: 5,
      peloGato: 2,
      racaGato: 'Persian',
      idIcone: 2,
      disponivel_para_cuidado: 0 as const,
    };

    await repository.update(gato.id, update);

    expect(database.calls[0].sql).toContain('UPDATE gatos');
    expect(database.calls[0].params).toEqual([
      update.nomeGato,
      update.idadeGato,
      update.pesoGato,
      update.peloGato,
      update.racaGato,
      update.idIcone,
      update.disponivel_para_cuidado,
      gato.id,
    ]);
  });
});
