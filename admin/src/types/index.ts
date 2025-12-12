export interface User {
  id: number;
  nickname: string;
  email: string;
  full_name?: string;
  phone?: string;
  created_at?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  brand_id?: number;
  category_id?: number;
  price: number;
  compare_at_price?: number;
  is_flash_sale?: boolean;
  flash_sale_end?: string;
  stock: number;
  category?: { id: number; name: string };
  brand?: { id: number; name: string };
  media?: { url: string }[];
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: number;
  brand_id?: number;
}

export interface Order {
  id: number;
  user_id: number;
  status: string;
  total_amount: number;
  shipping_cost: number;
  payment_method: string;
  created_at: string;
  user?: User;
  items: OrderItem[];
  payment?: any;
  shipment?: any;
}

export interface OrderItem {
  id: number;
  product_name_snapshot: string;
  price_snapshot: number;
  quantity: number;
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
