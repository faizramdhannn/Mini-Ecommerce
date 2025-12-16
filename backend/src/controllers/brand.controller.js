const { Brand, Product } = require('../models');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');

class BrandController {
  /**
   * Get all brands
   */
  async getAllBrands(req, res, next) {
    try {
      const { page = 1, limit = 100 } = req.query;
      const offset = (page - 1) * limit;

      const { count, rows } = await Brand.findAndCountAll({
        limit: parseInt(limit),
        offset,
        order: [['name', 'ASC']]
      });

      return paginatedResponse(
        res,
        rows,
        { page: parseInt(page), limit: parseInt(limit), total: count },
        'Brands retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get brand by ID
   */
  async getBrandById(req, res, next) {
    try {
      const { id } = req.params;

      const brand = await Brand.findByPk(id);

      if (!brand) {
        return errorResponse(res, 'Brand not found', 404);
      }

      return successResponse(res, brand, 'Brand retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create brand
   */
  async createBrand(req, res, next) {
    try {
      const { name, slug, description } = req.body;

      // Check if brand with same name exists
      const existingBrand = await Brand.findOne({ where: { name } });
      if (existingBrand) {
        return errorResponse(res, 'Brand with this name already exists', 409);
      }

      const brand = await Brand.create({ name, slug, description });

      return successResponse(res, brand, 'Brand created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update brand
   */
  async updateBrand(req, res, next) {
    try {
      const { id } = req.params;
      const { name, slug, description } = req.body;

      const brand = await Brand.findByPk(id);

      if (!brand) {
        return errorResponse(res, 'Brand not found', 404);
      }

      // Check if another brand with same name exists
      const existingBrand = await Brand.findOne({
        where: { name, id: { [require('sequelize').Op.ne]: id } }
      });

      if (existingBrand) {
        return errorResponse(res, 'Brand with this name already exists', 409);
      }

      await brand.update({ name, slug, description });

      return successResponse(res, brand, 'Brand updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete brand
   */
  async deleteBrand(req, res, next) {
    try {
      const { id } = req.params;

      const brand = await Brand.findByPk(id);

      if (!brand) {
        return errorResponse(res, 'Brand not found', 404);
      }

      // Check if brand is used by any products
      const productCount = await Product.count({ where: { brand_id: id } });

      if (productCount > 0) {
        return errorResponse(
          res,
          `Cannot delete brand. It is used by ${productCount} product(s)`,
          400
        );
      }

      await brand.destroy();

      return successResponse(res, null, 'Brand deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BrandController();