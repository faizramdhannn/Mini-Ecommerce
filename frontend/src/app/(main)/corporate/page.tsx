'use client';

import { useState, useEffect } from 'react';
import { Building2, Mail, Phone, User, Package, Send } from 'lucide-react';
import Image from 'next/image';
import { productService } from '@/lib/services/product.service';
import type { Product } from '@/types';

export default function CorporateOrderPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [formData, setFormData] = useState({
    company_name: '',
    contact_person: '',
    email: '',
    phone: '',
    product_id: '',
    quantity: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getProducts({ limit: 100 });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  const selectedProduct = products.find(p => p.id === Number(formData.product_id));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    alert(`Terima kasih! Permintaan corporate order Anda telah diterima.\n\nProduk: ${selectedProduct?.name}\nJumlah: ${formData.quantity} unit\n\nTim kami akan segera menghubungi Anda.`);
    
    setFormData({
      company_name: '',
      contact_person: '',
      email: '',
      phone: '',
      product_id: '',
      quantity: '',
      message: ''
    });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
            <Building2 className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Corporate Order
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Solusi pengadaan gadget dan elektronik untuk kebutuhan perusahaan Anda dengan harga khusus dan layanan prioritas.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Harga Khusus</h3>
            <p className="text-sm text-gray-600">
              Dapatkan harga spesial untuk pembelian dalam jumlah besar
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Account Manager</h3>
            <p className="text-sm text-gray-600">
              Dedicated account manager untuk kemudahan komunikasi
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
              <Building2 className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Layanan Prioritas</h3>
            <p className="text-sm text-gray-600">
              Proses cepat dan pengiriman prioritas untuk order perusahaan
            </p>
          </div>
        </div>

        {/* Order Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Form Permintaan Penawaran
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Name */}
            <div>
              <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-2">
                Nama Perusahaan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="company_name"
                required
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="PT. Contoh Perusahaan"
              />
            </div>

            {/* Contact Person */}
            <div>
              <label htmlFor="contact_person" className="block text-sm font-medium text-gray-700 mb-2">
                Nama Contact Person <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="contact_person"
                required
                value={formData.contact_person}
                onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Perusahaan <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="john@company.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Telepon <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="08123456789"
                />
              </div>
            </div>

            {/* Product Selection with Image */}
            <div>
              <label htmlFor="product_id" className="block text-sm font-medium text-gray-700 mb-2">
                Produk yang Diinginkan <span className="text-red-500">*</span>
              </label>
              
              {isLoadingProducts ? (
                <div className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-500">
                  Loading products...
                </div>
              ) : (
                <select
                  id="product_id"
                  required
                  value={formData.product_id}
                  onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Pilih Produk --</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - Rp {product.price.toLocaleString('id-ID')}
                    </option>
                  ))}
                </select>
              )}

              {/* Selected Product Preview */}
              {selectedProduct && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={selectedProduct.media?.[0]?.url || '/placeholder-product.png'}
                        alt={selectedProduct.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{selectedProduct.name}</h4>
                      <p className="text-sm text-gray-600">
                        {selectedProduct.brand?.name} • {selectedProduct.category?.name}
                      </p>
                      <p className="text-lg font-bold text-blue-600 mt-1">
                        Rp {selectedProduct.price.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                Jumlah Unit <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="quantity"
                required
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Minimal 1 unit"
              />
              <p className="mt-2 text-sm text-gray-500">
                Untuk pembelian dalam jumlah besar (&gt;10 unit), Anda akan mendapatkan harga khusus
              </p>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Pesan Tambahan (Optional)
              </label>
              <textarea
                id="message"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Catatan khusus atau pertanyaan lainnya..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <span>Mengirim...</span>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Kirim Permintaan Penawaran</span>
                </>
              )}
            </button>

            <p className="text-sm text-gray-500 text-center">
              Tim kami akan menghubungi Anda dalam 1x24 jam untuk diskusi lebih lanjut
            </p>
          </form>
        </div>

        {/* Contact Info */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-100">
          <h3 className="font-semibold text-gray-900 mb-4">Butuh Bantuan?</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-2 text-blue-600" />
              <span>Corporate Sales: +62 852-1584-2148</span>
            </div>
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2 text-blue-600" />
              <span>Email: corporate@magadir.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}