// models/Product.js
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
      if (product.name && !product.slug) {
        product.slug = slugify(product.name);
      }
    },
    beforeUpdate: (product) => {
      if (product.changed('name')) {
        product.slug = slugify(product.name);
      }
    }
  }
});

module.exports = Product;