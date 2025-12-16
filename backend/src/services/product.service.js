// backend/src/services/product.service.js - UPDATED VERSION
const { Product, Category, Brand, ProductMedia } = require('../models');
const { Op } = require('sequelize');

class ProductService {
  /**
   * Get all products dengan filter dan pagination
   * UPDATED: Exclude flash sale products (discount >= 30%) from regular listing
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
      max_price,
      is_flash_sale,
      exclude_flash_sale = true // ⚡ DEFAULT TRUE: exclude flash sale from all products
    } = filters;

    const offset = (page - 1) * limit;
    const where = {};

    // 🔍 Search
    if (search) {
      where.name = { [Op.iLike]: `%${search}%` };
    }

    // 🔍 Category ID
    if (category_id) {
      where.category_id = category_id;
    }

    // 🔍 Category by slug
    if (category_slug) {
      try {
        const category = await Category.findOne({ 
          where: { slug: category_slug } 
        });

        if (category) {
          where.category_id = category.id;
        } else {
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

    // 🔍 Brand
    if (brand_id) {
      where.brand_id = brand_id;
    }

    // 🔍 Price range
    if (min_price || max_price) {
      where.price = {};
      if (min_price) where.price[Op.gte] = min_price;
      if (max_price) where.price[Op.lte] = max_price;
    }

    // 🔥 Flash sale filter (optional)
    if (is_flash_sale !== undefined) {
      where.is_flash_sale = is_flash_sale;

      if (is_flash_sale === true) {
        where.flash_sale_end = { [Op.gt]: new Date() };
      }
    }

    try {
      let { count, rows } = await Product.findAndCountAll({
        where,
        include: [
          { model: Category, as: 'category' },
          { model: Brand, as: 'brand' },
          { model: ProductMedia, as: 'media' }
        ],
        limit: parseInt(limit) * 2, // Fetch more to account for filtering
        offset,
        order: [['created_at', 'DESC']]
      });

      // ⚡ FILTER OUT flash sale products (discount >= 30%)
      if (exclude_flash_sale === true) {
        rows = rows.filter(product => {
          if (!product.compare_at_price || product.compare_at_price <= product.price) {
            return true; // No discount, include it
          }
          
          const discountPercentage = ((product.compare_at_price - product.price) / product.compare_at_price) * 100;
          return discountPercentage < 30; // Exclude if discount >= 30%
        });

        // Trim to actual limit
        rows = rows.slice(0, parseInt(limit));
        count = rows.length; // Adjust count
      }

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
   * Get flash sale products ONLY
   * This endpoint shows products with discount >= 30%
   */
  async getFlashSaleProducts(filters = {}) {
    const { page = 1, limit = 12 } = filters;
    const offset = (page - 1) * limit;

    try {
      // Fetch all products with compare_at_price
      let { count, rows } = await Product.findAndCountAll({
        where: {
          compare_at_price: { [Op.gt]: 0 }
        },
        include: [
          { model: Category, as: 'category' },
          { model: Brand, as: 'brand' },
          { model: ProductMedia, as: 'media' }
        ],
        order: [['created_at', 'DESC']]
      });

      // Filter for discount >= 30%
      rows = rows.filter(product => {
        const discountPercentage = ((product.compare_at_price - product.price) / product.compare_at_price) * 100;
        return discountPercentage >= 30;
      });

      // Pagination
      const total = rows.length;
      rows = rows.slice(offset, offset + parseInt(limit));

      return {
        products: rows,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Error fetching flash sale products:', error);
      throw error;
    }
  }

  /**
   * Get products by category slug
   */
  async getProductsByCategory(categorySlug, options = {}) {
    const { page = 1, limit = 12 } = options;

    const category = await Category.findOne({
      where: { slug: categorySlug }
    });

    if (!category) {
      throw new Error('Category not found');
    }

    const offset = (page - 1) * limit;

    let { count, rows } = await Product.findAndCountAll({
      where: { category_id: category.id },
      include: [
        { model: Category, as: 'category' },
        { model: Brand, as: 'brand' },
        { model: ProductMedia, as: 'media' }
      ],
      order: [['created_at', 'DESC']]
    });

    // ⚡ Exclude flash sale products
    rows = rows.filter(product => {
      if (!product.compare_at_price || product.compare_at_price <= product.price) {
        return true;
      }
      const discountPercentage = ((product.compare_at_price - product.price) / product.compare_at_price) * 100;
      return discountPercentage < 30;
    });

    // Pagination
    const total = rows.length;
    rows = rows.slice(offset, offset + parseInt(limit));

    return {
      products: rows,
      pagination: {
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit),
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
   * Get products by brand slug
   */
  async getProductsByBrand(brandSlug, options = {}) {
    const { page = 1, limit = 12 } = options;

    const brand = await Brand.findOne({
      where: { slug: brandSlug }
    });

    if (!brand) {
      throw new Error('Brand not found');
    }

    const offset = (page - 1) * limit;

    let { count, rows } = await Product.findAndCountAll({
      where: { brand_id: brand.id },
      include: [
        { model: Category, as: 'category' },
        { model: Brand, as: 'brand' },
        { model: ProductMedia, as: 'media' }
      ],
      order: [['created_at', 'DESC']]
    });

    // ⚡ Exclude flash sale products
    rows = rows.filter(product => {
      if (!product.compare_at_price || product.compare_at_price <= product.price) {
        return true;
      }
      const discountPercentage = ((product.compare_at_price - product.price) / product.compare_at_price) * 100;
      return discountPercentage < 30;
    });

    // Pagination
    const total = rows.length;
    rows = rows.slice(offset, offset + parseInt(limit));

    return {
      products: rows,
      pagination: {
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit),
        limit: parseInt(limit)
      },
      brand: {
        id: brand.id,
        name: brand.name,
        slug: brand.slug
      }
    };
  }

  /**
   * Create product - FIXED
   */
  async createProduct(productData) {
    const product = await Product.create({
      name: productData.name,
      description: productData.description,
      slug: productData.slug,
      price: productData.price,
      stock: productData.stock,
      category_id: productData.category_id || null,
      brand_id: productData.brand_id || null,
      rating: productData.rating || null,
      
      // ⭐ NEW FIELDS - PROPERLY HANDLED
      compare_at_price: productData.compare_at_price || null,
      is_flash_sale: productData.is_flash_sale ?? false,
      flash_sale_end: productData.flash_sale_end || null
    });

    return await this.getProductById(product.id);
  }

  /**
   * Update product - FIXED
   */
  async updateProduct(productId, productData) {
    const product = await Product.findByPk(productId);

    if (!product) {
      throw new Error('Product not found');
    }

    // Prepare update data
    const updateData = {
      name: productData.name,
      description: productData.description,
      price: productData.price,
      stock: productData.stock,
      category_id: productData.category_id || null,
      brand_id: productData.brand_id || null,
      
      // ⭐ NEW FIELDS - PROPERLY HANDLED
      compare_at_price: productData.compare_at_price || null,
      is_flash_sale: productData.is_flash_sale ?? false,
      flash_sale_end: productData.flash_sale_end || null
    };

    // Only update slug if name changed
    if (productData.name && productData.name !== product.name) {
      // Slug will be auto-generated by hook
      updateData.name = productData.name;
    }

    await product.update(updateData);

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
   * Categories
   */
  async getAllCategories() {
    return await Category.findAll({
      order: [['name', 'ASC']]
    });
  }

  async getCategoryBySlug(slug) {
    const category = await Category.findOne({ where: { slug } });

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  }

  /**
   * Brands
   */
  async getAllBrands() {
    return await Brand.findAll({
      order: [['name', 'ASC']]
    });
  }

  async getBrandBySlug(slug) {
    const brand = await Brand.findOne({ where: { slug } });

    if (!brand) {
      throw new Error('Brand not found');
    }

    return brand;
  }
}

module.exports = new ProductService();