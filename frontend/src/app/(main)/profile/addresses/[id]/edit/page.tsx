'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/lib/store/auth.store';
import { userService } from '@/lib/services/user.service';
import toast from 'react-hot-toast';

export default function EditAddressPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
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
      return;
    }

    if (params.id) {
      loadAddress();
    }
  }, [isAuthenticated, params.id, router]);

  const loadAddress = async () => {
    if (!user || !params.id) {
      setIsLoadingData(false);
      return;
    }
    
    try {
      const addresses = await userService.getUserAddresses(user.id);
      const address = addresses.find(a => a.id === Number(params.id));
      
      if (address) {
        setFormData({
          label: address.label || '',
          recipient_name: address.recipient_name || '',
          phone: address.phone || '',
          address_line: address.address_line || '',
          city: address.city || '',
          province: address.province || '',
          postal_code: address.postal_code || '',
          is_default: address.is_default || false,
        });
      } else {
        toast.error('Address not found');
        router.push('/profile?tab=addresses');
      }
    } catch (error: any) {
      console.error('Error loading address:', error);
      toast.error(error.response?.data?.message || 'Failed to load address');
      router.push('/profile?tab=addresses');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !params.id) return;

    setIsLoading(true);

    try {
      await userService.updateAddress(user.id, Number(params.id), formData);
      toast.success('Address updated successfully!');
      router.push('/profile?tab=addresses');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update address');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user || !params.id || !confirm('Are you sure you want to delete this address?')) {
      return;
    }

    setIsDeleting(true);

    try {
      await userService.deleteAddress(user.id, Number(params.id));
      toast.success('Address deleted successfully!');
      router.push('/profile?tab=addresses');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete address');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-white hover:text-gray-400 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <h1 className="text-3xl font-bold mb-8">Edit Address</h1>

      <div className="bg-white rounded-lg border p-6">
        <div className="space-y-4">
          <Input
            label="Address Label (e.g., Home, Office)"
            type="text"
            className="text-black"
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            placeholder="Home, Office, etc."
          />

          <Input
            label="Recipient Name"
            type="text"
            className="text-black"
            required
            value={formData.recipient_name}
            onChange={(e) => setFormData({ ...formData, recipient_name: e.target.value })}
            placeholder="Full name"
          />

          <Input
            label="Phone Number"
            type="tel"
            className="text-black"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="08xxxxxxxxxx"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Address
            </label>
            <textarea
              required
              value={formData.address_line}
              onChange={(e) => setFormData({ ...formData, address_line: e.target.value })}
              placeholder="Street, building, floor, etc."
              rows={3}
              className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="City"
              type="text"
              className="text-black"
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="City name"
            />

            <Input
              label="Province"
              type="text"
              className="text-black"
              required
              value={formData.province}
              onChange={(e) => setFormData({ ...formData, province: e.target.value })}
              placeholder="Province name"
            />
          </div>

          <Input
            label="Postal Code"
            type="text"
            className="text-black"
            value={formData.postal_code}
            onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
            placeholder="12345"
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

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button 
            type="button" 
            onClick={handleSubmit}
            isLoading={isLoading} 
            className="flex-1"
          >
            Update Address
          </Button>
          
          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
            className="sm:w-auto"
          >
            <Trash2 className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="sm:w-auto"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}