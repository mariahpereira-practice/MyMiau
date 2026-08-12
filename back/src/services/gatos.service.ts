import { GatoModel } from '../models/gato.model';
import {
  GatoCreateInputDTO,
  GatoListFiltersInputDTO,
  GatoResponseDTO,
  GatoUpdateInputDTO,
} from '../dtos/gato.dto';

export class GatosService {
  async listGatos({
    searchGato,
    searchTutor,
    tutorId,
    disponiveis,
  }: GatoListFiltersInputDTO & { disponiveis?: boolean }) {
    const gatos = await GatoModel.findMany({ searchGato, searchTutor, tutorId, disponiveis });
    return gatos
      .map((gato) => new GatoModel({ gato }).toResponse())
      .filter((gato): gato is GatoResponseDTO => gato !== null);
  }

  async saveGato(data: GatoCreateInputDTO): Promise<GatoResponseDTO> {
    if (
      !data.nomeGato?.trim()
      || data.idadeGato == null
      || data.pesoGato == null
      || data.peloGato == null
      || !data.racaGato?.trim()
      || data.idIcone == null
      || data.tutor_id == null
    ) {
      throw new Error('Todos os campos são obrigatórios para salvar um gato.');
    }

    const existingGatos = await GatoModel.findMany({
      searchGato: data.nomeGato,
      tutorId: data.tutor_id,
    });

    if (existingGatos.length > 0) {
      throw new Error('Já existe um gato com esse nome para este tutor.');
    }

    const newGato = await GatoModel.createGato({
      nomeGato: data.nomeGato,
      idadeGato: data.idadeGato,
      pesoGato: data.pesoGato,
      peloGato: data.peloGato,
      racaGato: data.racaGato,
      idIcone: data.idIcone,
      tutor_id: data.tutor_id,
    });

    const gato = new GatoModel({ gato: newGato });
    const gatoResponse = gato.toResponse();
    if (!gatoResponse) {
      throw new Error('Erro ao normalizar resposta do gato criado.');
    }

    return gatoResponse;
  }

  private async __findTutorNome(tutorId: number): Promise<string> {
    const tutors = await GatoModel.findMany({ tutorId });
    return tutors[0]?.tutorNome || '';
  }

  async updateGato(id: number, idTutor: number, data: GatoUpdateInputDTO): Promise<GatoResponseDTO> {
    const gatoRow = await GatoModel.findGatoByIdGato(id);

    if (!gatoRow) {
      throw new Error('Gato não encontrado.');
    }

    const gato = new GatoModel({ gato: gatoRow });

    if (gato.tutorId !== idTutor) {
      throw new Error('Você não tem permissão para atualizar este gato.');
    }

    if (
      gato.id === null
      || gato.nomeGato === null
      || gato.idadeGato === null
      || gato.pesoGato === null
      || gato.peloGato === null
      || gato.racaGato === null
      || gato.idIcone === null
      || gato.tutorId === null
    ) {
      throw new Error('Dados do gato inválidos para atualização.');
    }

    const gatoUpdatedRow: GatoResponseDTO = {
      id: gato.id,
      nomeGato: data.nomeGato ?? gato.nomeGato,
      idadeGato: data.idadeGato ?? gato.idadeGato,
      pesoGato: data.pesoGato ?? gato.pesoGato,
      peloGato: data.peloGato ?? gato.peloGato,
      racaGato: data.racaGato ?? gato.racaGato,
      idIcone: data.idIcone ?? gato.idIcone,
      tutor_id: gato.tutorId,
      tutorNome: await this.__findTutorNome(gato.tutorId),
      disponivel_para_cuidado: data.disponivel_para_cuidado ?? gato.disponivelParaCuidado ?? 1,
    };

    const gatoUpdated = new GatoModel({ gato: gatoUpdatedRow });
    const gatoResponse = gatoUpdated.toResponse();
    if (!gatoResponse) {
      throw new Error('Erro ao normalizar resposta do gato atualizado.');
    }

    return gatoResponse;
  }
}

export const gatosService = new GatosService();
