// frontend/src/app/(main)/flash-sale/page.tsx - UPDATED VERSION
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Zap } from 'lucide-react';
import { productService } from '@/lib/services/product.service';
import { useAutoRefresh } from '@/lib/hooks/useAutoRefresh';
import type { Product } from '@/types';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function FlashSalePage() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [flashSaleProducts, setFlashSaleProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ⭐ Auto-refresh every 10 seconds
  const { refresh } = useAutoRefresh({
    interval: 10000, // 10 seconds
    enabled: true,
    onRefresh: loadFlashSaleProducts,
  });

  useEffect(() => {
    loadFlashSaleProducts();
  }, []);

  async function loadFlashSaleProducts() {
    try {
      setIsLoading(true);
      const response = await productService.getProducts({ 
        limit: 100,
        is_flash_sale: true
      });
      
      const flashSale = response.data.filter(product => product.is_flash_sale);

      flashSale.sort((a, b) => {
        const discountA = a.compare_at_price 
          ? ((a.compare_at_price - a.price) / a.compare_at_price) * 100 
          : 0;
        const discountB = b.compare_at_price 
          ? ((b.compare_at_price - b.price) / b.compare_at_price) * 100 
          : 0;
        return discountB - discountA;
      });

      const flashSaleWithStock = flashSale.map(product => {
        const actualRemaining = Math.min(product.stock, 10);
        const remainingStock = Math.floor(Math.random() * actualRemaining) + 1;
        
        return {
          ...product,
          flashSaleRemaining: remainingStock,
          flashSaleSold: product.stock - remainingStock
        };
      });

      setFlashSaleProducts(flashSaleWithStock);
    } catch (error) {
      console.error('Failed to load flash sale products:', error);
      setFlashSaleProducts([]);
    } finally {
      setIsLoading(false);
    }
  }

  // Countdown Timer
  useEffect(() => {
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

  const getProductSlug = (product: Product) => {
    return product.slug || product.name.toLowerCase().replace(/\s+/g, '-');
  };

  const calculateDiscount = (product: Product) => {
    if (!product.compare_at_price || product.compare_at_price <= product.price) return 0;
    return Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-600 via-red-500 to-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-white hover:text-gray-200 transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                  <Zap className="w-8 h-8 text-white fill-current animate-pulse" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">FLASH SALE</h1>
                  <p className="text-white/90 text-sm">Diskon hingga 70%!</p>
                </div>
              </div>
            </div>

            {/* Countdown */}
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
              <span className="text-white text-sm font-medium">Berakhir dalam:</span>
              <div className="flex items-center gap-1">
                <div className="text-center">
                  <div className="bg-white text-red-600 px-3 py-2 rounded-lg font-bold text-xl min-w-[50px]">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <div className="text-xs text-white mt-1">JAM</div>
                </div>
                <span className="text-white font-bold">:</span>
                <div className="text-center">
                  <div className="bg-white text-red-600 px-3 py-2 rounded-lg font-bold text-xl min-w-[50px]">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <div className="text-xs text-white mt-1">MENIT</div>
                </div>
                <span className="text-white font-bold">:</span>
                <div className="text-center">
                  <div className="bg-white text-red-600 px-3 py-2 rounded-lg font-bold text-xl min-w-[50px]">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                  <div className="text-xs text-white mt-1">DETIK</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ⭐ Auto-refresh indicator */}
      <div className="bg-blue-500 text-white text-center py-1 text-xs">
        🔄 Data diperbarui otomatis setiap 10 detik
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-6 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : flashSaleProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto">
              <Zap className="w-16 h-16 text-white mx-auto mb-4 opacity-50" />
              <h2 className="text-2xl font-bold text-white mb-2">Tidak Ada Flash Sale</h2>
              <p className="text-white/80">Flash sale sedang tidak tersedia saat ini</p>
              <Link href="/">
                <button className="mt-6 bg-white text-red-600 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-all">
                  Kembali ke Beranda
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {flashSaleProducts.map((product: any) => {
              const discount = calculateDiscount(product);
              const imageUrl = product.media?.[0]?.url || '/images/placeholder.png';
              
              const remainingStock = product.flashSaleRemaining || 1;
              const soldItems = product.flashSaleSold || 0;
              const stockPercentage = (remainingStock / 10) * 100;
              
              return (
                <Link
                  key={product.id}
                  href={`/products/${getProductSlug(product)}`}
                  className="bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-all group"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      unoptimized
                    />
                    {discount > 0 && (
                      <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                        -{discount}%
                      </div>
                    )}
                    
                    <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-bold">
                      Terjual {soldItems >= 100 ? '100+' : soldItems >= 50 ? '50+' : '10+'}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2 h-10">
                      {product.name}
                    </h3>
                    
                    <div className="mb-3">
                      {product.compare_at_price && (
                        <div className="text-xs text-gray-400 line-through">
                          {formatCurrency(product.compare_at_price)}
                        </div>
                      )}
                      <div className="text-lg font-bold text-red-600">
                        {formatCurrency(product.price)}
                      </div>
                    </div>
                    
                    {remainingStock > 0 ? (
                      <div className="mb-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600 font-medium">Tersisa</span>
                          <span className="text-xs font-bold text-red-600">{remainingStock}</span>
                        </div>
                        <div className="w-full bg-red-100 rounded-full h-3 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-red-600 to-orange-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${stockPercentage}%` }}
                          />
                        </div>
                        {remainingStock <= 3 && (
                          <p className="text-xs text-red-600 mt-1 font-semibold">
                            ⚡ Segera Habis!
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-2 bg-red-100 rounded text-xs font-bold text-red-600">
                        HABIS
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}