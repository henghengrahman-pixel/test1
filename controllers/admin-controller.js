const slugify = require('slugify');
const { validateAdmin } = require('../models/admin-model');
const { getDashboardStats, getAllOrders, getOrderById, updateOrderStatus } = require('../models/order-model');
const { getAdminProducts, createProduct, getProductById, updateProduct, deleteProduct } = require('../models/product-model');
const { getAllCategories } = require('../models/category-model');

function loginPage(req, res) {
  res.render('admin/login', { layout: false, error: null });
}

async function loginSubmit(req, res, next) {
  try {
    const admin = await validateAdmin(req.body.username, req.body.password);
    if (!admin) return res.render('admin/login', { layout: false, error: 'Username atau password salah.' });

    req.session.admin = { id: admin.id, username: admin.username };
    res.redirect('/admin');
  } catch (error) {
    next(error);
  }
}

function logout(req, res) {
  req.session.destroy(() => res.redirect('/admin/login'));
}

async function dashboard(req, res, next) {
  try {
    const stats = await getDashboardStats();
    res.render('admin/dashboard', { meta: { title: 'Admin Dashboard' }, stats });
  } catch (error) {
    next(error);
  }
}

async function productsPage(req, res, next) {
  try {
    const products = await getAdminProducts();
    res.render('admin/products', { meta: { title: 'Admin Products' }, products });
  } catch (error) {
    next(error);
  }
}

async function newProductPage(req, res, next) {
  try {
    const categories = await getAllCategories();
    res.render('admin/product-form', { meta: { title: 'New Product' }, categories, product: null, action: '/admin/products' });
  } catch (error) {
    next(error);
  }
}

async function createProductSubmit(req, res, next) {
  try {
    const data = normalizeProduct(req.body);
    await createProduct(data);
    res.redirect('/admin/products');
  } catch (error) {
    next(error);
  }
}

async function editProductPage(req, res, next) {
  try {
    const [categories, product] = await Promise.all([getAllCategories(), getProductById(req.params.id)]);
    res.render('admin/product-form', { meta: { title: 'Edit Product' }, categories, product, action: `/admin/products/update/${product.id}` });
  } catch (error) {
    next(error);
  }
}

async function updateProductSubmit(req, res, next) {
  try {
    const data = normalizeProduct(req.body);
    await updateProduct(req.params.id, data);
    res.redirect('/admin/products');
  } catch (error) {
    next(error);
  }
}

async function deleteProductSubmit(req, res, next) {
  try {
    await deleteProduct(req.params.id);
    res.redirect('/admin/products');
  } catch (error) {
    next(error);
  }
}

async function ordersPage(req, res, next) {
  try {
    const orders = await getAllOrders();
    res.render('admin/orders', { meta: { title: 'Admin Orders' }, orders });
  } catch (error) {
    next(error);
  }
}

async function orderDetailPage(req, res, next) {
  try {
    const detail = await getOrderById(req.params.id);
    res.render('admin/order-detail', { meta: { title: 'Order Detail' }, ...detail });
  } catch (error) {
    next(error);
  }
}

async function updateOrderStatusSubmit(req, res, next) {
  try {
    await updateOrderStatus(req.params.id, req.body.status);
    res.redirect(`/admin/orders/${req.params.id}`);
  } catch (error) {
    next(error);
  }
}

function normalizeProduct(body) {
  return {
    name: body.name,
    slug: body.slug || slugify(body.name, { lower: true, strict: true }),
    category_id: body.category_id,
    price: Number(body.price || 0),
    old_price: body.old_price ? Number(body.old_price) : null,
    stock: Number(body.stock || 0),
    image_url: body.image_url,
    short_description: body.short_description,
    full_description: body.full_description,
    is_featured: Boolean(body.is_featured),
    is_new: Boolean(body.is_new),
    is_sale: Boolean(body.is_sale)
  };
}

module.exports = {
  loginPage,
  loginSubmit,
  logout,
  dashboard,
  productsPage,
  newProductPage,
  createProductSubmit,
  editProductPage,
  updateProductSubmit,
  deleteProductSubmit,
  ordersPage,
  orderDetailPage,
  updateOrderStatusSubmit
};
