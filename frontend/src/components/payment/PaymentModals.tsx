'use client';

import { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';

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
    { code: 'GOPAY', name: 'GoPay', number: '085215842148' },
    { code: 'OVO', name: 'OVO', number: '085215842148' },
    { code: 'DANA', name: 'DANA', number: '085215842148' },
    { code: 'SHOPEEPAY', name: 'ShopeePay', number: '085215842148' }
  ];

  const handleCopyAccount = (account: string) => {
    navigator.clipboard.writeText(account);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
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
                <h2 className="text-2xl font-bold text-gray-900">E-Wallet</h2>
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {ewallets.map((ewallet) => (
                    <button
                      key={ewallet.code}
                      onClick={() => setSelectedEWallet(ewallet.code)}
                      className={`p-4 border-2 rounded-lg transition-colors ${
                        selectedEWallet === ewallet.code
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <p className="font-semibold text-gray-900">{ewallet.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {selectedEWallet && (
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Transfer ke {ewallets.find(e => e.code === selectedEWallet)?.name}
                  </h3>
                  <div className="space-y-3">
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
                  </div>
                </div>
              )}

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