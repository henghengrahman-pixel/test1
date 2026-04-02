const express = require('express');
const controller = require('../controllers/checkout-controller');
const router = express.Router();

router.get('/checkout', controller.checkoutPage);
router.post('/checkout', controller.checkoutSubmit);

module.exports = router;
