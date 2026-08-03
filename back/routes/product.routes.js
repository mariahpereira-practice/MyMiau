const express = require('express');
const { listProducts, getProductById } = require('../controllers/products.controller');

const router = express.Router();

router.get('/', listProducts);
router.get('/:id', getProductById);

module.exports = router;
