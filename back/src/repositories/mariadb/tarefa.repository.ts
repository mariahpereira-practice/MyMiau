import db from '../../config/databaseMariaDB';
import type { TarefaResponseDTO } from '../../dtos/tarefa.dto';
import type { DatabaseClient } from '../database-client';
import type {
  CreateTarefaRepositoryInput,
  TarefaRepository,
  UpdateTarefaRepositoryInput,
} from '../tarefa.repository';

// O SQL guarda ids numericos; os contratos usam string.
type TarefaSqlRow = Omit<TarefaResponseDTO, 'idTarefa' | 'gato_id' | 'concluida_por'> & {
  idTarefa: number;
  gato_id: number;
  concluida_por: number | null;
};

function toTarefaResponse(row: TarefaSqlRow): TarefaResponseDTO {
  return {
    ...row,
    idTarefa: String(row.idTarefa),
    gato_id: String(row.gato_id),
    concluida_por: row.concluida_por === null ? null : String(row.concluida_por),
  };
}

export class MariaDbTarefaRepository implements TarefaRepository {
  constructor(private readonly database: DatabaseClient = db) {}

  async findMany(idGato: string): Promise<TarefaResponseDTO[]> {
    const rows = await this.database.query<TarefaSqlRow[]>(
      'SELECT * FROM tarefas t WHERE t.gato_id = ? ORDER BY t.idTarefa DESC',
      [Number(idGato)],
    );
    return rows.map(toTarefaResponse);
  }

  async findById(idTarefa: string): Promise<TarefaResponseDTO | undefined> {
    const rows = await this.database.query<TarefaSqlRow[]>(
      'SELECT * FROM tarefas t WHERE t.idTarefa = ?',
      [Number(idTarefa)],
    );
    return rows[0] ? toTarefaResponse(rows[0]) : undefined;
  }

  async create(data: CreateTarefaRepositoryInput): Promise<{ insertId: string }> {
    const result = await this.database.query<{ insertId: number | string }>(
      'INSERT INTO tarefas (descricao, pontos, status, concluida_por, concluida_em, gato_id) VALUES (?, ?, ?, ?, ?, ?)',
      [
        data.descricao,
        data.pontos,
        data.status,
        data.concluida_por === null ? null : Number(data.concluida_por),
        data.concluida_em,
        Number(data.gato_id),
      ],
    );
    return { insertId: String(result.insertId) };
  }

  async delete(idTarefa: string): Promise<void> {
    await this.database.query('DELETE FROM tarefas WHERE idTarefa = ?', [Number(idTarefa)]);
  }

  async update(idTarefa: string, data: UpdateTarefaRepositoryInput): Promise<void> {
    await this.database.query(
      'UPDATE tarefas SET descricao = ?, pontos = ?, status = ? WHERE idTarefa = ?',
      [data.descricao, data.pontos, data.status, Number(idTarefa)],
    );
  }

  async updateStatus(idTarefa: string, idCatSitter: string): Promise<void> {
    await this.database.query(
      "UPDATE tarefas SET status = 'CONCLUIDA', concluida_em = ?, concluida_por = ? WHERE idTarefa = ?",
      [new Date(), Number(idCatSitter), Number(idTarefa)],
    );
  }

  async addPoints(idCatSitter: string, pontos: number): Promise<void> {
    await this.database.query(
      'UPDATE users SET pontuacao = pontuacao + ? WHERE id = ?',
      [pontos, Number(idCatSitter)],
    );
  }
}

export const mariaDbTarefaRepository: TarefaRepository = new MariaDbTarefaRepository();
