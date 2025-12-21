import api from './api';
import type { Cart } from '@/types';

export const cartService = {
  /**
   * Get cart
   */
  async getCart(): Promise<Cart> {
    const response = await api.get('/cart');
    return response.data.data;
  },

  /**
   * Add item to cart
   */
  async addToCart(productId: number, quantity: number = 1): Promise<Cart> {
    const response = await api.post('/cart/items', {
      product_id: productId,
      quantity
    });
    return response.data.data;
  },

  /**
   * Update cart item quantity
   */
  async updateCartItem(cartItemId: number, quantity: number): Promise<Cart> {
    const response = await api.put(`/cart/items/${cartItemId}`, {
      quantity
    });
    return response.data.data;
  },

  /**
   * Remove item from cart
   */
  async removeCartItem(cartItemId: number): Promise<Cart> {
    const response = await api.delete(`/cart/items/${cartItemId}`);
    return response.data.data;
  },

  /**
   * Clear entire cart
   */
  async clearCart(): Promise<Cart> {
    const response = await api.delete('/cart/clear');
    return response.data.data;
  }
};