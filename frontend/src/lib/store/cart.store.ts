import { create } from 'zustand';
import apiClient from '../api/client';
import { API_ENDPOINTS } from '../api/endpoint';
import type { Cart, CartItem } from '@/types';

interface CartState {
  cart: Cart | null;
  isOpen: boolean;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (productId: number, quantity: number) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
  itemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  isOpen: false,
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get<{ data: Cart }>(API_ENDPOINTS.CART.GET);
      set({ cart: response.data.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to fetch cart:', error);
    }
  },

  addItem: async (productId, quantity) => {
    try {
      const response = await apiClient.post<{ data: Cart }>(
        API_ENDPOINTS.CART.ADD_ITEM,
        { product_id: productId, quantity }
      );
      set({ cart: response.data.data });
    } catch (error) {
      throw error;
    }
  },

  updateItem: async (itemId, quantity) => {
    try {
      const response = await apiClient.put<{ data: Cart }>(
        API_ENDPOINTS.CART.UPDATE_ITEM(itemId),
        { quantity }
      );
      set({ cart: response.data.data });
    } catch (error) {
      throw error;
    }
  },

  removeItem: async (itemId) => {
    try {
      const response = await apiClient.delete<{ data: Cart }>(
        API_ENDPOINTS.CART.REMOVE_ITEM(itemId)
      );
      set({ cart: response.data.data });
    } catch (error) {
      throw error;
    }
  },

  clearCart: async () => {
    try {
      const response = await apiClient.delete<{ data: Cart }>(API_ENDPOINTS.CART.CLEAR);
      set({ cart: response.data.data });
    } catch (error) {
      throw error;
    }
  },

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  
  itemCount: () => {
    const { cart } = get();
    return cart?.items?.reduce((sum: number, item: CartItem) => sum + item.quantity, 0) || 0;
  },
}));