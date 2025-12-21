'use client';

import { Shield, CheckCircle, XCircle, Clock, FileText, Package } from 'lucide-react';

export default function WarrantyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
            <Shield className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Informasi Garansi
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Magadir memberikan garansi resmi untuk semua produk elektronik yang dijual. Berikut adalah informasi lengkap mengenai garansi produk kami.
          </p>
        </div>

        {/* Warranty Types */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Garansi Resmi</h3>
            <p className="text-gray-600">
              Garansi dari distributor resmi Indonesia dengan service center tersebar di seluruh Indonesia.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Package className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Garansi Internasional</h3>
            <p className="text-gray-600">
              Garansi dari brand langsung yang berlaku di seluruh dunia (tergantung produk).
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Garansi Toko</h3>
            <p className="text-gray-600">
              Garansi 7 hari dari toko untuk produk Dead on Arrival (DOA) atau cacat produksi.
            </p>
          </div>
        </div>

        {/* Warranty Period */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center mb-6">
            <Clock className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Periode Garansi</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Kategori Produk</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Garansi Resmi</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Garansi Toko</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-gray-900">Laptop & PC</td>
                  <td className="px-6 py-4 text-gray-600">1-2 Tahun</td>
                  <td className="px-6 py-4 text-gray-600">7 Hari</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-gray-900">Smartphone & Tablet</td>
                  <td className="px-6 py-4 text-gray-600">1 Tahun</td>
                  <td className="px-6 py-4 text-gray-600">7 Hari</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-900">Audio (Headphone, Speaker)</td>
                  <td className="px-6 py-4 text-gray-600">1 Tahun</td>
                  <td className="px-6 py-4 text-gray-600">7 Hari</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-gray-900">Peripheral (Keyboard, Mouse)</td>
                  <td className="px-6 py-4 text-gray-600">1 Tahun</td>
                  <td className="px-6 py-4 text-gray-600">7 Hari</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-900">Smartwatch & Wearable</td>
                  <td className="px-6 py-4 text-gray-600">1 Tahun</td>
                  <td className="px-6 py-4 text-gray-600">7 Hari</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* What's Covered */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center mb-6">
              <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Yang Ditanggung Garansi</h2>
            </div>

            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Kerusakan akibat cacat produksi atau material</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Kerusakan komponen hardware dalam penggunaan normal</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Dead on Arrival (DOA) maksimal 7 hari setelah pembelian</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Perbaikan atau penggantian unit sesuai kebijakan service center</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Spare part original dari brand</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center mb-6">
              <XCircle className="w-6 h-6 text-red-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Yang TIDAK Ditanggung</h2>
            </div>

            <ul className="space-y-3">
              <li className="flex items-start">
                <XCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Kerusakan akibat pemakaian tidak wajar atau kelalaian pengguna</span>
              </li>
              <li className="flex items-start">
                <XCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Kerusakan fisik (jatuh, benturan, terkena air/cairan)</span>
              </li>
              <li className="flex items-start">
                <XCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Produk yang telah dibongkar atau diperbaiki oleh pihak tidak resmi</span>
              </li>
              <li className="flex items-start">
                <XCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Kerusakan software atau virus</span>
              </li>
              <li className="flex items-start">
                <XCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Aksesoris tambahan (charger, kabel, dll) setelah masa garansi toko berakhir</span>
              </li>
              <li className="flex items-start">
                <XCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Produk tanpa kartu garansi atau bukti pembelian</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Claim Process */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Cara Klaim Garansi</h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full font-bold mb-4">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Hubungi Kami</h3>
              <p className="text-sm text-gray-600">
                Hubungi customer support via WhatsApp atau email dengan menyertakan bukti pembelian
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full font-bold mb-4">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Verifikasi</h3>
              <p className="text-sm text-gray-600">
                Tim kami akan memverifikasi garansi dan memberikan instruksi selanjutnya
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full font-bold mb-4">
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Kirim Produk</h3>
              <p className="text-sm text-gray-600">
                Kirim produk ke alamat service center atau pick-up akan diatur (khusus area tertentu)
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full font-bold mb-4">
                4
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Selesai</h3>
              <p className="text-sm text-gray-600">
                Produk diperbaiki/diganti dan dikirim kembali ke Anda (estimasi 7-14 hari kerja)
              </p>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
          <div className="flex">
            <FileText className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Catatan Penting</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Simpan kartu garansi dan bukti pembelian dengan baik</li>
                <li>• Kartu garansi yang hilang atau rusak tidak dapat diganti</li>
                <li>• Backup data Anda sebelum mengirim produk untuk klaim garansi</li>
                <li>• Biaya pengiriman untuk klaim garansi ditanggung oleh customer</li>
                <li>• Estimasi waktu perbaikan dapat berbeda-beda tergantung ketersediaan spare part</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}