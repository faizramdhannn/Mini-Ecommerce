import apiClient from '../api/client';
import { API_ENDPOINTS } from '../api/endpoint';
import type { Product, Category, Brand, ProductFilters, PaginatedResponse } from '@/types';

class ProductService {

  async getProducts(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    try {
      console.log('Fetching products with filters:', filters);
      
      const response = await apiClient.get<PaginatedResponse<Product>>(
        API_ENDPOINTS.PRODUCTS.LIST,
        { params: filters }
      );
      
      console.log('Products response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  /**
   * Get single product by slug
   * URL: /api/products?{slug}
   */
  async getProductBySlug(slug: string): Promise<Product> {
    try {
      const response = await apiClient.get<{ data: Product }>(
        API_ENDPOINTS.PRODUCTS.DETAIL(slug)
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  /**
   * Get all categories
   * URL: /api/categories
   */
  async getCategories(): Promise<Category[]> {
    try {
      const response = await apiClient.get<{ data: Category[] }>(
        API_ENDPOINTS.CATEGORIES.LIST
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  /**
   * Get category by slug
   * URL: /api/categories?{slug}
   */
  async getCategoryBySlug(slug: string): Promise<Category> {
    try {
      const response = await apiClient.get<{ data: Category }>(
        API_ENDPOINTS.CATEGORIES.DETAIL(slug)
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  }

  /**
   * Get products by category slug with pagination
   * URL: /api/categories/{slug}/products?page=1&limit=12
   */
  async getProductsByCategory(
    slug: string, 
    options?: { page?: number; limit?: number }
  ): Promise<PaginatedResponse<Product> & { category: Category }> {
    try {
      console.log('Fetching products by category:', slug, options);
      
      const response = await apiClient.get(
        API_ENDPOINTS.CATEGORIES.PRODUCTS(slug),
        { params: options }
      );
      
      console.log('Category products response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  }

  /**
   * Get all brands
   * URL: /api/brands
   */
  async getBrands(): Promise<Brand[]> {
    try {
      const response = await apiClient.get<{ data: Brand[] }>(
        API_ENDPOINTS.BRANDS.LIST
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching brands:', error);
      throw error;
    }
  }

  /**
   * Get brand by slug
   * URL: /api/brands?{slug}
   */
  async getBrandBySlug(slug: string): Promise<Brand> {
    try {
      const response = await apiClient.get<{ data: Brand }>(
        API_ENDPOINTS.BRANDS.DETAIL(slug)
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching brand:', error);
      throw error;
    }
  }

  /**
   * Get products by brand slug with pagination
   * URL: /api/brands/{slug}/products?page=1&limit=12
   */
  async getProductsByBrand(
    slug: string, 
    options?: { page?: number; limit?: number }
  ): Promise<PaginatedResponse<Product> & { brand: Brand }> {
    try {
      console.log('Fetching products by brand:', slug, options);
      
      const response = await apiClient.get(
        API_ENDPOINTS.BRANDS.PRODUCTS(slug),
        { params: options }
      );
      
      console.log('Brand products response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching products by brand:', error);
      throw error;
    }
  }

  /**
   * Search products
   * URL: /api/search?q=keyword&page=1&limit=12&category=slug&brand=slug
   */
  async searchProducts(params: {
    q?: string;
    page?: number;
    limit?: number;
    category?: string;
    brand?: string;
    min_price?: number;
    max_price?: number;
    sort?: string;
  }): Promise<PaginatedResponse<Product>> {
    try {
      console.log('Searching products with params:', params);
      
      const response = await apiClient.get<PaginatedResponse<Product>>(
        API_ENDPOINTS.SEARCH.PRODUCTS,
        { params }
      );
      
      console.log('Search response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }
}

export const productService = new ProductService();