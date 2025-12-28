'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { productService } from '@/lib/services/product.service';
import type { Product } from '@/types';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Extract product name without color
const getProductNameWithoutColor = (productName: string): string => {
  return productName.split(' - ')[0];
};

// Extract colors from product name
const extractColorsFromName = (productName: string): string[] => {
  const parts = productName.split(' - ');
  return parts.slice(1).filter(Boolean);
};

// Category mapping
const CATEGORY_MAPPING: Record<string, string> = {
  'all-product': 'All Products',
  'accessories': 'Accessories',
  'cross-body-bag': 'Cross Body Bag',
  'laptop-sleeve': 'Laptop Sleeve',
  'messenger-bag': 'Messenger Bag',
  'sling-bag': 'Sling Bag',
  'wallet': 'Wallet',
  'backpack': 'Backpack',
};

const SORT_OPTIONS = [
  { value: 'newest', label: 'Terbaru' },
  { value: 'price-low', label: 'Harga: Rendah ke Tinggi' },
  { value: 'price-high', label: 'Harga: Tinggi ke Rendah' },
  { value: 'name-asc', label: 'Nama: A-Z' },
  { value: 'name-desc', label: 'Nama: Z-A' },
];

const PRICE_RANGES = [
  { value: 'all', label: 'Semua Harga', min: 0, max: Infinity },
  { value: '0-100000', label: 'Di bawah Rp 100.000', min: 0, max: 100000 },
  { value: '100000-300000', label: 'Rp 100.000 - Rp 300.000', min: 100000, max: 300000 },
  { value: '300000-500000', label: 'Rp 300.000 - Rp 500.000', min: 300000, max: 500000 },
  { value: '500000-1000000', label: 'Rp 500.000 - Rp 1.000.000', min: 500000, max: 1000000 },
  { value: '1000000+', label: 'Di atas Rp 1.000.000', min: 1000000, max: Infinity },
];

export default function CollectionPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const categorySlug = params.slug as string;
  const categoryFromUrl = searchParams.get('category');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categoryFromUrl || (categorySlug !== 'all-product' ? categorySlug : 'all')
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedSort, setSelectedSort] = useState('newest');

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    } else if (categorySlug && categorySlug !== 'all-product') {
      setSelectedCategory(categorySlug);
    }
  }, [categorySlug, categoryFromUrl]);

  useEffect(() => {
    applyFilters();
  }, [products, selectedCategory, selectedPriceRange, selectedSort]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const response = await productService.getProducts({ limit: 100 });
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to load products:', error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(product => {
        const productCategorySlug = product.category?.slug?.toLowerCase() || '';
        return productCategorySlug === selectedCategory.toLowerCase();
      });
    }

    if (selectedPriceRange !== 'all') {
      const range = PRICE_RANGES.find(r => r.value === selectedPriceRange);
      if (range) {
        filtered = filtered.filter(
          product => product.price >= range.min && product.price < range.max
        );
      }
    }

    switch (selectedSort) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => {
          const dateA = new Date(a.created_at || 0).getTime();
          const dateB = new Date(b.created_at || 0).getTime();
          return dateB - dateA;
        });
        break;
    }

    setFilteredProducts(filtered);
  };

  const calculateDiscount = (product: Product) => {
    if (!product.compare_at_price || product.compare_at_price <= product.price) return 0;
    return Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100);
  };

  const getProductSlug = (product: Product) => {
    return product.slug || product.name.toLowerCase().replace(/\s+/g, '-');
  };

  const pageTitle = categorySlug === 'all-product' 
    ? 'All Products' 
    : CATEGORY_MAPPING[categorySlug] || categorySlug;

  const availableCategories = Array.from(
    new Set(products.map(p => p.category?.slug).filter(Boolean))
  ).map(slug => {
    const product = products.find(p => p.category?.slug === slug);
    return {
      slug: slug!,
      name: product?.category?.name || slug!
    };
  });

  return (
    <>
      {/* ========================================
          🎯 BANNER - HARUS MUNCUL DI ATAS!
          ======================================== */}
      <div 
        className="relative w-full overflow-hidden"
        style={{ height: '400px' }}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80"
            alt={pageTitle}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </div>
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        
        {/* Content */}
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              {pageTitle}
            </h1>
            <p className="text-lg md:text-xl text-gray-200">
              {filteredProducts.length} produk tersedia
            </p>
          </div>
        </div>
      </div>

      {/* ========================================
          MAIN CONTENT
          ======================================== */}
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 rounded-lg"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filter & Sort
            </button>

            <div className="hidden sm:flex flex-wrap gap-4 flex-1">
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="all">Semua Kategori</option>
                  {availableCategories.map(cat => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-black"
                >
                  {PRICE_RANGES.map(range => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
              </div>

              <div className="relative ml-auto">
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-black"
                >
                  {SORT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Mobile Filters Panel */}
          {showFilters && (
            <div className="sm:hidden fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowFilters(false)}>
              <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold">Filter & Sort</h3>
                  <button onClick={() => setShowFilters(false)}>
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Kategori</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option value="all">Semua Kategori</option>
                      {availableCategories.map(cat => (
                        <option key={cat.slug} value={cat.slug}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Harga</label>
                    <select
                      value={selectedPriceRange}
                      onChange={(e) => setSelectedPriceRange(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      {PRICE_RANGES.map(range => (
                        <option key={range.value} value={range.value}>
                          {range.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Urutkan</label>
                    <select
                      value={selectedSort}
                      onChange={(e) => setSelectedSort(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      {SORT_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full mt-6 bg-black text-white py-3 rounded-lg font-semibold"
                >
                  Terapkan Filter
                </button>
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {(selectedCategory !== 'all' || selectedPriceRange !== 'all') && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-2 bg-black text-white px-3 py-1 rounded-full text-sm">
                  {availableCategories.find(c => c.slug === selectedCategory)?.name}
                  <button onClick={() => setSelectedCategory('all')}>
                    <X className="w-4 h-4" />
                  </button>
                </span>
              )}
              {selectedPriceRange !== 'all' && (
                <span className="inline-flex items-center gap-2 bg-black text-white px-3 py-1 rounded-full text-sm">
                  {PRICE_RANGES.find(r => r.value === selectedPriceRange)?.label}
                  <button onClick={() => setSelectedPriceRange('all')}>
                    <X className="w-4 h-4" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse border">
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-6 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">Tidak ada produk ditemukan</p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedPriceRange('all');
                }}
                className="text-black underline"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product) => {
                const imageUrl = product.media?.[0]?.url || '/images/placeholder.png';
                const discount = calculateDiscount(product);
                const displayName = getProductNameWithoutColor(product.name);
                const colors = extractColorsFromName(product.name);

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
                          alt={displayName}
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
                            <span className="text-white text-sm font-semibold">Out of Stock</span>
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
                        
                        {/* Display name without color */}
                        <h3 className="font-medium text-gray-900 group-hover:text-gray-600 transition-colors text-sm sm:text-base mb-1 line-clamp-2 min-h-[2.5rem]">
                          {displayName}
                        </h3>
                        
                        {/* Display colors as tags */}
                        {colors.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {colors.map((color, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
                              >
                                {color}
                              </span>
                            ))}
                          </div>
                        )}
                        
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
        </div>
      </div>
    </>
  );
}