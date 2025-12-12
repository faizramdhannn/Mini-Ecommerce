export interface User {
  id: number;
  nickname: string;
  email: string;
  full_name?: string;
  phone?: string;
  role?: string;
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
  slug?: string;
  description?: string;
  brand_id?: number;
  category_id?: number;
  price: number;
  
  // NEW FIELDS - Flash Sale & Discount
  compare_at_price?: number | null;
  is_flash_sale?: boolean;
  flash_sale_end?: string | null;
  
  stock: number;
  rating?: number;
  category?: { id: number; name: string; slug?: string };
  brand?: { id: number; name: string; slug?: string };
  media?: { url: string; media_type?: string }[];
  created_at?: string;
  updated_at?: string;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: number;
  category_slug?: string;
  brand_id?: number;
  min_price?: number;
  max_price?: number;
  is_flash_sale?: boolean;
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
  product_id: number;
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