async function sendTelegramOrderNotification(order, items = []) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) return;

  const itemLines = items
    .map((item) => `- ${item.product_name} x${item.quantity} = $${Number(item.price) * Number(item.quantity)}`)
    .join('\n');

  const text = [
    '🛒 *New Order Received*',
    `Order ID: ${order.id}`,
    `Name: ${order.customer_name}`,
    `Phone: ${order.phone}`,
    `Address: ${order.address}`,
    `Notes: ${order.notes || '-'}`,
    `Items:\n${itemLines}`,
    `Total: $${Number(order.total_amount).toFixed(2)}`,
    `Date: ${new Date(order.created_at).toLocaleString()}`
  ].join('\n');

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' })
  }).catch((error) => {
    console.error('Telegram notification failed:', error.message);
  });
}

module.exports = { sendTelegramOrderNotification };
