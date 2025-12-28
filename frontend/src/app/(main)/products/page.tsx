'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductFilter } from '@/components/product/ProductFilter';
import { Pagination } from '@/components/ui/Pagination';
import { Spinner } from '@/components/ui/Spinner';
import { productService } from '@/lib/services/product.service';
import type { Product, ProductFilters } from '@/types';

// Helper function to get clean product name without color
const getProductNameWithoutColor = (productName: string): string => {
  return productName.split(' - ')[0];
};

// Helper function to extract colors from product name
const extractColorsFromName = (productName: string): string[] => {
  const parts = productName.split(' - ');
  return parts.slice(1).filter(Boolean);
};

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ProductFilters>({ page: 1, limit: 12 });
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  // Read category from URL
  useEffect(() => {
    const categorySlug = searchParams.get('category_slug');
    
    if (categorySlug) {
      setFilters(prev => ({ ...prev, category_slug: String(categorySlug), page: 1 }));
    }
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
    setFilters({ ...newFilters, page: 1, limit: 12 });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get category name for banner title
  const getCategoryTitle = () => {
    if (filters.category_slug) {
      // Find product with this category to get the name
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

                {/* Pass helper functions to ProductGrid if needed */}
                <ProductGrid 
                  products={products}
                />

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