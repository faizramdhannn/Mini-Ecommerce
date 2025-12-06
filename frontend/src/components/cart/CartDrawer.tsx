'use client';

import { useEffect } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart.store';
import { CartItem } from './CartItem';
import { Button } from '../ui/Button';
import { formatCurrency } from '@/lib/utils/format';
import { SHIPPING_COST } from '@/lib/utils/constants';
import { useRouter } from 'next/navigation';
import type { CartItem as CartItemType } from '@/types';

export const CartDrawer = () => {
  const { cart, isOpen, closeCart, fetchCart } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      fetchCart();
    }
  }, [isOpen, fetchCart]);

  const subtotal = cart?.items?.reduce(
    (sum: number, item: CartItemType) => sum + item.product.price * item.quantity,
    0
  ) || 0;

  const total = subtotal + SHIPPING_COST;

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl text-black font-semibold flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Shopping Cart
          </h2>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {!cart?.items || cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item: CartItemType) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart?.items && cart.items.length > 0 && (
          <div className="border-t p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-black">Subtotal</span>
                <span className="font-medium text-black">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-black">Shipping</span>
                <span className="font-medium text-black">{formatCurrency(SHIPPING_COST)}</span>
              </div>
              <div className="flex justify-between text-black text-lg font-bold border-t pt-2">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <Button fullWidth onClick={handleCheckout}>
              Checkout
            </Button>
          </div>
        )}
      </div>
    </>
  );
};