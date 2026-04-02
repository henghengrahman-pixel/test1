const { createOrder, getOrderById } = require('../models/order-model');
const { makeMeta } = require('../helpers/seo');
const { cartSummary } = require('../helpers/format');
const { sendTelegramOrderNotification } = require('../helpers/telegram');

function checkoutPage(req, res) {
  res.render('site/checkout', {
    meta: makeMeta({ title: 'Checkout | Mawar Parfume' }, req)
  });
}

async function checkoutSubmit(req, res, next) {
  try {
    if (!req.session.cart.length) return res.redirect('/cart');

    const { fullname, phone, address, notes } = req.body;
    const summary = cartSummary(req.session.cart);
    const order = await createOrder(
      {
        customer_name: fullname,
        phone,
        address,
        notes,
        total_amount: summary.subtotal
      },
      req.session.cart
    );

    const detail = await getOrderById(order.id);
    await sendTelegramOrderNotification(detail.order, detail.items);
    req.session.cart = [];

    res.redirect(`/order-success?orderId=${order.id}`);
  } catch (error) {
    next(error);
  }
}

module.exports = { checkoutPage, checkoutSubmit };
