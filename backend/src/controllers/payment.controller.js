const { Payment, Order } = require('../models');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');

class PaymentController {
  /**
   * Get all payments
   */
  async getAllPayments(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
      
      const { count, rows } = await Payment.findAndCountAll({
        include: [
          {
            model: Order,
            as: 'order',
            attributes: ['id', 'user_id', 'status', 'total_amount']
          }
        ],
        limit: parseInt(limit),
        offset,
        order: [['id', 'DESC']]
      });
      
      return paginatedResponse(
        res,
        rows,
        { page: parseInt(page), limit: parseInt(limit), total: count },
        'Payments retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get payment by ID
   */
  async getPaymentById(req, res, next) {
    try {
      const { id } = req.params;
      
      const payment = await Payment.findByPk(id, {
        include: [
          {
            model: Order,
            as: 'order',
            attributes: ['id', 'user_id', 'status', 'total_amount', 'shipping_cost']
          }
        ]
      });
      
      if (!payment) {
        return errorResponse(res, 'Payment not found', 404);
      }
      
      return successResponse(res, payment, 'Payment retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create payment
   */
  async createPayment(req, res, next) {
    try {
      const { order_id, provider, transaction_id, amount } = req.body;
      
      // Check if order exists
      const order = await Order.findByPk(order_id);
      if (!order) {
        return errorResponse(res, 'Order not found', 404);
      }
      
      // Check if payment already exists for this order
      const existingPayment = await Payment.findOne({ where: { order_id } });
      if (existingPayment) {
        return errorResponse(res, 'Payment already exists for this order', 400);
      }
      
      const payment = await Payment.create({
        order_id,
        provider,
        transaction_id,
        amount,
        status: 'paid',
        paid_at: new Date()
      });
      
      // Update order status
      await order.update({ status: 'paid' });
      
      return successResponse(res, payment, 'Payment created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update payment
   */
  async updatePayment(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const payment = await Payment.findByPk(id);
      
      if (!payment) {
        return errorResponse(res, 'Payment not found', 404);
      }
      
      await payment.update(updateData);
      
      return successResponse(res, payment, 'Payment updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete payment
   */
  async deletePayment(req, res, next) {
    try {
      const { id } = req.params;
      
      const payment = await Payment.findByPk(id);
      
      if (!payment) {
        return errorResponse(res, 'Payment not found', 404);
      }
      
      await payment.destroy();
      
      return successResponse(res, null, 'Payment deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PaymentController();