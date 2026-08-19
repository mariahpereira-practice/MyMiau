import { TarefaResponseDTO, TarefaStatus } from '../dtos/tarefa.dto';
import { tarefaRepository } from '../repositories/tarefa.repository';

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

  static async findMany({ idGato }: { idGato: number }): Promise<TarefaResponseDTO[]> {
    return tarefaRepository.findMany(idGato);
  }

  static async findTarefaById(idTarefa: number): Promise<TarefaResponseDTO | undefined> {
    return tarefaRepository.findById(idTarefa);
  }

  static async createTarefa(data: {
    descricao: string;
    pontos: number;
    status: TarefaStatus;
    concluida_por: number | null;
    concluida_em: Date;
    gato_id: number;
  }): Promise<{ insertId: number }> {
    return tarefaRepository.create(data);
  }

  static async deletarTarefa(idTarefa: number): Promise<void> {
    await tarefaRepository.delete(idTarefa);
  }

  static async updateTarefa(
    data: { descricao: string; pontos: number; status: TarefaStatus },
    idTarefa: number,
  ): Promise<void> {
    await tarefaRepository.update(idTarefa, data);
  }

  async updateStatusTarefa(idTarefa: number, idCatSitter: number): Promise<void> {
    await tarefaRepository.updateStatus(idTarefa, idCatSitter);
  }

  async updatePontuacaoCatSitter(idCatSitter: number, pontos: number): Promise<void> {
    await tarefaRepository.addPoints(idCatSitter, pontos);
  }

}