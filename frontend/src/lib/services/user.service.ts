import apiClient from '../api/client';
import { API_ENDPOINTS } from '../api/endpoint';
import type { User, UserAddress } from '@/types';

class UserService {
  async getUser(id: number): Promise<User> {
    const response = await apiClient.get<{ data: User }>(
      API_ENDPOINTS.USERS.DETAIL(id)
    );
    return response.data.data;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const response = await apiClient.put<{ data: User }>(
      API_ENDPOINTS.USERS.UPDATE(id),
      data
    );
    return response.data.data;
  }

  async getUserAddresses(id: number): Promise<UserAddress[]> {
    const response = await apiClient.get<{ data: UserAddress[] }>(
      API_ENDPOINTS.USERS.ADDRESSES(id)
    );
    return response.data.data;
  }

  async addAddress(userId: number, data: Omit<UserAddress, 'id' | 'user_id'>): Promise<UserAddress> {
    const response = await apiClient.post<{ data: UserAddress }>(
      API_ENDPOINTS.USERS.ADD_ADDRESS(userId),
      data
    );
    return response.data.data;
  }

  async updateAddress(
    userId: number,
    addressId: number,
    data: Partial<UserAddress>
  ): Promise<UserAddress> {
    const response = await apiClient.put<{ data: UserAddress }>(
      API_ENDPOINTS.USERS.UPDATE_ADDRESS(userId, addressId),
      data
    );
    return response.data.data;
  }

  async deleteAddress(userId: number, addressId: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.USERS.DELETE_ADDRESS(userId, addressId));
  }

  async setDefaultAddress(userId: number, addressId: number): Promise<UserAddress> {
    const response = await apiClient.patch<{ data: UserAddress }>(
      API_ENDPOINTS.USERS.UPDATE_ADDRESS(userId, addressId),
      { is_default: true }
    );
    return response.data.data;
  }
}

export const userService = new UserService();