"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { productService } from "@/lib/services/product.service";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductFilter } from "@/components/product/ProductFilter";
import type { Product, Category, ProductFilters } from "@/types";

const Spinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
  </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange }: any) => (
  <div className="flex items-center justify-center gap-2 mt-8">
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="px-4 py-2 bg-white text-black rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
    >
      Previous
    </button>
    <span className="px-4 py-2 text-white">
      Page {currentPage} of {totalPages}
    </span>
    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage >= totalPages}
      className="px-4 py-2 bg-white text-black rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
    >
      Next
    </button>
  </div>
);

export default function CollectionSlugPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [filters, setFilters] = useState<ProductFilters>({});

  useEffect(() => {
    const slug = params.slug as string;
    if (slug) {
      // Read filters from URL
      const urlFilters: any = {};
      const page = searchParams.get('page');
      const search = searchParams.get('search');
      const brand = searchParams.get('brand');
      const minPrice = searchParams.get('min_price');
      const maxPrice = searchParams.get('max_price');
      
      if (page) urlFilters.page = parseInt(page);
      if (search) urlFilters.search = search;
      if (brand) urlFilters.brand_id = parseInt(brand);
      if (minPrice) urlFilters.min_price = parseFloat(minPrice);
      if (maxPrice) urlFilters.max_price = parseFloat(maxPrice);
      
      setFilters(urlFilters);
      loadProducts(urlFilters.page || 1, slug, urlFilters);
    }
  }, [params.slug, searchParams]);

  const loadProducts = async (page: number, slug: string, additionalFilters: any = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Loading products for category:', slug, 'page:', page, 'filters:', additionalFilters);
      
      const response = await productService.getProductsByCategory(slug, {
        page,
        limit: 12,
        ...additionalFilters
      });
      
      console.log('Response received:', response);
      
      if (response && response.data) {
        setProducts(response.data);
        setCategory(response.category);
        
        if (response.pagination) {
          setPagination({
            page: response.pagination.page,
            totalPages: response.pagination.totalPages,
            total: response.pagination.total,
          });
        }
      } else {
        setError('Invalid response format');
        setProducts([]);
      }
    } catch (error: any) {
      console.error('Failed to load products:', error);
      setError(error.response?.data?.message || 'Failed to load products');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters: ProductFilters) => {
    // Update URL with filters
    const params = new URLSearchParams();
    
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.brand_id) params.set('brand', newFilters.brand_id.toString());
    if (newFilters.min_price) params.set('min_price', newFilters.min_price.toString());
    if (newFilters.max_price) params.set('max_price', newFilters.max_price.toString());
    
    const slug = params.slug as string;
    window.history.pushState(null, '', `?${params.toString()}`);
    
    setFilters(newFilters);
    if (slug) {
      loadProducts(1, slug, newFilters);
    }
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', page.toString());
    window.history.pushState(null, '', `?${params.toString()}`);
    
    const slug = params.slug as string;
    if (slug) {
      loadProducts(page, slug, filters);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading && !category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => {
              const slug = params.slug as string;
              if (slug) loadProducts(1, slug, filters);
            }}
            className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {category?.name || params.slug}
          </h1>
          <p className="text-gray-400">
            Showing {products.length} of {pagination.total} products
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <ProductFilter onFilterChange={handleFilterChange} />
            </div>
          </aside>

          {/* Products */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <Spinner />
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">No products found in this category</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {pagination.totalPages > 1 && (
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}