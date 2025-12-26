'use client';

import { X } from 'lucide-react';

interface PaymentModalsProps {
  showBankTransfer: boolean;
  setShowBankTransfer: (show: boolean) => void;
  showEWallet: boolean;
  setShowEWallet: (show: boolean) => void;
  onSelectEWallet?: (provider: string) => void;
}

export default function PaymentModals({
  showBankTransfer,
  setShowBankTransfer,
  showEWallet,
  setShowEWallet,
  onSelectEWallet,
}: PaymentModalsProps) {
  const ewalletProviders = [
    { id: 'gopay', name: 'GoPay', logo: '🏍️' },
    { id: 'ovo', name: 'OVO', logo: '💜' },
    { id: 'dana', name: 'DANA', logo: '💙' },
    { id: 'shopeepay', name: 'ShopeePay', logo: '🛍️' },
  ];

  const handleEWalletSelect = (provider: string) => {
    if (onSelectEWallet) {
      onSelectEWallet(provider);
    }
    setShowEWallet(false);
  };

  return (
    <>
      {/* Bank Transfer Modal */}
      {showBankTransfer && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowBankTransfer(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Bank Transfer</h3>
                <button
                  onClick={() => setShowBankTransfer(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
                      BCA
                    </div>
                    <div>
                      <p className="font-semibold">Bank BCA</p>
                      <p className="text-sm text-gray-500">a.n. Helobro Store</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-500 mb-1">Nomor Rekening</p>
                    <p className="text-lg font-bold">1234567890</p>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-red-600 rounded flex items-center justify-center text-white font-bold">
                      BNI
                    </div>
                    <div>
                      <p className="font-semibold">Bank BNI</p>
                      <p className="text-sm text-gray-500">a.n. Helobro Store</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-500 mb-1">Nomor Rekening</p>
                    <p className="text-lg font-bold">0987654321</p>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    💡 <strong>Catatan:</strong> Mohon transfer sesuai dengan total yang tertera.
                    Upload bukti transfer setelah pembayaran.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowBankTransfer(false)}
                className="w-full mt-6 bg-black text-white py-3 rounded-lg hover:bg-gray-800"
              >
                Mengerti
              </button>
            </div>
          </div>
        </>
      )}

      {/* E-Wallet Provider Selection Modal */}
      {/* ⭐ FEATURE 6: E-Wallet Provider Selection BEFORE order creation */}
      {showEWallet && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowEWallet(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Pilih E-Wallet</h3>
                <button
                  onClick={() => setShowEWallet(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-gray-600 mb-6">
                Pilih provider e-wallet untuk melanjutkan pembayaran
              </p>

              <div className="space-y-3">
                {ewalletProviders.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => handleEWalletSelect(provider.id)}
                    className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-black hover:shadow-md transition-all"
                  >
                    <span className="text-3xl">{provider.logo}</span>
                    <span className="font-semibold text-lg">{provider.name}</span>
                  </button>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                <p className="text-sm text-blue-800">
                  💡 Setelah memilih, Anda akan diarahkan ke halaman pembayaran provider.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}