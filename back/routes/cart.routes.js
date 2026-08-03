const express = require('express');
const auth = require('../middlewares/auth.middleware');
const { getCartItems, addCartItem, updateCartItem, removeCartItem } = require('../controllers/cart.controller');

const router = express.Router();

router.use(auth);

router.get('/', getCartItems);
router.post('/', addCartItem);
router.put('/:documentId', updateCartItem);
router.delete('/:documentId', removeCartItem);

module.exports = router;
