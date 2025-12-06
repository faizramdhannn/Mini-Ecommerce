'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem as CartItemType } from '@/types';
import { formatCurrency } from '@/lib/utils/format';
import { useCartStore } from '@/lib/store/cart.store';
import toast from 'react-hot-toast';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem = ({ item }: CartItemProps) => {
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

  const imageUrl = item.product.media?.[0]?.url || '/images/placeholder.png';

  return (
    <div className="flex gap-4">
      {/* Image */}
      <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={imageUrl}
          alt={item.product.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm text-black line-clamp-2">
          {item.product.name}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {formatCurrency(item.product.price)}
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center text-white gap-2 mt-2">
          <button
            onClick={() => handleUpdateQuantity(item.quantity - 1)}
            className="p-1 bg-black hover:bg-gray-100 hover:text-black rounded"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-sm text-black font-medium w-8 text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => handleUpdateQuantity(item.quantity + 1)}
            className="p-1 bg-black hover:bg-gray-100 hover:text-black rounded"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Remove */}
      <button
        onClick={handleRemove}
        className="p-2 hover:bg-gray-300 rounded-lg transition-colors h-fit"
      >
        <Trash2 className="w-4 h-4 text-red-500" />
      </button>
    </div>
  );
};