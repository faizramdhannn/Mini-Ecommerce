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

// ===== PUBLIC ROUTES =====

// Get all categories
router.get('/categories', productController.getAllCategories);

// Get all brands  
router.get('/brands', productController.getAllBrands);

// Get all products with filters
router.get('/', optionalAuth, productController.getAllProducts);

// Get product by SLUG (IMPORTANT: Must be after other specific routes)
router.get('/:slug', optionalAuth, productController.getProductBySlug);

// ===== ADMIN ROUTES (Protected) =====

// Create product
router.post('/', productValidation, productController.createProduct);

// Update product by ID
router.put('/:id', productValidation, productController.updateProduct);

// Delete product by ID
router.delete('/:id', productController.deleteProduct);

module.exports = router;