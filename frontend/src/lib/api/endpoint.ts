export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
    UPDATE_PASSWORD: '/auth/password',
  },
  
  // Products
  PRODUCTS: {
    LIST: '/products',
    BY_SLUG: (slug: string) => `/products/${slug}`,
    CREATE: '/products',
    UPDATE: (id: number) => `/products/${id}`,
    DELETE: (id: number) => `/products/${id}`,
  },
  
  // Categories
  CATEGORIES: {
    LIST: '/products/categories',
    BY_SLUG: (slug: string) => `/categories/${slug}`,
    PRODUCTS: (slug: string) => `/categories/${slug}/products`,
  },
  
  // Brands
  BRANDS: {
    LIST: '/products/brands',
    BY_SLUG: (slug: string) => `/brands/${slug}`,
    PRODUCTS: (slug: string) => `/brands/${slug}/products`,
  },
  
  // Search
  SEARCH: '/search',
  
  // Cart
  CART: {
    GET: '/cart',
    ADD_ITEM: '/cart/items',
    UPDATE_ITEM: (id: number) => `/cart/items/${id}`,
    REMOVE_ITEM: (id: number) => `/cart/items/${id}`,
    CLEAR: '/cart/clear',
  },
  
  // Orders
  ORDERS: {
    LIST: '/orders',
    DETAIL: (id: number) => `/orders/${id}`,
    CREATE: '/orders',
    UPDATE_STATUS: (id: number) => `/orders/${id}/status`,
    COMPLETE: (id: number) => `/orders/${id}/complete`,
    CANCEL: (id: number) => `/orders/${id}/cancel`,
    CREATE_PAYMENT: (id: number) => `/orders/${id}/payment`,
    CREATE_SHIPMENT: (id: number) => `/orders/${id}/shipment`,
    UPDATE_SHIPMENT_STATUS: (id: number) => `/orders/${id}/shipment/status`,
  },
  
  // Users
  USERS: {
    LIST: '/users',
    DETAIL: (id: number) => `/users/${id}`,
    UPDATE: (id: number) => `/users/${id}`,
    DELETE: (id: number) => `/users/${id}`,
    ADDRESSES: (id: number) => `/users/${id}/addresses`,
    ADD_ADDRESS: (id: number) => `/users/${id}/addresses`,
    UPDATE_ADDRESS: (id: number, addressId: number) => `/users/${id}/addresses/${addressId}`,
    DELETE_ADDRESS: (id: number, addressId: number) => `/users/${id}/addresses/${addressId}`,
  },
};