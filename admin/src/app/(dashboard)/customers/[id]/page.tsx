'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Phone, Calendar, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { userService } from '@/lib/services/user.service';
import { orderService } from '@/lib/services/order.service';
import { formatDate, formatCurrency, formatDateTime } from '@/lib/utils/format';
import type { User, Order } from '@/types';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      loadCustomerData(Number(params.id));
    }
  }, [params.id]);

  const loadCustomerData = async (id: number) => {
    try {
      const customerData = await userService.getUser(id);
      setCustomer(customerData);
      
      // Load customer orders
      const ordersResponse = await orderService.getOrders(1, 100);
      const customerOrders = ordersResponse.data.filter(order => order.user_id === id);
      setOrders(customerOrders);
    } catch (error) {
      toast.error('Failed to load customer data');
      router.push('/customers');
    } finally {
      setIsLoading(false);
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

  const totalSpent = orders.reduce((sum, order) => 
    sum + Number(order.total_amount) + Number(order.shipping_cost), 0
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Customer not found</p>
      </div>
    );
  }

  const orderColumns = [
    {
      key: 'id',
      label: 'Order ID',
      render: (order: Order) => (
        <span className="font-medium text-white">#{order.id}</span>
      ),
    },
    {
      key: 'items',
      label: 'Items',
      render: (order: Order) => (
        <span className="text-gray-300">{order.items.length} item(s)</span>
      ),
    },
    {
      key: 'total',
      label: 'Total',
      render: (order: Order) => (
        <span className="text-white font-medium">
          {formatCurrency(Number(order.total_amount) + Number(order.shipping_cost))}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (order: Order) => (
        <Badge variant={getStatusVariant(order.status)}>
          {order.status}
        </Badge>
      ),
    },
    {
      key: 'date',
      label: 'Date',
      render: (order: Order) => (
        <span className="text-gray-300 text-sm">
          {formatDateTime(order.created_at)}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (order: Order) => (
        <Link href={`/orders/${order.id}`}>
          <Button variant="ghost" size="sm">
            View
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white">{customer.nickname}</h1>
          <p className="text-gray-400">Customer Details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Profile Information</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white">{customer.email}</p>
                </div>
              </div>
              
              {customer.phone && (
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-400">Phone</p>
                    <p className="text-white">{customer.phone}</p>
                  </div>
                </div>
              )}

              {customer.full_name && (
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-400">Full Name</p>
                    <p className="text-white">{customer.full_name}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-400">Member Since</p>
                  <p className="text-white">
                    {customer.created_at ? formatDate(customer.created_at) : '-'}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Statistics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Total Orders</span>
                <span className="text-white font-semibold">{orders.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Total Spent</span>
                <span className="text-white font-semibold">{formatCurrency(totalSpent)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Average Order</span>
                <span className="text-white font-semibold">
                  {formatCurrency(orders.length > 0 ? totalSpent / orders.length : 0)}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Order History */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <ShoppingBag className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-white">Order History</h2>
            </div>
            
            <Table
              columns={orderColumns}
              data={orders}
              isLoading={false}
              emptyMessage="No orders yet"
            />
          </Card>
        </div>
      </div>
    </div>
  );
}