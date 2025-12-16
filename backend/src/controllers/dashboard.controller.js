const { Product, Order, User, OrderItem } = require('../models');
const { successResponse } = require('../utils/response');
const { Op } = require('sequelize');
const sequelize = require('../db');

class DashboardController {
  /**
   * Get dashboard statistics
   */
  async getStats(req, res, next) {
    try {
      // Total products
      const totalProducts = await Product.count();

      // Total orders
      const totalOrders = await Order.count();

      // Total customers (users)
      const totalCustomers = await User.count();

      // Total revenue (sum of completed orders)
      const revenueResult = await Order.findOne({
        where: {
          status: { [Op.in]: ['COMPLETED', 'DELIVERED', 'SHIPPED', 'PAID'] }
        },
        attributes: [
          [sequelize.fn('SUM', sequelize.col('total_amount')), 'total_revenue'],
          [sequelize.fn('SUM', sequelize.col('shipping_cost')), 'total_shipping']
        ],
        raw: true
      });

      const totalRevenue = (parseInt(revenueResult?.total_revenue || 0) + 
                           parseInt(revenueResult?.total_shipping || 0));

      // Calculate revenue change (compare with last month)
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      const lastMonthRevenue = await Order.findOne({
        where: {
          status: { [Op.in]: ['COMPLETED', 'DELIVERED', 'SHIPPED', 'PAID'] },
          created_at: { [Op.lt]: lastMonth }
        },
        attributes: [
          [sequelize.fn('SUM', sequelize.col('total_amount')), 'total_revenue'],
          [sequelize.fn('SUM', sequelize.col('shipping_cost')), 'total_shipping']
        ],
        raw: true
      });

      const lastMonthTotal = (parseInt(lastMonthRevenue?.total_revenue || 0) + 
                              parseInt(lastMonthRevenue?.total_shipping || 0));

      const revenueChange = lastMonthTotal > 0 
        ? ((totalRevenue - lastMonthTotal) / lastMonthTotal * 100).toFixed(1)
        : 0;

      // Calculate orders change
      const lastMonthOrders = await Order.count({
        where: { created_at: { [Op.lt]: lastMonth } }
      });

      const ordersChange = lastMonthOrders > 0
        ? ((totalOrders - lastMonthOrders) / lastMonthOrders * 100).toFixed(1)
        : 0;

      const stats = {
        totalProducts,
        totalOrders,
        totalCustomers,
        totalRevenue,
        revenueChange: parseFloat(revenueChange),
        ordersChange: parseFloat(ordersChange)
      };

      return successResponse(res, stats, 'Dashboard stats retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get sales chart data (last 7 days)
   */
  async getSalesChart(req, res, next) {
    try {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const today = new Date();
      const salesData = [];

      // Get last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);

        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const dayOrders = await Order.findOne({
          where: {
            status: { [Op.in]: ['COMPLETED', 'DELIVERED', 'SHIPPED', 'PAID'] },
            created_at: {
              [Op.gte]: date,
              [Op.lt]: nextDate
            }
          },
          attributes: [
            [sequelize.fn('SUM', sequelize.col('total_amount')), 'total'],
            [sequelize.fn('SUM', sequelize.col('shipping_cost')), 'shipping']
          ],
          raw: true
        });

        const sales = (parseInt(dayOrders?.total || 0) + 
                      parseInt(dayOrders?.shipping || 0));

        salesData.push({
          date: days[date.getDay()],
          sales: sales
        });
      }

      return successResponse(res, salesData, 'Sales chart data retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get recent orders
   */
  async getRecentOrders(req, res, next) {
    try {
      const orders = await Order.findAll({
        limit: 5,
        order: [['created_at', 'DESC']],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'nickname', 'email']
          },
          {
            model: OrderItem,
            as: 'items'
          }
        ]
      });

      return successResponse(res, orders, 'Recent orders retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();