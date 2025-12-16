import apiClient from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import type { Product, ProductFilters, PaginatedResponse } from '@/types';

class ProductService {
  /**
   * Get products list (for listing page)
   */
  async getProducts(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    const response = await apiClient.get<PaginatedResponse<Product>>(
      API_ENDPOINTS.PRODUCTS.LIST,
      { params: filters }
    );
    return response.data;
  }

  /**
   * Get product by ID (for admin edit - FIXED!)
   * Backend route: GET /api/products/:id (ini route admin, bukan public)
   */
  async getProduct(id: number): Promise<Product> {
    const response = await apiClient.get<{ data: Product }>(
      `/products/${id}`// Ini akan hit backend endpoint yang benar
    );
    return response.data.data;
  }

  /**
   * Create product
   */
  async createProduct(data: Partial<Product>): Promise<Product> {
    const cleanData = {
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      category_id: data.category_id,
      brand_id: data.brand_id,
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

  /**
   * Update product
   */
  async updateProduct(id: number, data: Partial<Product>): Promise<Product> {
    const cleanData = {
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      category_id: data.category_id,
      brand_id: data.brand_id,
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

  /**
   * Delete product
   */
  async deleteProduct(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.PRODUCTS.DELETE(id));
  }

  /**
   * Get categories
   */
  async getCategories() {
    const response = await apiClient.get<{ data: any[] }>(
      API_ENDPOINTS.PRODUCTS.CATEGORIES
    );
    return response.data.data;
  }

  /**
   * Get brands
   */
  async getBrands() {
    const response = await apiClient.get<{ data: any[] }>(
      API_ENDPOINTS.PRODUCTS.BRANDS
    );
    return response.data.data;
  }
}

export const productService = new ProductService();