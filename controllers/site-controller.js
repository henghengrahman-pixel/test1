const { getAllCategories } = require('../models/category-model');
const { getFeaturedProducts, getLatestProducts, getStoreProducts, getProductBySlug } = require('../models/product-model');
const { makeMeta } = require('../helpers/seo');

async function home(req, res, next) {
  try {
    const [categories, featuredProducts, latestProducts] = await Promise.all([
      getAllCategories(),
      getFeaturedProducts(8),
      getLatestProducts(12)
    ]);

    res.render('site/home', {
      meta: makeMeta({ title: 'Mawar Parfume | Home' }, req),
      categories,
      featuredProducts,
      latestProducts
    });
  } catch (error) {
    next(error);
  }
}

async function store(req, res, next) {
  try {
    const [categories, products] = await Promise.all([
      getAllCategories(),
      getStoreProducts({ search: req.query.search, category: req.query.category })
    ]);

    res.render('site/store', {
      meta: makeMeta({ title: 'Mawar Parfume | Store' }, req),
      categories,
      products,
      filters: { search: req.query.search || '', category: req.query.category || '' }
    });
  } catch (error) {
    next(error);
  }
}

async function productDetail(req, res, next) {
  try {
    const product = await getProductBySlug(req.params.slug);
    if (!product) return res.status(404).render('site/message', {
      meta: makeMeta({ title: 'Product not found' }, req),
      heading: 'Produk tidak ditemukan',
      message: 'Produk yang kamu cari belum tersedia.'
    });

    const relatedProducts = (await getStoreProducts({ category: product.category_slug })).filter((item) => item.id !== product.id).slice(0, 4);

    res.render('site/product-detail', {
      meta: makeMeta({ title: `${product.name} | Mawar Parfume`, description: product.short_description, image: product.image_url }, req),
      product,
      relatedProducts
    });
  } catch (error) {
    next(error);
  }
}

async function cartPage(req, res) {
  res.render('site/cart', {
    meta: makeMeta({ title: 'Cart | Mawar Parfume' }, req)
  });
}

async function orderSuccess(req, res) {
  res.render('site/order-success', {
    meta: makeMeta({ title: 'Order Success | Mawar Parfume' }, req),
    orderId: req.query.orderId || null
  });
}

async function robots(req, res) {
  res.type('text/plain').send(`User-agent: *\nAllow: /\nSitemap: ${(process.env.BASE_URL || '').replace(/\/$/, '')}/sitemap.xml`);
}

async function sitemap(req, res, next) {
  try {
    const products = await getStoreProducts();
    const baseUrl = (process.env.BASE_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
    const urls = ['/', '/store', '/cart', '/checkout', ...products.map((item) => `/product/${item.slug}`)];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${baseUrl}${url}</loc></url>`).join('\n')}\n</urlset>`;
    res.type('application/xml').send(xml);
  } catch (error) {
    next(error);
  }
}

module.exports = { home, store, productDetail, cartPage, orderSuccess, robots, sitemap };
