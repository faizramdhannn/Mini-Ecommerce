'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/lib/store/auth.store';
import { authService } from '@/lib/services/auth.service';
import toast from 'react-hot-toast';

export default function EditProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nickname: '',
    full_name: '',
    phone: '',
    birthday: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user) {
      setFormData({
        nickname: user.nickname || '',
        full_name: user.full_name || '',
        phone: user.phone || '',
        birthday: user.birthday || '',
      });
    }
  }, [user, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Note: You'll need to create updateProfile method in auth.service.ts
      // For now, we'll just update local state
      const updatedUser = { ...user!, ...formData };
      setUser(updatedUser);
      toast.success('Profile updated successfully!');
      router.push('/profile');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border p-6">
        <div className="space-y-4 text-black">
          <Input
            label="Nickname"
            type="text"
            className='text-black'
            required
            value={formData.nickname}
            onChange={(e) =>
              setFormData({ ...formData, nickname: e.target.value })
            }
          />

          <Input
            label="Full Name"
            type="text"
            className='text-black'
            value={formData.full_name}
            onChange={(e) =>
              setFormData({ ...formData, full_name: e.target.value })
            }
          />

          <Input
            label="Phone"
            type="number"
            className='text-black'
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />

          <Input
            label="Birthday"
            type="date"
            className='text-black'
            value={formData.birthday}
            onChange={(e) =>
              setFormData({ ...formData, birthday: e.target.value })
            }
          />
        </div>

        <div className="flex gap-4 mt-6">
          <Button type="submit" isLoading={isLoading}>
            Save Changes
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/profile')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}