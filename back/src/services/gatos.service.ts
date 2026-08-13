import {
  GatoCreateInputDTO,
  GatoListFiltersInputDTO,
  GatoResponseDTO,
  GatoUpdateInputDTO,
} from '../dtos/gato.dto';
import { ListarGatosDisponiveisCatSitterAction } from '../models/catSitterAction';
import { AtualizarGatoTutorAction, CriarGatoTutorAction, ListarMeusGatosTutorAction } from '../models/tutorAction';
import { UserModel } from '../models/user.model';

export class GatosService {

  private async __findUserOrThrow(idUser: number): Promise<UserModel> {
    const user = await UserModel.findById(idUser);

    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    return new UserModel({ user });
  }

  async listGatos(filters: GatoListFiltersInputDTO & { disponiveis?: boolean }, idUser: number) {
    const user = await this.__findUserOrThrow(idUser);

    if (filters.disponiveis === true) {
      const action = new ListarGatosDisponiveisCatSitterAction(user, filters);
      return action.run();
    }

    const action = new ListarMeusGatosTutorAction(user, filters);
    return action.run();
  }

  async saveGato(data: GatoCreateInputDTO): Promise<GatoResponseDTO> {
    const tutor = await this.__findUserOrThrow(data.tutor_id);
    const action = new CriarGatoTutorAction(tutor, data);
    return action.run();
  }

  async updateGato(id: number, idTutor: number, data: GatoUpdateInputDTO): Promise<GatoResponseDTO> {
    const tutor = await this.__findUserOrThrow(idTutor);
    const action = new AtualizarGatoTutorAction(tutor, id, data);
    return action.run();
  }
}

export const gatosService = new GatosService();
