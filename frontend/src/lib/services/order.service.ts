import apiClient from '../api/client';
import { API_ENDPOINTS } from '../api/endpoint';
import type { Order, CreateOrderRequest, PaginatedResponse } from '@/types';

class OrderService {
  async getOrders(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Order>> {
    const response = await apiClient.get<PaginatedResponse<Order>>(
      API_ENDPOINTS.ORDERS.LIST,
      { params: { page, limit } }
    );
    return response.data;
  }

  async getOrder(id: number): Promise<Order> {
    const response = await apiClient.get<{ data: Order }>(
      API_ENDPOINTS.ORDERS.DETAIL(id)
    );
    return response.data.data;
  }

  async createOrder(data: CreateOrderRequest): Promise<Order> {
    const response = await apiClient.post<{ data: Order }>(
      API_ENDPOINTS.ORDERS.CREATE,
      data
    );
    return response.data.data;
  }

  async cancelOrder(id: number, reason?: string): Promise<Order> {
    const response = await apiClient.patch<{ data: Order }>(
      API_ENDPOINTS.ORDERS.CANCEL(id),
      { reason }
    );
    return response.data.data;
  }
}

export const orderService = new OrderService();