'use client';

import { Menu, Bell, Search, User, LogOut } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth.store';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  return (
    <header className="h-16 bg-dark-950 border-b border-dark-800 flex items-center justify-between px-4 lg:px-8">
      {/* Left */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-dark-800 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-400" />
        </button>

        {/* Search - Hidden on mobile */}
        <div className="hidden md:flex items-center bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 w-80">
          <Search className="w-5 h-5 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none text-sm text-white placeholder-gray-500 w-full"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-dark-800 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-gray-400" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Menu */}
        <div className="flex items-center space-x-3 pl-4 border-l border-dark-800">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-white">
              {user?.nickname || 'Admin'}
            </p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <div className="w-10 h-10 bg-dark-800 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-gray-400" />
          </div>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-dark-800 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    </header>
  );
};