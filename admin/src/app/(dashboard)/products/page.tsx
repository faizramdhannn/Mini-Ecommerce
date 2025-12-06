'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { productService } from '@/lib/services/product.service';
import { formatCurrency } from '@/lib/utils/format';
import type { Product } from '@/types';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; productId: number | null }>({
    isOpen: false,
    productId: null,
  });

  useEffect(() => {
    loadProducts();
  }, [searchQuery]);

  const loadProducts = async () => {
    try {
      const response = await productService.getProducts({ search: searchQuery, limit: 100 });
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to load products:', error);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.productId) return;

    try {
      await productService.deleteProduct(deleteModal.productId);
      toast.success('Product deleted successfully');
      loadProducts();
      setDeleteModal({ isOpen: false, productId: null });
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Product',
      render: (product: Product) => (
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-dark-800 rounded-lg overflow-hidden">
            {product.media?.[0] && (
              <img
                src={product.media[0].url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div>
            <p className="font-medium text-white">{product.name}</p>
            <p className="text-sm text-gray-400">{product.category?.name}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'brand',
      label: 'Brand',
      render: (product: Product) => (
        <span className="text-gray-300">{product.brand?.name || '-'}</span>
      ),
    },
    {
      key: 'price',
      label: 'Price',
      render: (product: Product) => (
        <span className="text-white font-medium">{formatCurrency(product.price)}</span>
      ),
    },
    {
      key: 'stock',
      label: 'Stock',
      render: (product: Product) => (
        <Badge variant={product.stock > 0 ? 'success' : 'danger'}>
          {product.stock} units
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (product: Product) => (
        <div className="flex items-center space-x-2">
          <Link href={`/products/${product.id}/edit`}>
            <Button variant="ghost" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteModal({ isOpen: true, productId: product.id })}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Products</h1>
          <p className="text-gray-400">Manage your product inventory</p>
        </div>
        <Link href="/products/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 max-w-md">
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-5 h-5 text-gray-500" />}
          />
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={products}
        isLoading={isLoading}
        emptyMessage="No products found"
      />

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, productId: null })}
        title="Delete Product"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to delete this product? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ isOpen: false, productId: null })}
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