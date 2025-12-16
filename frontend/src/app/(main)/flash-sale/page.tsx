'use client';

import { useEffect, useState } from 'react';
import { Zap, Clock } from 'lucide-react';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Spinner } from '@/components/ui/Spinner';
import { productService } from '@/lib/services/product.service';
import type { Product } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils/format';
import { useCartStore } from '@/lib/store/cart.store';
import { useAuthStore } from '@/lib/store/auth.store';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function FlashSalePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const { addItem, openCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

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
      setIsLoading(true);
      const response = await productService.getProducts({ limit: 100 });
      
      // Filter products dengan diskon >= 30%
      const flashSale = response.data.filter(product => {
        const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
        if (!hasDiscount) return false;
        
        const discountPercentage = Math.round(
          ((product.compare_at_price! - product.price) / product.compare_at_price!) * 100
        );
        
        return discountPercentage >= 30;
      });

      // Sort by discount percentage (highest first)
      flashSale.sort((a, b) => {
        const discountA = a.compare_at_price 
          ? ((a.compare_at_price - a.price) / a.compare_at_price) * 100 
          : 0;
        const discountB = b.compare_at_price 
          ? ((b.compare_at_price - b.price) / b.compare_at_price) * 100 
          : 0;
        return discountB - discountA;
      });

      setProducts(flashSale);
    } catch (error) {
      console.error('Failed to load flash sale products:', error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      router.push('/login');
      return;
    }

    try {
      await addItem(product.id, 1);
      toast.success('Added to cart!');
      setTimeout(() => {
        openCart();
      }, 300);
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const getProductSlug = (product: Product) => {
    return product.slug || product.name.toLowerCase().replace(/\s+/g, '-');
  };

  const calculateDiscount = (product: Product) => {
    if (!product.compare_at_price || product.compare_at_price <= product.price) return 0;
    return Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100);
  };

  // Calculate remaining stock (simulate sold percentage)
  const getRemainingStock = (product: Product) => {
    // Simulate 30-70% already sold
    const soldPercentage = Math.floor(Math.random() * 40) + 30;
    return Math.max(1, Math.floor(product.stock * (100 - soldPercentage) / 100));
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

            {/* Custom Product Grid for Flash Sale */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {products.map((product) => {
                const discount = calculateDiscount(product);
                const imageUrl = product.media?.[0]?.url || '/images/placeholder.png';
                const remainingStock = getRemainingStock(product);
                const soldPercentage = Math.round(((product.stock - remainingStock) / product.stock) * 100);
                
                return (
                  <Link
                    key={product.id}
                    href={`/products/${getProductSlug(product)}`}
                    className="group block"
                  >
                    <div className="bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl border border-gray-100">
                      <div className="relative aspect-square overflow-hidden bg-gray-100">
                        <Image
                          src={imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                          unoptimized
                        />
                        {discount > 0 && (
                          <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg z-10">
                            -{discount}%
                          </div>
                        )}
                        <div className="absolute top-2 left-2 bg-gradient-to-r from-red-600 to-orange-600 text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs font-bold shadow-lg z-10 animate-pulse">
                          <Zap className="w-3 h-3 fill-current" />
                          FLASH
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

                        {/* Stock Progress Bar - Showing Remaining */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-600">Tersisa</span>
                            <span className="text-xs font-bold text-red-600">{remainingStock}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-red-600 to-orange-600 h-2.5 rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(5, 100 - soldPercentage)}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {soldPercentage}% Terjual
                          </p>
                        </div>

                        <button
                          onClick={(e) => handleAddToCart(product, e)}
                          className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-2 rounded-lg font-semibold hover:from-red-700 hover:to-orange-700 transition-all text-sm"
                        >
                          Beli Sekarang
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}