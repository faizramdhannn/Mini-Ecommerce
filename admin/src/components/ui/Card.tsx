import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const Card = ({ className, children, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        'bg-dark-950 border border-dark-800 rounded-xl overflow-hidden',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};