'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';
import { dashboardService } from '@/lib/services/dashboard.service';

interface SalesData {
  date: string;
  sales: number;
}

export const SalesChart = () => {
  const [data, setData] = useState<SalesData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSalesData();
  }, []);

  const loadSalesData = async () => {
    try {
      const salesData = await dashboardService.getSalesChart();
      setData(salesData);
    } catch (error) {
      console.error('Failed to load sales data:', error);
      // Mock data for demo
      setData([
        { date: 'Mon', sales: 2400 },
        { date: 'Tue', sales: 1398 },
        { date: 'Wed', sales: 9800 },
        { date: 'Thu', sales: 3908 },
        { date: 'Fri', sales: 4800 },
        { date: 'Sat', sales: 3800 },
        { date: 'Sun', sales: 4300 },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold text-white mb-6">Sales Overview</h2>
      
      {isLoading ? (
        <div className="text-center py-20 text-gray-400">Loading...</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis 
              dataKey="date" 
              stroke="#666"
              tick={{ fill: '#999' }}
            />
            <YAxis 
              stroke="#666"
              tick={{ fill: '#999' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '8px',
                color: '#fff',
              }}
              formatter={(value: number) => ['Rp ' + value.toLocaleString('id-ID'), 'Sales']}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#fff"
              strokeWidth={2}
              dot={{ fill: '#fff', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
};