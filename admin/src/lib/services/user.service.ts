import apiClient from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import type { User, PaginatedResponse } from '@/types';

class UserService {
  async getUsers(page: number = 1, limit: number = 10): Promise<PaginatedResponse<User>> {
    const response = await apiClient.get<PaginatedResponse<User>>(
      API_ENDPOINTS.USERS.LIST,
      { params: { page, limit } }
    );
    return response.data;
  }

  async getUser(id: number): Promise<User> {
    const response = await apiClient.get<{ data: User }>(
      API_ENDPOINTS.USERS.DETAIL(id)
    );
    return response.data.data;
  }
}

export const userService = new UserService();