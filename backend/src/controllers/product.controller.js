const productService = require('../services/product.service');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');

class ProductController {
  /**
   * Get all products with filters
   * GET /api/products?page=1&limit=12&search=...&category_slug=...
   */
  async getAllProducts(req, res, next) {
    try {
      const filters = {
        page: req.query.page || 1,
        limit: req.query.limit || 10,
        search: req.query.search,
        category_id: req.query.category_id,
        category_slug: req.query.category_slug,
        brand_id: req.query.brand_id,
        min_price: req.query.min_price,
        max_price: req.query.max_price
      };
      
      const result = await productService.getAllProducts(filters);
      
      return paginatedResponse(
        res,
        result.products,
        { page: result.page, limit: result.limit, total: result.total },
        'Products retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get product by SLUG (bukan ID)
   * GET /api/products/:slug
   */
  async getProductBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      
      const product = await productService.getProductBySlug(slug);
      
      return successResponse(res, product, 'Product retrieved successfully');
    } catch (error) {
      if (error.message === 'Product not found') {
        return errorResponse(res, error.message, 404);
      }
      next(error);
    }
  }

  /**
   * Get product by ID (untuk admin)
   * GET /api/products/:id
   */
  async getProductById(req, res, next) {
    try {
      const { id } = req.params;
      
      const product = await productService.getProductById(id);
      
      return successResponse(res, product, 'Product retrieved successfully');
    } catch (error) {
      if (error.message === 'Product not found') {
        return errorResponse(res, error.message, 404);
      }
      next(error);
    }
  }

  /**
   * Create product
   * POST /api/products
   */
  async createProduct(req, res, next) {
    try {
      const productData = req.body;
      
      const product = await productService.createProduct(productData);
      
      return successResponse(res, product, 'Product created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update product
   * PUT /api/products/:id
   */
  async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const productData = req.body;
      
      const product = await productService.updateProduct(id, productData);
      
      return successResponse(res, product, 'Product updated successfully');
    } catch (error) {
      if (error.message === 'Product not found') {
        return errorResponse(res, error.message, 404);
      }
      next(error);
    }
  }

  /**
   * Delete product
   * DELETE /api/products/:id
   */
  async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      
      await productService.deleteProduct(id);
      
      return successResponse(res, null, 'Product deleted successfully');
    } catch (error) {
      if (error.message === 'Product not found') {
        return errorResponse(res, error.message, 404);
      }
      next(error);
    }
  }

  /**
   * Get all categories
   * GET /api/categories
   */
  async getAllCategories(req, res, next) {
    try {
      const categories = await productService.getAllCategories();
      
      return successResponse(res, categories, 'Categories retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get products by category slug
   * GET /api/categories/:slug/products?page=1&limit=12
   */
  async getProductsByCategory(req, res, next) {
    try {
      const { slug } = req.params;
      const { page = 1, limit = 12 } = req.query;
      
      const result = await productService.getProductsByCategory(slug, { 
        page: parseInt(page), 
        limit: parseInt(limit) 
      });
      
      // Return format yang sesuai dengan frontend
      return res.status(200).json({
        success: true,
        message: 'Products retrieved successfully',
        data: result.products,
        pagination: result.pagination,
        category: result.category
      });
    } catch (error) {
      if (error.message === 'Category not found') {
        return errorResponse(res, error.message, 404);
      }
      next(error);
    }
  }

  /**
   * Get all brands
   * GET /api/brands
   */
  async getAllBrands(req, res, next) {
    try {
      const brands = await productService.getAllBrands();
      
      return successResponse(res, brands, 'Brands retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get products by brand slug
   * GET /api/brands/:slug/products?page=1&limit=12
   */
  async getProductsByBrand(req, res, next) {
    try {
      const { slug } = req.params;
      const { page = 1, limit = 12 } = req.query;
      
      const result = await productService.getProductsByBrand(slug, { 
        page: parseInt(page), 
        limit: parseInt(limit) 
      });
      
      return res.status(200).json({
        success: true,
        message: 'Products retrieved successfully',
        data: result.products,
        pagination: result.pagination,
        brand: result.brand
      });
    } catch (error) {
      if (error.message === 'Brand not found') {
        return errorResponse(res, error.message, 404);
      }
      next(error);
    }
  }
}

module.exports = new ProductController();