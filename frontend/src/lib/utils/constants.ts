// App Constants
export const APP_NAME = 'Minitorch';
export const APP_DESCRIPTION = 'Your Online Shopping Destination';

// Shipping
export const SHIPPING_COST = 20000;

// Order Status
export const ORDER_STATUS = {
  PENDING: {
    label: 'Pending',
    color: 'yellow',
    description: 'Waiting for payment',
  },
  PAID: {
    label: 'Paid',
    color: 'blue',
    description: 'Payment received',
  },
  SHIPPED: {
    label: 'Shipped',
    color: 'purple',
    description: 'Order is on delivery',
  },
  DELIVERED: {
    label: 'Delivered',
    color: 'green',
    description: 'Order has been delivered',
  },
  COMPLETED: {
    label: 'Completed',
    color: 'green',
    description: 'Order completed',
  },
  CANCELED: {
    label: 'Canceled',
    color: 'red',
    description: 'Order canceled',
  },
};

// Payment Methods
export const PAYMENT_METHODS = [
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'e_wallet', label: 'E-Wallet' },
  { value: 'cod', label: 'Cash on Delivery' },
];

// Pagination
export const DEFAULT_PAGE_SIZE = 12;
export const PAGE_SIZES = [12, 24, 36, 48];

// Product
export const PRODUCT_SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A to Z' },
  { value: 'name_desc', label: 'Name: Z to A' },
];

// Validation
export const PASSWORD_MIN_LENGTH = 6;
export const NICKNAME_MIN_LENGTH = 3;
export const NICKNAME_MAX_LENGTH = 50;

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  CART: 'cart',
  THEME: 'theme',
};

// API
export const API_TIMEOUT = 30000; // 30 seconds

// Image
export const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect fill="%23e5e7eb" width="100" height="100"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

// Toast
export const TOAST_DURATION = 3000;