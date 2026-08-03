const express = require('express');
const auth = require('../middlewares/auth.middleware');
const { getComprados, addProdutoComprado } = require('../controllers/comprados.controller');

const router = express.Router();

router.use(auth);

router.get('/', getComprados);
router.post('/', addProdutoComprado);

module.exports = router;
