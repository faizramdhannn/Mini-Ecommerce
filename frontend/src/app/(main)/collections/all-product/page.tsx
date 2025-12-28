'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductFilter } from '@/components/product/ProductFilter';
import { Pagination } from '@/components/ui/Pagination';
import { Spinner } from '@/components/ui/Spinner';
import { productService } from '@/lib/services/product.service';
import type { Product, ProductFilters } from '@/types';

export default function AllProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ProductFilters>({ page: 1, limit: 12 });
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  // Read filters from URL params
  useEffect(() => {
    const urlFilters: ProductFilters = { page: 1, limit: 12 };
    
    const page = searchParams.get('page');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const minPrice = searchParams.get('min_price');
    const maxPrice = searchParams.get('max_price');
    
    if (page) urlFilters.page = parseInt(page);
    if (search) urlFilters.search = search;
    if (category) urlFilters.category_slug = category;
    if (brand) urlFilters.brand_id = parseInt(brand);
    if (minPrice) urlFilters.min_price = parseFloat(minPrice);
    if (maxPrice) urlFilters.max_price = parseFloat(maxPrice);
    
    setFilters(urlFilters);
  }, [searchParams]);

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const response = await productService.getProducts(filters);
      setProducts(response.data);
      setPagination({
        page: response.pagination.page,
        totalPages: response.pagination.totalPages,
        total: response.pagination.total,
      });
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters: ProductFilters) => {
    // Update URL with new filters
    const params = new URLSearchParams();
    
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.category_slug) params.set('category', newFilters.category_slug);
    if (newFilters.brand_id) params.set('brand', newFilters.brand_id.toString());
    if (newFilters.min_price) params.set('min_price', newFilters.min_price.toString());
    if (newFilters.max_price) params.set('max_price', newFilters.max_price.toString());
    
    router.push(`/collections/all-product?${params.toString()}`);
    setFilters({ ...newFilters, page: 1, limit: 12 });
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', page.toString());
    router.push(`/collections/all-product?${params.toString()}`);
    
    setFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get category title for banner
  const getCategoryTitle = () => {
    if (filters.category_slug) {
      const product = products.find(p => p.category?.slug === filters.category_slug);
      return product?.category?.name || 'Products';
    }
    return 'All Products';
  };

  return (
    <>
      {/* ========================================
          🎯 BANNER SECTION - FULL WIDTH
          ======================================== */}
      <div className="relative w-full overflow-hidden" style={{ height: '400px' }}>
        {/* Background Image */}
        <Image
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80"
          alt={getCategoryTitle()}
          fill
          className="object-cover"
          priority
          unoptimized
        />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        
        {/* Banner Content */}
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              {getCategoryTitle()}
            </h1>
            <p className="text-lg md:text-xl text-gray-200">
              {pagination.total} produk tersedia
            </p>
          </div>
        </div>
      </div>

      {/* ========================================
          MAIN CONTENT SECTION
          ======================================== */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <ProductFilter onFilterChange={handleFilterChange} />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="py-12">
                <Spinner size="lg" />
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-gray-600">
                  Showing {products.length} of {pagination.total} products
                </div>

                <ProductGrid products={products} />

                {pagination.totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={pagination.page}
                      totalPages={pagination.totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}