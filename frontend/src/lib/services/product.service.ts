import apiClient from '../api/client';
import { API_ENDPOINTS } from '../api/endpoint';
import type { Product, Category, Brand, ProductFilters, PaginatedResponse } from '@/types';

class ProductService {
  // Get all products with filters
  async getProducts(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Product>>(
        API_ENDPOINTS.PRODUCTS.LIST,
        { params: filters }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // Get single product by slug
  async getProductBySlug(slug: string): Promise<Product> {
    try {
      const response = await apiClient.get<{ data: Product }>(
        API_ENDPOINTS.PRODUCTS.BY_SLUG(slug)
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  // Get all categories
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

  // Get products by category slug
  async getProductsByCategory(
    slug: string, 
    options?: { page?: number; limit?: number }
  ): Promise<PaginatedResponse<Product> & { category: Category }> {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.CATEGORIES.PRODUCTS(slug),
        { params: options }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  }

  // Get all brands
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

  // Get products by brand slug
  async getProductsByBrand(
    slug: string, 
    options?: { page?: number; limit?: number }
  ): Promise<PaginatedResponse<Product> & { brand: Brand }> {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.BRANDS.PRODUCTS(slug),
        { params: options }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching products by brand:', error);
      throw error;
    }
  }

  // Search products
  async searchProducts(params: {
    q?: string;
    page?: number;
    limit?: number;
    category?: string;
    brand?: string;
    min_price?: number;
    max_price?: number;
  }): Promise<PaginatedResponse<Product>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Product>>(
        API_ENDPOINTS.SEARCH,
        { params }
      );
      return response.data;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }
}

export const productService = new ProductService();