import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary: 'bg-black text-white hover:bg-gray-300 hover:text-black disabled:bg-black-300',
      outline: 'bg-white border-2 border-black text-black hover:bg-black hover:text-white disabled:border-gray-300 disabled:text-gray-300',
      danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300',
      ghost: 'bg-transparent hover:bg-gray-100 disabled:hover:bg-transparent',
    };

    const sizes = {
      sm: 'px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm',
      md: 'px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base',
      lg: 'px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-3 w-3 sm:h-4 sm:w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';