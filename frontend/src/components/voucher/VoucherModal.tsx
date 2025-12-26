'use client';

import { X, Tag, Loader2 } from 'lucide-react';
import type { Voucher } from '@/types/voucher';
import { formatCurrency } from '@/lib/utils/format';

interface VoucherListModalProps {
  isOpen: boolean;
  onClose: () => void;
  vouchers: Voucher[];
  isLoading: boolean;
  subtotal: number;
  onApplyVoucher: (voucher: Voucher) => void;
  appliedVoucherCode?: string;
}

export default function VoucherListModal({
  isOpen,
  onClose,
  vouchers,
  isLoading,
  subtotal,
  onApplyVoucher,
  appliedVoucherCode,
}: VoucherListModalProps) {
  if (!isOpen) return null;

  const isVoucherEligible = (voucher: Voucher) => {
    // Fix: Handle undefined min_purchase
    return subtotal >= (voucher.min_purchase ?? 0);
  };

  const getDiscountBadge = (voucher: Voucher) => {
    // Fix: All properties are now required in Voucher type
    if (voucher.discount_type === 'free_shipping') {
      return (
        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold">
          FREE SHIPPING
        </span>
      );
    }
    
    if (voucher.discount_type === 'fixed') {
      return (
        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-semibold">
          Diskon {formatCurrency(voucher.discount_value)}
        </span>
      );
    }

    if (voucher.discount_type === 'percentage') {
      return (
        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-semibold">
          Diskon {voucher.discount_value}%
        </span>
      );
    }

    return null;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <div className="flex items-center gap-2">
              <Tag className="w-6 h-6 text-orange-500" />
              <h3 className="text-xl font-bold">Voucher Tersedia</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : vouchers.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Tag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">Tidak ada voucher tersedia</p>
                <p className="text-sm">Periksa kembali nanti untuk promo menarik!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {vouchers.map((voucher) => {
                  const eligible = isVoucherEligible(voucher);
                  const isApplied = appliedVoucherCode === voucher.code;

                  return (
                    <div
                      key={voucher.id}
                      className={`border rounded-lg p-4 transition-all ${
                        eligible
                          ? 'border-gray-200 hover:border-orange-500 hover:shadow-md'
                          : 'border-gray-100 bg-gray-50 opacity-60'
                      } ${isApplied ? 'border-green-500 bg-green-50' : ''}`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          {/* Voucher Code */}
                          <div className="flex items-center gap-2 mb-2">
                            <code className="bg-orange-100 text-orange-800 px-3 py-1 rounded font-bold text-sm">
                              {voucher.code}
                            </code>
                            {getDiscountBadge(voucher)}
                          </div>

                          {/* Voucher Name */}
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {voucher.name}
                          </h4>

                          {/* Voucher Description */}
                          <p className="text-sm text-gray-600 mb-2">
                            {voucher.description}
                          </p>

                          {/* Minimum Purchase - Fix: Handle undefined */}
                          {(voucher.min_purchase ?? 0) > 0 && (
                            <p className="text-xs text-gray-500">
                              Min. belanja: {formatCurrency(voucher.min_purchase ?? 0)}
                            </p>
                          )}

                          {/* Ineligible Warning */}
                          {!eligible && (
                            <p className="text-xs text-red-500 mt-2">
                              ⚠️ Subtotal belanja kurang dari minimum
                            </p>
                          )}

                          {/* Applied Badge */}
                          {isApplied && (
                            <p className="text-xs text-green-600 font-semibold mt-2">
                              ✓ Voucher sedang digunakan
                            </p>
                          )}
                        </div>

                        {/* Apply Button */}
                        <button
                          onClick={() => onApplyVoucher(voucher)}
                          disabled={!eligible || isApplied}
                          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                            isApplied
                              ? 'bg-green-500 text-white cursor-default'
                              : eligible
                              ? 'bg-orange-500 text-white hover:bg-orange-600'
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {isApplied ? 'Terpilih' : 'Pakai'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t p-4 bg-gray-50">
            <p className="text-sm text-gray-600 text-center">
              💡 Pilih voucher yang sesuai dengan pembelian Anda
            </p>
          </div>
        </div>
      </div>
    </>
  );
}