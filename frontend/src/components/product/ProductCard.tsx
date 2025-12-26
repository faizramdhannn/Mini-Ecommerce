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
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);

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
      // Trigger animation
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 800);

      await addItem(product.id, 1);
      toast.success('Added to cart!');
      
      // ⭐ FEATURE: Auto-open cart drawer
      setTimeout(() => {
        window.dispatchEvent(new Event('open-cart'));
      }, 300);
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const imageUrl = product.media?.[0]?.url || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect fill="%23e5e7eb" width="100" height="100"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
  
  // Calculate discount percentage
  const discountPercentage = product.compare_at_price 
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  // Determine if this is a flash sale item (discount >= 30%)
  const isFlashSale = discountPercentage >= 30;

  // Calculate sold count (simulate 30-70% sold)
  const soldPercentage = Math.floor(Math.random() * 40) + 30;
  const soldCount = Math.floor(product.stock * soldPercentage / 100);

  return (
    <Link href={`/products/${getProductSlug()}`} className="group block h-full">
      <div className="bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-100 h-full flex flex-col relative">
        
        {/* Flash Sale Badge - only show if discount >= 30% */}
        {isFlashSale && (
          <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-red-600 to-orange-600 text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs font-bold shadow-lg animate-pulse">
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

        {/* Image with animation */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
              isAnimating ? 'animate-fly-to-cart' : ''
            }`}
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

          {/* ⭐ FEATURE: Rating Display - Above sold count */}
          {product.rating && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-sm ${
                      i < Math.floor(product.rating!)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-600">({product.rating})</span>
            </div>
          )}

          {/* Sold Count */}
          {soldCount > 0 && (
            <p className="text-xs text-gray-500 mb-2">
              🔥 Terjual {soldCount}+
            </p>
          )}

          {/* Price Section */}
          <div className="mt-auto pt-2">
            <div className="mb-2">
              {/* Compare At Price (Strikethrough) */}
              {product.compare_at_price && product.compare_at_price > product.price && (
                <div className="text-xs text-gray-400 line-through">
                  {formatCurrency(product.compare_at_price)}
                </div>
              )}
              
              {/* Current Price - Red for flash sale, black for normal */}
              <div className={`font-bold ${
                isFlashSale 
                  ? 'text-red-600 text-lg sm:text-xl' 
                  : 'text-gray-900 text-base sm:text-lg'
              }`}>
                {formatCurrency(product.price)}
              </div>
            </div>

            {/* Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`w-full flex items-center justify-center gap-2 p-2 rounded-lg transition-all text-sm ${
                isFlashSale
                  ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700'
                  : 'bg-black text-white hover:bg-gray-800'
              } disabled:bg-gray-300 disabled:cursor-not-allowed ${
                isAnimating ? 'scale-95' : ''
              }`}
              aria-label="Add to cart"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes flyToCart {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(0.8);
          }
          100% {
            transform: scale(1) translateX(100vw) translateY(-100vh);
            opacity: 0;
          }
        }

        :global(.animate-fly-to-cart) {
          animation: flyToCart 0.8s ease-in-out;
        }
      `}</style>
    </Link>
  );
};