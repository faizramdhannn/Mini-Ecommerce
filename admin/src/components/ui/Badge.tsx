import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export const Badge = ({ className, variant = 'default', children, ...props }: BadgeProps) => {
  const variants = {
    default: 'bg-dark-700 text-gray-300',
    success: 'bg-green-500/10 text-green-500 border border-green-500/20',
    warning: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20',
    danger: 'bg-red-500/10 text-red-500 border border-red-500/20',
    info: 'bg-blue-500/10 text-blue-500 border border-blue-500/20',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
