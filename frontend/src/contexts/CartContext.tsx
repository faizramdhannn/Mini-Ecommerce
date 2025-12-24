'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Product } from '@/types';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  variant?: {
    id: string;
    name: string;
    value: string;
  };
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, variant?: any) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        setItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save cart:', error);
    }
  }, [items]);

  const addItem = (product: Product, quantity: number = 1, variant?: any) => {
    setItems(currentItems => {
      // Check if item already exists
      const existingItemIndex = currentItems.findIndex(
        item => item.product.id === product.id && 
        (!variant || item.variant?.id === variant?.id)
      );

      if (existingItemIndex > -1) {
        // Update quantity of existing item
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Add new item
        const newItem: CartItem = {
          id: `${product.id}-${variant?.id || 'default'}-${Date.now()}`,
          product,
          quantity,
          variant,
        };
        return [...currentItems, newItem];
      }
    });
  };

  const removeItem = (itemId: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}