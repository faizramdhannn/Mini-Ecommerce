'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/lib/store/auth.store';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    nickname: user?.nickname || '',
    email: user?.email || '',
    full_name: user?.full_name || '',
    phone: user?.phone || '',
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // TODO: Implement profile update API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.new_password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement password update API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Password updated successfully');
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
    } catch (error) {
      toast.error('Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account settings and preferences</p>
      </div>

      {/* Profile Settings */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Profile Information</h2>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nickname"
              value={profileData.nickname}
              onChange={(e) => setProfileData({ ...profileData, nickname: e.target.value })}
              required
            />
            <Input
              label="Email"
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={profileData.full_name}
              onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
            />
            <Input
              label="Phone"
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" isLoading={isLoading}>
              Save Changes
            </Button>
          </div>
        </form>
      </Card>

      {/* Password Settings */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Change Password</h2>
        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            value={passwordData.current_password}
            onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="New Password"
              type="password"
              value={passwordData.new_password}
              onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
              required
            />
            <Input
              label="Confirm Password"
              type="password"
              value={passwordData.confirm_password}
              onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
              required
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" isLoading={isLoading}>
              Update Password
            </Button>
          </div>
        </form>
      </Card>

      {/* Store Settings */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Store Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Store Name
            </label>
            <Input value="MAGADIR" disabled />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Store Currency
            </label>
            <Input value="IDR (Indonesian Rupiah)" disabled />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              API URL
            </label>
            <Input 
              value={process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'} 
              disabled 
            />
          </div>
          <p className="text-sm text-gray-400">
            Store settings are configured in environment variables.
          </p>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Notifications</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Email Notifications</p>
              <p className="text-sm text-gray-400">Receive email alerts for new orders</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Low Stock Alerts</p>
              <p className="text-sm text-gray-400">Get notified when products are low on stock</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Order Updates</p>
              <p className="text-sm text-gray-400">Receive updates on order status changes</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white"></div>
            </label>
          </div>
        </div>
      </Card>
    </div>
  );
}