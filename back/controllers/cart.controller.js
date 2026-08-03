const { getCartItemsByUser, addCartItemToUser, updateCartItemQuantity, removeCartItemById } = require('../services/cart.service');

async function getCartItems(req, res, next) {
  try {
    const productDocumentId =
      req.query.filters?.product?.documentId?.$eq ||
      req.query['filters[product][documentId][$eq]'];

    const items = await getCartItemsByUser(req.user.id, productDocumentId);
    return res.json({ data: items });
  } catch (error) {
    next(error);
  }
}

async function addCartItem(req, res, next) {
  try {
    const { product, quantity } = req.body.data || {};
    if (!product) {
      return res.status(400).json({ error: 'Product identifier is required.' });
    }

    const item = await addCartItemToUser(req.user.id, product, quantity ?? 1);
    return res.json({ data: item });
  } catch (error) {
    next(error);
  }
}

async function updateCartItem(req, res, next) {
  try {
    const documentId = req.params.documentId;
    const { quantity } = req.body.data || {};
    if (typeof quantity !== 'number') {
      return res.status(400).json({ error: 'Quantity must be a number.' });
    }

    const item = await updateCartItemQuantity(req.user.id, documentId, quantity);
    return res.json({ data: item });
  } catch (error) {
    next(error);
  }
}

async function removeCartItem(req, res, next) {
  try {
    const documentId = req.params.documentId;
    await removeCartItemById(req.user.id, documentId);
    return res.json({ data: { documentId } });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCartItems,
  addCartItem,
  updateCartItem,
  removeCartItem,
};
