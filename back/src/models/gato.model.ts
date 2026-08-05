import db from '../config/database';

export type GatoRow = {
  id: number | string;
  nomeGato: string;
  nomeTutor: string;
  [key: string]: unknown;
};

function normalizeGato(row: GatoRow | null): GatoRow | null {
  if (!row) {
    return null;
  }

  return {
    ...row,
    id: row.id !== undefined ? Number(row.id) : row.id,
    nomeGato: row.nomeGato,
    nomeTutor: row.nomeTutor,
  };
}

export async function findMany({
  id,
  search,
}: {
  id?: unknown;
  search?: unknown;
} = {}): Promise<GatoRow[]> {
  const where: string[] = [];
  const params: Array<string | number> = [];

  if (id !== undefined && id !== null && String(id).trim() !== '') {
    where.push('id = ?');
    params.push(Number(id));
  }

  if (search && String(search).trim() !== '') {
    where.push('(LOWER(nomeGato) LIKE LOWER(?) OR LOWER(nomeTutor) LIKE LOWER(?))');
    const searchTerm = `%${String(search).trim()}%`;
    params.push(searchTerm, searchTerm);
  }

  const sql = `SELECT * FROM gatos${
    where.length ? ` WHERE ${where.join(' AND ')}` : ''
  } ORDER BY id DESC`;

  const rows = await db.query<GatoRow[]>(sql, params);
  return rows.map((row) => normalizeGato(row) as GatoRow);
}
