require('dotenv').config();
const { pool } = require('../config/db');

async function run() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      slug VARCHAR(160) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      price NUMERIC(12,2) NOT NULL DEFAULT 0,
      old_price NUMERIC(12,2),
      stock INTEGER NOT NULL DEFAULT 0,
      image_url TEXT,
      short_description TEXT,
      full_description TEXT,
      is_featured BOOLEAN DEFAULT FALSE,
      is_new BOOLEAN DEFAULT FALSE,
      is_sale BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      customer_name VARCHAR(255) NOT NULL,
      phone VARCHAR(100) NOT NULL,
      address TEXT NOT NULL,
      notes TEXT,
      status VARCHAR(50) NOT NULL DEFAULT 'Pending',
      total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
      product_name VARCHAR(255) NOT NULL,
      price NUMERIC(12,2) NOT NULL,
      quantity INTEGER NOT NULL,
      image_url TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log('Database schema created.');
  process.exit(0);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
