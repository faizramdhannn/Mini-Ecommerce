import apiClient from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import type { Product, ProductFilters, PaginatedResponse } from '@/types';

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

  async createProduct(data: Partial<Product>): Promise<Product> {
    const response = await apiClient.post<{ data: Product }>(
      API_ENDPOINTS.PRODUCTS.CREATE,
      data
    );
    return response.data.data;
  }

  async updateProduct(id: number, data: Partial<Product>): Promise<Product> {
    const response = await apiClient.put<{ data: Product }>(
      API_ENDPOINTS.PRODUCTS.UPDATE(id),
      data
    );
    return response.data.data;
  }

  async deleteProduct(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.PRODUCTS.DELETE(id));
  }

  async getCategories() {
    const response = await apiClient.get<{ data: any[] }>(
      API_ENDPOINTS.PRODUCTS.CATEGORIES
    );
    return response.data.data;
  }

  async getBrands() {
    const response = await apiClient.get<{ data: any[] }>(
      API_ENDPOINTS.PRODUCTS.BRANDS
    );
    return response.data.data;
  }
}

export const productService = new ProductService();