// backend/src/routes/index.js - FINAL VERSION
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middlewares/validate');
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth');

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
      brands: 'GET /api/brands/:slug/products'
    }
  });
});

// Auth routes
router.post('/auth/register', registerValidation, authController.register);
router.post('/auth/login', loginValidation, authController.login);
router.post('/auth/logout', authenticate, authController.logout);
router.get('/auth/profile', authenticate, authController.getProfile);

// Module routes - IMPORTANT: Order matters!
router.use('/search', searchRoutes);      // 1. Search first
router.use('/categories', categoryRoutes); // 2. Category routes
router.use('/brands', brandRoutes);        // 3. Brand routes
router.use('/products', productRoutes);    // 4. Products (includes /products/categories and /products/brands)
router.use('/users', userRoutes);
router.use('/orders', orderRoutes);
router.use('/cart', cartRoutes);

module.exports = router;