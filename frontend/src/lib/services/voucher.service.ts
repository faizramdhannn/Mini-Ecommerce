// frontend/src/lib/services/voucher.service.ts

import apiClient from '../api/client';
import type { Voucher, ApplyVoucherRequest, ApplyVoucherResponse } from '@/types/voucher';

// Mock vouchers data (replace with real API call when backend is ready)
const MOCK_VOUCHERS: Voucher[] = [
  {
    id: 1,
    code: 'HELOBRO',
    name: 'HeloBro Discount',
    description: 'Get Rp 100.000 off for your purchase',
    type: 'FIXED',  // ✅ FIXED: Changed from 'DISCOUNT' to 'FIXED'
    discount_type: 'fixed',
    discount_value: 100000,
    discount_amount: 100000,
    min_purchase: 200000,
    max_discount: null,
    usage_limit: 100,
    used_count: 0,
    valid_from: new Date('2025-01-01'),
    valid_until: new Date('2025-12-31'),
    is_active: true,
  },
  {
    id: 2,
    code: 'GRATONG',
    name: 'Gratong Free Shipping',
    description: 'Free shipping for all orders',
    type: 'FREE_SHIPPING',  // ✅ Correct type
    discount_type: 'free_shipping',
    discount_value: 0,
    discount_amount: 0,
    min_purchase: 0,
    max_discount: null,
    usage_limit: 100,
    used_count: 0,
    valid_from: new Date('2025-01-01'),
    valid_until: new Date('2025-12-31'),
    is_active: true,
  },
  {
    id: 3,
    code: 'DISKON20',
    name: '20% Discount',
    description: 'Get 20% off for your purchase',
    type: 'PERCENTAGE',  // ✅ New example with percentage
    discount_type: 'percentage',
    discount_value: 20,
    min_purchase: 500000,
    max_discount: 200000,
    usage_limit: 50,
    used_count: 0,
    valid_from: new Date('2025-01-01'),
    valid_until: new Date('2025-12-31'),
    is_active: true,
  },
];

class VoucherService {
  // Get available vouchers
  async getAvailableVouchers(): Promise<Voucher[]> {
    try {
      // For now, return mock data
      // Replace with real API call: const response = await apiClient.get<{ data: Voucher[] }>('/vouchers/available');
      return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_VOUCHERS), 500);
      });
    } catch (error) {
      console.error('Error fetching vouchers:', error);
      return [];
    }
  }

  // Apply voucher
  async applyVoucher(data: ApplyVoucherRequest): Promise<ApplyVoucherResponse> {
    try {
      // For now, use mock validation
      // Replace with real API call: const response = await apiClient.post<ApplyVoucherResponse>('/vouchers/apply', data);
      
      return new Promise((resolve) => {
        setTimeout(() => {
          const voucher = MOCK_VOUCHERS.find(v => v.code === data.code.toUpperCase());
          
          if (!voucher) {
            resolve({
              valid: false,
              message: 'Invalid voucher code',
            });
            return;
          }

          if (!voucher.is_active) {
            resolve({
              valid: false,
              message: 'This voucher is no longer active',
            });
            return;
          }

          // Check expiry
          const now = new Date();
          const validFrom = new Date(voucher.valid_from);
          const validUntil = new Date(voucher.valid_until);
          
          if (now < validFrom || now > validUntil) {
            resolve({
              valid: false,
              message: 'This voucher has expired',
            });
            return;
          }

          // Check minimum purchase
          if (voucher.min_purchase && data.subtotal < voucher.min_purchase) {
            resolve({
              valid: false,
              message: `Minimum purchase of Rp ${voucher.min_purchase.toLocaleString('id-ID')} required`,
            });
            return;
          }

          // Calculate discount based on type
          let discountAmount = 0;
          let freeShipping = false;

          if (voucher.type === 'FIXED') {
            discountAmount = voucher.discount_value;
          } else if (voucher.type === 'PERCENTAGE') {
            discountAmount = Math.floor((data.subtotal * voucher.discount_value) / 100);
            // Apply max discount if specified
            if (voucher.max_discount && discountAmount > voucher.max_discount) {
              discountAmount = voucher.max_discount;
            }
          } else if (voucher.type === 'FREE_SHIPPING') {
            freeShipping = true;
          }

          // Voucher is valid
          resolve({
            valid: true,
            message: 'Voucher applied successfully',
            discount_amount: discountAmount,
            free_shipping: freeShipping,
            voucher,
          });
        }, 500);
      });
    } catch (error: any) {
      return {
        valid: false,
        message: error.response?.data?.message || 'Invalid voucher code',
      };
    }
  }
}

export const voucherService = new VoucherService();