// backend/src/models/Product.js - VERIFIED VERSION
const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const { slugify } = require('../utils/slugify');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },

  slug: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  brand_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  category_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  price: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  // ⭐ COMPARE PRICE - Harga asli sebelum diskon
  compare_at_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: null
  },

  // ⭐ IS FLASH SALE - Apakah produk sedang flash sale
  is_flash_sale: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },

  // ⭐ FLASH SALE END - Kapan flash sale berakhir
  flash_sale_end: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  },

  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },

  rating: {
    type: DataTypes.DECIMAL(2, 1),
    allowNull: true
  }

}, {
  tableName: 'products',
  timestamps: true,
  hooks: {
    beforeValidate: (product) => {
      // Auto-generate slug dari name
      if (product.name && !product.slug) {
        product.slug = slugify(product.name);
      }
    },
    beforeUpdate: (product) => {
      // Auto-update slug jika name berubah
      if (product.changed('name')) {
        product.slug = slugify(product.name);
      }
    }
  }
});

module.exports = Product;