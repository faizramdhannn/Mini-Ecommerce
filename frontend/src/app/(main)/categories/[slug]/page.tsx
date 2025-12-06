"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Pagination } from "@/components/ui/Pagination";
import { Spinner } from "@/components/ui/Spinner";
import { productService } from "@/lib/services/product.service";
import type { Product, Category } from "@/types";

export default function CategoryPage() {
  const params = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  useEffect(() => {
    const slug = params.slug || params.name;
    if (slug) {
      loadCategory();
      loadProducts(1, String(slug));
    }
  }, [params]);

  const loadCategory = async () => {
    try {
      const categories = await productService.getCategories();
      const found = categories.find((c) => c.name === String(params.name));
      setCategory(found || null);
    } catch (error) {
      console.error("Failed to load category:", error);
    }
  };

  const loadProducts = async (page: number, slug: string) => {
    setIsLoading(true);
    try {
      const response = await productService.getProducts({
        category_slug: slug,
        page,
        limit: 12,
      });
      setProducts(response.data);
      setPagination({
        page: response.pagination.page,
        totalPages: response.pagination.totalPages,
        total: response.pagination.total,
      });
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    const slug = params.slug || params.name;
    if (slug) {
      loadProducts(page, String(slug));
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading && !category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {category?.name || "Category"}
        </h1>
        <p className="text-gray-400">
          Showing {products.length} of {pagination.total} products
        </p>
      </div>

      {/* Products */}
      {isLoading ? (
        <div className="py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
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
  );
}
