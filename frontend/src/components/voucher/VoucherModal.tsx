'use client';

import { useState, useEffect } from 'react';
import { X, Search, Tag, Check } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { voucherService } from '@/lib/services/voucher.service';
import { formatCurrency } from '@/lib/utils/format';
import type { Voucher } from '@/types/voucher';
import toast from 'react-hot-toast';

interface VoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (voucher: Voucher) => void;
  subtotal: number;
}

export const VoucherModal = ({ isOpen, onClose, onApply, subtotal }: VoucherModalProps) => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadVouchers();
    }
  }, [isOpen]);

  const loadVouchers = async () => {
    setIsLoading(true);
    try {
      const data = await voucherService.getAvailableVouchers();
      setVouchers(data);
    } catch (error) {
      console.error('Failed to load vouchers:', error);
      setVouchers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyManual = async () => {
    if (!manualCode.trim()) {
      toast.error('Please enter voucher code');
      return;
    }

    setIsApplying(true);
    try {
      const result = await voucherService.applyVoucher({
        code: manualCode.trim(),
        subtotal,
      });

      if (result.valid && result.voucher) {
        onApply(result.voucher);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to apply voucher');
    } finally {
      setIsApplying(false);
    }
  };

  const handleSelectVoucher = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
  };

  const handleConfirm = () => {
    if (selectedVoucher) {
      onApply(selectedVoucher);
    }
  };

  const isVoucherEligible = (voucher: Voucher) => {
    if (!voucher.is_active) return false;
    if (voucher.min_purchase && subtotal < voucher.min_purchase) return false;
    
    const now = new Date();
    const validFrom = new Date(voucher.valid_from);
    const validUntil = new Date(voucher.valid_until);
    
    return now >= validFrom && now <= validUntil;
  };

  const getVoucherValue = (voucher: Voucher) => {
    if (voucher.type === 'FREE_SHIPPING') {
      return 'FREE SHIPPING';
    }
    if (voucher.discount_amount) {
      return formatCurrency(voucher.discount_amount);
    }
    return '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="text-xl font-bold text-gray-900">Select Voucher</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Manual Entry */}
          <div className="p-6 border-b bg-gray-50">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Voucher Code
            </label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter voucher code"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleApplyManual();
                  }
                }}
              />
              <Button
                onClick={handleApplyManual}
                isLoading={isApplying}
                disabled={!manualCode.trim()}
              >
                Apply
              </Button>
            </div>
          </div>

          {/* Voucher List */}
          <div className="flex-1 overflow-y-auto p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Available Vouchers</h4>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              </div>
            ) : vouchers.length === 0 ? (
              <div className="text-center py-8">
                <Tag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No vouchers available</p>
              </div>
            ) : (
              <div className="space-y-3">
                {vouchers.map((voucher) => {
                  const eligible = isVoucherEligible(voucher);
                  const isSelected = selectedVoucher?.id === voucher.id;

                  return (
                    <button
                      key={voucher.id}
                      onClick={() => eligible && handleSelectVoucher(voucher)}
                      disabled={!eligible}
                      className={`w-full text-left border-2 rounded-lg p-4 transition-all ${
                        isSelected
                          ? 'border-green-500 bg-green-50'
                          : eligible
                          ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3 flex-1">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                            voucher.type === 'FREE_SHIPPING' ? 'bg-green-100' : 'bg-blue-100'
                          }`}>
                            <Tag className={`w-6 h-6 ${
                              voucher.type === 'FREE_SHIPPING' ? 'text-green-600' : 'text-blue-600'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-semibold text-gray-900 mb-1">{voucher.name}</h5>
                            <p className="text-sm text-gray-600 mb-2">{voucher.description}</p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded font-mono font-bold">
                                {voucher.code}
                              </span>
                              <span className="text-sm font-semibold text-gray-900">
                                {getVoucherValue(voucher)}
                              </span>
                            </div>
                            {voucher.min_purchase && (
                              <p className="text-xs text-gray-500 mt-2">
                                Min. purchase: {formatCurrency(voucher.min_purchase)}
                              </p>
                            )}
                            {!eligible && voucher.min_purchase && subtotal < voucher.min_purchase && (
                              <p className="text-xs text-red-600 mt-1">
                                Need {formatCurrency(voucher.min_purchase - subtotal)} more to use
                              </p>
                            )}
                          </div>
                        </div>
                        {isSelected && (
                          <div className="flex-shrink-0 ml-3">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t p-6 flex gap-3">
            <Button
              variant="outline"
              fullWidth
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              onClick={handleConfirm}
              disabled={!selectedVoucher}
            >
              Use Voucher
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};