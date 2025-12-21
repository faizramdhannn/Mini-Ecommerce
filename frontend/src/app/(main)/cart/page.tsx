'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Check } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth.store';
import { cartService } from '@/lib/services/cart.service';
import type { Cart, CartItem } from '@/types';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [isUpdating, setIsUpdating] = useState<number | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/cart');
      return;
    }
    fetchCart();
  }, [user, router]);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const data = await cartService.getCart();
      setCart(data);
      
      // Auto-select all items by default
      if (data.items && data.items.length > 0) {
        const allItemIds = new Set(data.items.map((item: CartItem) => item.id));
        setSelectedItems(allItemIds);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectItem = (itemId: number) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
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
      const allItemIds = new Set(cart.items.map((item: CartItem) => item.id));
      setSelectedItems(allItemIds);
    }
  };

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      setIsUpdating(itemId);
      await cartService.updateCartItem(itemId, newQuantity);
      await fetchCart();
      toast.success('Cart updated');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update cart');
    } finally {
      setIsUpdating(null);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    if (!confirm('Remove this item from cart?')) return;

    try {
      await cartService.removeCartItem(itemId);
      
      // Remove from selection
      setSelectedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
      
      await fetchCart();
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.size === 0) {
      toast.error('Please select items to delete');
      return;
    }

    if (!confirm(`Delete ${selectedItems.size} selected item(s)?`)) return;

    try {
      // Convert Set to Array for iteration
      const selectedArray = Array.from(selectedItems);
      
      // Delete all selected items
      for (const itemId of selectedArray) {
        await cartService.removeCartItem(itemId);
      }
      
      setSelectedItems(new Set());
      await fetchCart();
      toast.success(`${selectedArray.length} item(s) deleted`);
    } catch (error) {
      toast.error('Failed to delete items');
    }
  };

  const handleClearCart = async () => {
    if (!confirm('Clear all items from cart?')) return;

    try {
      await cartService.clearCart();
      setSelectedItems(new Set());
      await fetchCart();
      toast.success('Cart cleared');
    } catch (error) {
      toast.error('Failed to clear cart');
    }
  };

  // Calculate totals for selected items only
  const calculateSelectedTotals = () => {
    if (!cart?.items) return { subtotal: 0, count: 0, totalItems: 0 };

    const selectedCartItems = cart.items.filter((item: CartItem) => selectedItems.has(item.id));
    
    const subtotal = selectedCartItems.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    return {
      subtotal,
      count: selectedCartItems.length,
      totalItems: selectedCartItems.reduce((sum, item) => sum + item.quantity, 0)
    };
  };

  const selectedTotals = calculateSelectedTotals();
  const shippingCost = selectedTotals.count > 0 ? 20000 : 0;
  const total = selectedTotals.subtotal + shippingCost;

  const handleCheckout = () => {
    if (selectedItems.size === 0) {
      toast.error('Please select items to checkout');
      return;
    }

    // Get selected items data
    const selectedCartItems = cart?.items?.filter((item: CartItem) => selectedItems.has(item.id)) || [];
    
    // Store selected items in sessionStorage for checkout
    sessionStorage.setItem('checkoutItems', JSON.stringify(selectedCartItems));
    
    router.push('/checkout');
  };

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Start adding products to your cart!</p>
          <Link
            href="/products"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Select All & Bulk Actions */}
            <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleSelectAll}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    selectedItems.size === cart.items.length
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-gray-300 hover:border-blue-600'
                  }`}
                >
                  {selectedItems.size === cart.items.length && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </button>
                <span className="font-medium text-gray-900">
                  Select All ({cart.items.length})
                </span>
                {selectedItems.size > 0 && (
                  <span className="text-sm text-gray-600">
                    ({selectedItems.size} selected)
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                {selectedItems.size > 0 && (
                  <button
                    onClick={handleDeleteSelected}
                    className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Selected</span>
                  </button>
                )}
                <button
                  onClick={handleClearCart}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Cart Items List */}
            {cart.items.map((item: CartItem) => (
              <div
                key={item.id}
                className={`bg-white rounded-lg shadow-sm p-4 transition-all ${
                  selectedItems.has(item.id) ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Checkbox */}
                  <button
                    onClick={() => handleSelectItem(item.id)}
                    className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      selectedItems.has(item.id)
                        ? 'bg-blue-600 border-blue-600'
                        : 'border-gray-300 hover:border-blue-600'
                    }`}
                  >
                    {selectedItems.has(item.id) && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </button>

                  {/* Product Image */}
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={item.product.media?.[0]?.url || '/placeholder-product.png'}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="font-semibold text-gray-900 hover:text-blue-600 line-clamp-2"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-gray-600 mt-1">
                      {item.product.brand?.name} • {item.product.category?.name}
                    </p>
                    <p className="text-lg font-bold text-gray-900 mt-2">
                      Rp {item.product.price.toLocaleString('id-ID')}
                    </p>
                    <p className="text-sm text-gray-500">
                      Stock: {item.product.stock} available
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end space-y-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || isUpdating === item.id}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-medium">
                        {isUpdating === item.id ? '...' : item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock || isUpdating === item.id}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-600 hover:text-red-700 flex items-center space-x-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm">Remove</span>
                    </button>

                    <div className="text-right">
                      <p className="text-sm text-gray-600">Subtotal</p>
                      <p className="text-lg font-bold text-gray-900">
                        Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

              {selectedItems.size > 0 ? (
                <>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Selected Items ({selectedTotals.count})</span>
                      <span>{selectedTotals.totalItems} pcs</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>Rp {selectedTotals.subtotal.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span>Rp {shippingCost.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">Total</span>
                        <span className="text-xl font-bold text-blue-600">
                          Rp {total.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No items selected</p>
                  <p className="text-sm text-gray-500">
                    Select items to see checkout summary
                  </p>
                </div>
              )}

              <Link
                href="/products"
                className="block w-full text-center mt-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </Link>

              {/* Shopping Benefits */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Free shipping for orders over Rp 500,000</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Official warranty included</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Secure payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}