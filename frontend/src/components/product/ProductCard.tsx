'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '@/types';
import { formatCurrency } from '@/lib/utils/format';
import { useCartStore } from '@/lib/store/cart.store';
import { useAuthStore } from '@/lib/store/auth.store';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  // Generate slug dari product name jika tidak ada slug
  const getProductSlug = () => {
    if (product.slug) return product.slug;
    return product.name.toLowerCase().replace(/\s+/g, '-');
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      router.push('/login');
      return;
    }

    try {
      await addItem(product.id, 1);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const imageUrl = product.media?.[0]?.url || '/images/placeholder.png';

  return (
    <Link href={`/products/${getProductSlug()}`} className="group block h-full">
      <div className="bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-100 h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white text-xs sm:text-sm font-semibold">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3 sm:p-4 flex flex-col flex-1">
          {/* Category */}
          <div className="h-5 mb-1">
            {product.category && (
              <p className="text-xs text-gray-500 truncate">
                {product.category.name}
              </p>
            )}
          </div>

          {/* Product Name */}
          <h3 className="font-medium text-gray-900 group-hover:text-gray-600 transition-colors text-sm sm:text-base mb-2 line-clamp-2 h-10 sm:h-12">
            {product.name}
          </h3>

          {/* Price & Cart */}
          <div className="flex items-center justify-between mt-auto pt-2">
            <span className="text-base sm:text-lg font-bold text-gray-900">
              {formatCurrency(product.price)}
            </span>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="p-1.5 sm:p-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex-shrink-0"
              aria-label="Add to cart"
            >
              <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};