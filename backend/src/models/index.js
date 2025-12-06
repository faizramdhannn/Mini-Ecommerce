const sequelize = require('../db');

// Import semua models
const User = require('./User');
const UserAddress = require('./UserAddress');
const Product = require('./Product');
const ProductMedia = require('./ProductMedia');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Payment = require('./Payment');
const Shipment = require('./Shipment');
const Category = require('./Category');
const Brand = require('./Brand');

// =================== RELASI ===================

// ---------- USER ----------
User.hasMany(UserAddress, { foreignKey: 'user_id', as: 'addresses' });
UserAddress.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasOne(Cart, { foreignKey: 'user_id', as: 'cart' });
Cart.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// ---------- PRODUCT ----------
Product.hasMany(ProductMedia, { foreignKey: 'product_id', as: 'media' });
ProductMedia.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Product → Category
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });

// Product → Brand
Product.belongsTo(Brand, { foreignKey: 'brand_id', as: 'brand' });
Brand.hasMany(Product, { foreignKey: 'brand_id', as: 'products' });

// ---------- CART ----------
Cart.hasMany(CartItem, { foreignKey: 'cart_id', as: 'items' });
CartItem.belongsTo(Cart, { foreignKey: 'cart_id', as: 'cart' });

Product.hasMany(CartItem, { foreignKey: 'product_id', as: 'cartItems' });
CartItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// ---------- ORDER ----------
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

Product.hasMany(OrderItem, { foreignKey: 'product_id', as: 'orderItems' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Order → Payment
Order.hasOne(Payment, { foreignKey: 'order_id', as: 'payment' });
Payment.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// Order → Shipment
Order.hasOne(Shipment, { foreignKey: 'order_id', as: 'shipment' });
Shipment.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// Export semua model
module.exports = {
  sequelize,
  User,
  UserAddress,
  Product,
  ProductMedia,
  Category,
  Brand,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Payment,
  Shipment
};
