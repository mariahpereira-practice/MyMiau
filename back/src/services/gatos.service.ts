import {
  GatoCreateInputDTO,
  GatoListFiltersInputDTO,
  GatoResponseDTO,
  GatoUpdateInputDTO,
} from '../dtos/gato.dto';
import { ListarGatosDisponiveisCatSitterAction } from '../models/catSitterAction';
import { AtualizarGatoTutorAction, CriarGatoTutorAction, ListarMeusGatosTutorAction } from '../models/tutorAction';
import { UserModel } from '../models/user.model';
import { userRepository, UserRepository } from '../repositories/user.repository';
import { gatoRepository, GatoRepository } from '../repositories/gato.repository';

export class GatosService {

  constructor(
    private readonly repository: UserRepository = userRepository,
    private readonly gatos: GatoRepository = gatoRepository,
  ) {}

  private async __findUserOrThrow(idUser: number): Promise<UserModel> {
    const user = await this.repository.findById(idUser);

    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    return new UserModel({ user });
  }

  async listGatos(filters: GatoListFiltersInputDTO & { disponiveis?: boolean }, idUser: number) {
    const user = await this.__findUserOrThrow(idUser);

    if (filters.disponiveis === true) {
      const action = new ListarGatosDisponiveisCatSitterAction(user, filters, this.gatos);
      return action.run();
    }

    const action = new ListarMeusGatosTutorAction(user, filters, this.gatos);
    return action.run();
  }

  async saveGato(data: GatoCreateInputDTO): Promise<GatoResponseDTO> {
    const tutor = await this.__findUserOrThrow(data.tutor_id);
    const action = new CriarGatoTutorAction(tutor, data, this.gatos);
    return action.run();
  }

  async updateGato(id: number, idTutor: number, data: GatoUpdateInputDTO): Promise<GatoResponseDTO> {
    const tutor = await this.__findUserOrThrow(idTutor);
    const action = new AtualizarGatoTutorAction(tutor, id, data, this.gatos);
    return action.run();
  }
}

export const gatosService = new GatosService();
