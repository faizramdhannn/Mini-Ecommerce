'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem as CartItemType } from '@/types';
import { formatCurrency } from '@/lib/utils/format';
import { useCartStore } from '@/lib/store/cart.store';
import toast from 'react-hot-toast';

interface CartItemProps {
  item: CartItemType;
  isSelected?: boolean;
  onSelectChange?: (checked: boolean) => void;
}

export const CartItem = ({ item, isSelected = false, onSelectChange }: CartItemProps) => {
  const { updateItem, removeItem } = useCartStore();

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > item.product.stock) {
      toast.error('Not enough stock available');
      return;
    }

    try {
      await updateItem(item.id, newQuantity);
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const handleRemove = async () => {
    try {
      await removeItem(item.id);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  // Helper function to get product image with proper fallback
  const getProductImage = () => {
    // Check multiple possible locations
    if (item.product?.media?.[0]?.url) {
      return item.product.media[0].url;
    }
    if (item.product?.media) {
      return item.product.media[0].url;
    }
    
    // Fallback to inline SVG (no external file needed)
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect fill="%23e5e7eb" width="100" height="100"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
  };

  const imageUrl = getProductImage();

  return (
    <div className={`flex gap-3 p-3 rounded-lg border-2 transition-colors ${
      isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
    }`}>
      {/* Checkbox */}
      {onSelectChange && (
        <div className="flex-shrink-0 pt-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelectChange(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
        </div>
      )}

      {/* Image */}
      <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={imageUrl}
          alt={item.product.name}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm text-black line-clamp-2 mb-1">
          {item.product.name}
        </h3>
        <p className="text-sm text-gray-500 mb-2">
          {formatCurrency(item.product.price)}
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleUpdateQuantity(item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="p-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="w-3 h-3 text-gray-700" />
          </button>
          <span className="text-sm text-black font-medium w-8 text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => handleUpdateQuantity(item.quantity + 1)}
            disabled={item.quantity >= item.product.stock}
            className="p-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-3 h-3 text-gray-700" />
          </button>
        </div>

        {/* Stock warning */}
        {item.quantity >= item.product.stock && (
          <p className="text-xs text-orange-600 mt-1">Max stock reached</p>
        )}
      </div>

      {/* Remove & Price */}
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={handleRemove}
          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
          title="Remove item"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </button>
        
        <div className="text-right">
          <p className="text-xs text-gray-500">Subtotal</p>
          <p className="text-sm font-bold text-black">
            {formatCurrency(item.product.price * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  );
};