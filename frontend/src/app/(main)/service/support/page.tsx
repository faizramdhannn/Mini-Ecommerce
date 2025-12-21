'use client';

import { useState } from 'react';
import { Phone, Mail, MessageCircle, Clock, MapPin, Send } from 'lucide-react';

export default function CustomerSupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    alert('Pesan Anda telah dikirim! Tim kami akan segera menghubungi Anda.');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Customer Support
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Kami siap membantu Anda! Hubungi kami melalui berbagai channel di bawah ini atau kirim pesan langsung.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Contact Methods */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Hubungi Kami
            </h2>

            {/* WhatsApp */}
            <div className="bg-white rounded-lg shadow-md p-6 flex items-start space-x-4 hover:shadow-lg transition-shadow">
              <div className="bg-green-100 p-3 rounded-full">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">WhatsApp</h3>
                <p className="text-gray-600 mb-2">Chat langsung dengan tim kami</p>
                <a 
                  href="https://wa.me/6285215842148?text=Halo%2C%20saya%20butuh%20bantuan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  +62 852-1584-2148
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-white rounded-lg shadow-md p-6 flex items-start space-x-4 hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 p-3 rounded-full">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Telepon</h3>
                <p className="text-gray-600 mb-2">Senin - Jumat: 09:00 - 18:00 WIB</p>
                <a 
                  href="tel:+6285215842148"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  +62 852-1584-2148
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white rounded-lg shadow-md p-6 flex items-start space-x-4 hover:shadow-lg transition-shadow">
              <div className="bg-purple-100 p-3 rounded-full">
                <Mail className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                <p className="text-gray-600 mb-2">Kami akan membalas dalam 24 jam</p>
                <a 
                  href="mailto:support@magadir.com"
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  support@magadir.com
                </a>
              </div>
            </div>

            {/* Office Hours */}
            <div className="bg-white rounded-lg shadow-md p-6 flex items-start space-x-4">
              <div className="bg-orange-100 p-3 rounded-full">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Jam Operasional</h3>
                <div className="text-gray-600 space-y-1">
                  <p>Senin - Jumat: 09:00 - 18:00 WIB</p>
                  <p>Sabtu: 09:00 - 15:00 WIB</p>
                  <p>Minggu & Tanggal Merah: Tutup</p>
                </div>
              </div>
            </div>

            {/* Office Location */}
            <div className="bg-white rounded-lg shadow-md p-6 flex items-start space-x-4">
              <div className="bg-red-100 p-3 rounded-full">
                <MapPin className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Alamat Kantor</h3>
                <p className="text-gray-600">
                  Jl. Soekarno-Hatta No. 456<br />
                  Bandung, Jawa Barat 40286<br />
                  Indonesia
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Kirim Pesan
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subjek <span className="text-red-500">*</span>
                </label>
                <select
                  id="subject"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Pilih Subjek</option>
                  <option value="order">Pertanyaan tentang Pesanan</option>
                  <option value="product">Pertanyaan tentang Produk</option>
                  <option value="shipping">Pengiriman & Tracking</option>
                  <option value="return">Retur & Refund</option>
                  <option value="technical">Masalah Teknis</option>
                  <option value="other">Lainnya</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Pesan <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Tulis pesan Anda di sini..."
                />
              </div>

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
                    <span>Kirim Pesan</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Pertanyaan yang Sering Diajukan
          </h2>

          <div className="space-y-4">
            <details className="group border-b border-gray-200 pb-4">
              <summary className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600 flex justify-between items-center">
                Bagaimana cara melacak pesanan saya?
                <span className="ml-2 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-gray-600">
                Anda dapat melacak pesanan melalui menu "Orders" di akun Anda atau gunakan halaman tracking dengan memasukkan nomor tracking yang dikirim via email.
              </p>
            </details>

            <details className="group border-b border-gray-200 pb-4">
              <summary className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600 flex justify-between items-center">
                Berapa lama proses pengiriman?
                <span className="ml-2 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-gray-600">
                Estimasi pengiriman: 2-5 hari kerja untuk Jabodetabek, 3-7 hari kerja untuk luar Jabodetabek. Untuk area remote bisa memakan waktu hingga 14 hari kerja.
              </p>
            </details>

            <details className="group border-b border-gray-200 pb-4">
              <summary className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600 flex justify-between items-center">
                Bagaimana kebijakan retur dan refund?
                <span className="ml-2 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-gray-600">
                Anda dapat mengembalikan produk dalam 7 hari setelah penerimaan jika terdapat cacat produksi atau tidak sesuai pesanan. Silakan hubungi Customer Support untuk proses retur.
              </p>
            </details>

            <details className="group">
              <summary className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600 flex justify-between items-center">
                Bagaimana cara menggunakan voucher?
                <span className="ml-2 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-gray-600">
                Masukkan kode voucher pada halaman checkout sebelum melakukan pembayaran. Voucher akan otomatis mengurangi total pembayaran sesuai nilai yang tertera.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}