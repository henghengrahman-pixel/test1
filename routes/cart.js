const express = require('express');
const controller = require('../controllers/cart-controller');
const router = express.Router();

router.post('/cart/add', controller.addToCart);
router.post('/cart/update', controller.updateCart);
router.post('/cart/remove', controller.removeFromCart);

module.exports = router;
