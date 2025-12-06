const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const UserAddress = sequelize.define('UserAddress', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  label: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  recipient_name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  address_line: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  province: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  postal_code: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  is_default: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'user_addresses',
  timestamps: false
});

module.exports = UserAddress;