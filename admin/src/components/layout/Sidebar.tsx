'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Layers,
  Settings,
  Store,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Orders', href: '/orders', icon: ShoppingCart },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Categories', href: '/categories', icon: Tag },
  { name: 'Brands', href: '/brands', icon: Layers },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-dark-950 border-r border-dark-800 h-screen flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-dark-800">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <Store className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-bold text-white">MAGADIR</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:bg-dark-800 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-dark-800">
        <div className="text-xs text-gray-500 text-center">
          © 2025 Magadir Admin
        </div>
      </div>
    </div>
  );
};