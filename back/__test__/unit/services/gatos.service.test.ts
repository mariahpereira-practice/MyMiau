import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { GatoCreateInputDTO, GatoListFiltersInputDTO, GatoResponseDTO, GatoUpdateInputDTO } from '../../../src/dtos/gato.dto';
import { UserRole } from '../../../src/dtos/user.dto';
import { GatosService } from '../../../src/services/gatos.service';
import { UserModel, UserRow } from '../../../src/models/user.model';

const listTutorRunMock = jest.fn<() => Promise<GatoResponseDTO[]>>();
const listCatSitterRunMock = jest.fn<() => Promise<GatoResponseDTO[]>>();
const saveGatoRunMock = jest.fn<() => Promise<GatoResponseDTO>>();
const updateGatoRunMock = jest.fn<() => Promise<GatoResponseDTO>>();

const listTutorCtorSpy = jest.fn();
const listCatSitterCtorSpy = jest.fn();
const saveGatoCtorSpy = jest.fn();
const updateGatoCtorSpy = jest.fn();

jest.mock('../../../src/models/tutorAction', () => {
  const actual = jest.requireActual('../../../src/models/tutorAction') as typeof import('../../../src/models/tutorAction');

  class FakeListarMeusGatosTutorAction extends actual.ListarMeusGatosTutorAction {
    constructor(user: UserModel, filters: GatoListFiltersInputDTO) {
      super(user, filters);
      listTutorCtorSpy(user, filters);
    }

    run(): Promise<GatoResponseDTO[]> {
      return listTutorRunMock();
    }
  }

  class FakeCriarGatoTutorAction extends actual.CriarGatoTutorAction {
    constructor(user: UserModel, data: GatoCreateInputDTO) {
      super(user, data);
      saveGatoCtorSpy(user, data);
    }

    run(): Promise<GatoResponseDTO> {
      return saveGatoRunMock();
    }
  }

  class FakeAtualizarGatoTutorAction extends actual.AtualizarGatoTutorAction {
    constructor(user: UserModel, idGato: number, data: GatoUpdateInputDTO) {
      super(user, idGato, data);
      updateGatoCtorSpy(user, idGato, data);
    }

    run(): Promise<GatoResponseDTO> {
      return updateGatoRunMock();
    }
  }

  return {
    ...actual,
    ListarMeusGatosTutorAction: FakeListarMeusGatosTutorAction,
    CriarGatoTutorAction: FakeCriarGatoTutorAction,
    AtualizarGatoTutorAction: FakeAtualizarGatoTutorAction,
  };
});

jest.mock('../../../src/models/catSitterAction', () => {
  const actual = jest.requireActual('../../../src/models/catSitterAction') as typeof import('../../../src/models/catSitterAction');

  class FakeListarGatosDisponiveisCatSitterAction extends actual.ListarGatosDisponiveisCatSitterAction {
    constructor(user: UserModel, filters: GatoListFiltersInputDTO) {
      super(user, filters);
      listCatSitterCtorSpy(user, filters);
    }

    run(): Promise<GatoResponseDTO[]> {
      return listCatSitterRunMock();
    }
  }

  return {
    ...actual,
    ListarGatosDisponiveisCatSitterAction: FakeListarGatosDisponiveisCatSitterAction,
  };
});

describe('Gatos Service', () => {
  const service = new GatosService();

  const userRow: UserRow = {
    id: 99,
    username: 'tutor99',
    email: 'tutor99@email.com',
    role: UserRole.TUTOR,
    password_hash: 'hashed-password',
  };

  const gatoResponse: GatoResponseDTO = {
    id: 1,
    nomeGato: 'Mimi',
    idadeGato: 2,
    pesoGato: 3.4,
    peloGato: 1,
    racaGato: 'SRD',
    idIcone: 4,
    tutor_id: 99,
    tutorNome: 'tutor99',
    disponivel_para_cuidado: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(UserModel, 'findById').mockResolvedValue(userRow);
  });

  test('should list available cats when filters.disponiveis is true', async () => {
    const filters = { searchGato: 'Mi', disponiveis: true };
    listCatSitterRunMock.mockResolvedValue([gatoResponse]);

    const result = await service.listGatos(filters, 99);

    expect(UserModel.findById).toHaveBeenCalledWith(99);
    expect(listCatSitterCtorSpy).toHaveBeenCalledTimes(1);
    expect(listCatSitterCtorSpy.mock.calls[0][1]).toEqual(filters);
    expect(listCatSitterRunMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual([gatoResponse]);
  });

  test('should list tutor cats when filters.disponiveis is not true', async () => {
    const filters = { searchTutor: 'tu' };
    listTutorRunMock.mockResolvedValue([gatoResponse]);

    const result = await service.listGatos(filters, 99);

    expect(UserModel.findById).toHaveBeenCalledWith(99);
    expect(listTutorCtorSpy).toHaveBeenCalledTimes(1);
    expect(listTutorCtorSpy.mock.calls[0][1]).toEqual(filters);
    expect(listTutorRunMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual([gatoResponse]);
  });

  test('should save cat using CriarGatoTutorAction', async () => {
    const payload: GatoCreateInputDTO = {
      nomeGato: 'Mimi',
      idadeGato: 2,
      pesoGato: 3.4,
      peloGato: 1,
      racaGato: 'SRD',
      idIcone: 4,
      tutor_id: 99,
    };
    saveGatoRunMock.mockResolvedValue(gatoResponse);

    const result = await service.saveGato(payload);

    expect(UserModel.findById).toHaveBeenCalledWith(99);
    expect(saveGatoCtorSpy).toHaveBeenCalledTimes(1);
    expect(saveGatoCtorSpy.mock.calls[0][1]).toEqual(payload);
    expect(saveGatoRunMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual(gatoResponse);
  });

  test('should update cat using AtualizarGatoTutorAction', async () => {
    const payload: GatoUpdateInputDTO = {
      nomeGato: 'Mimi Atualizada',
      disponivel_para_cuidado: 0,
    };
    updateGatoRunMock.mockResolvedValue({
      ...gatoResponse,
      nomeGato: 'Mimi Atualizada',
      disponivel_para_cuidado: 0,
    });

    const result = await service.updateGato(10, 99, payload);

    expect(UserModel.findById).toHaveBeenCalledWith(99);
    expect(updateGatoCtorSpy).toHaveBeenCalledTimes(1);
    expect(updateGatoCtorSpy.mock.calls[0][1]).toBe(10);
    expect(updateGatoCtorSpy.mock.calls[0][2]).toEqual(payload);
    expect(updateGatoRunMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      ...gatoResponse,
      nomeGato: 'Mimi Atualizada',
      disponivel_para_cuidado: 0,
    });
  });

  test('should throw when user is not found', async () => {
    jest.spyOn(UserModel, 'findById').mockResolvedValueOnce(null);

    await expect(service.listGatos({}, 1234)).rejects.toThrow('Usuário não encontrado.');
    expect(listTutorRunMock).not.toHaveBeenCalled();
    expect(listCatSitterRunMock).not.toHaveBeenCalled();
  });
});
