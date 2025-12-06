import apiClient from '../api/client';

class DashboardService {
  async getStats() {
    // Mock data - replace with actual API call
    return {
      totalProducts: 125,
      totalOrders: 48,
      totalCustomers: 324,
      totalRevenue: 45678000,
      revenueChange: 12.5,
      ordersChange: 8.3,
    };
  }

  async getSalesChart() {
    // Mock data - replace with actual API call
    return [
      { date: 'Mon', sales: 2400000 },
      { date: 'Tue', sales: 1398000 },
      { date: 'Wed', sales: 9800000 },
      { date: 'Thu', sales: 3908000 },
      { date: 'Fri', sales: 4800000 },
      { date: 'Sat', sales: 3800000 },
      { date: 'Sun', sales: 4300000 },
    ];
  }
}

export const dashboardService = new DashboardService();