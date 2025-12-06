'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/lib/store/auth.store';
import { userService } from '@/lib/services/user.service';
import toast from 'react-hot-toast';

export default function NewAddressPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    label: '',
    recipient_name: '',
    phone: '',
    address_line: '',
    city: '',
    province: '',
    postal_code: '',
    is_default: false,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);

    try {
      await userService.addAddress(user.id, formData);
      toast.success('Address added successfully!');
      router.push('/profile?tab=addresses');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add address');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <h1 className="text-3xl font-bold mb-8">Add New Address</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border p-6">
        <div className="space-y-4">
          <Input
            label="Address Label (e.g., Home, Office)"
            type="text"
            className="text-black"
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            placeholder="..."
          />

          <Input
            label="Recipient Name"
            type="text"
            className="text-black"
            required
            value={formData.recipient_name}
            onChange={(e) => setFormData({ ...formData, recipient_name: e.target.value })}
            placeholder="..."
          />

          <Input
            label="Phone Number"
            type="tel"
            className="text-black"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="..."
          />

          <Input
            label="Full Address"
            type="text"
            className="text-black"
            required
            value={formData.address_line}
            onChange={(e) => setFormData({ ...formData, address_line: e.target.value })}
            placeholder="..."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="City"
              type="text"
              className="text-black"
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="..."
            />

            <Input
              label="Province"
              type="text"
              className="text-black"
              required
              value={formData.province}
              onChange={(e) => setFormData({ ...formData, province: e.target.value })}
              placeholder="..."
            />
          </div>

          <Input
            label="Postal Code"
            type="text"
            className="text-black"
            value={formData.postal_code}
            onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
            placeholder="..."
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_default"
              checked={formData.is_default}
              onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
            />
            <label htmlFor="is_default" className="text-sm text-gray-700">
              Set as default address
            </label>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Button type="submit" isLoading={isLoading} className="flex-1">
            Add Address
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}