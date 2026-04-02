const { pool } = require('../config/db');

async function getFeaturedProducts(limit = 8) {
  const { rows } = await pool.query(
    `SELECT p.*, c.name AS category_name
     FROM products p
     LEFT JOIN categories c ON c.id = p.category_id
     WHERE p.is_featured = true
     ORDER BY p.created_at DESC
     LIMIT $1`,
    [limit]
  );
  return rows;
}

async function getLatestProducts(limit = 12) {
  const { rows } = await pool.query(
    `SELECT p.*, c.name AS category_name
     FROM products p
     LEFT JOIN categories c ON c.id = p.category_id
     ORDER BY p.created_at DESC
     LIMIT $1`,
    [limit]
  );
  return rows;
}

async function getStoreProducts({ search = '', category = '' } = {}) {
  const params = [];
  const conditions = [];

  if (search) {
    params.push(`%${search}%`);
    conditions.push(`(p.name ILIKE $${params.length} OR p.short_description ILIKE $${params.length})`);
  }

  if (category) {
    params.push(category);
    conditions.push(`c.slug = $${params.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const { rows } = await pool.query(
    `SELECT p.*, c.name AS category_name, c.slug AS category_slug
     FROM products p
     LEFT JOIN categories c ON c.id = p.category_id
     ${where}
     ORDER BY p.created_at DESC`,
    params
  );
  return rows;
}

async function getProductBySlug(slug) {
  const { rows } = await pool.query(
    `SELECT p.*, c.name AS category_name, c.slug AS category_slug
     FROM products p
     LEFT JOIN categories c ON c.id = p.category_id
     WHERE p.slug = $1
     LIMIT 1`,
    [slug]
  );
  return rows[0];
}

async function getProductById(id) {
  const { rows } = await pool.query('SELECT * FROM products WHERE id = $1 LIMIT 1', [id]);
  return rows[0];
}

async function getAdminProducts() {
  const { rows } = await pool.query(
    `SELECT p.*, c.name AS category_name
     FROM products p
     LEFT JOIN categories c ON c.id = p.category_id
     ORDER BY p.created_at DESC`
  );
  return rows;
}

async function createProduct(data) {
  const { rows } = await pool.query(
    `INSERT INTO products
      (name, slug, category_id, price, old_price, stock, image_url, short_description, full_description, is_featured, is_new, is_sale)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
     RETURNING *`,
    [
      data.name,
      data.slug,
      data.category_id || null,
      data.price,
      data.old_price || null,
      data.stock,
      data.image_url,
      data.short_description,
      data.full_description,
      data.is_featured,
      data.is_new,
      data.is_sale
    ]
  );
  return rows[0];
}

async function updateProduct(id, data) {
  const { rows } = await pool.query(
    `UPDATE products SET
      name=$1, slug=$2, category_id=$3, price=$4, old_price=$5, stock=$6, image_url=$7,
      short_description=$8, full_description=$9, is_featured=$10, is_new=$11, is_sale=$12, updated_at=NOW()
     WHERE id=$13 RETURNING *`,
    [
      data.name,
      data.slug,
      data.category_id || null,
      data.price,
      data.old_price || null,
      data.stock,
      data.image_url,
      data.short_description,
      data.full_description,
      data.is_featured,
      data.is_new,
      data.is_sale,
      id
    ]
  );
  return rows[0];
}

async function deleteProduct(id) {
  await pool.query('DELETE FROM products WHERE id = $1', [id]);
}

module.exports = {
  getFeaturedProducts,
  getLatestProducts,
  getStoreProducts,
  getProductBySlug,
  getProductById,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct
};
