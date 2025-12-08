export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
    UPDATE_PASSWORD: '/auth/password',
  },
  
  // Products - NEW STRUCTURE
  PRODUCTS: {
    // All products
    LIST: '/products',
    // Single product by slug
    DETAIL: (slug: string) => `/products?${slug}`,
    // Create/Update/Delete (admin)
    CREATE: '/products',
    UPDATE: (id: number) => `/products/${id}`,
    DELETE: (id: number) => `/products/${id}`,
  },
  
  // Categories - NEW STRUCTURE
  CATEGORIES: {
    // All categories
    LIST: '/categories',
    // Single category by slug
    DETAIL: (slug: string) => `/categories?${slug}`,
    // Products by category slug
    PRODUCTS: (slug: string) => `/categories/${slug}/products`,
  },
  
  // Brands - NEW STRUCTURE
  BRANDS: {
    // All brands
    LIST: '/brands',
    // Single brand by slug
    DETAIL: (slug: string) => `/brands?${slug}`,
    // Products by brand slug
    PRODUCTS: (slug: string) => `/brands/${slug}/products`,
  },
  
  // Search
  SEARCH: {
    PRODUCTS: '/search',
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