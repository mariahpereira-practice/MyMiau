import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { UserRole } from '../../../src/dtos/user.dto';
import { TarefaService } from '../../../src/services/tarefas.service';
import { UserModel, UserRow } from '../../../src/models/user.model';
import { CreateTarefaInputDTO, TarefaResponseDTO, UpdateTarefaInputDTO } from '../../../src/dtos/tarefa.dto';
import { GatoModel } from '../../../src/models/gato.model';

const listarTarefasCatSitterRunMock = jest.fn<() => Promise<TarefaResponseDTO[]>>();
const listarTarefasTutorRunMock = jest.fn<() => Promise<TarefaResponseDTO[]>>();
const criarTarefaRunMock = jest.fn<() => Promise<void>>();
const deletarTarefaRunMock = jest.fn<() => Promise<void>>();
const atualizarTarefaRunMock = jest.fn<() => Promise<void>>();
const concluirTarefaRunMock = jest.fn<() => Promise<void>>();

const listarTarefasCatSitterCtorSpy = jest.fn();
const listarTarefasTutorCtorSpy = jest.fn();
const criarTarefaCtorSpy = jest.fn();
const deletarTarefaCtorSpy = jest.fn();
const atualizarTarefaCtorSpy = jest.fn();
const concluirTarefaCtorSpy = jest.fn();

jest.mock('../../../src/models/tutorAction', () => {
  const actual = jest.requireActual('../../../src/models/tutorAction') as typeof import('../../../src/models/tutorAction');

  class FakeListarTarefasTutorAction extends actual.ListarTarefasTutorAction {
    constructor(user: UserModel, idGato: number) {
      super(user, idGato);
      listarTarefasTutorCtorSpy(user, idGato);
    }

    run(): Promise<TarefaResponseDTO[]> {
      return listarTarefasTutorRunMock();
    }
  }

  class FakeCriarTarefaTutorAction extends actual.CriarTarefaTutorAction {
    constructor(user: UserModel, idGato: number, data: CreateTarefaInputDTO) {
      super(user, idGato, data);
      criarTarefaCtorSpy(user, idGato, data);
    }

    run(): Promise<void> {
      return criarTarefaRunMock();
    }
  }

  class FakeAtualizarTarefaTutorAction extends actual.AtualizarTarefaTutorAction {
    constructor(user: UserModel, idGato: number, idTarefa: number, data: UpdateTarefaInputDTO) {
      super(user, idGato, idTarefa, data);
      atualizarTarefaCtorSpy(user, idGato, idTarefa, data);
    }

    run(): Promise<void> {
      return atualizarTarefaRunMock();
    }
  }

  class FakeDeletarTarefaTutorAction extends actual.DeletarTarefaTutorAction {
    constructor(user: UserModel, idGato: number, idTarefa: number) {
      super(user, idGato, idTarefa);
      deletarTarefaCtorSpy(user, idGato, idTarefa);
    }

    run(): Promise<void> {
      return deletarTarefaRunMock();
    }
  }

  return {
    ...actual,
    ListarTarefasTutorAction: FakeListarTarefasTutorAction,
    CriarTarefaTutorAction: FakeCriarTarefaTutorAction,
    AtualizarTarefaTutorAction: FakeAtualizarTarefaTutorAction,
    DeletarTarefaTutorAction: FakeDeletarTarefaTutorAction,
  };
});

jest.mock('../../../src/models/catSitterAction', () => {
  const actual = jest.requireActual('../../../src/models/catSitterAction') as typeof import('../../../src/models/catSitterAction');

  class FakeListarTarefasCatSitterAction extends actual.ListarTarefasCatSitterAction {
    constructor(user: UserModel, idGato: number) {
      super(user, idGato);
      listarTarefasCatSitterCtorSpy(user, idGato);
    }

    run(): Promise<TarefaResponseDTO[]> {
      return listarTarefasCatSitterRunMock();
    }
  }

  class FakeConcluirTarefaAction extends actual.ConcluirTarefa {
    constructor(user: UserModel, idTarefa: number) {
      super(user, idTarefa);
      concluirTarefaCtorSpy(user, idTarefa);
    }

    run(): Promise<void> {
      return concluirTarefaRunMock();
    }
  } 

  return {
    ...actual,
    ListarTarefasCatSitterAction: FakeListarTarefasCatSitterAction,
    ConcluirTarefa: FakeConcluirTarefaAction,
  };
});

