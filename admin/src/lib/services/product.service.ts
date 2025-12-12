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
    // Clean data before sending
    const cleanData = {
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      category_id: data.category_id,
      brand_id: data.brand_id,
      // NEW FIELDS
      compare_at_price: data.compare_at_price || null,
      is_flash_sale: data.is_flash_sale || false,
      flash_sale_end: data.flash_sale_end || null,
    };

    const response = await apiClient.post<{ data: Product }>(
      API_ENDPOINTS.PRODUCTS.CREATE,
      cleanData
    );
    return response.data.data;
  }

  async updateProduct(id: number, data: Partial<Product>): Promise<Product> {
    // Clean data before sending
    const cleanData = {
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      category_id: data.category_id,
      brand_id: data.brand_id,
      // NEW FIELDS
      compare_at_price: data.compare_at_price || null,
      is_flash_sale: data.is_flash_sale || false,
      flash_sale_end: data.flash_sale_end || null,
    };

    const response = await apiClient.put<{ data: Product }>(
      API_ENDPOINTS.PRODUCTS.UPDATE(id),
      cleanData
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