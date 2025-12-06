import { create } from 'zustand';
import { authService } from '../services/auth.service';
import type { User, LoginRequest, RegisterRequest } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  initAuth: () => {
    if (typeof window === 'undefined') return;
    
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user, token, isAuthenticated: true });
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  },

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const response = await authService.login(credentials);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
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

  register: async (data) => {
    set({ isLoading: true });
    try {
      const response = await authService.register(data);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
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
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    }
  },

  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },
}));