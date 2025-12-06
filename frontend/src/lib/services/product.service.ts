import apiClient from '../api/client';
import { API_ENDPOINTS } from '../api/endpoint';
import type { Product, Category, Brand, ProductFilters, PaginatedResponse } from '@/types';

class ProductService {
  async getProducts(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    const response = await apiClient.get<PaginatedResponse<Product>>(
      API_ENDPOINTS.PRODUCTS.LIST,
      { params: filters }
    );
    return response.data;
  }

  async getProduct(id: number): Promise<Product> {
    const response = await apiClient.get<{ data: Product }>(
      API_ENDPOINTS.PRODUCTS.DETAIL(id)
    );
    return response.data.data;
  }

  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<{ data: Category[] }>(
      API_ENDPOINTS.PRODUCTS.CATEGORIES
    );
    return response.data.data;
  }

  async getBrands(): Promise<Brand[]> {
    const response = await apiClient.get<{ data: Brand[] }>(
      API_ENDPOINTS.PRODUCTS.BRANDS
    );
    return response.data.data;
  }
}

export const productService = new ProductService();