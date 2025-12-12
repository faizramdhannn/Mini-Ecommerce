'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Zap } from 'lucide-react';
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
  
  // Calculate discount percentage
  const discountPercentage = product.compare_at_price 
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  return (
    <Link href={`/products/${getProductSlug()}`} className="group block h-full">
      <div className="bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-100 h-full flex flex-col relative">
        
        {/* Flash Sale Badge */}
        {product.is_flash_sale && (
          <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-red-600 to-orange-600 text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs font-bold shadow-lg">
            <Zap className="w-3 h-3 fill-current" />
            FLASH SALE
          </div>
        )}

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-2 right-2 z-10 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
            -{discountPercentage}%
          </div>
        )}

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

          {/* Price Section */}
          <div className="mt-auto pt-2">
            <div className="mb-2">
              {/* Compare At Price (Strikethrough) */}
              {product.compare_at_price && product.compare_at_price > product.price && (
                <div className="text-xs text-gray-400 line-through">
                  {formatCurrency(product.compare_at_price)}
                </div>
              )}
              
              {/* Current Price */}
              <div className={`font-bold ${
                product.compare_at_price ? 'text-red-600 text-lg sm:text-xl' : 'text-gray-900 text-base sm:text-lg'
              }`}>
                {formatCurrency(product.price)}
              </div>
            </div>

            {/* Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full flex items-center justify-center gap-2 p-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
              aria-label="Add to cart"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};