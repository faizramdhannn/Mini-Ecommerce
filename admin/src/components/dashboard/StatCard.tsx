'use client';

import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';
import { Card } from '../ui/Card';
import { cn } from '@/lib/utils/cn';

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

export const StatCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  iconColor, 
  iconBg 
}: StatCardProps) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <Card className="p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', iconBg)}>
          <Icon className={cn('w-6 h-6', iconColor)} />
        </div>
        {change !== undefined && (
          <div
            className={cn(
              'flex items-center space-x-1 text-sm font-medium',
              isPositive && 'text-green-500',
              isNegative && 'text-red-500',
              !isPositive && !isNegative && 'text-gray-400'
            )}
          >
            {isPositive && <TrendingUp className="w-4 h-4" />}
            {isNegative && <TrendingDown className="w-4 h-4" />}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-gray-400 text-sm mb-1">{title}</p>
        <p className="text-white text-2xl font-bold">{value}</p>
      </div>
    </Card>
  );
};