'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/lib/store/auth.store';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(formData);
      toast.success('Login successful!');
      router.push('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="w-full max-w-md px-6">
      <div className="bg-dark-900 border border-dark-700 rounded-xl p-8 shadow-2xl">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-black" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h2>
          <p className="text-gray-400 text-sm">Sign in to manage your store</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email"
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="admin@example.com"
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 text-gray-400 hover:text-gray-300"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          <Button type="submit" fullWidth isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        {/* Info */}
        <div className="mt-6 p-4 bg-dark-800 border border-dark-700 rounded-lg">
          <p className="text-xs text-gray-400 text-center">
            Demo Credentials:<br/>
            Email: admin@example.com<br/>
            Password: admin123
          </p>
        </div>
      </div>
    </div>
  );
}