// models/Category.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const { slugify } = require('../utils/slugify');

const Category = sequelize.define('Category', {
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
  tableName: 'categories',
  timestamps: false, // ← PENTING: Disable timestamps
  hooks: {
    beforeValidate: (category) => {
      if (category.name && !category.slug) {
        category.slug = slugify(category.name);
      }
    },
    beforeUpdate: (category) => {
      if (category.changed('name')) {
        category.slug = slugify(category.name);
      }
    }
  }
});

module.exports = Category;