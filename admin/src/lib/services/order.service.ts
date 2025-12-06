import apiClient from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import type { Order, PaginatedResponse } from '@/types';

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

  async updateStatus(id: number, status: string): Promise<Order> {
    const response = await apiClient.patch<{ data: Order }>(
      API_ENDPOINTS.ORDERS.UPDATE_STATUS(id),
      { status }
    );
    return response.data.data;
  }
}

export const orderService = new OrderService();