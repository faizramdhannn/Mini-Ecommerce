const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Shipment = sequelize.define('Shipment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  courier: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  tracking_number: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  status: {
    type: DataTypes.ENUM('WAITING_PICKUP', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'),
    defaultValue: 'WAITING_PICKUP',
    allowNull: false
  },
  shipped_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  delivered_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'shipments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Shipment;