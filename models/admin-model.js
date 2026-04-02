const bcrypt = require('bcrypt');
const { pool } = require('../config/db');

async function findAdminByUsername(username) {
  const { rows } = await pool.query('SELECT * FROM admins WHERE username = $1 LIMIT 1', [username]);
  return rows[0];
}

async function validateAdmin(username, password) {
  const admin = await findAdminByUsername(username);
  if (!admin) return null;
  const ok = await bcrypt.compare(password, admin.password_hash);
  return ok ? admin : null;
}

module.exports = { findAdminByUsername, validateAdmin };
