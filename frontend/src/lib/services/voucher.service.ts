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
    type: 'DISCOUNT',
    discount_amount: 100000,
    min_purchase: 200000,
    valid_from: '2025-01-01',
    valid_until: '2025-12-31',
    is_active: true,
    used_count: 0,
  },
  {
    id: 2,
    code: 'GRATONG',
    name: 'Gratong Free Shipping',
    description: 'Free shipping for all orders',
    type: 'FREE_SHIPPING',
    min_purchase: 0,
    valid_from: '2025-01-01',
    valid_until: '2025-12-31',
    is_active: true,
    used_count: 0,
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

          // Voucher is valid
          resolve({
            valid: true,
            message: 'Voucher applied successfully',
            discount_amount: voucher.type === 'DISCOUNT' ? voucher.discount_amount : 0,
            free_shipping: voucher.type === 'FREE_SHIPPING',
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