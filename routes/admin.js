const express = require('express');
const controller = require('../controllers/admin-controller');
const { requireAdmin } = require('../middleware/admin-auth');
const router = express.Router();

router.get('/login', controller.loginPage);
router.post('/login', controller.loginSubmit);
router.post('/logout', controller.logout);
router.get('/', requireAdmin, controller.dashboard);
router.get('/products', requireAdmin, controller.productsPage);
router.get('/products/new', requireAdmin, controller.newProductPage);
router.post('/products', requireAdmin, controller.createProductSubmit);
router.get('/products/edit/:id', requireAdmin, controller.editProductPage);
router.post('/products/update/:id', requireAdmin, controller.updateProductSubmit);
router.post('/products/delete/:id', requireAdmin, controller.deleteProductSubmit);
router.get('/orders', requireAdmin, controller.ordersPage);
router.get('/orders/:id', requireAdmin, controller.orderDetailPage);
router.post('/orders/:id/status', requireAdmin, controller.updateOrderStatusSubmit);

module.exports = router;
