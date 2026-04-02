const { getProductById } = require('../models/product-model');

async function addToCart(req, res, next) {
  try {
    const product = await getProductById(req.body.productId);
    if (!product) return res.redirect('/store');

    const quantity = Math.max(1, Number(req.body.quantity || 1));
    const existing = req.session.cart.find((item) => item.product_id === product.id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      req.session.cart.push({
        product_id: product.id,
        name: product.name,
        price: Number(product.price),
        quantity,
        image_url: product.image_url,
        slug: product.slug
      });
    }

    res.redirect(req.get('referer') || '/cart');
  } catch (error) {
    next(error);
  }
}

function updateCart(req, res) {
  const updates = req.body.quantity || {};
  req.session.cart = req.session.cart
    .map((item) => ({ ...item, quantity: Math.max(0, Number(updates[item.product_id] || item.quantity)) }))
    .filter((item) => item.quantity > 0);
  res.redirect('/cart');
}

function removeFromCart(req, res) {
  req.session.cart = req.session.cart.filter((item) => item.product_id !== Number(req.body.productId));
  res.redirect('/cart');
}

module.exports = { addToCart, updateCart, removeFromCart };
