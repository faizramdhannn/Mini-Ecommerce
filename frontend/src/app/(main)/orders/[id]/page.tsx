// frontend/src/app/(main)/orders/[id]/page.tsx - UPDATED WITH AUTO-REFRESH
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Package, CreditCard, Truck, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { orderService } from '@/lib/services/order.service';
import { useAutoRefresh } from '@/lib/hooks/useAutoRefresh';
import { formatCurrency, formatDateTime } from '@/lib/utils/format';
import { ORDER_STATUS } from '@/lib/utils/constants';
import type { Order } from '@/types';
import toast from 'react-hot-toast';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedResi, setCopiedResi] = useState(false);

  // ⭐ Auto-refresh order status every 10 seconds
  const { refresh } = useAutoRefresh({
    interval: 10000, // 10 seconds
    enabled: !!order, // Only when order is loaded
    onRefresh: loadOrder,
  });

  useEffect(() => {
    loadOrder();
  }, [params.id]);

  async function loadOrder() {
    try {
      const data = await orderService.getOrder(Number(params.id));
      console.log('Order loaded:', data);
      setOrder(data);
    } catch (error) {
      console.error('Failed to load order:', error);
      toast.error('Failed to load order');
      if (isLoading) {
        router.push('/orders');
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopyResi = (trackingNumber: string) => {
    navigator.clipboard.writeText(trackingNumber);
    setCopiedResi(true);
    toast.success('Tracking number copied!');
    setTimeout(() => setCopiedResi(false), 2000);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = ORDER_STATUS[status as keyof typeof ORDER_STATUS];
    const variantMap: Record<string, any> = {
      yellow: 'warning',
      blue: 'info',
      purple: 'info',
      green: 'success',
      red: 'danger',
    };
    return (
      <Badge variant={variantMap[statusConfig.color]}>
        {statusConfig.label}
      </Badge>
    );
  };

  const getProductImage = (item: any) => {
    const possibleImages = [
      item.product?.media?.[0]?.url,
      item.product?.media?.[0],
      item.product?.image,
      item.product_image_snapshot,
    ];

    for (const img of possibleImages) {
      if (img) {
        const url = typeof img === 'string' ? img : img?.url;
        if (url && url.trim() !== '') {
          return url;
        }
      }
    }

    return '/images/placeholder.png';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!order) return null;

  const isPaid = order.status === 'PAID' || order.status === 'SHIPPED' || order.status === 'DELIVERED' || order.status === 'COMPLETED';

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white hover:text-gray-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Orders
        </button>

        {/* ⭐ Auto-refresh indicator */}
        <div className="bg-blue-500 text-white rounded-lg p-3 mb-6 flex items-center gap-2">
          <span className="animate-pulse">🔄</span>
          <span className="text-sm">Status pesanan diperbarui otomatis setiap 10 detik</span>
        </div>

        <div className="bg-white rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-black text-2xl font-bold">Order #{order.id}</h1>
              <p className="text-gray-600 text-sm mt-1">
                {formatDateTime(order.created_at)}
              </p>
            </div>
            {getStatusBadge(order.status)}
          </div>

          {/* Tracking Number Card */}
          {isPaid && (
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Truck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Tracking Number</h3>
                    <p className="text-sm text-gray-600">Your order has been shipped</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 mb-1">Courier: <span className="font-semibold">JNE Regular</span></p>
                    <div className="flex items-center gap-2">
                      <code className="text-2xl font-mono font-bold text-gray-900">
                        JNE{order.id}2025
                      </code>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopyResi(`JNE${order.id}2025`)}
                    className="ml-4 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    title="Copy tracking number"
                  >
                    {copiedResi ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <Link href="/service/tracking">
                <Button fullWidth variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50">
                  <Truck className="w-5 h-5 mr-2" />
                  Track Shipment
                </Button>
              </Link>
            </div>
          )}

          {/* Order Items */}
          <div className="border-t pt-6 mb-6">
            <h2 className="text-black font-semibold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Items
            </h2>
            <div className="space-y-4">
              {order.items.map((item) => {
                const imageUrl = getProductImage(item);
                
                return (
                  <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="relative w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={imageUrl}
                        alt={item.product_name_snapshot}
                        fill
                        className="object-cover"
                        unoptimized
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/placeholder.png';
                        }}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-black font-medium mb-1 line-clamp-2">
                        {item.product_name_snapshot}
                      </h3>
                      
                      {(item.product?.brand?.name || item.product?.category?.name) && (
                        <p className="text-sm text-gray-600 mb-2">
                          {item.product?.brand?.name && (
                            <span className="mr-2">{item.product.brand.name}</span>
                          )}
                          {item.product?.brand?.name && item.product?.category?.name && (
                            <span className="mr-2">•</span>
                          )}
                          {item.product?.category?.name && (
                            <span>{item.product.category.name}</span>
                          )}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 flex-wrap">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium text-gray-900">
                            {formatCurrency(item.price_snapshot)}
                          </span>
                          {' × '}
                          <span className="font-medium">{item.quantity}</span>
                        </p>
                        <p className="text-base text-black font-bold">
                          = {formatCurrency(item.price_snapshot * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Info */}
          {order.payment && (
            <div className="border-t pt-6 mb-6">
              <h2 className="text-black font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Information
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {order.payment.provider.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-medium text-gray-900 font-mono text-xs">
                    {order.payment.transaction_id}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <Badge variant="success">{order.payment.status}</Badge>
                </div>
                {order.payment.paid_at && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Paid At:</span>
                    <span className="font-medium text-gray-900">
                      {formatDateTime(order.payment.paid_at)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Shipment Info */}
          {order.shipment && (
            <div className="border-t pt-6 mb-6">
              <h2 className="text-black font-semibold mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Shipment Information
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Courier:</span>
                  <span className="font-medium text-gray-900">{order.shipment.courier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tracking Number:</span>
                  <span className="font-medium text-gray-900 font-mono text-xs">
                    {order.shipment.tracking_number}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <Badge variant="info">{order.shipment.status}</Badge>
                </div>
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="border-t pt-6">
            <h2 className="text-black font-semibold mb-4">Order Summary</h2>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal ({order.items.length} items)</span>
                <span className="text-gray-900 font-medium">
                  {formatCurrency(Number(order.total_amount))}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping Cost</span>
                <span className="text-gray-900 font-medium">
                  {formatCurrency(order.shipping_cost)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-3">
                <span className="text-gray-900">Total</span>
                <span className="text-blue-600">
                  {formatCurrency(Number(order.total_amount) + Number(order.shipping_cost))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}