'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cartService } from '@/lib/services/cart.service';
import type { Cart } from '@/types';
import { toast } from 'react-hot-toast';

export const CartDrawer = () => {
  // ⭐ Local state untuk drawer (karena cart.store belum punya isCartOpen)
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());

  // Fetch cart data
  const fetchCart = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await cartService.getCart();
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch cart when drawer opens
  useEffect(() => {
    if (isOpen) {
      fetchCart();
    }
  }, [isOpen, fetchCart]);

  // ⭐ Listen for global cart events
  useEffect(() => {
    const handleCartUpdate = () => {
      fetchCart();
    };

    const handleOpenCart = () => {
      setIsOpen(true);
    };

    const handleToggleCart = () => {
      setIsOpen(prev => !prev);
    };

    window.addEventListener('cart-updated', handleCartUpdate);
    window.addEventListener('open-cart', handleOpenCart);
    window.addEventListener('toggle-cart', handleToggleCart);

    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
      window.removeEventListener('open-cart', handleOpenCart);
      window.removeEventListener('toggle-cart', handleToggleCart);
    };
  }, [fetchCart]);

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    setUpdatingItems(prev => new Set(prev).add(itemId));
    try {
      // ⭐ Fix: cartService.updateCartItem expects just quantity number
      await cartService.updateCartItem(itemId, newQuantity);
      await fetchCart();
      
      // Dispatch event untuk update cart count di header
      window.dispatchEvent(new Event('cart-updated'));
      
      toast.success('Cart updated');
    } catch (error) {
      toast.error('Failed to update cart');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const removeItem = async (itemId: number) => {
    setUpdatingItems(prev => new Set(prev).add(itemId));
    try {
      await cartService.removeCartItem(itemId);
      await fetchCart();
      
      // Dispatch event untuk update cart count di header
      window.dispatchEvent(new Event('cart-updated'));
      
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const calculateTotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const totalItems = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const total = calculateTotal();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5 text-gray-900" />
            <h2 className="text-lg font-bold text-gray-900">
              Keranjang ({totalItems})
            </h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-[calc(100%-4rem)]">
          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : !cart?.items || cart.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-600 mb-2">Keranjang Anda kosong</p>
                <p className="text-sm text-gray-400 mb-4">Mulai belanja sekarang!</p>
                <Link
                  href="/products"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Belanja Sekarang
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                    {/* Product Image */}
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={item.product.media?.[0]?.url || '/placeholder-product.png'}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                        {item.product.name}
                      </h3>
                      <p className="text-blue-600 font-bold text-sm mb-2">
                        Rp {item.product.price.toLocaleString('id-ID')}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || updatingItems.has(item.id)}
                            className="p-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={updatingItems.has(item.id)}
                            className="p-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={updatingItems.has(item.id)}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer - Total & Checkout */}
          {cart?.items && cart.items.length > 0 && (
            <div className="border-t border-gray-200 p-4 space-y-3 bg-white">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                <span className="text-xl font-bold text-gray-900">
                  Rp {total.toLocaleString('id-ID')}
                </span>
              </div>

              <Link
                href="/checkout"
                onClick={() => setIsOpen(false)}
                className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Checkout
              </Link>

              <Link
                href="/cart"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center text-blue-600 hover:text-blue-700 py-2"
              >
                Lihat Keranjang Lengkap
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};