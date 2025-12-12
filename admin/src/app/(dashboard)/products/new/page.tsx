'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { productService } from '@/lib/services/product.service';
import toast from 'react-hot-toast';

export default function NewProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    compare_at_price: '', // TAMBAHKAN
    stock: '',
    category_id: '',
    brand_id: '',
    is_flash_sale: false, // TAMBAHKAN
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    loadOptions();
  }, []);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    setImages([...images, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const price = parseFloat(formData.price);
    const comparePrice = formData.compare_at_price ? parseFloat(formData.compare_at_price) : null;

    if (comparePrice && comparePrice <= price) {
      toast.error('Compare at price must be greater than price');
      return;
    }

    setIsLoading(true);

    try {
      const productData = {
        ...formData,
        price,
        compare_at_price: comparePrice,
        stock: parseInt(formData.stock),
        category_id: formData.category_id ? parseInt(formData.category_id) : undefined,
        brand_id: formData.brand_id ? parseInt(formData.brand_id) : undefined,
      };

      await productService.createProduct(productData);
      toast.success('Product created successfully');
      router.push('/products');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white">Add New Product</h1>
          <p className="text-gray-400">Create a new product for your store</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
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
                className="w-full px-4 py-2.5 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                placeholder="Enter product description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Category"
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                options={[
                  { value: '', label: 'Select Category' },
                  ...categories.map(cat => ({ value: cat.id.toString(), label: cat.name }))
                ]}
              />

              <Select
                label="Brand"
                value={formData.brand_id}
                onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
                options={[
                  { value: '', label: 'Select Brand' },
                  ...brands.map(brand => ({ value: brand.id.toString(), label: brand.name }))
                ]}
              />
            </div>
          </div>
        </Card>

        {/* Pricing & Inventory */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Pricing & Inventory</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Price (IDR) *"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                min="0"
                step="1000"
                placeholder="0"
              />

              <Input
                label="Compare At Price (IDR)"
                type="number"
                value={formData.compare_at_price}
                onChange={(e) => setFormData({ ...formData, compare_at_price: e.target.value })}
                min="0"
                step="1000"
                placeholder="0 (Optional)"
              />
            </div>

            <div className="bg-dark-800 border border-dark-700 rounded-lg p-4">
              <p className="text-sm text-gray-300 mb-2">
                💡 <strong>Compare At Price:</strong> Harga asli produk sebelum diskon.
              </p>
              <p className="text-xs text-gray-400">
                Jika diisi, harga ini akan dicoret di frontend dan menampilkan persentase diskon.
              </p>
            </div>

            <Input
              label="Stock"
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              required
              min="0"
              placeholder="0"
            />

            {/* Flash Sale Toggle */}
            <div className="flex items-center space-x-3 p-4 bg-dark-800 border border-dark-700 rounded-lg">
              <input
                type="checkbox"
                id="is_flash_sale"
                checked={formData.is_flash_sale}
                onChange={(e) => setFormData({ ...formData, is_flash_sale: e.target.checked })}
                className="w-5 h-5 rounded border-dark-600 text-white focus:ring-white"
              />
              <label htmlFor="is_flash_sale" className="text-white font-medium cursor-pointer">
                ⚡ Mark as Flash Sale Product
              </label>
            </div>
          </div>
        </Card>

        {/* Product Images */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Product Images</h2>
          <div className="space-y-4">
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {images.length < 5 && (
              <div className="border-2 border-dashed border-dark-700 rounded-lg p-8 text-center hover:border-dark-600 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400">Click to upload images</p>
                  <p className="text-sm text-gray-500 mt-1">
                    PNG, JPG up to 5 images
                  </p>
                </label>
              </div>
            )}
          </div>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Create Product
          </Button>
        </div>
      </form>
    </div>
  );
}