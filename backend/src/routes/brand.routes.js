const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

// Get products by brand slug with pagination
// Route: GET /api/brands/:slug/products?page=1&limit=12
router.get('/:slug/products', productController.getProductsByBrand);

module.exports = router;