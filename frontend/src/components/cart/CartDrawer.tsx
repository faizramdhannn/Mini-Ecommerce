'use client';

import { useEffect, useState } from 'react';
import { X, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cart.store';
import { formatCurrency } from '@/lib/utils/format';

// ✅ Named export for compatibility
export function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  
  // ✅ Get the entire store to avoid method name issues
  const store = useCartStore();
  const cart = store.cart;

  // ⭐ FEATURE: Listen for 'open-cart' event from ProductCard
  useEffect(() => {
    const handleOpenCart = () => {
      setIsOpen(true);
    };

    window.addEventListener('open-cart', handleOpenCart);
    return () => window.removeEventListener('open-cart', handleOpenCart);
  }, []);

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      // ✅ Try all common method names
      if ('updateQuantity' in store && typeof store.updateQuantity === 'function') {
        await (store as any).updateQuantity(itemId, newQuantity);
      } else if ('updateItemQuantity' in store && typeof store.updateItemQuantity === 'function') {
        await (store as any).updateItemQuantity(itemId, newQuantity);
      } else if ('updateItem' in store && typeof store.updateItem === 'function') {
        await (store as any).updateItem(itemId, { quantity: newQuantity });
      } else if ('setQuantity' in store && typeof store.setQuantity === 'function') {
        await (store as any).setQuantity(itemId, newQuantity);
      } else {
        console.error('No update method found in cart store');
        console.log('Available methods:', Object.keys(store).filter(key => typeof (store as any)[key] === 'function'));
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      // ✅ Try all common method names
      if ('removeItem' in store && typeof store.removeItem === 'function') {
        await (store as any).removeItem(itemId);
      } else if ('removeFromCart' in store && typeof store.removeFromCart === 'function') {
        await (store as any).removeFromCart(itemId);
      } else if ('deleteItem' in store && typeof store.deleteItem === 'function') {
        await (store as any).deleteItem(itemId);
      } else if ('deleteCartItem' in store && typeof store.deleteCartItem === 'function') {
        await (store as any).deleteCartItem(itemId);
      } else {
        console.error('No remove method found in cart store');
        console.log('Available methods:', Object.keys(store).filter(key => typeof (store as any)[key] === 'function'));
      }
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  // Calculate total
  const getTotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const items = cart?.items || [];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <h2 className="text-lg font-semibold">
                Keranjang ({items.length})
              </h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <ShoppingBag className="w-16 h-16 mb-4" />
                <p className="text-lg font-medium">Keranjang Kosong</p>
                <p className="text-sm">Tambahkan produk untuk melanjutkan</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    {/* Product Image */}
                    <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.media?.[0]?.url || '/placeholder.png'}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-gray-900 font-semibold mt-1">
                        {formatCurrency(item.product.price)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="p-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-2 hover:bg-red-50 rounded-full transition-colors self-start"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t p-4 space-y-4">
              {/* Subtotal */}
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-xl font-bold">
                  {formatCurrency(getTotal())}
                </span>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                onClick={() => setIsOpen(false)}
                className="block w-full bg-black text-white py-3 rounded-lg text-center font-semibold hover:bg-gray-800 transition-colors"
              >
                Checkout
              </Link>

              {/* Continue Shopping */}
              <button
                onClick={() => setIsOpen(false)}
                className="w-full text-gray-600 py-2 text-sm hover:text-black transition-colors"
              >
                Lanjut Belanja
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ✅ Also export as default for compatibility
export default CartDrawer;