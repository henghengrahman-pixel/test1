const { cartSummary } = require('../helpers/format');

function attachGlobals(req, res, next) {
  if (!req.session.cart) req.session.cart = [];
  res.locals.currentPath = req.path;
  res.locals.storeName = process.env.STORE_NAME || 'Mawar Parfume';
  res.locals.baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
  res.locals.cart = req.session.cart;
  res.locals.cartSummary = cartSummary(req.session.cart);
  res.locals.admin = req.session.admin || null;
  res.locals.year = new Date().getFullYear();
  next();
}

module.exports = { attachGlobals };
