require('dotenv').config();
const bcrypt = require('bcrypt');
const slugify = require('slugify');
const { pool } = require('../config/db');

async function seed() {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin12345';
  const passwordHash = await bcrypt.hash(password, 10);

  await pool.query(
    `INSERT INTO admins (username, password_hash)
     VALUES ($1, $2)
     ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
    [username, passwordHash]
  );

  const categoryNames = ['Parfum Pria', 'Parfum Wanita', 'Best Seller', 'Gift Set'];
  for (const name of categoryNames) {
    await pool.query(
      `INSERT INTO categories (name, slug)
       VALUES ($1, $2)
       ON CONFLICT (slug) DO NOTHING`,
      [name, slugify(name, { lower: true, strict: true })]
    );
  }

  const categories = await pool.query('SELECT * FROM categories ORDER BY id ASC');
  const categoryMap = Object.fromEntries(categories.rows.map((c) => [c.slug, c.id]));

  const products = [
    {
      name: 'Mawar Signature Oud', slug: 'mawar-signature-oud', category_id: categoryMap['parfum-pria'],
      price: 29.99, old_price: 39.99, stock: 20, image_url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80',
      short_description: 'Parfum pria elegan dengan aroma hangat dan mewah.',
      full_description: 'Cocok untuk harian maupun acara spesial. Aroma tahan lama dengan karakter premium.',
      is_featured: true, is_new: true, is_sale: true
    },
    {
      name: 'Mawar Velvet Bloom', slug: 'mawar-velvet-bloom', category_id: categoryMap['parfum-wanita'],
      price: 24.99, old_price: 0, stock: 15, image_url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80',
      short_description: 'Nuansa floral manis yang lembut dan berkelas.',
      full_description: 'Aroma segar dan feminin untuk dipakai seharian.',
      is_featured: true, is_new: true, is_sale: false
    },
    {
      name: 'Mawar Royal Amber', slug: 'mawar-royal-amber', category_id: categoryMap['best-seller'],
      price: 34.99, old_price: 44.99, stock: 10, image_url: 'https://images.unsplash.com/photo-1615634262417-4e5ff3e2f2d8?auto=format&fit=crop&w=900&q=80',
      short_description: 'Aroma amber intens dengan kesan mahal.',
      full_description: 'Best seller untuk pelanggan yang suka parfum berkarakter kuat.',
      is_featured: true, is_new: false, is_sale: true
    },
    {
      name: 'Mawar Gift Set Deluxe', slug: 'mawar-gift-set-deluxe', category_id: categoryMap['gift-set'],
      price: 49.99, old_price: 59.99, stock: 8, image_url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=80',
      short_description: 'Paket hadiah premium untuk pasangan dan keluarga.',
      full_description: 'Isi lengkap dan cocok untuk hadiah spesial.',
      is_featured: false, is_new: true, is_sale: true
    }
  ];

  for (const p of products) {
    await pool.query(
      `INSERT INTO products (name, slug, category_id, price, old_price, stock, image_url, short_description, full_description, is_featured, is_new, is_sale)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       ON CONFLICT (slug) DO NOTHING`,
      [p.name, p.slug, p.category_id, p.price, p.old_price || null, p.stock, p.image_url, p.short_description, p.full_description, p.is_featured, p.is_new, p.is_sale]
    );
  }

  console.log('Seed complete.');
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
