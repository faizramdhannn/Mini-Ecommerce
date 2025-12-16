import apiClient from '../api/client';

class DashboardService {
  async getStats() {
    try {
      const response = await apiClient.get('/dashboard/stats');
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      // Return default values on error
      return {
        totalProducts: 0,
        totalOrders: 0,
        totalCustomers: 0,
        totalRevenue: 0,
        revenueChange: 0,
        ordersChange: 0,
      };
    }
  }

  async getSalesChart() {
    try {
      const response = await apiClient.get('/dashboard/sales-chart');
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch sales chart:', error);
      // Return empty array on error
      return [];
    }
  }

  async getRecentOrders() {
    try {
      const response = await apiClient.get('/dashboard/recent-orders');
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch recent orders:', error);
      return [];
    }
  }
}

export const dashboardService = new DashboardService();