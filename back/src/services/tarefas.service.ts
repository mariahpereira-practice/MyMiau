import { findMany, createTarefa } from "../models/tarefa.model";
import { findGatoByIdGato } from "../models/gato.model";
import { Tarefa } from "../types/tarefa";

export async function listTarefasCatSitter({
  idGato
}: {
  idGato: number;
}) {
  const gato = await findGatoByIdGato(idGato);
    
  if (!gato) {
    throw new Error('Gato não encontrado.');
  } 

  if(gato.disponivel_para_cuidado !== 1) {
    throw new Error('Gato não disponível para cuidado.');
  }

  const tarefas = await findMany({ idGato });
  return tarefas;
}

export async function listTarefasTutor({
    idGato,
    idTutor
}: {
    idGato: number;
    idTutor: number;
}) {
    const gato = await findGatoByIdGato(idGato);

    if (!gato) {
        throw new Error('Gato não encontrado.');
    }

    if (gato.tutor_id !== idTutor) {
        throw new Error('Você não tem permissão para visualizar as tarefas deste gato.');
    }

    const tarefas = await findMany({ idGato });
    return tarefas;
}

export async function criarTarefa(idGato: number, idTutor: number, data: Tarefa) {
    
    const gato = await findGatoByIdGato(idGato);

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
      
      const newTarefa = await createTarefa({
        gato_id: idGato,
        descricao: data.descricao,
        pontos: data.pontos,
        status: 'PENDENTE',
        concluida_por: idTutor,
        concluida_em: new Date(),
      });        
}