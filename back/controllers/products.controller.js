const { listProducts, getProduct } = require('../services/product.service');

async function listProductsController(req, res, next) {
  try {
    const page = Number(req.query['pagination[page]'] || 1);
    const pageSize = Number(req.query['pagination[pageSize]'] || 10);

    const rawFilters = req.query.filters?.$or || [];
    const searchFromFilters = rawFilters
      .flatMap((item) => [item?.title?.$containsi, item?.autor?.$containsi])
      .filter(Boolean)
      .find(Boolean) || '';

    const search =
      searchFromFilters ||
      req.query['filters[$or][0][title][$containsi]'] ||
      req.query['filters[$or][1][title][$containsi]'] ||
      req.query['filters[$or][0][autor][$containsi]'] ||
      req.query['filters[$or][1][autor][$containsi]'] ||
      '';

    const result = await listProducts({ page, pageSize, search });
    return res.json(result);
  } catch (error) {
    next(error);
  }
}

async function getProductById(req, res, next) {
  try {
    const product = await getProduct(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    return res.json({ data: product });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listProducts: listProductsController,
  getProductById,
};
