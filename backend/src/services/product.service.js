const { Product, Category, Brand, ProductMedia } = require('../models');
const { Op } = require('sequelize');

class ProductService {
  /**
   * Get all products dengan filter dan pagination
   */
  async getAllProducts(filters = {}) {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      category_id,
      category_slug,
      brand_id, 
      min_price, 
      max_price 
    } = filters;
    const offset = (page - 1) * limit;
    
    const where = {};
    
    // Filter search
    if (search) {
      where.name = { [Op.iLike]: `%${search}%` };
    }
    
    // Filter category by ID
    if (category_id) {
      where.category_id = category_id;
    }

    // Filter category by slug
    if (category_slug) {
      try {
        const category = await Category.findOne({ 
          where: { slug: category_slug } 
        });
        
        if (category) {
          where.category_id = category.id;
        } else {
          // Jika category tidak ditemukan, return empty result
          return {
            products: [],
            total: 0,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: 0
          };
        }
      } catch (error) {
        console.error('Error finding category:', error);
        return {
          products: [],
          total: 0,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: 0
        };
      }
    }
    
    // Filter brand
    if (brand_id) {
      where.brand_id = brand_id;
    }
    
    // Filter price range
    if (min_price || max_price) {
      where.price = {};
      if (min_price) where.price[Op.gte] = min_price;
      if (max_price) where.price[Op.lte] = max_price;
    }
    
    try {
      const { count, rows } = await Product.findAndCountAll({
        where,
        include: [
          { model: Category, as: 'category' },
          { model: Brand, as: 'brand' },
          { model: ProductMedia, as: 'media' }
        ],
        limit: parseInt(limit),
        offset,
        order: [['created_at', 'DESC']]
      });
      
      return {
        products: rows,
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  /**
   * Get product by ID
   */
  async getProductById(productId) {
    const product = await Product.findByPk(productId, {
      include: [
        { model: Category, as: 'category' },
        { model: Brand, as: 'brand' },
        { model: ProductMedia, as: 'media' }
      ]
    });
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    return product;
  }

  /**
   * Get product by slug
   */
  async getProductBySlug(slug) {
    const product = await Product.findOne({
      where: { slug },
      include: [
        { model: Category, as: 'category' },
        { model: Brand, as: 'brand' },
        { model: ProductMedia, as: 'media' }
      ]
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  /**
   * Get products by category slug
   */
  async getProductsByCategory(categorySlug, options = {}) {
    const { page = 1, limit = 12 } = options;
    
    // Cari category dulu
    const category = await Category.findOne({
      where: { slug: categorySlug }
    });

    if (!category) {
      throw new Error('Category not found');
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Product.findAndCountAll({
      where: { category_id: category.id },
      include: [
        { model: Category, as: 'category' },
        { model: Brand, as: 'brand' },
        { model: ProductMedia, as: 'media' }
      ],
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'DESC']]
    });

    return {
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit),
        limit: parseInt(limit)
      },
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug
      }
    };
  }

  /**
   * Create product
   */
  async createProduct(productData) {
    const product = await Product.create(productData);
    return await this.getProductById(product.id);
  }

  /**
   * Update product
   */
  async updateProduct(productId, productData) {
    const product = await Product.findByPk(productId);
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    await product.update(productData);
    return await this.getProductById(productId);
  }

  /**
   * Delete product
   */
  async deleteProduct(productId) {
    const product = await Product.findByPk(productId);
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    await product.destroy();
    return true;
  }

  /**
   * Get all categories
   */
  async getAllCategories() {
    return await Category.findAll({
      order: [['name', 'ASC']]
    });
  }

  /**
   * Get category by slug
   */
  async getCategoryBySlug(slug) {
    const category = await Category.findOne({
      where: { slug }
    });

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  }

  /**
   * Get all brands
   */
  async getAllBrands() {
    return await Brand.findAll({
      order: [['name', 'ASC']]
    });
  }

  /**
   * Get brand by slug
   */
  async getBrandBySlug(slug) {
    const brand = await Brand.findOne({
      where: { slug }
    });

    if (!brand) {
      throw new Error('Brand not found');
    }

    return brand;
  }
}

module.exports = new ProductService();