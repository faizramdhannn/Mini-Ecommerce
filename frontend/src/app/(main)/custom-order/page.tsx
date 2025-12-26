'use client';

import { useState } from 'react';
import { Palette, Send } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function CustomOrderPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.description.trim()) {
      toast.error('Please fill in all fields');
      setIsSubmitting(false);
      return;
    }

    // ⭐ FEATURE: Create WhatsApp message (NO database storage)
    const message = `*CUSTOM ORDER REQUEST*
    
Nama: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}

Detail Pesanan:
${formData.description}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = '6285215842148'; // Your WhatsApp number
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Open WhatsApp in new tab
    window.open(whatsappLink, '_blank');
    
    // Show success message
    toast.success('Opening WhatsApp...');
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      description: '',
    });
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Palette className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Custom Order</h1>
          <p className="text-gray-400 text-lg">
            Buat produk unik sesuai keinginan Anda
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg p-8">
          <h2 className="text-2xl font-bold text-black mb-6">Detail Pesanan Custom</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Nama *"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nama Anda"
              className="text-black"
            />

            <Input
              label="Email *"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@example.com"
              className="text-black"
            />

            <Input
              label="Nomor HP *"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="08xxxxxxxxxx"
              className="text-black"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Detail Pesanan *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Jelaskan detail produk custom yang Anda inginkan (ukuran, warna, bahan, design, dll)"
                rows={6}
                className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                💡 <strong>Catatan:</strong> Setelah mengirim form, Anda akan diarahkan ke WhatsApp untuk melanjutkan pemesanan dengan tim kami.
              </p>
            </div>

            <Button type="submit" fullWidth isLoading={isSubmitting} size="lg">
              <Send className="w-5 h-5 mr-2" />
              Kirim ke WhatsApp
            </Button>
          </form>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <Palette className="w-10 h-10 mx-auto mb-3" />
            <h3 className="font-bold mb-2">Desain Sendiri</h3>
            <p className="text-sm text-gray-400">Wujudkan ide Anda</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <svg className="w-10 h-10 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="font-bold mb-2">Kualitas Premium</h3>
            <p className="text-sm text-gray-400">Bahan berkualitas tinggi</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <svg className="w-10 h-10 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="font-bold mb-2">Proses Cepat</h3>
            <p className="text-sm text-gray-400">2-4 minggu produksi</p>
          </div>
        </div>
      </div>
    </div>
  );
}