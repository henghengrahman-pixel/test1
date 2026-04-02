const { pool } = require('../config/db');

async function getAllCategories() {
  const { rows } = await pool.query('SELECT * FROM categories ORDER BY name ASC');
  return rows;
}

module.exports = { getAllCategories };
