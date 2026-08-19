import { TarefaResponseDTO, TarefaStatus } from '../dtos/tarefa.dto';

export class TarefaModel {
  private __tarefaRow: TarefaResponseDTO | null;

  constructor(data: { tarefa: TarefaResponseDTO }) {
    this.__tarefaRow = data.tarefa;
  }

  get idTarefa(): number | null {
    return this.__tarefaRow?.idTarefa || null;
  }

  get gato_id(): number | null {
    return this.__tarefaRow?.gato_id || null;
  }

  get descricao(): string | null {
    return this.__tarefaRow?.descricao || null;
  }

  get pontos(): number | null {
    return this.__tarefaRow?.pontos || null;
  }

  get status(): TarefaStatus | null {
    return this.__tarefaRow?.status || null;
  }

  get concluida_por(): number | null {
    return this.__tarefaRow?.concluida_por || null;
  }

  get concluida_em(): Date | null {
    return this.__tarefaRow?.concluida_em || null;
  }

  toResponse(): TarefaResponseDTO | null {
    if (!this.__tarefaRow) {
      return null;
    } 

    const response: TarefaResponseDTO = {
      idTarefa: this.idTarefa as number,
      gato_id: this.gato_id as number,
      descricao: this.descricao as string,
      pontos: this.pontos as number,
      status: this.status as TarefaStatus,
      concluida_por: this.concluida_por ?? null,
      concluida_em: this.concluida_em ?? null,
    };

    return response;
  }

}