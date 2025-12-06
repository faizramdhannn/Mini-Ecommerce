'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { orderService } from '@/lib/services/order.service';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { ORDER_STATUS } from '@/lib/utils/constants';
import type { Order } from '@/types';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await orderService.getOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setIsLoading(false);
    }
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">You haven't placed any orders yet</p>
          <Link href="/products" className="text-blue-600 hover:underline">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block bg-white rounded-lg border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-black font-semibold">Order #{order.id}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(order.created_at)}
                  </p>
                </div>
                {getStatusBadge(order.status)}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    {order.items.length} item(s)
                  </p>
                  <p className="text-black font-bold">
                    {formatCurrency(Number(order.total_amount) + Number(order.shipping_cost))}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}