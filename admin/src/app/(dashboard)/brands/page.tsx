'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import apiClient from '@/lib/api/client';
import toast from 'react-hot-toast';

interface Brand {
  id: number;
  name: string;
  slug: string;
  description?: string;
  created_at?: string;
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; brandId: number | null }>({
    isOpen: false,
    brandId: null,
  });

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      const response = await apiClient.get('/admin/brands');
      setBrands(response.data.data);
    } catch (error) {
      toast.error('Failed to load brands');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (editingBrand) {
        // Update brand
        await apiClient.put(`/admin/brands/${editingBrand.id}`, formData);
        toast.success('Brand updated successfully');
      } else {
        // Create brand
        await apiClient.post('/admin/brands', formData);
        toast.success('Brand created successfully');
      }
      
      setIsModalOpen(false);
      setEditingBrand(null);
      setFormData({ name: '', description: '' });
      loadBrands();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save brand');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({ name: brand.name, description: brand.description || '' });
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteModal.brandId) return;
    
    try {
      await apiClient.delete(`/admin/brands/${deleteModal.brandId}`);
      toast.success('Brand deleted successfully');
      setDeleteModal({ isOpen: false, brandId: null });
      loadBrands();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete brand');
    }
  };

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      key: 'name',
      label: 'Brand Name',
      render: (brand: Brand) => (
        <div>
          <p className="font-medium text-white">{brand.name}</p>
          <p className="text-sm text-gray-400">{brand.slug}</p>
        </div>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      render: (brand: Brand) => (
        <span className="text-gray-300">{brand.description || '-'}</span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (brand: Brand) => (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(brand)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteModal({ isOpen: true, brandId: brand.id })}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Brands</h1>
          <p className="text-gray-400">Manage product brands</p>
        </div>
        <Button onClick={() => {
          setEditingBrand(null);
          setFormData({ name: '', description: '' });
          setIsModalOpen(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Brand
        </Button>
      </div>

      <div className="max-w-md">
        <Input
          type="text"
          placeholder="Search brands..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Search className="w-5 h-5 text-gray-500" />}
        />
      </div>

      <Table
        columns={columns}
        data={filteredBrands}
        isLoading={isLoading}
        emptyMessage="No brands found"
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBrand(null);
          setFormData({ name: '', description: '' });
        }}
        title={editingBrand ? 'Edit Brand' : 'Add Brand'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Brand Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="e.g., Apple, Samsung"
          />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
              placeholder="Brief description of the brand"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              {editingBrand ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, brandId: null })}
        title="Delete Brand"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to delete this brand? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ isOpen: false, brandId: null })}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}