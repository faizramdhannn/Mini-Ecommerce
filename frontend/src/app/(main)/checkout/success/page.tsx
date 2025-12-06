'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { orderService } from '@/lib/services/order.service';
import { formatCurrency } from '@/lib/utils/format';
import type { Order } from '@/types';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const data = await orderService.getOrder(Number(orderId));
      setOrder(data);
    } catch (error) {
      console.error('Failed to load order:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
      <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
      <p className="text-gray-600 mb-8">
        Thank you for your order. We'll send you a confirmation email shortly.
      </p>

      {order && (
        <div className="bg-white rounded-lg border p-6 mb-8 text-left">
          <h2 className="font-semibold mb-4 text-black">Order Details</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-medium text-gray-600">#{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total:</span>
              <span className="font-medium text-gray-600">{formatCurrency(Number(order.total_amount) + Number(order.shipping_cost))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-medium capitalize text-gray-600">{order.payment_method.replace('_', ' ')}</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-4 justify-center">
        <Button variant="outline" onClick={() => router.push('/orders')}>
          View Orders
        </Button>
        <Button variant="outline" onClick={() => router.push('/')}>
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}