const cron = require('node-cron');
const { Order, OrderItem, Product } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');
const sequelize = require('../db');

class OrderScheduler {
  /**
   * Auto-expire PENDING orders yang sudah lebih dari 24 jam
   * Runs every hour
   */
  startAutoExpireOrders() {
    // Run every hour: 0 * * * *
    cron.schedule('0 * * * *', async () => {
      try {
        logger.info('Running auto-expire PENDING orders scheduler...');
        
        // Calculate 24 hours ago
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
        
        // Find PENDING orders older than 24 hours
        const expiredOrders = await Order.findAll({
          where: {
            status: 'PENDING',
            created_at: {
              [Op.lt]: twentyFourHoursAgo
            }
          },
          include: [
            {
              model: OrderItem,
              as: 'items'
            }
          ]
        });
        
        if (expiredOrders.length === 0) {
          logger.info('No expired PENDING orders found.');
          return;
        }
        
        logger.info(`Found ${expiredOrders.length} expired PENDING orders. Processing...`);
        
        // Process each expired order
        for (const order of expiredOrders) {
          const transaction = await sequelize.transaction();
          
          try {
            // Restore stock for each order item
            for (const item of order.items) {
              const product = await Product.findByPk(item.product_id);
              if (product) {
                await product.update(
                  { stock: product.stock + item.quantity },
                  { transaction }
                );
                logger.info(`Restored stock for product ${product.name}: +${item.quantity}`);
              }
            }
            
            // Update order status to CANCELED
            await order.update({
              status: 'CANCELED',
              canceled_at: new Date(),
              canceled_reason: 'Order expired - payment not received within 24 hours'
            }, { transaction });
            
            await transaction.commit();
            
            logger.info(`Order #${order.id} expired and canceled successfully.`);
          } catch (error) {
            await transaction.rollback();
            logger.error(`Error processing expired order #${order.id}:`, error);
          }
        }
        
        logger.info('Auto-expire PENDING orders scheduler completed.');
      } catch (error) {
        logger.error('Error in auto-expire scheduler:', error);
      }
    });
    
    logger.info('✅ Order auto-expire scheduler started (runs every hour)');
  }
}

module.exports = new OrderScheduler();