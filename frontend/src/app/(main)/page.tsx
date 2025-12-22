'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, Truck, Shield, Package, Zap, TrendingUp, Star } from 'lucide-react';
import { productService } from '@/lib/services/product.service';
import type { Product } from '@/types';

// Hero Slides Configuration
const HERO_SLIDES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80',
    title: 'Summer Collection 2025',
    subtitle: 'Discover the latest trends',
    cta: 'Shop Now',
    link: '/collections/all-product'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1920&q=80',
    title: 'Up to 50% Off',
    subtitle: 'Limited time offer',
    cta: 'View Deals',
    link: '/flash-sale'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&q=80',
    title: 'New Arrivals',
    subtitle: 'Fresh styles just landed',
    cta: 'Explore',
    link: '/collections/all-product'
  }
];

// Categories - sesuai dengan database
const CATEGORIES = [
  {
    id: 1,
    name: 'Accessories',
    image: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=600&q=80',
    link: '/collections/accessories'
  },
  {
    id: 2,
    name: 'Cross Body Bag',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80',
    link: '/collections/cross-body-bag'
  },
  {
    id: 3,
    name: 'Laptop Sleeve',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80',
    link: '/collections/laptop-sleeve'
  },
  {
    id: 4,
    name: 'Messenger Bag',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
    link: '/collections/messenger-bag'
  },
  {
    id: 5,
    name: 'Sling Bag',
    image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&q=80',
    link: '/collections/sling-bag'
  }
];

