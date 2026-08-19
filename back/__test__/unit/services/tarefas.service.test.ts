import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { CreateTarefaInputDTO, TarefaResponseDTO, UpdateTarefaInputDTO } from '../../../src/dtos/tarefa.dto';
import { UserRole } from '../../../src/dtos/user.dto';
import { UserModel, UserRow } from '../../../src/models/user.model';
import { TarefaService } from '../../../src/services/tarefas.service';
import type { UserRepository } from '../../../src/repositories/user.repository';

const runMocks = {
  catSitterList: jest.fn<() => Promise<TarefaResponseDTO[]>>(),
  tutorList: jest.fn<() => Promise<TarefaResponseDTO[]>>(),
  create: jest.fn<() => Promise<void>>(),
  remove: jest.fn<() => Promise<void>>(),
  update: jest.fn<() => Promise<void>>(),
  conclude: jest.fn<() => Promise<void>>(),
};
const ctorMocks = {
  catSitterList: jest.fn(),
  tutorList: jest.fn(),
  create: jest.fn(),
  remove: jest.fn(),
  update: jest.fn(),
  conclude: jest.fn(),
};

jest.mock('../../../src/models/tutorAction', () => {
  const actual = jest.requireActual('../../../src/models/tutorAction') as typeof import('../../../src/models/tutorAction');
  class FakeTutorList extends actual.ListarTarefasTutorAction {
    constructor(user: UserModel, idGato: number) { super(user, idGato); ctorMocks.tutorList(user, idGato); }
    run() { return runMocks.tutorList(); }
  }
  class FakeCreate extends actual.CriarTarefaTutorAction {
    constructor(user: UserModel, idGato: number, data: CreateTarefaInputDTO) { super(user, idGato, data); ctorMocks.create(user, idGato, data); }
    run() { return runMocks.create(); }
  }
  class FakeUpdate extends actual.AtualizarTarefaTutorAction {
    constructor(user: UserModel, idGato: number, idTarefa: number, data: UpdateTarefaInputDTO) { super(user, idGato, idTarefa, data); ctorMocks.update(user, idGato, idTarefa, data); }
    run() { return runMocks.update(); }
  }
  class FakeRemove extends actual.DeletarTarefaTutorAction {
    constructor(user: UserModel, idGato: number, idTarefa: number) { super(user, idGato, idTarefa); ctorMocks.remove(user, idGato, idTarefa); }
    run() { return runMocks.remove(); }
  }
  return { ...actual, ListarTarefasTutorAction: FakeTutorList, CriarTarefaTutorAction: FakeCreate, AtualizarTarefaTutorAction: FakeUpdate, DeletarTarefaTutorAction: FakeRemove };
});

jest.mock('../../../src/models/catSitterAction', () => {
  const actual = jest.requireActual('../../../src/models/catSitterAction') as typeof import('../../../src/models/catSitterAction');
  class FakeCatSitterList extends actual.ListarTarefasCatSitterAction {
    constructor(user: UserModel, idGato: number) { super(user, idGato); ctorMocks.catSitterList(user, idGato); }
    run() { return runMocks.catSitterList(); }
  }
  class FakeConclude extends actual.ConcluirTarefa {
    constructor(user: UserModel, idTarefa: number) { super(user, idTarefa); ctorMocks.conclude(user, idTarefa); }
    run() { return runMocks.conclude(); }
  }
  return { ...actual, ListarTarefasCatSitterAction: FakeCatSitterList, ConcluirTarefa: FakeConclude };
});

describe('TarefaService', () => {
  const userRow: UserRow = { id: 99, username: 'tutor99', email: 'tutor99@email.com', role: UserRole.TUTOR, password_hash: 'hash' };
  const tarefa: TarefaResponseDTO = { idTarefa: 7, gato_id: 1, descricao: 'Escovar', pontos: 10, status: 'PENDENTE', concluida_por: null, concluida_em: null };
  const userRepository: jest.Mocked<UserRepository> = { findByEmail: jest.fn(), findByUsername: jest.fn(), findById: jest.fn(), create: jest.fn() };
  const service = new TarefaService(userRepository);

  beforeEach(() => {
    jest.clearAllMocks();
    userRepository.findById.mockResolvedValue(userRow);
  });

  test('lista tarefas para catsitter', async () => {
    runMocks.catSitterList.mockResolvedValue([tarefa]);
    await expect(service.listTarefasCatSitter({ idGato: 1, idCatSitter: 99 })).resolves.toEqual([tarefa]);
    expect(userRepository.findById).toHaveBeenCalledWith(99);
    expect(ctorMocks.catSitterList).toHaveBeenCalledWith(expect.any(UserModel), 1);
  });

  test('lista tarefas para tutor', async () => {
    runMocks.tutorList.mockResolvedValue([tarefa]);
    await expect(service.listTarefasTutor({ idGato: 1, idTutor: 99 })).resolves.toEqual([tarefa]);
    expect(userRepository.findById).toHaveBeenCalledWith(99);
    expect(ctorMocks.tutorList).toHaveBeenCalledWith(expect.any(UserModel), 1);
  });

  test('cria tarefa', async () => {
    const input: CreateTarefaInputDTO = { descricao: 'Limpar caixa', pontos: 5 };
    await service.criarTarefa(1, 99, input);
    expect(userRepository.findById).toHaveBeenCalledWith(99);
    expect(ctorMocks.create).toHaveBeenCalledWith(expect.any(UserModel), 1, input);
  });

  test('remove tarefa', async () => {
    await service.deletarTarefaServico(1, 7, 99);
    expect(userRepository.findById).toHaveBeenCalledWith(99);
    expect(ctorMocks.remove).toHaveBeenCalledWith(expect.any(UserModel), 1, 7);
  });

  test('atualiza tarefa', async () => {
    const input: UpdateTarefaInputDTO = { descricao: 'Dar ração', pontos: 20, status: 'CONCLUIDA' };
    await service.atualizarTarefa(1, 99, input, 7);
    expect(userRepository.findById).toHaveBeenCalledWith(99);
    expect(ctorMocks.update).toHaveBeenCalledWith(expect.any(UserModel), 1, 7, input);
  });

  test('conclui tarefa', async () => {
    await service.atualizarStatusTarefa(7, 99);
    expect(userRepository.findById).toHaveBeenCalledWith(99);
    expect(ctorMocks.conclude).toHaveBeenCalledWith(expect.any(UserModel), 7);
  });

  test('rejeita usuário inexistente', async () => {
    userRepository.findById.mockResolvedValueOnce(null);
    await expect(service.listTarefasTutor({ idGato: 1, idTutor: 1234 })).rejects.toThrow('Usuário não encontrado.');
    expect(runMocks.tutorList).not.toHaveBeenCalled();
  });
});
