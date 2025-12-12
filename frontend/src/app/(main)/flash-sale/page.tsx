'use client';

import { useEffect, useState } from 'react';
import { Zap, Clock } from 'lucide-react';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Spinner } from '@/components/ui/Spinner';
import { productService } from '@/lib/services/product.service';
import type { Product } from '@/types';

export default function FlashSalePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    loadFlashSaleProducts();
    
    // Countdown timer
    const flashSaleEnd = new Date();
    flashSaleEnd.setHours(23, 59, 59, 999);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = flashSaleEnd.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const loadFlashSaleProducts = async () => {
    try {
      // Filter products dengan is_flash_sale = true dan diskon >= 30%
      const response = await productService.getProducts({ limit: 100 });
      
      const flashSaleProducts = response.data.filter(product => {
        const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
        if (!hasDiscount) return false;
        
        const discountPercentage = Math.round(
          ((product.compare_at_price! - product.price) / product.compare_at_price!) * 100
        );
        
        return discountPercentage >= 30; // Diskon minimal 30%
      });

      // Sort by discount percentage (highest first)
      flashSaleProducts.sort((a, b) => {
        const discountA = a.compare_at_price 
          ? ((a.compare_at_price - a.price) / a.compare_at_price) * 100 
          : 0;
        const discountB = b.compare_at_price 
          ? ((b.compare_at_price - b.price) / b.compare_at_price) * 100 
          : 0;
        return discountB - discountA;
      });

      setProducts(flashSaleProducts);
    } catch (error) {
      console.error('Failed to load flash sale products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 text-white px-6 py-3 rounded-full mb-4">
            <Zap className="w-6 h-6 fill-current animate-pulse" />
            <span className="text-2xl font-bold">FLASH SALE</span>
            <Zap className="w-6 h-6 fill-current animate-pulse" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Diskon Hingga 70%! ⚡
          </h1>
          <p className="text-gray-400 text-lg mb-6">
            Buruan! Penawaran terbatas, selagi stok masih ada
          </p>

          {/* Countdown */}
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-4">
            <Clock className="w-6 h-6 text-red-500" />
            <div className="flex items-center gap-2">
              <div className="text-center">
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg font-bold text-2xl min-w-[60px]">
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <div className="text-xs text-gray-400 mt-1">JAM</div>
              </div>
              <span className="text-2xl font-bold">:</span>
              <div className="text-center">
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg font-bold text-2xl min-w-[60px]">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <div className="text-xs text-gray-400 mt-1">MENIT</div>
              </div>
              <span className="text-2xl font-bold">:</span>
              <div className="text-center">
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg font-bold text-2xl min-w-[60px]">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
                <div className="text-xs text-gray-400 mt-1">DETIK</div>
              </div>
            </div>
          </div>
        </div>

        {/* Products */}
        {isLoading ? (
          <div className="py-12">
            <Spinner size="lg" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              Belum ada produk flash sale saat ini
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 text-center">
              <p className="text-gray-300">
                Menampilkan <span className="font-bold text-white">{products.length}</span> produk dengan diskon besar
              </p>
            </div>
            <ProductGrid products={products} />
          </>
        )}
      </div>
    </div>
  );
}