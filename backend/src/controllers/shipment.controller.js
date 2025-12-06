const { Shipment, Order } = require('../models');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');

class ShipmentController {
  /**
   * Get all shipments
   */
  async getAllShipments(req, res, next) {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const offset = (page - 1) * limit;
      
      const where = {};
      if (status) where.status = status;
      
      const { count, rows } = await Shipment.findAndCountAll({
        where,
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
        'Shipments retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get shipment by ID
   */
  async getShipmentById(req, res, next) {
    try {
      const { id } = req.params;
      
      const shipment = await Shipment.findByPk(id, {
        include: [
          {
            model: Order,
            as: 'order',
            attributes: ['id', 'user_id', 'status', 'total_amount', 'shipping_cost']
          }
        ]
      });
      
      if (!shipment) {
        return errorResponse(res, 'Shipment not found', 404);
      }
      
      return successResponse(res, shipment, 'Shipment retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create shipment
   */
  async createShipment(req, res, next) {
    try {
      const { order_id, courier, tracking_number } = req.body;
      
      // Check if order exists
      const order = await Order.findByPk(order_id);
      if (!order) {
        return errorResponse(res, 'Order not found', 404);
      }
      
      // Check if shipment already exists for this order
      const existingShipment = await Shipment.findOne({ where: { order_id } });
      if (existingShipment) {
        return errorResponse(res, 'Shipment already exists for this order', 400);
      }
      
      const shipment = await Shipment.create({
        order_id,
        courier,
        tracking_number,
        status: 'waiting_pickup'
      });
      
      return successResponse(res, shipment, 'Shipment created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update shipment
   */
  async updateShipment(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const shipment = await Shipment.findByPk(id);
      
      if (!shipment) {
        return errorResponse(res, 'Shipment not found', 404);
      }
      
      // Auto-set timestamps based on status
      if (updateData.status === 'shipped' && !shipment.shipped_at) {
        updateData.shipped_at = new Date();
      }
      
      if (updateData.status === 'delivered' && !shipment.delivered_at) {
        updateData.delivered_at = new Date();
        
        // Update order status
        const order = await Order.findByPk(shipment.order_id);
        if (order) {
          await order.update({ status: 'delivered' });
        }
      }
      
      await shipment.update(updateData);
      
      return successResponse(res, shipment, 'Shipment updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete shipment
   */
  async deleteShipment(req, res, next) {
    try {
      const { id } = req.params;
      
      const shipment = await Shipment.findByPk(id);
      
      if (!shipment) {
        return errorResponse(res, 'Shipment not found', 404);
      }
      
      await shipment.destroy();
      
      return successResponse(res, null, 'Shipment deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Track shipment by tracking number
   */
  async trackShipment(req, res, next) {
    try {
      const { tracking_number } = req.params;
      
      const shipment = await Shipment.findOne({
        where: { tracking_number },
        include: [
          {
            model: Order,
            as: 'order',
            attributes: ['id', 'status', 'total_amount']
          }
        ]
      });
      
      if (!shipment) {
        return errorResponse(res, 'Shipment not found', 404);
      }
      
      return successResponse(res, shipment, 'Shipment tracked successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ShipmentController();