const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

// Get products by category slug with pagination
// Route: GET /api/categories/:slug/products?page=1&limit=12
router.get('/:slug/products', productController.getProductsByCategory);

module.exports = router;