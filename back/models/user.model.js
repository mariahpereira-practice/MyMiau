const db = require('../src/config/database');

function normalizeUser(row) {
  if (!row) return null;
  return {
    ...row,
    id: Number(row.id),
  };
}

async function findByEmail(email) {
  const rows = await db.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
  return normalizeUser(rows[0]) || null;
}

async function findByUsername(username) {
  const rows = await db.query('SELECT * FROM users WHERE username = ? LIMIT 1', [username]);
  return normalizeUser(rows[0]) || null;
}

async function findById(id) {
  const rows = await db.query('SELECT id, username, email FROM users WHERE id = ? LIMIT 1', [id]);
  return normalizeUser(rows[0]) || null;
}

async function createUser({ username, email, password_hash }) {
  return db.query('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)', [username, email, password_hash]);
}

module.exports = {
  findByEmail,
  findByUsername,
  findById,
  createUser,
};
