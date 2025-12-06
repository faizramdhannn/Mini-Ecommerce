const userService = require('../services/user.service');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');

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
}

module.exports = new UserController();