function formatCurrency(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(Number(value || 0));
}

function cartSummary(cart = []) {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.quantity * Number(item.price), 0);
  return { count, subtotal };
}

module.exports = { formatCurrency, cartSummary };
