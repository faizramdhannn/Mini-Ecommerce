const { Order, OrderItem, Product, User, Payment, Shipment } = require('../models');
const sequelize = require('../db');
const { Op } = require('sequelize');

class OrderService {
  /**
   * ⭐ NEW: Update membership points setelah payment
   */
  async updateMembershipPoints(userId, orderAmount) {
    try {
      const user = await User.findByPk(userId);
      if (!user) return;
      
      // Hitung poin dari order ini (Rp 1,000 = 1 poin)
      const pointsEarned = Math.floor(orderAmount / 1000);
      
      // Update total points
      await user.update({
        membership_points: (user.membership_points || 0) + pointsEarned
      });
      
      console.log(`✅ User ${user.nickname} earned ${pointsEarned} points from order amount Rp ${orderAmount.toLocaleString()}`);
    } catch (error) {
      console.error('Error updating membership points:', error);
    }
  }

  /**
   * ⭐ NEW: Deduct membership points (untuk cancel order yang sudah PAID)
   */
  async deductMembershipPoints(userId, orderAmount) {
    try {
      const user = await User.findByPk(userId);
      if (!user) return;
      
      // Hitung poin yang harus dikurangi
      const pointsToDeduct = Math.floor(orderAmount / 1000);
      
      // Kurangi points, minimal 0
      const newPoints = Math.max(0, (user.membership_points || 0) - pointsToDeduct);
      
      await user.update({
        membership_points: newPoints
      });
      
      console.log(`✅ Deducted ${pointsToDeduct} points from user ${user.nickname}. New total: ${newPoints} points`);
    } catch (error) {
      console.error('Error deducting membership points:', error);
    }
  }

