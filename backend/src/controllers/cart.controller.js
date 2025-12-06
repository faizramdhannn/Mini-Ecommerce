const cartService = require('../services/cart.service');
const { successResponse, errorResponse } = require('../utils/response');

class CartController {
  /**
   * Get cart
   */
  async getCart(req, res, next) {
    try {
      const userId = req.user.id;
      const cart = await cartService.getOrCreateCart(userId);
      
      return successResponse(res, cart, 'Cart retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add item to cart
   */
  async addItem(req, res, next) {
    try {
      const userId = req.user.id;
      const { product_id, quantity } = req.body;
      
      const cart = await cartService.addItem(userId, product_id, quantity);
      
      return successResponse(res, cart, 'Item added to cart successfully');
    } catch (error) {
      if (error.message.includes('not found') || error.message.includes('stock')) {
        return errorResponse(res, error.message, 400);
      }
      next(error);
    }
  }

  /**
   * Update cart item
   */
  async updateItem(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { quantity } = req.body;
      
      const cart = await cartService.updateItem(userId, id, quantity);
      
      return successResponse(res, cart, 'Cart item updated successfully');
    } catch (error) {
      if (error.message.includes('not found') || error.message.includes('stock')) {
        return errorResponse(res, error.message, 400);
      }
      next(error);
    }
  }

  /**
   * Remove item from cart
   */
  async removeItem(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      
      const cart = await cartService.removeItem(userId, id);
      
      return successResponse(res, cart, 'Item removed from cart successfully');
    } catch (error) {
      if (error.message === 'Cart item not found') {
        return errorResponse(res, error.message, 404);
      }
      next(error);
    }
  }

  /**
   * Clear cart
   */
  async clearCart(req, res, next) {
    try {
      const userId = req.user.id;
      const cart = await cartService.clearCart(userId);
      
      return successResponse(res, cart, 'Cart cleared successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CartController();