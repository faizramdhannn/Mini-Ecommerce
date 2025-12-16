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

  useEffect(() => {
    loadOrder();
  }, [params.id]);

  const loadOrder = async () => {
    try {
      const data = await orderService.getOrder(Number(params.id));
      setOrder(data);
    } catch (error) {
      toast.error('Failed to load order');
      router.push('/orders');
    } finally {
      setIsLoading(false);
    }
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!order) return null;

  const isPaid = order.status === 'PAID' || order.status === 'SHIPPED' || order.status === 'DELIVERED' || order.status === 'COMPLETED';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-white hover:text-gray-400 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Orders
      </button>

      <div className="bg-white rounded-lg border p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-black text-2xl font-bold">Order #{order.id}</h1>
            <p className="text-gray-600 text-sm mt-1">
              {formatDateTime(order.created_at)}
            </p>
          </div>
          {getStatusBadge(order.status)}
        </div>

        {/* Tracking Number Card - Show when PAID or later */}
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
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={item.product?.media?.[0]?.url || '/images/placeholder.png'}
                    alt={item.product_name_snapshot}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-black font-medium">{item.product_name_snapshot}</h3>
                  <p className="text-sm text-gray-600">
                    {formatCurrency(item.price_snapshot)} × {item.quantity}
                  </p>
                  <p className="text-black font-semibold mt-1">
                    {formatCurrency(item.price_snapshot * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Info */}
        {order.payment && (
          <div className="border-t pt-6 mb-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Information
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Provider:</span>
                <span className="font-medium capitalize">
                  {order.payment.provider.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-medium">{order.payment.transaction_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <Badge variant="success">{order.payment.status}</Badge>
              </div>
              {order.payment.paid_at && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Paid At:</span>
                  <span className="font-medium">{formatDateTime(order.payment.paid_at)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Shipment Info */}
        {order.shipment && (
          <div className="border-t pt-6 mb-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Shipment Information
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Courier:</span>
                <span className="font-medium">{order.shipment.courier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tracking Number:</span>
                <span className="font-medium">{order.shipment.tracking_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <Badge variant="info">{order.shipment.status}</Badge>
              </div>
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="border-t pt-6">
          <h2 className="text-black font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-600 font-medium">{formatCurrency(Number(order.total_amount))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="text-gray-600 font-medium">{formatCurrency(order.shipping_cost)}</span>
            </div>
            <div className="flex justify-between text-black text-lg font-bold border-t pt-2">
              <span>Total</span>
              <span>{formatCurrency(Number(order.total_amount) + Number(order.shipping_cost))}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}