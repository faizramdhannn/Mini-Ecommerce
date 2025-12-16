const { Category, Product } = require('../models');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');

class CategoryController {
  /**
   * Get all categories
   */
  async getAllCategories(req, res, next) {
    try {
      const { page = 1, limit = 100 } = req.query;
      const offset = (page - 1) * limit;

      const { count, rows } = await Category.findAndCountAll({
        limit: parseInt(limit),
        offset,
        order: [['name', 'ASC']]
      });

      return paginatedResponse(
        res,
        rows,
        { page: parseInt(page), limit: parseInt(limit), total: count },
        'Categories retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get category by ID
   */
  async getCategoryById(req, res, next) {
    try {
      const { id } = req.params;

      const category = await Category.findByPk(id);

      if (!category) {
        return errorResponse(res, 'Category not found', 404);
      }

      return successResponse(res, category, 'Category retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create category
   */
  async createCategory(req, res, next) {
    try {
      const { name, slug } = req.body;

      // Check if category with same name exists
      const existingCategory = await Category.findOne({ where: { name } });
      if (existingCategory) {
        return errorResponse(res, 'Category with this name already exists', 409);
      }

      const category = await Category.create({ name, slug });

      return successResponse(res, category, 'Category created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update category
   */
  async updateCategory(req, res, next) {
    try {
      const { id } = req.params;
      const { name, slug } = req.body;

      const category = await Category.findByPk(id);

      if (!category) {
        return errorResponse(res, 'Category not found', 404);
      }

      // Check if another category with same name exists
      const existingCategory = await Category.findOne({
        where: { name, id: { [require('sequelize').Op.ne]: id } }
      });

      if (existingCategory) {
        return errorResponse(res, 'Category with this name already exists', 409);
      }

      await category.update({ name, slug });

      return successResponse(res, category, 'Category updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete category
   */
  async deleteCategory(req, res, next) {
    try {
      const { id } = req.params;

      const category = await Category.findByPk(id);

      if (!category) {
        return errorResponse(res, 'Category not found', 404);
      }

      // Check if category is used by any products
      const productCount = await Product.count({ where: { category_id: id } });

      if (productCount > 0) {
        return errorResponse(
          res,
          `Cannot delete category. It is used by ${productCount} product(s)`,
          400
        );
      }

      await category.destroy();

      return successResponse(res, null, 'Category deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CategoryController();