import { TarefaModel } from "../models/tarefa.model";
import { GatoModel } from "../models/gato.model";
import { CreateTarefaInputDTO, UpdateTarefaInputDTO } from "../dtos/tarefa.dto";
import { ConcluirTarefa } from "../models/action";
import { UserModel } from "../models/user.model";

export class TarefaService {

  async listTarefasCatSitter({ idGato }: { idGato: number }) {
    const gato = await GatoModel.findGatoByIdGato(idGato);
    
    if (!gato) {
      throw new Error('Gato não encontrado.');
    } 

    if(gato.disponivel_para_cuidado !== 1) {
      throw new Error('Gato não disponível para cuidado.');
    }

    const tarefas = await TarefaModel.findMany({ idGato });
    return tarefas
      .map((tarefa) => new TarefaModel({ tarefa }).toResponse())
      .filter((tarefa): tarefa is NonNullable<typeof tarefa> => tarefa !== null);
  }

  async listTarefasTutor({ idGato, idTutor }: { idGato: number; idTutor: number }) {
    const gato = await GatoModel.findGatoByIdGato(idGato);

    if (!gato) {
      throw new Error('Gato não encontrado.');
    }

    if (gato.tutor_id !== idTutor) {
      throw new Error('Você não tem permissão para visualizar as tarefas deste gato.');
    }

    const tarefas = await TarefaModel.findMany({ idGato });
    return tarefas
      .map((tarefa) => new TarefaModel({ tarefa }).toResponse())
      .filter((tarefa): tarefa is NonNullable<typeof tarefa> => tarefa !== null);
  }

  async criarTarefa(idGato: number, idTutor: number, data: CreateTarefaInputDTO) {
    
    const gato = await GatoModel.findGatoByIdGato(idGato);

    if (!gato) {
        throw new Error('Gato não encontrado.');
    }

    if (gato.tutor_id !== idTutor) {
        throw new Error('Você não tem permissão para criar tarefas para este gato.');
    }

    if (
        !data.descricao?.trim()
        || data.pontos == null
      ) {
        throw new Error('Descrição e pontos são obrigatórios para salvar uma tarefa.');
      }
      
      await TarefaModel.createTarefa({
        gato_id: idGato,
        descricao: data.descricao,
        pontos: data.pontos,
        status: 'PENDENTE',
        concluida_por: idTutor,
        concluida_em: new Date(),
      });
  }

  async deletarTarefaServico(idGato: number, idTarefa: number, idTutor: number) {
    const gato = await GatoModel.findGatoByIdGato(idGato);

    if (!gato) {
        throw new Error('Gato não encontrado.');
    }

    if (gato.tutor_id !== idTutor) {
        throw new Error('Você não tem permissão para deletar tarefas deste gato.');
    }

      const tarefa = await TarefaModel.findTarefaById(idTarefa);

    if (!tarefa) {
        throw new Error('Tarefa não encontrada.');
    }

      const tarefaInstance = new TarefaModel({ tarefa });

      if (tarefaInstance.gato_id !== idGato) {
        throw new Error('A tarefa não pertence a este gato.');
    }

    await TarefaModel.deletarTarefa(idTarefa);

  } 

 async atualizarTarefa(idGato: number, idTutor: number, data: UpdateTarefaInputDTO, idTarefa: number) {
    const gato = await GatoModel.findGatoByIdGato(idGato);

      if (!gato) {
          throw new Error('Gato não encontrado.');
      }

      if (gato.tutor_id !== idTutor) {
          throw new Error('Você não tem permissão para atualizar tarefas deste gato.');
      }
      const tarefa = await TarefaModel.findTarefaById(idTarefa);

      if (!tarefa) {
          throw new Error('Tarefa não encontrada.');
      }

      const tarefaInstance = new TarefaModel({ tarefa });

      if (tarefaInstance.gato_id !== idGato) {
          throw new Error('A tarefa não pertence a este gato.');
      }

      if (
        tarefaInstance.descricao === null
        || tarefaInstance.pontos === null
        || tarefaInstance.status === null
      ) {
        throw new Error('Dados da tarefa inválidos para atualização.');
      }

      const payload = {
        descricao: data.descricao ?? tarefaInstance.descricao,
        pontos: data.pontos ?? tarefaInstance.pontos,
        status: data.status ?? tarefaInstance.status,
      };

      await TarefaModel.updateTarefa(payload, idTarefa);
}

async atualizarStatusTarefa(idTarefa: number, idCatSitter: number) {
  
  const tarefa = await TarefaModel.findTarefaById(idTarefa);
  const user = await UserModel.findById(idCatSitter);

  if (!tarefa) {
    throw new Error('Tarefa não encontrada.');
  }

  const tarefaInstance = new TarefaModel({ tarefa });

  const concluirTarefaAction = new ConcluirTarefa(
    new UserModel({ user: user as any }), 
    tarefaInstance
  );

  if (tarefaInstance.status === 'CONCLUIDA') {
    throw new Error('A tarefa já foi concluída.');
  }

  if (tarefaInstance.pontos === null) {
    throw new Error('Tarefa inválida para atualização de pontuação.');
  }
  
  await concluirTarefaAction.run();
}

}

export const tarefasService = new TarefaService();
