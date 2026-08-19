import db from '../config/database';
import type { TarefaResponseDTO, TarefaStatus } from '../dtos/tarefa.dto';
import type { DatabaseClient } from './database-client';

export interface CreateTarefaRepositoryInput {
  descricao: string;
  pontos: number;
  status: TarefaStatus;
  concluida_por: number | null;
  concluida_em: Date;
  gato_id: number;
}

export interface UpdateTarefaRepositoryInput {
  descricao: string;
  pontos: number;
  status: TarefaStatus;
}

export interface TarefaRepository {
  findMany(idGato: number): Promise<TarefaResponseDTO[]>;
  findById(idTarefa: number): Promise<TarefaResponseDTO | undefined>;
  create(data: CreateTarefaRepositoryInput): Promise<{ insertId: number }>;
  delete(idTarefa: number): Promise<void>;
  update(idTarefa: number, data: UpdateTarefaRepositoryInput): Promise<void>;
  updateStatus(idTarefa: number, idCatSitter: number): Promise<void>;
  addPoints(idCatSitter: number, pontos: number): Promise<void>;
}

export class MariaDbTarefaRepository implements TarefaRepository {
  constructor(private readonly database: DatabaseClient = db) {}

  async findMany(idGato: number): Promise<TarefaResponseDTO[]> {
    return this.database.query<TarefaResponseDTO[]>(
      'SELECT * FROM tarefas t WHERE t.gato_id = ? ORDER BY t.idTarefa DESC',
      [idGato],
    );
  }

  async findById(idTarefa: number): Promise<TarefaResponseDTO | undefined> {
    const rows = await this.database.query<TarefaResponseDTO[]>(
      'SELECT * FROM tarefas t WHERE t.idTarefa = ?',
      [idTarefa],
    );
    return rows[0];
  }

  async create(data: CreateTarefaRepositoryInput): Promise<{ insertId: number }> {
    return this.database.query<{ insertId: number }>(
      'INSERT INTO tarefas (descricao, pontos, status, concluida_por, concluida_em, gato_id) VALUES (?, ?, ?, ?, ?, ?)',
      [data.descricao, data.pontos, data.status, data.concluida_por, data.concluida_em, data.gato_id],
    );
  }

  async delete(idTarefa: number): Promise<void> {
    await this.database.query('DELETE FROM tarefas WHERE idTarefa = ?', [idTarefa]);
  }

  async update(idTarefa: number, data: UpdateTarefaRepositoryInput): Promise<void> {
    await this.database.query(
      'UPDATE tarefas SET descricao = ?, pontos = ?, status = ? WHERE idTarefa = ?',
      [data.descricao, data.pontos, data.status, idTarefa],
    );
  }

  async updateStatus(idTarefa: number, idCatSitter: number): Promise<void> {
    await this.database.query(
      "UPDATE tarefas SET status = 'CONCLUIDA', concluida_em = ?, concluida_por = ? WHERE idTarefa = ?",
      [new Date(), idCatSitter, idTarefa],
    );
  }

  async addPoints(idCatSitter: number, pontos: number): Promise<void> {
    await this.database.query(
      'UPDATE users SET pontuacao = pontuacao + ? WHERE id = ?',
      [pontos, idCatSitter],
    );
  }
}

export const tarefaRepository: TarefaRepository = new MariaDbTarefaRepository();
