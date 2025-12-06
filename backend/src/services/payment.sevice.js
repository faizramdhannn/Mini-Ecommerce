const { Payment, Order } = require('../models');

class PaymentService {
  /**
   * Get all payments
   */
  async getAllPayments(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await Payment.findAndCountAll({
      include: [
        {
          model: Order,
          as: 'order',
          attributes: ['id', 'user_id', 'status', 'total_amount']
        }
      ],
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });
    
    return {
      payments: rows,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit)
    };
  }

  /**
   * Get payment by ID
   */
  async getPaymentById(paymentId) {
    const payment = await Payment.findByPk(paymentId, {
      include: [
        {
          model: Order,
          as: 'order',
          attributes: ['id', 'user_id', 'status', 'total_amount', 'shipping_cost']
        }
      ]
    });
    
    if (!payment) {
      throw new Error('Payment not found');
    }
    
    return payment;
  }

  /**
   * Get payment by order ID
   */
  async getPaymentByOrderId(orderId) {
    const payment = await Payment.findOne({
      where: { order_id: orderId },
      include: [
        {
          model: Order,
          as: 'order'
        }
      ]
    });
    
    return payment;
  }

  /**
   * Create payment
   */
  async createPayment(orderId, paymentData) {
    const order = await Order.findByPk(orderId);
    
    if (!order) {
      throw new Error('Order not found');
    }

    // Check if payment already exists
    const existingPayment = await Payment.findOne({ where: { order_id: orderId } });
    if (existingPayment) {
      throw new Error('Payment already exists for this order');
    }
    
    const payment = await Payment.create({
      order_id: orderId,
      provider: paymentData.provider,
      status: paymentData.status || 'pending',
      transaction_id: paymentData.transaction_id,
      amount: Number(order.total_amount) + Number(order.shipping_cost),
      paid_at: paymentData.status === 'paid' ? new Date() : null
    });
    
    // Update order status if payment is completed
    if (paymentData.status === 'paid') {
      await order.update({ status: 'paid' });
    }
    
    return await this.getPaymentById(payment.id);
  }

  /**
   * Update payment status
   */
  async updatePaymentStatus(paymentId, status) {
    const payment = await Payment.findByPk(paymentId);
    
    if (!payment) {
      throw new Error('Payment not found');
    }
    
    const updateData = { status };
    
    if (status === 'paid' && !payment.paid_at) {
      updateData.paid_at = new Date();
      
      // Update order status
      const order = await Order.findByPk(payment.order_id);
      await order.update({ status: 'paid' });
    }
    
    await payment.update(updateData);
    
    return await this.getPaymentById(paymentId);
  }

  /**
   * Delete payment
   */
  async deletePayment(paymentId) {
    const payment = await Payment.findByPk(paymentId);
    
    if (!payment) {
      throw new Error('Payment not found');
    }
    
    await payment.destroy();
    return true;
  }
}

module.exports = new PaymentService();