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
    DETAIL: (id: number) => `/products/${id}`,
    CREATE: '/products',
    UPDATE: (id: number) => `/products/${id}`,
    DELETE: (id: number) => `/products/${id}`,
    CATEGORIES: '/products/categories',
    BRANDS: '/products/brands',
  },
  
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
  
  // Payments
  PAYMENTS: {
    LIST: '/payments',
    DETAIL: (id: number) => `/payments/${id}`,
    CREATE: '/payments',
    UPDATE: (id: number) => `/payments/${id}`,
    DELETE: (id: number) => `/payments/${id}`,
  },
  
  // Shipments
  SHIPMENTS: {
    LIST: '/shipments',
    DETAIL: (id: number) => `/shipments/${id}`,
    CREATE: '/shipments',
    UPDATE: (id: number) => `/shipments/${id}`,
    DELETE: (id: number) => `/shipments/${id}`,
    TRACK: (trackingNumber: string) => `/shipments/track/${trackingNumber}`,
  },
};