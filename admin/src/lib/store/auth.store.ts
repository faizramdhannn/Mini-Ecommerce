import { create } from 'zustand';
import { authService } from '../services/auth.service';
import type { User, LoginRequest } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  initAuth: () => {
    if (typeof window === 'undefined') return;
    
    const token = localStorage.getItem('admin_token');
    const userStr = localStorage.getItem('admin_user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user, token, isAuthenticated: true });
      } catch (error) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
      }
    }
  },

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const response = await authService.login(credentials);
      localStorage.setItem('admin_token', response.token);
      localStorage.setItem('admin_user', JSON.stringify(response.user));
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      set({ user: null, token: null, isAuthenticated: false });
    }
  },
}));