const { DataTypes } = require('sequelize');
const sequelize = require('../db');

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
  timestamps: true
});

module.exports = Product;