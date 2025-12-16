const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { optionalAuth, authenticate, requireAdmin } = require('../middlewares/auth');
const { body } = require('express-validator');
const validate = require('../middlewares/validate');

// Validation rules
const productValidation = [
  body('name').notEmpty().withMessage('Product name is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('stock').isNumeric().withMessage('Stock must be a number'),

  body('compare_at_price')
    .optional()
    .isNumeric()
    .withMessage('compare_at_price must be a number'),

  body('is_flash_sale')
    .optional()
    .isBoolean()
    .withMessage('is_flash_sale must be true or false'),

  body('flash_sale_end')
    .optional()
    .isISO8601()
    .withMessage('flash_sale_end must be a valid datetime'),

  validate
];

// ===== PUBLIC ROUTES =====

// Get all categories
router.get('/categories', productController.getAllCategories);

// Get all brands
router.get('/brands', productController.getAllBrands);

// ⚡ Get flash sale products ONLY - MUST BE BEFORE /:slug
router.get('/flash-sale', optionalAuth, productController.getFlashSaleProducts);

// Get all products with filters (excludes flash sale by default)
router.get('/', optionalAuth, productController.getAllProducts);

// ===== ADMIN ROUTES (Protected) =====

// IMPORTANT: Admin routes with numeric ID must come BEFORE slug route
// Get product by ID (for admin edit) - MUST BE BEFORE /:slug
router.get('/:id(\\d+)', authenticate, requireAdmin, productController.getProductById);

// Create product
router.post('/', authenticate, requireAdmin, productValidation, productController.createProduct);

// Update product by ID
router.put('/:id(\\d+)', authenticate, requireAdmin, productValidation, productController.updateProduct);

// Delete product by ID
router.delete('/:id(\\d+)', authenticate, requireAdmin, productController.deleteProduct);

// ===== PUBLIC ROUTE (Must be LAST) =====
// Get product by SLUG (public access)
router.get('/:slug', optionalAuth, productController.getProductBySlug);

module.exports = router;