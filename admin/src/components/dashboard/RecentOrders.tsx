'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { orderService } from '@/lib/services/order.service';
import { formatCurrency } from '@/lib/utils/format';
import type { Order } from '@/types';

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

export const RecentOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await orderService.getOrders(1, 5);
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Recent Orders</h2>
        <Link
          href="/orders"
          className="text-sm text-gray-400 hover:text-white flex items-center space-x-1"
        >
          <span>View all</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-400">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8 text-gray-400">No orders yet</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="flex items-center justify-between p-4 bg-dark-900 border border-dark-700 rounded-lg hover:border-dark-600 transition-colors"
            >
              <div className="flex-1">
                <p className="text-white font-medium mb-1">Order #{order.id}</p>
                <p className="text-sm text-gray-400">
                  {order.user?.nickname || 'Unknown'} • {order.items.length} item(s)
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-white font-semibold">
                    {formatCurrency(Number(order.total_amount) + Number(order.shipping_cost))}
                  </p>
                </div>
                <Badge variant={getStatusVariant(order.status)}>
                  {order.status}
                </Badge>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
};