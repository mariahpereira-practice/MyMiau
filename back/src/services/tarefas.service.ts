import { CreateTarefaInputDTO, UpdateTarefaInputDTO } from "../dtos/tarefa.dto";
import { ConcluirTarefa, ListarTarefasCatSitterAction } from "../models/catSitterAction";
import {
  AtualizarTarefaTutorAction,
  CriarTarefaTutorAction,
  DeletarTarefaTutorAction,
  ListarTarefasTutorAction,
} from "../models/tutorAction";
import { UserModel } from "../models/user.model";
import { userRepository, UserRepository } from '../repositories';
import { gatoRepository, GatoRepository } from '../repositories';
import { tarefaRepository, TarefaRepository } from '../repositories';

export class TarefaService {

  constructor(
    private readonly repository: UserRepository = userRepository,
    private readonly gatos: GatoRepository = gatoRepository,
    private readonly tarefas: TarefaRepository = tarefaRepository,
  ) {}

  private async __findUserOrThrow(idUser: string): Promise<UserModel> {
    const user = await this.repository.findById(idUser);

    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    return new UserModel({ user });
  }

  async listTarefasCatSitter({ idGato, idCatSitter }: { idGato: string; idCatSitter: string }) {
    const catSitter = await this.__findUserOrThrow(idCatSitter);
    const action = new ListarTarefasCatSitterAction(catSitter, idGato, this.gatos, this.tarefas);
    return action.run();
  }

  async listTarefasTutor({ idGato, idTutor }: { idGato: string; idTutor: string }) {
    const tutor = await this.__findUserOrThrow(idTutor);
    const action = new ListarTarefasTutorAction(tutor, idGato, this.gatos, this.tarefas);
    return action.run();
  }

  async criarTarefa(idGato: string, idTutor: string, data: CreateTarefaInputDTO) {
    const tutor = await this.__findUserOrThrow(idTutor);
    const action = new CriarTarefaTutorAction(tutor, idGato, data, this.gatos, this.tarefas);
    await action.run();
  }

  async deletarTarefaServico(idGato: string, idTarefa: string, idTutor: string) {
    const tutor = await this.__findUserOrThrow(idTutor);
    const action = new DeletarTarefaTutorAction(tutor, idGato, idTarefa, this.gatos, this.tarefas);
    await action.run();
  } 

 async atualizarTarefa(idGato: string, idTutor: string, data: UpdateTarefaInputDTO, idTarefa: string) {
    const tutor = await this.__findUserOrThrow(idTutor);
    const action = new AtualizarTarefaTutorAction(tutor, idGato, idTarefa, data, this.gatos, this.tarefas);
    await action.run();
}

async atualizarStatusTarefa(idTarefa: string, idCatSitter: string) {
  const catSitter = await this.__findUserOrThrow(idCatSitter);
  const concluirTarefaAction = new ConcluirTarefa(catSitter, idTarefa, this.gatos, this.tarefas);
  await concluirTarefaAction.run();
}

}

export const tarefasService = new TarefaService();
