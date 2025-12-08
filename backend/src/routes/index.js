const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middlewares/validate');
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth');

// Import route modules
const userRoutes = require('./user.routes');
const productRoutes = require('./product.routes');
const orderRoutes = require('./order.routes');
const cartRoutes = require('./cart.routes');
const paymentRoutes = require('./payment.routes');
const shipmentRoutes = require('./shipment.routes');
const searchRoutes = require('./search.routes'); // NEW

// Auth validation rules
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

const updatePasswordValidation = [
  body('old_password').notEmpty().withMessage('Old password is required'),
  body('new_password').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  validate
];

// Root route
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'E-Commerce API',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        logout: 'POST /api/auth/logout',
        profile: 'GET /api/auth/profile',
        updatePassword: 'PUT /api/auth/password'
      },
      users: 'GET /api/users',
      products: {
        list: 'GET /api/products',
        bySlug: 'GET /api/products/:slug',
        categories: 'GET /api/categories',
        categoryProducts: 'GET /api/categories/:slug/products',
        brands: 'GET /api/brands',
        brandProducts: 'GET /api/brands/:slug/products'
      },
      search: 'GET /api/search?q=keyword',
      orders: 'GET /api/orders',
      cart: 'GET /api/cart',
      payments: 'GET /api/payments',
      shipments: 'GET /api/shipments'
    }
  });
});

// Auth routes
router.post('/auth/register', registerValidation, authController.register);
router.post('/auth/login', loginValidation, authController.login);
router.post('/auth/logout', authenticate, authController.logout);
router.get('/auth/profile', authenticate, authController.getProfile);
router.put('/auth/password', authenticate, updatePasswordValidation, authController.updatePassword);

// Module routes
router.use('/users', userRoutes);
router.use('/products', productRoutes); // Includes /categories and /brands
router.use('/categories', productRoutes); // Route untuk categories
router.use('/brands', productRoutes); // Route untuk brands
router.use('/search', searchRoutes); // NEW - Search route
router.use('/orders', orderRoutes);
router.use('/cart', cartRoutes);
router.use('/payments', paymentRoutes);
router.use('/shipments', shipmentRoutes);

module.exports = router;