  /**
   * Get all orders dengan pagination
   * Admin: dapat melihat semua orders
   * User: hanya melihat orders miliknya
   */
  async getAllOrders(user = null, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    let where = {};
    
    // Jika user ada dan bukan admin, filter berdasarkan user_id
    if (user && user.role !== 'admin') {
      where.user_id = user.id;
    }
    // Jika user adalah admin atau tidak ada user, tampilkan semua
    
    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['id', 'full_name', 'email', 'nickname'] },
        { 
          model: OrderItem, 
          as: 'items',
          include: [{ model: Product, as: 'product' }]
        },
        { model: Payment, as: 'payment' },
        { model: Shipment, as: 'shipment' }
      ],
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });
    
    return {
      orders: rows,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit)
    };
  }

  /**
   * Get order by ID
   * Admin: dapat melihat order apapun
   * User: hanya melihat order miliknya
   */
  async getOrderById(orderId, user = null) {
    const where = { id: orderId };
    
    // Jika user ada dan bukan admin, pastikan order milik user tersebut
    if (user && user.role !== 'admin') {
      where.user_id = user.id;
    }
    
    const order = await Order.findOne({
      where,
      include: [
        { model: User, as: 'user', attributes: ['id', 'full_name', 'email', 'phone', 'nickname'] },
        { 
          model: OrderItem, 
          as: 'items',
          include: [{ model: Product, as: 'product' }]
        },
        { model: Payment, as: 'payment' },
        { model: Shipment, as: 'shipment' }
      ]
    });
    
    if (!order) {
      throw new Error('Order not found');
    }
    
    return order;
  }

  /**
   * Create order dari cart (status: PENDING)
   */
  async createOrder(userId, orderData) {
    const transaction = await sequelize.transaction();
    
    try {
      const { items, payment_method, shipping_cost = 20000 } = orderData;
      
      if (!items || items.length === 0) {
        throw new Error('Order must have at least one item');
      }
      
      let total_amount = 0;
      const orderItems = [];
      
      for (const item of items) {
        const product = await Product.findByPk(item.product_id);
        
        if (!product) {
          throw new Error(`Product with ID ${item.product_id} not found`);
        }
        
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product: ${product.name}`);
        }
        
        const itemTotal = product.price * item.quantity;
        total_amount += itemTotal;
        
        orderItems.push({
          product_id: product.id,
          product_name_snapshot: product.name,
          price_snapshot: product.price,
          quantity: item.quantity
        });
        
        await product.update(
          { stock: product.stock - item.quantity },
          { transaction }
        );
      }
      
      const order = await Order.create({
        user_id: userId,
        status: 'PENDING',
        total_amount,
        shipping_cost,
        payment_method
      }, { transaction });
      
      for (const item of orderItems) {
        await OrderItem.create({
          order_id: order.id,
          ...item
        }, { transaction });
      }
      
      await transaction.commit();
      
      return await this.getOrderById(order.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Update order status dengan validasi flow
   */
  async updateOrderStatus(orderId, status, reason = null) {
    const order = await Order.findByPk(orderId);
    
    if (!order) {
      throw new Error('Order not found');
    }
    
    this.validateStatusTransition(order.status, status);
    
    const updateData = { status };
    
    await order.update(updateData);
    
    return await this.getOrderById(orderId);
  }

  /**
   * Validasi status transition
   */
  validateStatusTransition(currentStatus, newStatus) {
    const validTransitions = {
      'PENDING': ['PAID', 'CANCELED'],
      'PAID': ['SHIPPED', 'CANCELED'],
      'SHIPPED': ['DELIVERED'],
      'DELIVERED': ['COMPLETED'],
      'COMPLETED': [],
      'CANCELED': []
    };
    
    if (!validTransitions[currentStatus]) {
      throw new Error(`Invalid current status: ${currentStatus}`);
    }
    
    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new Error(`Cannot transition from ${currentStatus} to ${newStatus}`);
    }
  }

  /**
   * Create payment untuk order (PENDING → PAID)
   * ⭐ UPDATED: Auto-update membership points setelah payment
   */
  async createPayment(orderId, paymentData) {
    const order = await Order.findByPk(orderId);
    
    if (!order) {
      throw new Error('Order not found');
    }
    
    if (order.status !== 'PENDING') {
      throw new Error(`Cannot create payment for order with status: ${order.status}`);
    }
    
    const existingPayment = await Payment.findOne({ where: { order_id: orderId } });
    if (existingPayment) {
      throw new Error('Payment already exists for this order');
    }
    
    const payment = await Payment.create({
      order_id: orderId,
      provider: paymentData.provider,
      status: 'PAID',
      transaction_id: paymentData.transaction_id,
      amount: Number(order.total_amount) + Number(order.shipping_cost),
      paid_at: new Date()
    });
    
    await order.update({ status: 'PAID' });
    
    // ⭐ UPDATE MEMBERSHIP POINTS (hanya dari total_amount, tidak termasuk shipping)
    await this.updateMembershipPoints(order.user_id, order.total_amount);
    
    return payment;
  }

  /**
   * Create shipment untuk order (PAID → SHIPPED)
   */
  async createShipment(orderId, shipmentData) {
    const order = await Order.findByPk(orderId);
    
    if (!order) {
      throw new Error('Order not found');
    }
    
    if (order.status !== 'PAID') {
      throw new Error(`Cannot create shipment for order with status: ${order.status}`);
    }
    
    const existingShipment = await Shipment.findOne({ where: { order_id: orderId } });
    if (existingShipment) {
      throw new Error('Shipment already exists for this order');
    }
    
    const shipment = await Shipment.create({
      order_id: orderId,
      courier: shipmentData.courier,
      tracking_number: shipmentData.tracking_number,
      status: 'WAITING_PICKUP',
      shipped_at: new Date()
    });
    
    await order.update({ status: 'SHIPPED' });
    
    return shipment;
  }

  /**
   * Update shipment status (SHIPPED → DELIVERED)
   */
  async updateShipmentStatus(orderId, status) {
    const shipment = await Shipment.findOne({ where: { order_id: orderId } });
    
    if (!shipment) {
      throw new Error('Shipment not found');
    }
    
    const updateData = { status };
    
    if (status === 'DELIVERED') {
      updateData.delivered_at = new Date();
      
      const order = await Order.findByPk(orderId);
      await order.update({ status: 'DELIVERED' });
    }
    
    await shipment.update(updateData);
    
    return shipment;
  }

  /**
   * Complete order (DELIVERED → COMPLETED)
   */
  async completeOrder(orderId, user = null) {
    const where = { id: orderId };
    
    // Jika user bukan admin, pastikan order milik user
    if (user && user.role !== 'admin') {
      where.user_id = user.id;
    }
    
    const order = await Order.findOne({ where });
    
    if (!order) {
      throw new Error('Order not found');
    }
    
    if (order.status !== 'DELIVERED') {
      throw new Error(`Cannot complete order with status: ${order.status}`);
    }
    
    await order.update({ status: 'COMPLETED' });
    
    return await this.getOrderById(orderId);
  }

  /**
   * Cancel order (PENDING/PAID → CANCELED)
   * ⭐ UPDATED: Deduct membership points jika order sudah PAID
   */
  async cancelOrder(orderId, user = null, reason = null) {
    const where = { id: orderId };
    
    // Jika user bukan admin, pastikan order milik user
    if (user && user.role !== 'admin') {
      where.user_id = user.id;
    }
    
    const order = await Order.findOne({ where });
    
    if (!order) {
      throw new Error('Order not found');
    }
    
    if (!['PENDING', 'PAID'].includes(order.status)) {
      throw new Error(`Cannot cancel order with status: ${order.status}`);
    }
    
    // ⭐ Jika order sudah PAID, kurangi membership points
    if (order.status === 'PAID') {
      await this.deductMembershipPoints(order.user_id, order.total_amount);
    }
    
    // Restore stock untuk semua items
    const transaction = await sequelize.transaction();
    
    try {
      const orderItems = await OrderItem.findAll({
        where: { order_id: orderId }
      });
      
      for (const item of orderItems) {
        const product = await Product.findByPk(item.product_id);
        if (product) {
          await product.update(
            { stock: product.stock + item.quantity },
            { transaction }
          );
        }
      }
      
      await order.update({ status: 'CANCELED' }, { transaction });
      
      await transaction.commit();
      
      return await this.getOrderById(orderId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = new OrderService();