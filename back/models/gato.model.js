const db = require('../src/config/database');

function normalizeGato(row) {
  if (!row) return null;

  return {
    ...row,
    id: row.id !== undefined ? Number(row.id) : undefined,
    nomeGato: row.nomeGato,
    nomeTutor: row.nomeTutor,
  };
}

async function findMany({ id, search } = {}) {
  const where = [];
  const params = [];

  if (id !== undefined && id !== null && String(id).trim() !== '') {
    where.push('id = ?');
    params.push(Number(id));
  }

  if (search && String(search).trim() !== '') {
    where.push('(LOWER(nomeGato) LIKE LOWER(?) OR LOWER(nomeTutor) LIKE LOWER(?))');
    const searchTerm = `%${search.trim()}%`;
    params.push(searchTerm, searchTerm);
  }

  const sql = `SELECT * FROM gatos${where.length ? ` WHERE ${where.join(' AND ')}` : ''} ORDER BY id DESC`;
  const rows = await db.query(sql, params);

  return rows.map(normalizeGato);
}

module.exports = {
  findMany,
};