import apiClient from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import type { LoginRequest, AuthResponse, User } from '@/types';

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<{ data: AuthResponse }>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    return response.data.data;
  }

  async logout(): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  }

  async getProfile(): Promise<User> {
    const response = await apiClient.get<{ data: User }>(
      API_ENDPOINTS.AUTH.PROFILE
    );
    return response.data.data;
  }
}

export const authService = new AuthService();