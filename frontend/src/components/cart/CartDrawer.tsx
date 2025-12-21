'use client';

import { useEffect, useState } from 'react';
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
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (isOpen) {
      fetchCart();
    }
  }, [isOpen, fetchCart]);

  // Auto-select all items when cart loads
  useEffect(() => {
    if (cart?.items && cart.items.length > 0) {
      const allItemIds = new Set(cart.items.map((item: CartItemType) => item.id));
      setSelectedItems(allItemIds);
    }
  }, [cart?.items]);

  const handleSelectItem = (itemId: number, checked: boolean) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(itemId);
      } else {
        newSet.delete(itemId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (!cart?.items) return;
    
    if (selectedItems.size === cart.items.length) {
      // Deselect all
      setSelectedItems(new Set());
    } else {
      // Select all
      const allItemIds = new Set(cart.items.map((item: CartItemType) => item.id));
      setSelectedItems(allItemIds);
    }
  };

  // Calculate totals for selected items only
  const calculateSelectedTotals = () => {
    if (!cart?.items) return { subtotal: 0, count: 0 };

    const selectedCartItems = cart.items.filter((item: CartItemType) => 
      selectedItems.has(item.id)
    );
    
    const subtotal = selectedCartItems.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    return {
      subtotal,
      count: selectedCartItems.length,
    };
  };

  const selectedTotals = calculateSelectedTotals();
  const total = selectedTotals.subtotal + (selectedTotals.count > 0 ? SHIPPING_COST : 0);

  const handleCheckout = () => {
    if (selectedItems.size === 0) {
      alert('Please select at least one item to checkout');
      return;
    }

    // Get selected items data
    const selectedCartItems = cart?.items?.filter((item: CartItemType) => 
      selectedItems.has(item.id)
    ) || [];
    
    // Store selected items in sessionStorage for checkout
    sessionStorage.setItem('checkoutItems', JSON.stringify(selectedCartItems));
    
    closeCart();
    router.push('/checkout');
  };

  if (!isOpen) return null;

  const allSelected = cart?.items && selectedItems.size === cart.items.length && cart.items.length > 0;

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

        {/* Select All Section */}
        {cart?.items && cart.items.length > 0 && (
          <div className="px-6 py-3 border-b bg-gray-50 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Select All ({cart.items.length} items)
              </span>
            </label>
            {selectedItems.size > 0 && (
              <span className="text-xs text-gray-500">
                {selectedItems.size} selected
              </span>
            )}
          </div>
        )}

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
                <CartItem 
                  key={item.id} 
                  item={item}
                  isSelected={selectedItems.has(item.id)}
                  onSelectChange={(checked) => handleSelectItem(item.id, checked)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart?.items && cart.items.length > 0 && (
          <div className="border-t p-6 space-y-4">
            {selectedItems.size > 0 ? (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Selected ({selectedTotals.count} items)
                    </span>
                    <span className="font-medium text-black">
                      {formatCurrency(selectedTotals.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-black">
                      {formatCurrency(SHIPPING_COST)}
                    </span>
                  </div>
                  <div className="flex justify-between text-black text-lg font-bold border-t pt-2">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>

                <Button fullWidth onClick={handleCheckout}>
                  Checkout ({selectedItems.size} items)
                </Button>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm mb-2">
                  No items selected
                </p>
                <p className="text-gray-400 text-xs">
                  Select items to proceed to checkout
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};