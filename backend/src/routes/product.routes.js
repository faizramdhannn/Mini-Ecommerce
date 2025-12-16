const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { optionalAuth } = require('../middlewares/auth');
const { body } = require('express-validator');
const validate = require('../middlewares/validate');

// Validation rules
const productValidation = [
  body('name').notEmpty().withMessage('Product name is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('stock').isNumeric().withMessage('Stock must be a number'),

  // NEW ↓↓↓
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

// ⚡ NEW: Get flash sale products ONLY - MUST BE BEFORE /:slug
router.get('/flash-sale', optionalAuth, productController.getFlashSaleProducts);

// Get all products with filters (excludes flash sale by default)
router.get('/', optionalAuth, productController.getAllProducts);

// Get product by SLUG
router.get('/:slug', optionalAuth, productController.getProductBySlug);

// ===== ADMIN ROUTES (Protected) =====

// Create product
router.post('/', productValidation, productController.createProduct);

// Update product by ID
router.put('/:id', productValidation, productController.updateProduct);

// Delete product by ID
router.delete('/:id', productController.deleteProduct);

module.exports = router;