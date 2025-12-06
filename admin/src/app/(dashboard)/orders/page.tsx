'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye, Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { orderService } from '@/lib/services/order.service';
import { formatCurrency, formatDateTime } from '@/lib/utils/format';
import type { Order } from '@/types';
import toast from 'react-hot-toast';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await orderService.getOrders(1, 100);
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to load orders');
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toString().includes(searchQuery) ||
      order.user?.nickname.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: 'id',
      label: 'Order ID',
      render: (order: Order) => (
        <span className="font-medium text-white">#{order.id}</span>
      ),
    },
    {
      key: 'customer',
      label: 'Customer',
      render: (order: Order) => (
        <div>
          <p className="text-white">{order.user?.nickname || 'Unknown'}</p>
          <p className="text-sm text-gray-400">{order.user?.email}</p>
        </div>
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
            <Eye className="w-4 h-4" />
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Orders</h1>
        <p className="text-gray-400">Manage and track customer orders</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search by order ID or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-5 h-5 text-gray-500" />}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: '', label: 'All Status' },
              { value: 'PENDING', label: 'Pending' },
              { value: 'PAID', label: 'Paid' },
              { value: 'SHIPPED', label: 'Shipped' },
              { value: 'DELIVERED', label: 'Delivered' },
              { value: 'COMPLETED', label: 'Completed' },
              { value: 'CANCELED', label: 'Canceled' },
            ]}
          />
        </div>
      </div>

      <Table
        columns={columns}
        data={filteredOrders}
        isLoading={isLoading}
        emptyMessage="No orders found"
      />
    </div>
  );
}