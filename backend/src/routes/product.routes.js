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
  validate
];

// ===== PUBLIC ROUTES (no auth required) =====

// Get all categories - NEW
router.get('/categories', productController.getAllCategories);

// Get all brands - NEW
router.get('/brands', productController.getAllBrands);

// Get products by category slug - NEW
router.get('/categories/:slug/products', productController.getProductsByCategory);

// Get products by brand slug - NEW
router.get('/brands/:slug/products', productController.getProductsByBrand);

// Get all products with filters
router.get('/', optionalAuth, productController.getAllProducts);

// Get product by SLUG (bukan ID) - IMPORTANT: After other specific routes
router.get('/:slug', optionalAuth, productController.getProductBySlug);

// ===== PROTECTED ROUTES (auth required) =====

// Create product (admin only)
router.post('/', productValidation, productController.createProduct);

// Update product (admin only)
router.put('/:id', productValidation, productController.updateProduct);

// Delete product (admin only)
router.delete('/:id', productController.deleteProduct);

module.exports = router;