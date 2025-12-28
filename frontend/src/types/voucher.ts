// frontend/src/types/voucher.ts

export interface Voucher {
  id: number;
  code: string;
  name: string;
  description: string;
  
  // Discount configuration
  type: 'FIXED' | 'PERCENTAGE' | 'FREE_SHIPPING';  // ✅ Used in checkout page
  discount_type: 'fixed' | 'percentage' | 'free_shipping';  // ✅ Used in modal
  discount_value: number;
  discount_amount?: number;  // ✅ Calculated discount amount
  
  // Purchase requirements
  min_purchase: number;
  max_discount: number | null;
  
  // Usage tracking
  usage_limit: number;
  used_count: number;
  
  // Validity period
  valid_from: Date;
  valid_until: Date;
  is_active: boolean;
  
  // Timestamps
  created_at?: Date;
  updated_at?: Date;
}

export interface VoucherApplication {
  voucher: Voucher;
  discount_amount: number;
  free_shipping: boolean;
}

// ✅ Request/Response types untuk apply voucher
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