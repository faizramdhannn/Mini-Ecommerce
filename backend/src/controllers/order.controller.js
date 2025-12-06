const orderService = require('../services/order.service');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');

class OrderController {
  /**
   * Get all orders
   * Admin dapat melihat semua orders
   * User biasa hanya melihat orders miliknya
   */
  async getAllOrders(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      
      // Pass user object (includes role) ke service
      const result = await orderService.getAllOrders(req.user, parseInt(page), parseInt(limit));
      
      return paginatedResponse(
        res,
        result.orders,
        { page: result.page, limit: result.limit, total: result.total },
        'Orders retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get order by ID
   */
  async getOrderById(req, res, next) {
    try {
      const { id } = req.params;
      
      // Pass user object ke service
      const order = await orderService.getOrderById(id, req.user);
      
      return successResponse(res, order, 'Order retrieved successfully');
    } catch (error) {
      if (error.message === 'Order not found') {
        return errorResponse(res, error.message, 404);
      }
      next(error);
    }
  }

  /**
   * Create order (status: PENDING)
   */
  async createOrder(req, res, next) {
    try {
      const userId = req.user.id;
      const orderData = req.body;
      
      const order = await orderService.createOrder(userId, orderData);
      
      return successResponse(res, order, 'Order created successfully', 201);
    } catch (error) {
      if (error.message.includes('not found') || 
          error.message.includes('Insufficient stock') ||
          error.message.includes('must have at least')) {
        return errorResponse(res, error.message, 400);
      }
      next(error);
    }
  }

  /**
   * Update order status
   */
  async updateOrderStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status, reason } = req.body;
      
      const order = await orderService.updateOrderStatus(id, status, reason);
      
      return successResponse(res, order, 'Order status updated successfully');
    } catch (error) {
      if (error.message === 'Order not found') {
        return errorResponse(res, error.message, 404);
      }
      if (error.message.includes('Cannot transition') || 
          error.message.includes('Invalid')) {
        return errorResponse(res, error.message, 400);
      }
      next(error);
    }
  }

  /**
   * Create payment (PENDING → PAID)
   */
  async createPayment(req, res, next) {
    try {
      const { id } = req.params;
      const paymentData = req.body;
      
      const payment = await orderService.createPayment(id, paymentData);
      
      return successResponse(res, payment, 'Payment created successfully', 201);
    } catch (error) {
      if (error.message === 'Order not found') {
        return errorResponse(res, error.message, 404);
      }
      if (error.message.includes('Cannot create payment') || 
          error.message.includes('already exists')) {
        return errorResponse(res, error.message, 400);
      }
      next(error);
    }
  }

  /**
   * Create shipment (PAID → SHIPPED)
   */
  async createShipment(req, res, next) {
    try {
      const { id } = req.params;
      const shipmentData = req.body;
      
      const shipment = await orderService.createShipment(id, shipmentData);
      
      return successResponse(res, shipment, 'Shipment created successfully', 201);
    } catch (error) {
      if (error.message === 'Order not found') {
        return errorResponse(res, error.message, 404);
      }
      if (error.message.includes('Cannot create shipment') || 
          error.message.includes('already exists')) {
        return errorResponse(res, error.message, 400);
      }
      next(error);
    }
  }

  /**
   * Update shipment status (SHIPPED → DELIVERED)
   */
  async updateShipmentStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const shipment = await orderService.updateShipmentStatus(id, status);
      
      return successResponse(res, shipment, 'Shipment status updated successfully');
    } catch (error) {
      if (error.message === 'Shipment not found') {
        return errorResponse(res, error.message, 404);
      }
      next(error);
    }
  }

  /**
   * Complete order (DELIVERED → COMPLETED)
   */
  async completeOrder(req, res, next) {
    try {
      const { id } = req.params;
      
      // Pass user object
      const order = await orderService.completeOrder(id, req.user);
      
      return successResponse(res, order, 'Order completed successfully');
    } catch (error) {
      if (error.message === 'Order not found') {
        return errorResponse(res, error.message, 404);
      }
      if (error.message.includes('Cannot complete')) {
        return errorResponse(res, error.message, 400);
      }
      next(error);
    }
  }

  /**
   * Cancel order (PENDING/PAID → CANCELED)
   */
  async cancelOrder(req, res, next) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      
      // Pass user object
      const order = await orderService.cancelOrder(id, req.user, reason);
      
      return successResponse(res, order, 'Order canceled successfully');
    } catch (error) {
      if (error.message === 'Order not found') {
        return errorResponse(res, error.message, 404);
      }
      if (error.message.includes('Cannot cancel')) {
        return errorResponse(res, error.message, 400);
      }
      next(error);
    }
  }
}

module.exports = new OrderController();