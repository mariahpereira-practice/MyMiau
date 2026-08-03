const { getCompradosByUser, addProdutoCompradoToUser } = require('../services/comprados.service');

async function getComprados(req, res, next) {
  try {
    const productDocumentId =
      req.query.filters?.product?.documentId?.$eq ||
      req.query['filters[product][documentId][$eq]'];

    const items = await getCompradosByUser(req.user.id, productDocumentId);
    return res.json({ data: items });
  } catch (error) {
    next(error);
  }
}

async function addProdutoComprado(req, res, next) {
  try {
    const { productsIds } = req.body.data || {};
    if (!productsIds || productsIds.length === 0) {
      return res.status(400).json({ error: 'Product identifiers are required.' });
    }

    const item = await addProdutoCompradoToUser(req.user.id, productsIds);
    return res.json({ data: item });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getComprados,
  addProdutoComprado
};
