'use client';

import { useState } from 'react';
import { X, Copy, Check, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface PaymentModalsProps {
  orderId: number;
  totalAmount: number;
  showBankTransfer: boolean;
  showEWallet: boolean;
  onClose: () => void;
}

export default function PaymentModals({
  orderId,
  totalAmount,
  showBankTransfer,
  showEWallet,
  onClose
}: PaymentModalsProps) {
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [selectedEWallet, setSelectedEWallet] = useState<string>('');
  const [copiedBank, setCopiedBank] = useState(false);

  const banks = [
    { code: 'BCA', name: 'BCA', account: '1234567890' },
    { code: 'MANDIRI', name: 'Mandiri', account: '0987654321' },
    { code: 'BNI', name: 'BNI', account: '1122334455' },
    { code: 'BRI', name: 'BRI', account: '5544332211' }
  ];

  const ewallets = [
    { 
      code: 'GOPAY', 
      name: 'GoPay', 
      number: '085215842148',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg',
      webLink: 'https://gopay.co.id',
      color: 'bg-[#00AA13]'
    },
    { 
      code: 'OVO', 
      name: 'OVO', 
      number: '085215842148',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Logo_ovo_purple.svg',
      webLink: 'https://ovo.id',
      color: 'bg-[#4C3494]'
    },
    { 
      code: 'DANA', 
      name: 'DANA', 
      number: '085215842148',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_dana_blue.svg',
      webLink: 'https://dana.id',
      color: 'bg-[#118EEA]'
    },
    { 
      code: 'SHOPEEPAY', 
      name: 'ShopeePay', 
      number: '085215842148',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Shopee.svg',
      webLink: 'https://shopee.co.id/web',
      color: 'bg-[#EE4D2D]'
    }
  ];

  const handleCopyAccount = (account: string) => {
    navigator.clipboard.writeText(account);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  const handleOpenEWallet = (webLink: string) => {
    window.open(webLink, '_blank');
  };

  if (!showBankTransfer && !showEWallet) return null;

  return (
    <>
      {/* Bank Transfer Modal */}
      {showBankTransfer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Bank Transfer</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 mb-2">Order ID: <span className="font-semibold">#{orderId}</span></p>
                <p className="text-2xl font-bold text-blue-600">
                  Rp {totalAmount.toLocaleString('id-ID')}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Pilih Bank</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {banks.map((bank) => (
                    <button
                      key={bank.code}
                      onClick={() => setSelectedBank(bank.code)}
                      className={`p-4 border-2 rounded-lg transition-colors ${
                        selectedBank === bank.code
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <p className="font-semibold text-gray-900">{bank.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {selectedBank && (
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Transfer ke rekening {banks.find(b => b.code === selectedBank)?.name}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Nomor Rekening</p>
                      <div className="flex items-center justify-between bg-white p-3 rounded border border-gray-200">
                        <p className="text-lg font-bold text-gray-900">
                          {banks.find(b => b.code === selectedBank)?.account}
                        </p>
                        <button
                          onClick={() => handleCopyAccount(banks.find(b => b.code === selectedBank)?.account || '')}
                          className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                        >
                          {copiedBank ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span className="text-sm">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              <span className="text-sm">Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Atas Nama</p>
                      <p className="font-semibold text-gray-900">PT Magadir Indonesia</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  <strong>Penting:</strong> Transfer tepat sesuai jumlah yang tertera untuk mempercepat verifikasi pembayaran.
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Saya Sudah Transfer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* E-Wallet Modal */}
      {showEWallet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">E-Wallet Payment</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 mb-2">Order ID: <span className="font-semibold">#{orderId}</span></p>
                <p className="text-2xl font-bold text-blue-600">
                  Rp {totalAmount.toLocaleString('id-ID')}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Pilih E-Wallet</h3>
                <div className="grid grid-cols-2 gap-3">
                  {ewallets.map((ewallet) => (
                    <button
                      key={ewallet.code}
                      onClick={() => setSelectedEWallet(ewallet.code)}
                      className={`p-4 border-2 rounded-lg transition-all hover:shadow-md ${
                        selectedEWallet === ewallet.code
                          ? 'border-blue-600 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-3">
                        {/* Logo Container with colored background */}
                        <div className={`w-16 h-16 rounded-lg ${ewallet.color} p-3 flex items-center justify-center`}>
                          <div className="w-full h-full relative bg-white rounded">
                            <Image
                              src={ewallet.logo}
                              alt={ewallet.name}
                              fill
                              className="object-contain p-1"
                              unoptimized
                            />
                          </div>
                        </div>
                        <p className="font-semibold text-gray-900 text-sm">{ewallet.name}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedEWallet && (
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Transfer ke {ewallets.find(e => e.code === selectedEWallet)?.name}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Nomor {ewallets.find(e => e.code === selectedEWallet)?.name}</p>
                      <p className="text-lg font-bold text-gray-900">
                        {ewallets.find(e => e.code === selectedEWallet)?.number}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Atas Nama</p>
                      <p className="font-semibold text-gray-900">Magadir Store</p>
                    </div>

                    {/* Open E-Wallet App Button */}
                    <button
                      onClick={() => {
                        const ewallet = ewallets.find(e => e.code === selectedEWallet);
                        if (ewallet) handleOpenEWallet(ewallet.webLink);
                      }}
                      className={`w-full ${ewallets.find(e => e.code === selectedEWallet)?.color} text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center justify-center space-x-2`}
                    >
                      <span>Buka Aplikasi {ewallets.find(e => e.code === selectedEWallet)?.name}</span>
                      <ExternalLink className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Cara Bayar:</strong>
                  <ol className="list-decimal ml-4 mt-2 space-y-1">
                    <li>Klik tombol "Buka Aplikasi" di atas</li>
                    <li>Login ke akun e-wallet Anda</li>
                    <li>Transfer ke nomor yang tertera</li>
                    <li>Gunakan catatan: Order #{orderId}</li>
                  </ol>
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Saya Sudah Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}