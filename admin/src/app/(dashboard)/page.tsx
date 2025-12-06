'use client';

import { useEffect, useState } from 'react';
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentOrders } from '@/components/dashboard/RecentOrders';
import { SalesChart } from '@/components/dashboard/SalesChart';
import { Card } from '@/components/ui/Card';
import { dashboardService } from '@/lib/services/dashboard.service';
import { Spinner } from '@/components/ui/Spinner';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  revenueChange: number;
  ordersChange: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`Rp ${(stats?.totalRevenue || 0).toLocaleString('id-ID')}`}
          change={stats?.revenueChange || 0}
          icon={DollarSign}
          iconColor="text-green-500"
          iconBg="bg-green-500/10"
        />
        <StatCard
          title="Orders"
          value={stats?.totalOrders.toString() || '0'}
          change={stats?.ordersChange || 0}
          icon={ShoppingCart}
          iconColor="text-blue-500"
          iconBg="bg-blue-500/10"
        />
        <StatCard
          title="Products"
          value={stats?.totalProducts.toString() || '0'}
          icon={Package}
          iconColor="text-purple-500"
          iconBg="bg-purple-500/10"
        />
        <StatCard
          title="Customers"
          value={stats?.totalCustomers.toString() || '0'}
          icon={Users}
          iconColor="text-orange-500"
          iconBg="bg-orange-500/10"
        />
      </div>

      {/* Charts and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart />
        <RecentOrders />
      </div>
    </div>
  );
}