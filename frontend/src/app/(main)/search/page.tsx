'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductFilter } from '@/components/product/ProductFilter';
import { Pagination } from '@/components/ui/Pagination';
import { Spinner } from '@/components/ui/Spinner';
import { productService } from '@/lib/services/product.service';
import { Input } from '@/components/ui/Input';
import { Search as SearchIcon } from 'lucide-react';
import type { Product } from '@/types';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  // Read all params from URL
  const [filters, setFilters] = useState({
    q: '',
    page: 1,
    limit: 12,
    category: '',
    brand: '',
    min_price: undefined as number | undefined,
    max_price: undefined as number | undefined,
    sort: '',
  });

  useEffect(() => {
    const q = searchParams.get('q') || '';
    const page = searchParams.get('page') || '1';
    const category = searchParams.get('category') || '';
    const brand = searchParams.get('brand') || '';
    const minPrice = searchParams.get('min_price');
    const maxPrice = searchParams.get('max_price');
    const sort = searchParams.get('sort') || '';

    setSearchQuery(q);
    setFilters({
      q,
      page: parseInt(page),
      limit: 12,
      category,
      brand,
      min_price: minPrice ? parseFloat(minPrice) : undefined,
      max_price: maxPrice ? parseFloat(maxPrice) : undefined,
      sort,
    });
  }, [searchParams]);

  useEffect(() => {
    if (filters.q || filters.category || filters.brand) {
      searchProducts();
    }
  }, [filters]);

  const searchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await productService.searchProducts(filters);
      setProducts(response.data);
      setPagination({
        page: response.pagination.page,
        totalPages: response.pagination.totalPages,
        total: response.pagination.total,
      });
    } catch (error) {
      console.error('Failed to search products:', error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL({ q: searchQuery, page: 1 });
  };

  const updateURL = (newParams: any) => {
    const params = new URLSearchParams(window.location.search);
    
    Object.keys(newParams).forEach(key => {
      if (newParams[key]) {
        params.set(key, newParams[key].toString());
      } else {
        params.delete(key);
      }
    });
    
    window.history.pushState(null, '', `?${params.toString()}`);
    setFilters(prev => ({ ...prev, ...newParams }));
  };

  const handleFilterChange = (newFilters: any) => {
    updateURL({ ...newFilters, page: 1 });
  };

  const handlePageChange = (page: number) => {
    updateURL({ page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search Bar */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Search Products</h1>
        <form onSubmit={handleSearch} className="max-w-2xl">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-12"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700"
            >
              <SearchIcon className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {filters.q && (
        <div className="mb-6">
          <p className="text-gray-400">
            Search results for: <span className="font-semibold text-white">"{filters.q}"</span>
          </p>
          {!isLoading && (
            <p className="text-sm text-gray-500 mt-1">
              Found {pagination.total} products
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24">
            <h3 className="font-semibold mb-4">Filter Results</h3>
            <ProductFilter onFilterChange={handleFilterChange} />
          </div>
        </aside>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="py-12">
              <Spinner size="lg" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">
                {filters.q ? `No products found for "${filters.q}"` : 'Start searching for products'}
              </p>
              {filters.q && (
                <p className="text-sm text-gray-500">
                  Try adjusting your search or filters
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-white">
                Showing {products.length} of {pagination.total} results
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