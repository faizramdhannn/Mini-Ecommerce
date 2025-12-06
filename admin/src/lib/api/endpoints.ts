export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
  },
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id: number) => `/products/${id}`,
    CREATE: '/products',
    UPDATE: (id: number) => `/products/${id}`,
    DELETE: (id: number) => `/products/${id}`,
    CATEGORIES: '/products/categories',
    BRANDS: '/products/brands',
  },
  ORDERS: {
    LIST: '/orders',
    DETAIL: (id: number) => `/orders/${id}`,
    UPDATE_STATUS: (id: number) => `/orders/${id}/status`,
  },
  USERS: {
    LIST: '/users',
    DETAIL: (id: number) => `/users/${id}`,
  },
};