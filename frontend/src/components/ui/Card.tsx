import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card = ({ className, children, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};