// frontend/src/components/voucher/VoucherCard.tsx
'use client';

import { Copy, Check, Tag } from 'lucide-react';
import { useState } from 'react';
import type { Voucher } from '@/types/voucher';
import { formatCurrency } from '@/lib/utils/format';
import toast from 'react-hot-toast';

interface VoucherCardProps {
  voucher: Voucher;
}

export const VoucherCard = ({ voucher }: VoucherCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(voucher.code);
    setCopied(true);
    toast.success('Voucher code copied!');
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const getVoucherValue = () => {
    if (voucher.type === 'FREE_SHIPPING') {
      return 'FREE SHIPPING';
    }
    if (voucher.discount_amount) {
      return formatCurrency(voucher.discount_amount);
    }
    return '';
  };

  const isExpired = new Date(voucher.valid_until) < new Date();
  const isAvailable = voucher.usage_limit ? voucher.used_count < voucher.usage_limit : true;

  return (
    <div className={`border rounded-lg overflow-hidden transition-all ${
      isExpired || !isAvailable ? 'opacity-50 bg-gray-50' : 'hover:shadow-md bg-white'
    }`}>
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              voucher.type === 'FREE_SHIPPING' ? 'bg-green-100' : 'bg-blue-100'
            }`}>
              <Tag className={`w-6 h-6 ${
                voucher.type === 'FREE_SHIPPING' ? 'text-green-600' : 'text-blue-600'
              }`} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{voucher.name}</h3>
              <p className="text-sm text-gray-600">{getVoucherValue()}</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-3">{voucher.description}</p>

        {voucher.min_purchase && (
          <p className="text-xs text-gray-500 mb-3">
            Min. purchase: {formatCurrency(voucher.min_purchase)}
          </p>
        )}

        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-2">
            <code className="px-3 py-1 bg-gray-100 text-gray-900 rounded font-mono text-sm font-semibold">
              {voucher.code}
            </code>
          </div>
          
          <button
            onClick={handleCopy}
            disabled={isExpired || !isAvailable}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        </div>

        {isExpired && (
          <p className="text-xs text-red-600 mt-2">Expired</p>
        )}
        {!isAvailable && (
          <p className="text-xs text-red-600 mt-2">Quota reached</p>
        )}
      </div>
    </div>
  );
};