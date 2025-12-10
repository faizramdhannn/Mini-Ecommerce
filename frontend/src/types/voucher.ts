// frontend/src/types/voucher.ts

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