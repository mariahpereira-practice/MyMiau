import { CreateTarefaInputDTO, UpdateTarefaInputDTO } from "../dtos/tarefa.dto";
import { ConcluirTarefa, ListarTarefasCatSitterAction } from "../models/catSitterAction";
import {
  AtualizarTarefaTutorAction,
  CriarTarefaTutorAction,
  DeletarTarefaTutorAction,
  ListarTarefasTutorAction,
} from "../models/tutorAction";
import { UserModel } from "../models/user.model";
import { userRepository, UserRepository } from '../repositories/user.repository';
import { gatoRepository, GatoRepository } from '../repositories/gato.repository';
import { tarefaRepository, TarefaRepository } from '../repositories/tarefa.repository';

export class TarefaService {

  constructor(
    private readonly repository: UserRepository = userRepository,
    private readonly gatos: GatoRepository = gatoRepository,
    private readonly tarefas: TarefaRepository = tarefaRepository,
  ) {}

  private async __findUserOrThrow(idUser: number): Promise<UserModel> {
    const user = await this.repository.findById(idUser);

    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    return new UserModel({ user });
  }

  async listTarefasCatSitter({ idGato, idCatSitter }: { idGato: number; idCatSitter: number }) {
    const catSitter = await this.__findUserOrThrow(idCatSitter);
    const action = new ListarTarefasCatSitterAction(catSitter, idGato, this.gatos, this.tarefas);
    return action.run();
  }

  async listTarefasTutor({ idGato, idTutor }: { idGato: number; idTutor: number }) {
    const tutor = await this.__findUserOrThrow(idTutor);
    const action = new ListarTarefasTutorAction(tutor, idGato, this.gatos, this.tarefas);
    return action.run();
  }

  async criarTarefa(idGato: number, idTutor: number, data: CreateTarefaInputDTO) {
    const tutor = await this.__findUserOrThrow(idTutor);
    const action = new CriarTarefaTutorAction(tutor, idGato, data, this.gatos, this.tarefas);
    await action.run();
  }

  async deletarTarefaServico(idGato: number, idTarefa: number, idTutor: number) {
    const tutor = await this.__findUserOrThrow(idTutor);
    const action = new DeletarTarefaTutorAction(tutor, idGato, idTarefa, this.gatos, this.tarefas);
    await action.run();
  } 

 async atualizarTarefa(idGato: number, idTutor: number, data: UpdateTarefaInputDTO, idTarefa: number) {
    const tutor = await this.__findUserOrThrow(idTutor);
    const action = new AtualizarTarefaTutorAction(tutor, idGato, idTarefa, data, this.gatos, this.tarefas);
    await action.run();
}

async atualizarStatusTarefa(idTarefa: number, idCatSitter: number) {
  const catSitter = await this.__findUserOrThrow(idCatSitter);
  const concluirTarefaAction = new ConcluirTarefa(catSitter, idTarefa, this.gatos, this.tarefas);
  await concluirTarefaAction.run();
}

}

export const tarefasService = new TarefaService();
