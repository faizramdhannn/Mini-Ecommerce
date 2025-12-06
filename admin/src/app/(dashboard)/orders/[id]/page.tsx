'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Package, MapPin, CreditCard, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Spinner } from '@/components/ui/Spinner';
import { orderService } from '@/lib/services/order.service';
import { formatCurrency, formatDateTime } from '@/lib/utils/format';
import type { Order } from '@/types';
import toast from 'react-hot-toast';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadOrder(Number(params.id));
    }
  }, [params.id]);

  const loadOrder = async (id: number) => {
    try {
      const data = await orderService.getOrder(id);
      setOrder(data);
    } catch (error) {
      toast.error('Failed to load order');
      router.push('/orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;
    
    setIsUpdating(true);
    try {
      await orderService.updateStatus(order.id, newStatus);
      toast.success('Order status updated');
      loadOrder(order.id);
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusVariant = (status: string) => {
    const variants: Record<string, any> = {
      'PENDING': 'warning',
      'PAID': 'info',
      'SHIPPED': 'info',
      'DELIVERED': 'success',
      'COMPLETED': 'success',
      'CANCELED': 'danger',
    };
    return variants[status] || 'default';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Order not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Order #{order.id}</h1>
            <p className="text-gray-400">{formatDateTime(order.created_at)}</p>
          </div>
        </div>
        <Badge variant={getStatusVariant(order.status)}>
          {order.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Package className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-white">Order Items</h2>
            </div>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-dark-900 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-white">{item.product_name_snapshot}</p>
                    <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-white">{formatCurrency(item.price_snapshot)}</p>
                    <p className="text-sm text-gray-400">
                      Total: {formatCurrency(item.price_snapshot * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Shipping Information */}
          {order.shipment && (
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-white">Shipping Information</h2>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-400">Address</p>
                  <p className="text-white">{order.shipment.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">City</p>
                  <p className="text-white">{order.shipment.city}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Postal Code</p>
                  <p className="text-white">{order.shipment.postal_code}</p>
                </div>
                {order.shipment.tracking_number && (
                  <div>
                    <p className="text-sm text-gray-400">Tracking Number</p>
                    <p className="text-white font-mono">{order.shipment.tracking_number}</p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <User className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-white">Customer</h2>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-400">Name</p>
                <p className="text-white">{order.user?.nickname || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-white">{order.user?.email || '-'}</p>
              </div>
              {order.user?.phone && (
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <p className="text-white">{order.user.phone}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Payment Info */}
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <CreditCard className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-white">Payment</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-white">{formatCurrency(Number(order.total_amount))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Shipping</span>
                <span className="text-white">{formatCurrency(Number(order.shipping_cost))}</span>
              </div>
              <div className="border-t border-dark-700 pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-white">Total</span>
                  <span className="font-bold text-white">
                    {formatCurrency(Number(order.total_amount) + Number(order.shipping_cost))}
                  </span>
                </div>
              </div>
              <div className="pt-2">
                <p className="text-sm text-gray-400">Payment Method</p>
                <p className="text-white capitalize">{order.payment_method.replace('_', ' ')}</p>
              </div>
            </div>
          </Card>

          {/* Update Status */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Update Status</h2>
            <Select
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              options={[
                { value: 'PENDING', label: 'Pending' },
                { value: 'PAID', label: 'Paid' },
                { value: 'SHIPPED', label: 'Shipped' },
                { value: 'DELIVERED', label: 'Delivered' },
                { value: 'COMPLETED', label: 'Completed' },
                { value: 'CANCELED', label: 'Canceled' },
              ]}
              disabled={isUpdating}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}