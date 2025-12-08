'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductFilter } from '@/components/product/ProductFilter';
import { Pagination } from '@/components/ui/Pagination';
import { Spinner } from '@/components/ui/Spinner';
import { productService } from '@/lib/services/product.service';
import type { Product, ProductFilters } from '@/types';

export default function AllProductsPage() {
  const searchParams = useSearchParams();
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
    const sort = searchParams.get('sort');
    
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
    
    window.history.pushState(null, '', `?${params.toString()}`);
    setFilters({ ...newFilters, page: 1, limit: 12 });
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', page.toString());
    window.history.pushState(null, '', `?${params.toString()}`);
    
    setFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>

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
              <div className="mb-4 text-sm text-white">
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
  );
}