describe('Tarefas Service', () => {
  const service = new TarefaService();

  const userRow: UserRow = {
    id: 99,
    username: 'tutor99',
    email: 'tutor99@email.com',
    role: UserRole.TUTOR,
    password_hash: 'hashed-password',
  };

  const gatoRow = {
    id: 1,
    nomeGato: 'Mimi',
    tutor_id: 99,
    idadeGato: 3,
    pesoGato: 4.5,
    peloGato: 1,
    racaGato: 'Siamês',
    idIcone: 2,
    tutorNome:'tutor99',
    disponivel_para_cuidado: '1' as any,
  };  
  
  const tarefaRow: TarefaResponseDTO = {
    idTarefa: 7,
    gato_id: 1,
    descricao: 'Escovar o gato',
    pontos: 10,
    status: 'PENDENTE',
    concluida_por: null,
    concluida_em: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(UserModel, 'findById').mockResolvedValue(userRow);
    jest.spyOn(GatoModel, 'findGatoByIdGato').mockResolvedValue(gatoRow);
  });

  test('should list tarefas for cat sitter', async () => {
    listarTarefasCatSitterRunMock.mockResolvedValue([tarefaRow]);

    const result = await service.listTarefasCatSitter({ idGato: gatoRow.id, idCatSitter: gatoRow.tutor_id });

    expect(UserModel.findById).toHaveBeenCalledWith(gatoRow.tutor_id);
    expect(listarTarefasCatSitterCtorSpy).toHaveBeenCalledTimes(1);
    expect(listarTarefasTutorCtorSpy).not.toHaveBeenCalled();
    expect(listarTarefasCatSitterCtorSpy.mock.calls[0][1]).toBe(gatoRow.id);
    expect(listarTarefasCatSitterRunMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual([tarefaRow]);
  });

  test('should list tarefas for tutor', async () => {
    listarTarefasTutorRunMock.mockResolvedValue([tarefaRow]);

    const result = await service.listTarefasTutor({ idGato: gatoRow.id, idTutor: gatoRow.tutor_id });

    expect(UserModel.findById).toHaveBeenCalledWith(gatoRow.tutor_id);
    expect(listarTarefasTutorCtorSpy).toHaveBeenCalledTimes(1);
    expect(listarTarefasCatSitterCtorSpy).not.toHaveBeenCalled();
    expect(listarTarefasTutorCtorSpy.mock.calls[0][1]).toBe(gatoRow.id);
    expect(listarTarefasTutorRunMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual([tarefaRow]);
  });

  test('should create tarefa for tutor', async () => {
    const payload: CreateTarefaInputDTO = {
      descricao: 'Limpar caixa de areia',
      pontos: 5,
    };

    criarTarefaRunMock.mockResolvedValue(undefined);

    await service.criarTarefa(gatoRow.id, gatoRow.tutor_id, payload);

    expect(UserModel.findById).toHaveBeenCalledWith(gatoRow.tutor_id);
    expect(criarTarefaCtorSpy).toHaveBeenCalledTimes(1);
    expect(criarTarefaCtorSpy.mock.calls[0][1]).toBe(gatoRow.id);
    expect(criarTarefaCtorSpy.mock.calls[0][2]).toEqual(payload);
    expect(criarTarefaRunMock).toHaveBeenCalledTimes(1);
  });

  test('should delete tarefa for tutor', async () => {
    deletarTarefaRunMock.mockResolvedValue(undefined);

    await service.deletarTarefaServico(gatoRow.id, tarefaRow.idTarefa, gatoRow.tutor_id);

    expect(UserModel.findById).toHaveBeenCalledWith(gatoRow.tutor_id);
    expect(deletarTarefaCtorSpy).toHaveBeenCalledTimes(1);
    expect(deletarTarefaCtorSpy.mock.calls[0][1]).toBe(gatoRow.id);
    expect(deletarTarefaCtorSpy.mock.calls[0][2]).toBe(tarefaRow.idTarefa);
    expect(deletarTarefaRunMock).toHaveBeenCalledTimes(1);
  });

  test('should update tarefa for tutor', async () => {
    const payload: UpdateTarefaInputDTO = {
      descricao: 'Dar ração premium',
      pontos: 20,
      status: 'CONCLUIDA',
    };

    atualizarTarefaRunMock.mockResolvedValue(undefined);

    await service.atualizarTarefa(gatoRow.id, gatoRow.tutor_id, payload, tarefaRow.idTarefa);

    expect(UserModel.findById).toHaveBeenCalledWith(gatoRow.tutor_id);
    expect(atualizarTarefaCtorSpy).toHaveBeenCalledTimes(1);
    expect(atualizarTarefaCtorSpy.mock.calls[0][1]).toBe(gatoRow.id);
    expect(atualizarTarefaCtorSpy.mock.calls[0][2]).toBe(tarefaRow.idTarefa);
    expect(atualizarTarefaCtorSpy.mock.calls[0][3]).toEqual(payload);
    expect(atualizarTarefaRunMock).toHaveBeenCalledTimes(1);
  });

  test('should conclude tarefa for cat sitter', async () => {
    concluirTarefaRunMock.mockResolvedValue(undefined);

    await service.atualizarStatusTarefa(tarefaRow.idTarefa, gatoRow.tutor_id);

    expect(UserModel.findById).toHaveBeenCalledWith(gatoRow.tutor_id);
    expect(concluirTarefaCtorSpy).toHaveBeenCalledTimes(1);
    expect(concluirTarefaCtorSpy.mock.calls[0][1]).toBe(tarefaRow.idTarefa);
    expect(concluirTarefaRunMock).toHaveBeenCalledTimes(1);
  });

  test('should throw when user is not found', async () => {
    jest.spyOn(UserModel, 'findById').mockResolvedValueOnce(null);

    await expect(service.listTarefasTutor({ idGato: 1, idTutor: 1234 })).rejects.toThrow('Usuário não encontrado.');
    expect(listarTarefasTutorRunMock).not.toHaveBeenCalled();
  });


});
