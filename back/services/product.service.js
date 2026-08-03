const db = require('../src/config/database');

function mapProduct(row) {
  if (!row) {
    return null;
  }

  return {
    id: Number(row.id),
    documentId: String(row.id),
    title: row.title,
    description: row.description,
    price: Number(row.price),
    autor: row.autor,
    image: row.image_url ? { url: row.image_url } : undefined,
  };
}

async function listProducts({ page, pageSize, search }) {
  const offset = Math.max((Number(page) || 1) - 1, 0) * Math.max(Number(pageSize) || 10);
  const filters = [];
  const params = [];

  const normalizedSearch = typeof search === 'string' ? search.trim() : '';

  if (normalizedSearch) {
    const searchTerm = `%${normalizedSearch.toLowerCase()}%`;
    filters.push('(LOWER(title) LIKE ? OR LOWER(autor) LIKE ?)');
    params.push(searchTerm, searchTerm);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const rows = await db.query(
    `SELECT * FROM products ${whereClause} ORDER BY id ASC LIMIT ? OFFSET ?`,
    [...params, pageSize, offset],
  );

  const countRows = await db.query(`SELECT COUNT(*) AS total FROM products ${whereClause}`, params);
  const total = Number(countRows[0]?.total ?? 0);

  return {
    data: rows.map(mapProduct),
    meta: {
      pagination: {
        page: Number(page) || 1,
        pageSize: Number(pageSize) || 10,
        pageCount: Math.ceil(total / (Number(pageSize) || 10)) || 0,
        total,
      },
    },
  };
}

async function getProduct(productId) {
  const productIdNumber = Number(productId);
  if (Number.isNaN(productIdNumber)) {
    return null;
  }

  const rows = await db.query('SELECT * FROM products WHERE id = ? LIMIT 1', [productIdNumber]);
  return mapProduct(rows[0]);
}

async function getProductByDocumentId(documentId) {
  return getProduct(documentId);
}

module.exports = {
  listProducts,
  getProduct: getProductByDocumentId,
};
