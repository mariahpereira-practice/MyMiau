import db from '../config/database';
import { GatoResponse } from '../types/gato';

function normalizeGato(row: GatoResponse | null): GatoResponse | null {
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
    disponivel_para_cuidado: row.disponivel_para_cuidado,
  };
}

export async function findMany({
  searchGato,
  searchTutor,
  tutorId,
  disponiveis,
}: {
  searchGato?: unknown;
  searchTutor?: unknown;
  tutorId?: unknown;
  disponiveis?: unknown;
} = {}): Promise<GatoResponse[]> {
  const where: string[] = [];
  const params: Array<string | number> = [];

  if (tutorId !== undefined && tutorId !== null && String(tutorId).trim() !== '') {
    const parsedTutorId = Number(tutorId);
    if (!Number.isNaN(parsedTutorId)) {
      where.push('g.tutor_id = ?');
      params.push(parsedTutorId);
    }
  }

  if (disponiveis == true) {
    where.push('g.disponivel_para_cuidado = 1');
  }

  if (searchGato && String(searchGato).trim() !== '') {
    where.push('LOWER(g.nomeGato) LIKE LOWER(?)');
    params.push(`%${String(searchGato).trim()}%`);
  }

  if (searchTutor && String(searchTutor).trim() !== '') {
    where.push('LOWER(u.username) LIKE LOWER(?)');
    params.push(`%${String(searchTutor).trim()}%`);
  }

  const sql = `SELECT g.*, COALESCE(u.username, '') AS tutorNome FROM gatos g
  LEFT JOIN users u ON u.id = g.tutor_id${
    where.length ? ` WHERE ${where.join(' AND ')}` : ''
  } ORDER BY id DESC`;

  const rows = await db.query<GatoResponse[]>(sql, params);
  return rows.map((row) => normalizeGato(row) as GatoResponse);
}

type InsertResult = {
  insertId: number | string;
};

export async function createGato({
  nomeGato,
  idadeGato,
  pesoGato,
  peloGato,
  racaGato,
  idIcone,
  tutor_id,
}: {
  nomeGato: string;
  idadeGato: number;
  pesoGato: number;
  peloGato: number;
  racaGato: string;
  idIcone: number;
  tutor_id: number;
}): Promise<InsertResult> {
  const result = await db.query<InsertResult>(
    'INSERT INTO gatos (nomeGato, idadeGato, pesoGato, peloGato, racaGato, idIcone, tutor_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [nomeGato, idadeGato, pesoGato, peloGato, racaGato, idIcone, tutor_id],
  );
  return result;
}

export async function findGatoByIdGato(id: number): Promise<GatoResponse | null> {
  const rows = await db.query<GatoResponse[]>(
    'SELECT * FROM gatos WHERE id = ?',
    [id]
  );
  return normalizeGato(rows[0] || null);
}


