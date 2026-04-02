const { pool } = require('../config/db');

async function createOrder(order, items) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const orderResult = await client.query(
      `INSERT INTO orders (customer_name, phone, address, notes, status, total_amount)
       VALUES ($1,$2,$3,$4,'Pending',$5)
       RETURNING *`,
      [order.customer_name, order.phone, order.address, order.notes, order.total_amount]
    );

    const newOrder = orderResult.rows[0];

    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, price, quantity, image_url)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [newOrder.id, item.product_id, item.name, item.price, item.quantity, item.image_url]
      );
    }

    await client.query('COMMIT');
    return newOrder;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function getOrderById(id) {
  const orderRes = await pool.query('SELECT * FROM orders WHERE id = $1 LIMIT 1', [id]);
  const itemsRes = await pool.query('SELECT * FROM order_items WHERE order_id = $1 ORDER BY id ASC', [id]);
  return { order: orderRes.rows[0], items: itemsRes.rows };
}

async function getAllOrders() {
  const { rows } = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
  return rows;
}

async function updateOrderStatus(id, status) {
  const { rows } = await pool.query(
    'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
    [status, id]
  );
  return rows[0];
}

async function getDashboardStats() {
  const [products, orders, pending, completed] = await Promise.all([
    pool.query('SELECT COUNT(*)::int AS total FROM products'),
    pool.query('SELECT COUNT(*)::int AS total FROM orders'),
    pool.query("SELECT COUNT(*)::int AS total FROM orders WHERE status = 'Pending'"),
    pool.query("SELECT COUNT(*)::int AS total FROM orders WHERE status = 'Completed'")
  ]);

  return {
    totalProducts: products.rows[0].total,
    totalOrders: orders.rows[0].total,
    pendingOrders: pending.rows[0].total,
    completedOrders: completed.rows[0].total
  };
}

module.exports = { createOrder, getOrderById, getAllOrders, updateOrderStatus, getDashboardStats };
