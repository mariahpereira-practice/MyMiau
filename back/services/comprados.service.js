const db = require('../src/config/database');

function mapProduct(row) {
  return {
    id: Number(row.product_id),
    documentId: String(row.product_id),
    title: row.title,
    description: row.description,
    price: Number(row.price),
    autor: row.autor,
    image: row.image_url ? { url: row.image_url } : undefined,
  };
}

function mapCompradosRow(row) {
  return {
    id: Number(row.comprados_id),
    documentId: String(row.comprados_id),
    book: mapProduct(row),
  };
}

async function getCompradosByUser(userId, productDocumentId) {
  const params = [userId];
  let filter = '';

  if (productDocumentId) {
    const productId = Number(productDocumentId);
    if (!Number.isNaN(productId)) {
      filter = ' AND p.id = ?';
      params.push(productId);
    }
  }

  const rows = await db.query(
    `SELECT c.id AS comprados_id, p.id AS product_id, p.title, p.description, p.price, p.autor, p.image_url
     FROM comprados c
     JOIN products p ON p.id = c.product_id
     WHERE c.user_id = ?${filter}`,
    params,
  );

  return rows.map(mapCompradosRow);
}

async function addProdutoCompradoToUser(userId, productsIds) {
  const promises = productsIds.map(async (id) => {
  if (Number.isNaN(Number(id))) {
    throw createHttpError(400, 'Invalid product identifier: ' + id);
  }

  const [productRows] = await db.query(
    'SELECT id FROM products WHERE id = ?',
    [id]
  );

  if (!productRows || productRows.length === 0) {
    throw createHttpError(400, `Product ${id} does not exist`);
  }

  const existing = await findProdutoCompradoByProduct(userId, id);
  if (existing) return null;

  const [result] = await db.query(
    'INSERT INTO comprados (user_id, product_id) VALUES (?, ?)',
    [userId, id],
  );

  const [rows] = await db.query(
    `SELECT c.id AS comprados_id, p.id AS product_id, p.title, p.description, p.price, p.autor, p.image_url
     FROM comprados c
     JOIN products p ON p.id = c.product_id
     WHERE c.id = ? LIMIT 1`,
    [result.insertId],
  );

  return mapCompradosRow(rows[0]);
});

  const results = await Promise.all(promises);
  return results.filter(r => r !== null);
}

async function findProdutoCompradoByProduct(userId, productDocumentId) {
  const productId = Number(productDocumentId);
  if (Number.isNaN(productId)) {
    return null;
  }

  const rows = await db.query(
    `SELECT c.id AS comprados_id, p.id AS product_id, p.title, p.description, p.price, p.autor, p.image_url
     FROM comprados c
     JOIN products p ON p.id = c.product_id
     WHERE c.user_id = ? AND p.id = ?
     LIMIT 1`,
    [userId, productId],
  );

  return rows[0] ? mapCompradosRow(rows[0]) : null;
}

function createHttpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

module.exports = {
  getCompradosByUser, addProdutoCompradoToUser
};
