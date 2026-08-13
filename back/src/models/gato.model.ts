import db from '../config/database';
import { GatoCreateInputDTO, GatoListFiltersInputDTO, GatoResponseDTO } from '../dtos/gato.dto';

type InsertResult = {
  insertId: number | string;
};

export class GatoModel {
  private __gatoRow: GatoResponseDTO | null;

  constructor(data: { gato: GatoResponseDTO }) {
    this.__gatoRow = data.gato;
  }

  get id(): number | null {
    return this.__gatoRow?.id || null;
  }

  get nomeGato(): string | null {
    return this.__gatoRow?.nomeGato || null;
  }

  get idadeGato(): number | null {
    return this.__gatoRow?.idadeGato || null;
  }

  get pesoGato(): number | null {
    return this.__gatoRow?.pesoGato || null;
  }

  get peloGato(): number | null {
    return this.__gatoRow?.peloGato || null;
  }

  get racaGato(): string | null {
    return this.__gatoRow?.racaGato || null;
  }

  get idIcone(): number | null {
    return this.__gatoRow?.idIcone || null;
  }

  get tutorId(): number | null {
    return this.__gatoRow?.tutor_id || null;
  }

  get tutorNome(): string | null {
    return this.__gatoRow?.tutorNome || null;
  }

  get disponivelParaCuidado(): 0 | 1 | null {
    return this.__gatoRow?.disponivel_para_cuidado ?? null;
  }

  toResponse(): GatoResponseDTO | null {
    if (!this.__gatoRow) {
      return null;
    }

    if (
      this.id === null
      || this.nomeGato === null
      || this.idadeGato === null
      || this.pesoGato === null
      || this.peloGato === null
      || this.racaGato === null
      || this.idIcone === null
      || this.tutorId === null
    ) {
      return null;
    }

    return {
      id: this.id,
      nomeGato: this.nomeGato,
      idadeGato: this.idadeGato,
      pesoGato: this.pesoGato,
      peloGato: this.peloGato,
      racaGato: this.racaGato,
      idIcone: this.idIcone,
      tutor_id: this.tutorId,
      tutorNome: this.tutorNome ?? '',
      disponivel_para_cuidado: this.disponivelParaCuidado ?? 1,
    };
  }

  private static __normalizeGato(row: GatoResponseDTO | null): GatoResponseDTO | null {
    if (!row) {
      return null;
    }

    return {
      ...row,
      id: row.id !== undefined ? Number(row.id) : row.id,
      nomeGato: row.nomeGato,
      idadeGato: row.idadeGato,
      pesoGato: row.pesoGato,
      peloGato: Number(row.peloGato),
      racaGato: row.racaGato,
      idIcone: row.idIcone,
      tutor_id: row.tutor_id,
      tutorNome: row.tutorNome,
      disponivel_para_cuidado: row.disponivel_para_cuidado ?? 1,
    };
  }

  static async findMany(filters: GatoListFiltersInputDTO = {}): Promise<GatoResponseDTO[]> {
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

    const rows = await db.query<GatoResponseDTO[]>(sql, params);
    return rows.map((row) => GatoModel.__normalizeGato(row) as GatoResponseDTO);
  }

  static async findGatoByIdGato(id: number): Promise<GatoResponseDTO | null> {
    const rows = await db.query<GatoResponseDTO[]>(
      `SELECT g.*, COALESCE(u.username, '') AS tutorNome
      FROM gatos g
      LEFT JOIN users u ON u.id = g.tutor_id
      WHERE g.id = ?
      LIMIT 1`,
      [id],
    );
    return GatoModel.__normalizeGato(rows[0] || null);
  }

  static async createGato(data: GatoCreateInputDTO): Promise<GatoResponseDTO> {
    const result = await db.query<InsertResult>(
      'INSERT INTO gatos (nomeGato, idadeGato, pesoGato, peloGato, racaGato, idIcone, tutor_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [data.nomeGato, data.idadeGato, data.pesoGato, data.peloGato, data.racaGato, data.idIcone, data.tutor_id]
    );
    const newGatoId = Number(result.insertId);
    const newGato = await GatoModel.findGatoByIdGato(newGatoId);
    if (!newGato) {
      throw new Error('Failed to create gato.');
    }
    return newGato;
  }

  static async updateGato(
    id: number,
    data: {
      nomeGato: string;
      idadeGato: number;
      pesoGato: number;
      peloGato: number;
      racaGato: string;
      idIcone: number;
      disponivel_para_cuidado: 0 | 1;
    },
  ): Promise<void> {
    const sql = `
      UPDATE gatos
      SET nomeGato = ?, idadeGato = ?, pesoGato = ?, peloGato = ?, racaGato = ?, idIcone = ?, disponivel_para_cuidado = ?
      WHERE id = ?
    `;

    await db.query(sql, [
      data.nomeGato,
      data.idadeGato,
      data.pesoGato,
      data.peloGato,
      data.racaGato,
      data.idIcone,
      data.disponivel_para_cuidado,
      id,
    ]);
  }

}



