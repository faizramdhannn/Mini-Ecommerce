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

  async getProduct(id: number): Promise<Product> {
    try {
      const response = await apiClient.get<{ data: Product }>(
        API_ENDPOINTS.PRODUCTS.DETAIL(id)
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  async getCategories(): Promise<Category[]> {
    try {
      const response = await apiClient.get<{ data: Category[] }>(
        API_ENDPOINTS.PRODUCTS.CATEGORIES
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  async getBrands(): Promise<Brand[]> {
    try {
      const response = await apiClient.get<{ data: Brand[] }>(
        API_ENDPOINTS.PRODUCTS.BRANDS
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching brands:', error);
      throw error;
    }
  }

  async getProductsByCategory(slug: string, options?: { page?: number; limit?: number }) {
    try {
      console.log('Fetching products by category:', slug, options);
      
      const response = await apiClient.get(
        `/products/category/${slug}`,
        { params: options }
      );
      
      console.log('Category products response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  }
}

export const productService = new ProductService();