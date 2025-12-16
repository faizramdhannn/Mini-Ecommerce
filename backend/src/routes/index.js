// backend/src/routes/index.js - UPDATED VERSION
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middlewares/validate');
const authController = require('../controllers/auth.controller');
const categoryController = require('../controllers/category.controller');
const brandController = require('../controllers/brand.controller');
const dashboardController = require('../controllers/dashboard.controller');
const { authenticate, requireAdmin } = require('../middlewares/auth');

// Import route modules
const userRoutes = require('./user.routes');
const productRoutes = require('./product.routes');
const categoryRoutes = require('./category.routes');
const brandRoutes = require('./brand.routes');
const orderRoutes = require('./order.routes');
const cartRoutes = require('./cart.routes');
const searchRoutes = require('./search.routes');

// Auth validation
const registerValidation = [
  body('nickname').notEmpty().withMessage('Nickname is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

// Category/Brand validation
const categoryValidation = [
  body('name').notEmpty().withMessage('Category name is required'),
  validate
];

const brandValidation = [
  body('name').notEmpty().withMessage('Brand name is required'),
  validate
];

// Root
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'E-Commerce API v1.0.0',
    endpoints: {
      auth: 'POST /api/auth/login',
      products: 'GET /api/products',
      search: 'GET /api/search?q=keyword',
      categories: 'GET /api/categories/:slug/products',
      brands: 'GET /api/brands/:slug/products',
      dashboard: 'GET /api/dashboard/stats'
    }
  });
});

// Auth routes
router.post('/auth/register', registerValidation, authController.register);
router.post('/auth/login', loginValidation, authController.login);
router.post('/auth/logout', authenticate, authController.logout);
router.get('/auth/profile', authenticate, authController.getProfile);

// Dashboard routes (admin only)
router.get('/dashboard/stats', authenticate, requireAdmin, dashboardController.getStats);
router.get('/dashboard/sales-chart', authenticate, requireAdmin, dashboardController.getSalesChart);
router.get('/dashboard/recent-orders', authenticate, requireAdmin, dashboardController.getRecentOrders);

// Admin Category CRUD routes
router.get('/admin/categories', authenticate, requireAdmin, categoryController.getAllCategories);
router.get('/admin/categories/:id', authenticate, requireAdmin, categoryController.getCategoryById);
router.post('/admin/categories', authenticate, requireAdmin, categoryValidation, categoryController.createCategory);
router.put('/admin/categories/:id', authenticate, requireAdmin, categoryValidation, categoryController.updateCategory);
router.delete('/admin/categories/:id', authenticate, requireAdmin, categoryController.deleteCategory);

// Admin Brand CRUD routes
router.get('/admin/brands', authenticate, requireAdmin, brandController.getAllBrands);
router.get('/admin/brands/:id', authenticate, requireAdmin, brandController.getBrandById);
router.post('/admin/brands', authenticate, requireAdmin, brandValidation, brandController.createBrand);
router.put('/admin/brands/:id', authenticate, requireAdmin, brandValidation, brandController.updateBrand);
router.delete('/admin/brands/:id', authenticate, requireAdmin, brandController.deleteBrand);

// Module routes - IMPORTANT: Order matters!
router.use('/search', searchRoutes);      // 1. Search first
router.use('/categories', categoryRoutes); // 2. Category routes (public)
router.use('/brands', brandRoutes);        // 3. Brand routes (public)
router.use('/products', productRoutes);    // 4. Products (includes /products/categories and /products/brands)
router.use('/users', userRoutes);
router.use('/orders', orderRoutes);
router.use('/cart', cartRoutes);

module.exports = router;