"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { productService } from "@/lib/services/product.service";

// Placeholder components
const ProductGrid = ({ products }: any) => (
  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
    {products.map((product: any) => (
      <div key={product.id} className="bg-white rounded-lg border p-4">
        <div className="aspect-square bg-gray-200 rounded mb-3" />
        <h3 className="font-medium text-sm line-clamp-2 mb-2">{product.name}</h3>
        <p className="text-lg font-bold">
          {new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
          }).format(product.price)}
        </p>
      </div>
    ))}
  </div>
);

const Spinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
  </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange }: any) => (
  <div className="flex items-center justify-center gap-2 mt-8">
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="px-4 py-2 border rounded disabled:opacity-50"
    >
      Previous
    </button>
    <span className="px-4 py-2">
      Page {currentPage} of {totalPages}
    </span>
    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage >= totalPages}
      className="px-4 py-2 border rounded disabled:opacity-50"
    >
      Next
    </button>
  </div>
);

export default function CategoryPage() {
  const params = useParams();
  const [products, setProducts] = useState<any[]>([]);
  const [category, setCategory] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  useEffect(() => {
    const slug = params.slug as string;
    if (slug) {
      loadProducts(1, slug);
    }
  }, [params.slug]);

  const loadProducts = async (page: number, slug: string) => {
    setIsLoading(true);
    try {
      console.log('Loading products for category:', slug);
      
      const response = await productService.getProductsByCategory(slug, {
        page,
        limit: 12,
      });
      
      console.log('Response:', response);
      
      // Handle response structure
      if (response.data) {
        setProducts(response.data);
        setCategory(response.category);
        setPagination({
          page: response.pagination.page,
          totalPages: response.pagination.totalPages,
          total: response.pagination.total,
        });
      }
    } catch (error) {
      console.error('Failed to load products:', error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    const slug = params.slug as string;
    if (slug) {
      loadProducts(page, slug);
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

        {/* Products */}
        {isLoading ? (
          <Spinner />
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No products found in this category</p>
          </div>
        ) : (
          <>
            <ProductGrid products={products} />

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
  );
}