const express = require('express');
const router = express.Router();
const productService = require('../services/product.service');
const { paginatedResponse } = require('../utils/response');

/**
 * Search products
 * GET /api/search?q=keyword&page=1&limit=12&category=slug&brand=slug&min_price=0&max_price=10000
 */
router.get('/', async (req, res, next) => {
  try {
    const filters = {
      page: req.query.page || 1,
      limit: req.query.limit || 12,
      search: req.query.q, // Query string menggunakan 'q'
      category_slug: req.query.category,
      brand_id: req.query.brand,
      min_price: req.query.min_price,
      max_price: req.query.max_price
    };

    const result = await productService.getAllProducts(filters);

    return paginatedResponse(
      res,
      result.products,
      { page: result.page, limit: result.limit, total: result.total },
      'Search results retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
});

module.exports = router;