// Features
const FEATURES = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On orders over Rp 500.000'
  },
  {
    icon: Shield,
    title: 'Secure Payment',
    description: '100% secure transactions'
  },
  {
    icon: Package,
    title: 'Easy Returns',
    description: '30-day return policy'
  }
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [flashSaleProducts, setFlashSaleProducts] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoadingFlashSale, setIsLoadingFlashSale] = useState(true);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);

  // Hero Carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Load Flash Sale Products
  useEffect(() => {
    loadFlashSaleProducts();
  }, []);

  // Load Featured Products
  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFlashSaleProducts = async () => {
    try {
      setIsLoadingFlashSale(true);
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

      // Add stable random remaining stock to each product
      const flashSaleWithStock = flashSale.slice(0, 10).map(product => {
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
      setIsLoadingFlashSale(false);
    }
  };

  const loadFeaturedProducts = async () => {
    try {
      setIsLoadingFeatured(true);
      const response = await productService.getProducts({ limit: 8 });
      setFeaturedProducts(response.data);
    } catch (error) {
      console.error('Failed to load featured products:', error);
      setFeaturedProducts([]);
    } finally {
      setIsLoadingFeatured(false);
    }
  };

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

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  const scrollFlashSale = (direction: 'left' | 'right') => {
    const container = document.getElementById('flash-sale-container');
    if (container) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const getProductSlug = (product: Product) => {
    return product.slug || product.name.toLowerCase().replace(/\s+/g, '-');
  };

  const calculateDiscount = (product: Product) => {
    if (!product.compare_at_price || product.compare_at_price <= product.price) return 0;
    return Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] bg-black overflow-hidden">
        <div className="relative h-full">
          {HERO_SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="absolute inset-0">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  unoptimized
                />
                <div className="absolute inset-0 bg-black bg-opacity-40" />
              </div>

              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center z-10">
                <div className="max-w-xl lg:max-w-2xl">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 sm:mb-4 md:mb-6 text-white drop-shadow-lg">
                    {slide.title}
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-4 sm:mb-6 md:mb-8 drop-shadow-lg">
                    {slide.subtitle}
                  </p>
                  <Link href={slide.link}>
                    <button className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition-all shadow-xl flex items-center gap-2">
                      {slide.cta}
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full transition-all z-10"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full transition-all z-10"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white w-6 sm:w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Flash Sale Section - SHOPEE STYLE */}
      <section className="bg-gradient-to-b from-black via-orange-600 to-black py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-white fill-current animate-pulse" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                  FLASH SALE ⚡
                </h2>
                <p className="text-white/90 text-sm sm:text-base">Diskon hingga 70%!</p>
              </div>
            </div>

            {/* Countdown */}
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
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

          {/* ⭐ SHOPEE STYLE Products Slider */}
          <div className="relative">
            <button
              onClick={() => scrollFlashSale('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white text-black p-3 rounded-full shadow-lg hover:bg-gray-100 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div
              id="flash-sale-container"
              className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {isLoadingFlashSale ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-[200px] sm:w-[240px] bg-white rounded-xl overflow-hidden animate-pulse">
                    <div className="aspect-square bg-gray-200" />
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-6 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))
              ) : flashSaleProducts.length === 0 ? (
                <div className="w-full text-center py-12">
                  <p className="text-white">Tidak ada flash sale saat ini</p>
                </div>
              ) : (
                flashSaleProducts.map((product: any) => {
                  const discount = calculateDiscount(product);
                  const imageUrl = product.media?.[0]?.url || '/images/placeholder.png';
                  
                  // ⭐ Use pre-calculated stable stock values
                  const remainingStock = product.flashSaleRemaining || 1;
                  const soldItems = product.flashSaleSold || 0;
                  
                  // Progress bar: 10 items = 100%, 5 items = 50%, 1 item = 10%
                  const stockPercentage = (remainingStock / 10) * 100;
                  
                  return (
                    <Link
                      key={product.id}
                      href={`/products/${getProductSlug(product)}`}
                      className="flex-shrink-0 w-[200px] sm:w-[240px] bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-all group"
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
                        
                        {/* ⭐ SHOPEE STYLE: Sold badge */}
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
                        
                        {/* ⭐ SHOPEE STYLE: Stock Progress Bar - MAX 10 ITEMS */}
                        {remainingStock > 0 ? (
                          <div className="mb-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-600 font-medium">Tersisa</span>
                              <span className="text-xs font-bold text-red-600">{remainingStock}</span>
                            </div>
                            {/* Bar dengan max 10 item = 100% */}
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
                })
              )}
            </div>

            <button
              onClick={() => scrollFlashSale('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white text-black p-3 rounded-full shadow-lg hover:bg-gray-100 transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="text-center mt-6">
            <Link href="/flash-sale">
              <button className="bg-white text-red-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-all shadow-lg">
                Lihat Semua Flash Sale →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-black py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              Shop by Category
            </h2>
            <p className="text-sm text-white sm:text-base md:text-lg max-w-2xl mx-auto">
              Explore our collection of bags and accessories
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {CATEGORIES.map((category) => (
              <Link
                key={category.id}
                href={category.link}
                className="group relative aspect-square rounded-2xl overflow-hidden hover:shadow-2xl transition-all"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                  <h3 className="text-white text-base sm:text-lg md:text-xl font-bold text-center">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="bg-black max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
            Featured Products
          </h2>
          <p className="text-sm text-white sm:text-base md:text-lg max-w-2xl mx-auto mb-6">
            Check out our latest arrivals and trending items
          </p>
          <Link href="/collections/all-product">
            <button className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition-all border-2 border-white">
              View All Products
              <ArrowRight className="inline ml-2 w-4 h-4" />
            </button>
          </Link>
        </div>

        {isLoadingFeatured ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
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
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {featuredProducts.map((product) => {
              const imageUrl = product.media?.[0]?.url || '/images/placeholder.png';
              const discount = calculateDiscount(product);
              
              return (
                <Link
                  key={product.id}
                  href={`/products/${getProductSlug(product)}`}
                  className="group block"
                >
                  <div className="bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-100">
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                      {discount > 0 && (
                        <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                          -{discount}%
                        </div>
                      )}
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="text-white text-xs sm:text-sm font-semibold">Out of Stock</span>
                        </div>
                      )}
                    </div>
                    <div className="p-3 sm:p-4">
                      <div className="h-5 mb-1">
                        {product.category && (
                          <p className="text-xs text-gray-500 truncate">
                            {product.category.name}
                          </p>
                        )}
                      </div>
                      <h3 className="font-medium text-gray-900 group-hover:text-gray-600 transition-colors text-sm sm:text-base mb-2 line-clamp-2 h-10 sm:h-12">
                        {product.name}
                      </h3>
                      <div className="mt-auto pt-2">
                        <div className="mb-2">
                          {product.compare_at_price && product.compare_at_price > product.price && (
                            <div className="text-xs text-gray-400 line-through">
                              {formatCurrency(product.compare_at_price)}
                            </div>
                          )}
                          <div className={`font-bold ${
                            product.compare_at_price ? 'text-red-600 text-lg sm:text-xl' : 'text-gray-900 text-base sm:text-lg'
                          }`}>
                            {formatCurrency(product.price)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Info Cards Section */}
      <section className="bg-black py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Link href="/custom-order" className="group relative aspect-[16/10] rounded-2xl overflow-hidden hover:shadow-2xl transition-all">
              <Image
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"
                alt="Custom Order"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <h3 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                  Mau Pesan Custom?
                </h3>
                <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-2 rounded-full font-medium transition-all border border-white/30">
                  Selengkapnya
                </button>
              </div>
            </Link>

            <Link href="/stores" className="group relative aspect-[16/10] rounded-2xl overflow-hidden hover:shadow-2xl transition-all">
              <Image
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
                alt="Official Store"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <h3 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                  Official Store
                </h3>
                <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-2 rounded-full font-medium transition-all border border-white/30">
                  Selengkapnya
                </button>
              </div>
            </Link>
          </div>

          <div className="mt-6">
            <Link href="/membership" className="group relative aspect-[21/9] rounded-2xl overflow-hidden hover:shadow-2xl transition-all block">
              <Image
                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&q=80"
                alt="Magadir Membership"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent group-hover:from-black/70 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <h3 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                  Gabung Magadir Membership
                </h3>
                <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-8 py-3 rounded-full font-medium transition-all border border-white/30">
                  Selengkapnya
                </button>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-black py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 sm:p-8 text-center hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-600 sm:text-xl mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}