// frontend/src/types/index.ts

// User Types
export interface User {
  id: number;
  nickname: string;
  email: string;
  full_name?: string;
  phone?: string;
  profile_image?: string;
  birthday?: string;
  role?: 'user' | 'admin';
  created_at?: string;
  updated_at?: string;
}

export interface UserAddress {
  id: number;
  user_id: number;
  label?: string;
  recipient_name: string;
  phone: string;
  address_line: string;
  city: string;
  province: string;
  postal_code?: string;
  is_default: boolean;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nickname: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Product Types
export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
}

export interface ProductMedia {
  id: number;
  product_id: number;
  media_type?: string;
  url: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  brand_id?: number;
  category_id?: number;
  price: number;
  compare_at_price?: number;
  is_flash_sale?: boolean;
  flash_sale_end?: string;
  stock: number;
  rating?: number;
  created_at?: string;
  updated_at?: string;
  category?: Category;
  brand?: Brand;
  media?: ProductMedia[];
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  category_slug?: string;
  brand_id?: number;
  min_price?: number;
  max_price?: number;
}

// Cart Types
export interface Cart {
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  items: CartItem[];
}

export interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  product: Product;
}

export interface AddToCartRequest {
  product_id: number;
  quantity: number;
}

// Order Types
export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'COMPLETED' | 'CANCELED';

export interface Order {
  id: number;
  user_id: number;
  status: OrderStatus;
  total_amount: number;
  shipping_cost: number;
  payment_method: string;
  created_at: string;
  updated_at: string;
  user?: User;
  items: OrderItem[];
  payment?: Payment;
  shipment?: Shipment;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name_snapshot: string;
  price_snapshot: number;
  quantity: number;
  product?: Product;
}

export interface CreateOrderRequest {
  items: {
    product_id: number;
    quantity: number;
  }[];
  payment_method: string;
  shipping_cost?: number;
  voucher_code?: string;
}

// Payment Types
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED';

export interface Payment {
  id: number;
  order_id: number;
  provider: string;
  status: PaymentStatus;
  transaction_id: string;
  amount: number;
  paid_at?: string;
  expired_at?: string;
  created_at: string;
  updated_at: string;
  order?: Order;
}

// Shipment Types
export type ShipmentStatus = 'WAITING_PICKUP' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED';

export interface Shipment {
  id: number;
  order_id: number;
  courier: string;
  tracking_number: string;
  status: ShipmentStatus;
  shipped_at?: string;
  delivered_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  order?: Order;
}

// Voucher Types
export interface Voucher {
  id: number;
  code: string;
  name: string;
  description: string;
  type: 'DISCOUNT' | 'FREE_SHIPPING';
  discount_amount?: number;
  min_purchase?: number;
  max_discount?: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  usage_limit?: number;
  used_count: number;
}

export interface UserVoucher {
  id: number;
  user_id: number;
  voucher_id: number;
  used_at?: string;
  voucher: Voucher;
}

export interface ApplyVoucherRequest {
  code: string;
  subtotal: number;
}

export interface ApplyVoucherResponse {
  valid: boolean;
  message: string;
  discount_amount?: number;
  free_shipping?: boolean;
  voucher?: Voucher;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}