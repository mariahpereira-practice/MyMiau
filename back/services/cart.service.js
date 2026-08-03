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

function mapCartItem(row) {
  return {
    id: Number(row.cart_item_id),
    documentId: String(row.cart_item_id),
    quantity: row.quantity,
    book: mapProduct(row),
  };
}

async function getCartItemsByUser(userId, productDocumentId) {
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
    `SELECT ci.id AS cart_item_id, ci.quantity, p.id AS product_id, p.title, p.description, p.price, p.autor, p.image_url
     FROM cart_items ci
     JOIN products p ON p.id = ci.product_id
     WHERE ci.user_id = ?${filter}`,
    params,
  );

  return rows.map(mapCartItem);
}

async function findCartItemByProduct(userId, productDocumentId) {
  const productId = Number(productDocumentId);
  if (Number.isNaN(productId)) {
    return null;
  }

  const rows = await db.query(
    `SELECT ci.id AS cart_item_id, ci.quantity, p.id AS product_id, p.title, p.description, p.price, p.autor, p.image_url
     FROM cart_items ci
     JOIN products p ON p.id = ci.product_id
     WHERE ci.user_id = ? AND p.id = ?
     LIMIT 1`,
    [userId, productId],
  );

  return rows[0] ? mapCartItem(rows[0]) : null;
}

async function addCartItemToUser(userId, productDocumentId, quantity) {
  const productId = Number(productDocumentId);
  if (Number.isNaN(productId)) {
    throw createHttpError(400, 'Invalid product identifier.');
  }

  const existing = await findCartItemByProduct(userId, productDocumentId);
  if (existing) {
    return updateCartItemQuantity(userId, existing.documentId, existing.quantity + quantity);
  }

  const result = await db.query(
    'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
    [userId, productId, quantity],
  );

  const [inserted] = await db.query(
    `SELECT ci.id AS cart_item_id, ci.quantity, p.id AS product_id, p.title, p.description, p.price, p.autor, p.image_url
     FROM cart_items ci
     JOIN products p ON p.id = ci.product_id
     WHERE ci.id = ? LIMIT 1`,
    [result.insertId],
  );

  if (!inserted) {
    throw createHttpError(500, 'Unable to create cart item.');
  }

  return mapCartItem(inserted);
}

async function updateCartItemQuantity(userId, documentId, quantity) {
  const cartItemId = Number(documentId);
  if (Number.isNaN(cartItemId)) {
    throw createHttpError(400, 'Invalid cart item identifier.');
  }

  const result = await db.query(
    'UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?',
    [quantity, cartItemId, userId],
  );

  if (result.affectedRows === 0) {
    throw createHttpError(404, 'Cart item not found.');
  }

  const [updated] = await db.query(
    `SELECT ci.id AS cart_item_id, ci.quantity, p.id AS product_id, p.title, p.description, p.price, p.autor, p.image_url
     FROM cart_items ci
     JOIN products p ON p.id = ci.product_id
     WHERE ci.id = ? LIMIT 1`,
    [cartItemId],
  );

  if (!updated) {
    throw createHttpError(404, 'Cart item not found after update.');
  }

  return mapCartItem(updated);
}

async function removeCartItemById(userId, documentId) {
  const cartItemId = Number(documentId);
  if (Number.isNaN(cartItemId)) {
    throw createHttpError(400, 'Invalid cart item identifier.');
  }

  const result = await db.query('DELETE FROM cart_items WHERE id = ? AND user_id = ?', [cartItemId, userId]);
  if (result.affectedRows === 0) {
    throw createHttpError(404, 'Cart item not found.');
  }

  return true;
}

function createHttpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

module.exports = {
  getCartItemsByUser,
  addCartItemToUser,
  updateCartItemQuantity,
  removeCartItemById,
};
