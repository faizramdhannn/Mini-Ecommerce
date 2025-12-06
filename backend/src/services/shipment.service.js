const { Shipment, Order } = require('../models');

class ShipmentService {
  /**
   * Get all shipments
   */
  async getAllShipments(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await Shipment.findAndCountAll({
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
      shipments: rows,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit)
    };
  }

  /**
   * Get shipment by ID
   */
  async getShipmentById(shipmentId) {
    const shipment = await Shipment.findByPk(shipmentId, {
      include: [
        {
          model: Order,
          as: 'order',
          attributes: ['id', 'user_id', 'status', 'total_amount']
        }
      ]
    });
    
    if (!shipment) {
      throw new Error('Shipment not found');
    }
    
    return shipment;
  }

  /**
   * Get shipment by order ID
   */
  async getShipmentByOrderId(orderId) {
    const shipment = await Shipment.findOne({
      where: { order_id: orderId },
      include: [
        {
          model: Order,
          as: 'order'
        }
      ]
    });
    
    return shipment;
  }

  /**
   * Create shipment
   */
  async createShipment(orderId, shipmentData) {
    const order = await Order.findByPk(orderId);
    
    if (!order) {
      throw new Error('Order not found');
    }

    // Check if shipment already exists
    const existingShipment = await Shipment.findOne({ where: { order_id: orderId } });
    if (existingShipment) {
      throw new Error('Shipment already exists for this order');
    }
    
    const shipment = await Shipment.create({
      order_id: orderId,
      courier: shipmentData.courier,
      tracking_number: shipmentData.tracking_number,
      status: shipmentData.status || 'waiting_pickup'
    });
    
    return await this.getShipmentById(shipment.id);
  }

  /**
   * Update shipment
   */
  async updateShipment(shipmentId, shipmentData) {
    const shipment = await Shipment.findByPk(shipmentId);
    
    if (!shipment) {
      throw new Error('Shipment not found');
    }
    
    await shipment.update(shipmentData);
    
    return await this.getShipmentById(shipmentId);
  }

  /**
   * Update shipment status
   */
  async updateShipmentStatus(shipmentId, status) {
    const shipment = await Shipment.findByPk(shipmentId);
    
    if (!shipment) {
      throw new Error('Shipment not found');
    }
    
    const updateData = { status };
    
    if (status === 'shipped' && !shipment.shipped_at) {
      updateData.shipped_at = new Date();
    }
    
    if (status === 'delivered') {
      updateData.delivered_at = new Date();
      
      // Update order status
      const order = await Order.findByPk(shipment.order_id);
      await order.update({ status: 'delivered' });
    }
    
    await shipment.update(updateData);
    
    return await this.getShipmentById(shipmentId);
  }

  /**
   * Delete shipment
   */
  async deleteShipment(shipmentId) {
    const shipment = await Shipment.findByPk(shipmentId);
    
    if (!shipment) {
      throw new Error('Shipment not found');
    }
    
    await shipment.destroy();
    return true;
  }
}

module.exports = new ShipmentService();