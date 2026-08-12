import db from '../config/database';
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

  static async findMany({ idGato }: { idGato: number }): Promise<TarefaResponseDTO[]> {
    const sql = `SELECT * FROM tarefas t WHERE t.gato_id = ? ORDER BY t.idTarefa DESC`;
    const rows = await db.query<TarefaResponseDTO[]>(sql, [idGato]);
    return rows;
  }

  static async findTarefaById(idTarefa: number): Promise<TarefaResponseDTO | undefined> {
    const sql = `SELECT * FROM tarefas t WHERE t.idTarefa = ?`;
    const rows = await db.query<TarefaResponseDTO[]>(sql, [idTarefa]);
    return rows[0];
  }

  static async createTarefa(data: {
    descricao: string;
    pontos: number;
    status: TarefaStatus;
    concluida_por: number | null;
    concluida_em: Date;
    gato_id: number;
  }): Promise<{ insertId: number }> {
    const sql = `INSERT INTO tarefas (descricao, pontos, status, concluida_por, concluida_em, gato_id) VALUES (?, ?, ?, ?, ?, ?)`;
    const result = await db.query<{ insertId: number }>(sql, [
      data.descricao,
      data.pontos,
      data.status,
      data.concluida_por,
      data.concluida_em,
      data.gato_id,
    ]);
    return result;
  }

  static async deletarTarefa(idTarefa: number): Promise<void> {
    const sql = `DELETE FROM tarefas WHERE idTarefa = ?`;
    await db.query(sql, [idTarefa]);
  }

  static async updateTarefa(
    data: { descricao: string; pontos: number; status: TarefaStatus },
    idTarefa: number,
  ): Promise<void> {
    const sql = `UPDATE tarefas SET descricao = ?, pontos = ?, status = ? WHERE idTarefa = ? `;
    await db.query(sql, [data.descricao, data.pontos, data.status, idTarefa]);
  }

  async updateStatusTarefa(idTarefa: number, idCatSitter: number): Promise<void> {
    const sql = `UPDATE tarefas SET status = 'CONCLUIDA', concluida_em = ?, concluida_por = ? WHERE idTarefa = ?`;
    await db.query(sql, [new Date(), idCatSitter, idTarefa]);
  }

  async updatePontuacaoCatSitter(idCatSitter: number, pontos: number): Promise<void> {
    const sql = `UPDATE users SET pontuacao = pontuacao + ? WHERE id = ?`;
    await db.query(sql, [pontos, idCatSitter]);
  }

}