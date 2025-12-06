const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  provider: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'PAID', 'FAILED', 'EXPIRED'),
    defaultValue: 'PENDING',
    allowNull: false
  },
  transaction_id: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  amount: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  paid_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  expired_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'payments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Payment;