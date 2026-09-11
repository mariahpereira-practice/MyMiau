import db from '../../config/databaseMariaDB';
import type {
  GatoCreateInputDTO,
  GatoListFiltersInputDTO,
  GatoResponseDTO,
} from '../../dtos/gato.dto';
import type { DatabaseClient } from '../database-client';
import type { GatoRepository, GatoUpdateRepositoryInput } from '../gato.repository';

type InsertResult = {
  insertId: number | string;
};

// O SQL guarda ids numericos; os contratos usam string.
type GatoSqlRow = Omit<GatoResponseDTO, 'id' | 'tutor_id'> & { id: number; tutor_id: number };

function toGatoResponse(row: GatoSqlRow): GatoResponseDTO {
  return { ...row, id: String(row.id), tutor_id: String(row.tutor_id) };
}

export class MariaDbGatoRepository implements GatoRepository {
  constructor(private readonly database: DatabaseClient = db) {}

  async findMany(filters: GatoListFiltersInputDTO = {}): Promise<GatoResponseDTO[]> {
    const where: string[] = [];
    const params: Array<string | number> = [];

    if (filters.tutorId !== undefined && filters.tutorId !== null && String(filters.tutorId).trim() !== '') {
      const parsedTutorId = Number(filters.tutorId);
      if (!Number.isNaN(parsedTutorId)) {
        where.push('g.tutor_id = ?');
        params.push(parsedTutorId);
      }
    }

    if (filters.disponiveis === true) {
      where.push('g.disponivel_para_cuidado = 1');
    }

    if (filters.searchGato && String(filters.searchGato).trim() !== '') {
      where.push('LOWER(g.nomeGato) LIKE LOWER(?)');
      params.push(`%${String(filters.searchGato).trim()}%`);
    }

    if (filters.searchTutor && String(filters.searchTutor).trim() !== '') {
      where.push('LOWER(u.username) LIKE LOWER(?)');
      params.push(`%${String(filters.searchTutor).trim()}%`);
    }

    const sql = `SELECT g.*, COALESCE(u.username, '') AS tutorNome FROM gatos g
    LEFT JOIN users u ON u.id = g.tutor_id${
      where.length ? ` WHERE ${where.join(' AND ')}` : ''
    } ORDER BY id DESC`;

    const rows = await this.database.query<GatoSqlRow[]>(sql, params);
    return rows.map(toGatoResponse);
  }

  async findById(id: string): Promise<GatoResponseDTO | null> {
    const rows = await this.database.query<GatoSqlRow[]>(
      `SELECT g.*, COALESCE(u.username, '') AS tutorNome
      FROM gatos g
      LEFT JOIN users u ON u.id = g.tutor_id
      WHERE g.id = ?
      LIMIT 1`,
      [Number(id)],
    );
    return rows[0] ? toGatoResponse(rows[0]) : null;
  }

  async create(data: GatoCreateInputDTO): Promise<GatoResponseDTO> {
    const result = await this.database.query<InsertResult>(
      'INSERT INTO gatos (nomeGato, idadeGato, pesoGato, peloGato, racaGato, idIcone, tutor_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [data.nomeGato, data.idadeGato, data.pesoGato, data.peloGato, data.racaGato, data.idIcone, Number(data.tutor_id)],
    );
    const newGato = await this.findById(String(result.insertId));
    if (!newGato) {
      throw new Error('Failed to create gato.');
    }
    return newGato;
  }

  async update(id: string, data: GatoUpdateRepositoryInput): Promise<void> {
    await this.database.query(
      `UPDATE gatos
      SET nomeGato = ?, idadeGato = ?, pesoGato = ?, peloGato = ?, racaGato = ?, idIcone = ?, disponivel_para_cuidado = ?
      WHERE id = ?`,
      [
        data.nomeGato,
        data.idadeGato,
        data.pesoGato,
        data.peloGato,
        data.racaGato,
        data.idIcone,
        data.disponivel_para_cuidado,
        Number(id),
      ],
    );
  }
}

export const mariaDbGatoRepository: GatoRepository = new MariaDbGatoRepository();
