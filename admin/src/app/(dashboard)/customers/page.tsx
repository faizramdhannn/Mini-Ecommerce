'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye, Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { userService } from '@/lib/services/user.service';
import { formatDate } from '@/lib/utils/format';
import type { User } from '@/types';
import toast from 'react-hot-toast';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const response = await userService.getUsers(1, 100);
      setCustomers(response.data);
    } catch (error) {
      toast.error('Failed to load customers');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      key: 'nickname',
      label: 'Customer',
      render: (customer: User) => (
        <div>
          <p className="font-medium text-white">{customer.nickname}</p>
          <p className="text-sm text-gray-400">{customer.email}</p>
        </div>
      ),
    },
    {
      key: 'full_name',
      label: 'Full Name',
      render: (customer: User) => (
        <span className="text-gray-300">{customer.full_name || '-'}</span>
      ),
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (customer: User) => (
        <span className="text-gray-300">{customer.phone || '-'}</span>
      ),
    },
    {
      key: 'created_at',
      label: 'Joined',
      render: (customer: User) => (
        <span className="text-gray-300 text-sm">
          {customer.created_at ? formatDate(customer.created_at) : '-'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (customer: User) => (
        <Link href={`/customers/${customer.id}`}>
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
        <h1 className="text-3xl font-bold text-white mb-2">Customers</h1>
        <p className="text-gray-400">Manage your customer base</p>
      </div>

      <div className="max-w-md">
        <Input
          type="text"
          placeholder="Search customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Search className="w-5 h-5 text-gray-500" />}
        />
      </div>

      <Table
        columns={columns}
        data={filteredCustomers}
        isLoading={isLoading}
        emptyMessage="No customers found"
      />
    </div>
  );
}