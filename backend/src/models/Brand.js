// models/Brand.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const { slugify } = require('../utils/slugify');

const Brand = sequelize.define('Brand', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  }
}, {
  tableName: 'brands',
  timestamps: true,
  hooks: {
    beforeValidate: (brand) => {
      if (brand.name && !brand.slug) {
        brand.slug = slugify(brand.name);
      }
    },
    beforeUpdate: (brand) => {
      if (brand.changed('name')) {
        brand.slug = slugify(brand.name);
      }
    }
  }
});

module.exports = Brand;