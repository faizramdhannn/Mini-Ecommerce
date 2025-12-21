const userService = require('../services/user.service');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');
const { User, Order } = require('../models');
const { Op } = require('sequelize');

class UserController {
  /**
   * Get all users
   */
  async getAllUsers(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      
      const result = await userService.getAllUsers(parseInt(page), parseInt(limit));
      
      return paginatedResponse(
        res, 
        result.users, 
        { page: result.page, limit: result.limit, total: result.total },
        'Users retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      
      const user = await userService.getUserById(id);
      
      if (!user) {
        return errorResponse(res, 'User not found', 404);
      }
      
      return successResponse(res, user, 'User retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user
   */
  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      // Prevent password update via this endpoint
      delete updateData.password;
      
      const user = await userService.updateUser(id, updateData);
      
      return successResponse(res, user, 'User updated successfully');
    } catch (error) {
      if (error.message === 'User not found') {
        return errorResponse(res, error.message, 404);
      }
      next(error);
    }
  }

  /**
   * Delete user
   */
  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      
      await userService.deleteUser(id);
      
      return successResponse(res, null, 'User deleted successfully');
    } catch (error) {
      if (error.message === 'User not found') {
        return errorResponse(res, error.message, 404);
      }
      next(error);
    }
  }

  /**
   * Get user addresses
   */
  async getUserAddresses(req, res, next) {
    try {
      const { id } = req.params;
      
      const addresses = await userService.getUserAddresses(id);
      
      return successResponse(res, addresses, 'Addresses retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add user address
   */
  async addUserAddress(req, res, next) {
    try {
      const { id } = req.params;
      const addressData = req.body;
      
      const address = await userService.addUserAddress(id, addressData);
      
      return successResponse(res, address, 'Address added successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user address
   */
  async updateUserAddress(req, res, next) {
    try {
      const { id, addressId } = req.params;
      const addressData = req.body;
      
      const address = await userService.updateUserAddress(addressId, id, addressData);
      
      return successResponse(res, address, 'Address updated successfully');
    } catch (error) {
      if (error.message === 'Address not found') {
        return errorResponse(res, error.message, 404);
      }
      next(error);
    }
  }

  /**
   * Delete user address
   */
  async deleteUserAddress(req, res, next) {
    try {
      const { id, addressId } = req.params;
      
      await userService.deleteUserAddress(addressId, id);
      
      return successResponse(res, null, 'Address deleted successfully');
    } catch (error) {
      if (error.message === 'Address not found') {
        return errorResponse(res, error.message, 404);
      }
      next(error);
    }
  }

  /**
   * ⭐ NEW: Get membership info untuk user yang login
   * Route: GET /api/users/me/membership
   */
  async getMembershipInfo(req, res, next) {
    try {
      const userId = req.user.id;
      
      // Get user data
      const user = await User.findByPk(userId, {
        attributes: ['id', 'nickname', 'email', 'full_name', 'membership_points']
      });
      
      if (!user) {
        return errorResponse(res, 'User not found', 404);
      }
      
      // Get all completed orders
      const orders = await Order.findAll({
        where: { 
          user_id: userId,
          status: { [Op.in]: ['PAID', 'SHIPPED', 'DELIVERED', 'COMPLETED'] }
        },
        attributes: ['id', 'total_amount', 'status', 'created_at'],
        order: [['created_at', 'DESC']]
      });
      
      // Calculate total spent
      const totalSpent = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);
      
      // Get membership points (use database value)
      const points = user.membership_points || 0;
      
      // Determine tier based on points
      let tier = 'Bronze';
      let tierIcon = 'Crown';
      let nextTier = 'Silver';
      let nextTierPoints = 10000;
      let tierColor = 'from-orange-600 to-orange-400';
      let progress = 0;
      
      if (points >= 100000) {
        tier = 'Platinum';
        tierIcon = 'Zap';
        nextTier = 'Platinum (Max)';
        nextTierPoints = points; // Already at max
        tierColor = 'from-purple-600 to-pink-500';
        progress = 100;
      } else if (points >= 50000) {
        tier = 'Gold';
        tierIcon = 'Gift';
        nextTier = 'Platinum';
        nextTierPoints = 100000;
        tierColor = 'from-yellow-500 to-yellow-300';
        progress = Math.floor(((points - 50000) / (100000 - 50000)) * 100);
      } else if (points >= 10000) {
        tier = 'Silver';
        tierIcon = 'Star';
        nextTier = 'Gold';
        nextTierPoints = 50000;
        tierColor = 'from-gray-400 to-gray-200';
        progress = Math.floor(((points - 10000) / (50000 - 10000)) * 100);
      } else {
        // Bronze
        progress = Math.floor((points / 10000) * 100);
      }
      
      // Calculate points needed for next tier
      const pointsToNextTier = Math.max(0, nextTierPoints - points);
      
      // Get tier benefits
      const benefits = this.getTierBenefits(tier);
      
      return successResponse(res, {
        user: {
          id: user.id,
          nickname: user.nickname,
          email: user.email,
          full_name: user.full_name
        },
        membership: {
          points: points,
          tier: tier,
          tierIcon: tierIcon,
          tierColor: tierColor,
          nextTier: nextTier,
          pointsToNextTier: pointsToNextTier,
          progress: progress,
          benefits: benefits
        },
        stats: {
          totalSpent: totalSpent,
          totalOrders: orders.length,
          recentOrders: orders.slice(0, 5).map(order => ({
            id: order.id,
            amount: Number(order.total_amount),
            status: order.status,
            pointsEarned: Math.floor(Number(order.total_amount) / 1000),
            date: order.created_at
          }))
        }
      }, 'Membership info retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * ⭐ Helper: Get tier benefits
   */
  getTierBenefits(tier) {
    const benefitsMap = {
      'Bronze': {
        discount: '5%',
        vouchers: 'Rp 10,000',
        shipping: 'Standard',
        earlyAccess: false,
        specialGifts: false
      },
      'Silver': {
        discount: '10%',
        vouchers: 'Rp 25,000',
        shipping: 'Gratis di atas Rp 100K',
        earlyAccess: true,
        specialGifts: false
      },
      'Gold': {
        discount: '15%',
        vouchers: 'Rp 50,000',
        shipping: 'Gratis semua pembelian',
        earlyAccess: true,
        specialGifts: true
      },
      'Platinum': {
        discount: '20%',
        vouchers: 'Rp 100,000',
        shipping: 'Gratis + Priority',
        earlyAccess: true,
        specialGifts: true
      }
    };
    
    return benefitsMap[tier] || benefitsMap['Bronze'];
  }
}

module.exports = new UserController();