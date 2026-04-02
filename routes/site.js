const express = require('express');
const controller = require('../controllers/site-controller');
const router = express.Router();

router.get('/', controller.home);
router.get('/store', controller.store);
router.get('/product/:slug', controller.productDetail);
router.get('/cart', controller.cartPage);
router.get('/order-success', controller.orderSuccess);
router.get('/robots.txt', controller.robots);
router.get('/sitemap.xml', controller.sitemap);

module.exports = router;
