const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  full_name: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  nickname: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(150),
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  profile_image: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  birthday: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
    allowNull: false
  }
}, {
  tableName: 'users',
  timestamps: true
});

module.exports = User;