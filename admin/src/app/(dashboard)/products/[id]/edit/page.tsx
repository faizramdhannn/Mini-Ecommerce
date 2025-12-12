'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { productService } from '@/lib/services/product.service';
import type { Product } from '@/types';
import toast from 'react-hot-toast';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [product, setProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    compare_at_price: '',
    stock: '',
    category_id: '',
    brand_id: '',
    is_flash_sale: false,
  });

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (params.id) {
      loadProduct(Number(params.id));
      loadOptions();
    }
  }, [params.id]);

  const loadProduct = async (id: number) => {
    try {
      const data = await productService.getProduct(id);

      setProduct(data);

      setFormData({
        name: data.name,
        description: data.description || '',
        price: data.price?.toString() || '',
        compare_at_price: data.compare_at_price?.toString() || '',
        stock: data.stock?.toString() || '',
        category_id: data.category_id?.toString() || '',
        brand_id: data.brand_id?.toString() || '',
        is_flash_sale: data.is_flash_sale || false,
      });

      setExistingImages(data.media?.map(m => m.url) || []);
    } catch (error) {
      toast.error('Failed to load product');
      router.push('/products');
    } finally {
      setIsLoading(false);
    }
  };

  const loadOptions = async () => {
    try {
      const [categoriesData, brandsData] = await Promise.all([
        productService.getCategories(),
        productService.getBrands(),
      ]);
      setCategories(categoriesData);
      setBrands(brandsData);
    } catch (error) {
      toast.error('Failed to load options');
    }
  };

  /* ---------------- IMAGE HANDLING ---------------- */

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const total = existingImages.length + newImages.length + files.length;

    if (total > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    setNewImages([...newImages, ...files]);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewImages(newImages.filter((_, i) => i !== index));
    setNewImagePreviews(newImagePreviews.filter((_, i) => i !== index));
  };

  /* ---------------- FORM SUBMIT ---------------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    // Validasi compare at price
    const price = parseFloat(formData.price);
    const comparePrice = formData.compare_at_price
      ? parseFloat(formData.compare_at_price)
      : null;

    if (comparePrice && comparePrice <= price) {
      toast.error('Compare at price must be greater than price');
      return;
    }

    setIsSaving(true);

    try {
      const productData = {
        ...formData,
        price,
        compare_at_price: comparePrice,
        stock: parseInt(formData.stock),
        category_id: formData.category_id ? parseInt(formData.category_id) : undefined,
        brand_id: formData.brand_id ? parseInt(formData.brand_id) : undefined,
      };

      // Update detail produk
      await productService.updateProduct(product.id, productData);

      // TODO: Upload images if your backend supports it

      toast.success('Product updated successfully');
      router.push('/products');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update product');
    } finally {
      setIsSaving(false);
    }
  };

  /* ---------------- UI ---------------- */

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Product not found</p>
      </div>
    );
  }

  const totalImages = existingImages.length + newImages.length;

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">

      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white">Edit Product</h1>
          <p className="text-gray-400">Update product information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Basic */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Basic Information</h2>

          <div className="space-y-4">
            <Input
              label="Product Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Enter product name"
            />

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2.5 bg-dark-900 border border-dark-700 rounded-lg text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Category"
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                options={[
                  { value: '', label: 'Select Category' },
                  ...categories.map(cat => ({ value: cat.id.toString(), label: cat.name })),
                ]}
              />

              <Select
                label="Brand"
                value={formData.brand_id}
                onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
                options={[
                  { value: '', label: 'Select Brand' },
                  ...brands.map(b => ({ value: b.id.toString(), label: b.name })),
                ]}
              />
            </div>
          </div>
        </Card>

        {/* Pricing */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Pricing & Inventory</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Price (IDR)"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
              min="0"
              step="1000"
            />

            <Input
              label="Compare At Price (IDR)"
              type="number"
              value={formData.compare_at_price}
              onChange={(e) => setFormData({ ...formData, compare_at_price: e.target.value })}
              min="0"
              step="1000"
              placeholder="Optional"
            />
          </div>

          <div className="bg-dark-800 border border-dark-700 rounded-lg p-4 mt-4">
            <p className="text-sm text-gray-300 mb-2">
              💡 <strong>Compare At Price:</strong> Harga asli sebelum diskon.
            </p>
            <p className="text-xs text-gray-400">
              Jika diisi, harga asli dicoret dan menampilkan persentase diskon.
            </p>
          </div>

          <Input
            label="Stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            required
            min="0"
            className="mt-4"
          />

          <div className="flex items-center space-x-3 p-4 mt-4 bg-dark-800 border border-dark-700 rounded-lg">
            <input
              type="checkbox"
              id="is_flash_sale"
              checked={formData.is_flash_sale}
              onChange={(e) => setFormData({ ...formData, is_flash_sale: e.target.checked })}
            />
            <label htmlFor="is_flash_sale" className="text-white cursor-pointer">
              ⚡ Mark as Flash Sale Product
            </label>
          </div>
        </Card>

        {/* Images */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Product Images</h2>

          <div className="space-y-4">
            {(existingImages.length > 0 || newImagePreviews.length > 0) && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {existingImages.map((url, index) => (
                  <div key={`exist-${index}`} className="relative group">
                    <img src={url} className="w-full h-32 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-2 right-2 bg-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}

                {newImagePreviews.map((preview, index) => (
                  <div key={`new-${index}`} className="relative group">
                    <img src={preview} className="w-full h-32 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-2 right-2 bg-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs rounded">
                      New
                    </div>
                  </div>
                ))}
              </div>
            )}

            {totalImages < 5 && (
              <div className="border-2 border-dashed border-dark-700 rounded-lg p-8 text-center cursor-pointer">
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label htmlFor="image-upload">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400">Click to upload images</p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG up to {5 - totalImages} remaining
                  </p>
                </label>
              </div>
            )}
          </div>
        </Card>

        {/* Save */}
        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>

          <Button type="submit" isLoading={isSaving}>
            Update Product
          </Button>
        </div>

      </form>

    </div>
  );
}
