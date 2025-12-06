import React, { useState } from 'react';
import { X, CheckCircle, Wallet, CreditCard, Banknote } from 'lucide-react';

// Type definitions
interface BankTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

interface CreditCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: CreditCardFormData) => void;
}

interface EWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (walletId: string) => void;
}

interface CODModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  totalAmount: number;
}

interface CreditCardFormData {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

interface FormErrors {
  cardNumber?: string;
  cardName?: string;
  expiryDate?: string;
  cvv?: string;
}

// Bank Transfer Modal
export const BankTransferModal: React.FC<BankTransferModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  const bankDetails = {
    bankName: 'Bank Central Asia (BCA)',
    accountNumber: '1234567890',
    accountName: 'PT Magadir Indonesia',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Banknote className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Bank Transfer</h3>
            <p className="text-sm text-gray-600">Transfer ke rekening berikut</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Bank</label>
              <p className="font-semibold text-gray-900">{bankDetails.bankName}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Nomor Rekening</label>
              <div className="flex items-center justify-between bg-white p-3 rounded border">
                <p className="font-mono text-lg font-bold text-gray-900">{bankDetails.accountNumber}</p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(bankDetails.accountNumber);
                    alert('Nomor rekening disalin!');
                  }}
                  className="text-blue-600 text-sm font-medium"
                >
                  Salin
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Nama Penerima</label>
              <p className="font-semibold text-gray-900">{bankDetails.accountName}</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
            <p className="text-xs text-yellow-800">
              <strong>Penting:</strong> Lakukan transfer sesuai dengan total yang tertera. Pesanan akan diproses setelah pembayaran dikonfirmasi.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={onConfirm}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Saya Sudah Bayar
            </button>
            <button
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Credit Card Modal
export const CreditCardModal: React.FC<CreditCardModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [formData, setFormData] = useState<CreditCardFormData>({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  if (!isOpen) return null;

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.substring(0, 16);
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    setFormData({ ...formData, cardNumber: value });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    setFormData({ ...formData, expiryDate: value });
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 3);
    setFormData({ ...formData, cvv: value });
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = 'Nomor kartu harus 16 digit';
    }
    if (!formData.cardName) {
      newErrors.cardName = 'Nama pemegang kartu harus diisi';
    }
    if (formData.expiryDate.length !== 5) {
      newErrors.expiryDate = 'Format MM/YY';
    }
    if (formData.cvv.length !== 3) {
      newErrors.cvv = 'CVV harus 3 digit';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onConfirm(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Credit Card</h3>
            <p className="text-sm text-gray-600">Masukkan detail kartu kredit Anda</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nomor Kartu
              </label>
              <input
                type="text"
                value={formData.cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {errors.cardNumber && (
                <p className="text-xs text-red-600 mt-1">{errors.cardNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Pemegang Kartu
              </label>
              <input
                type="text"
                value={formData.cardName}
                onChange={(e) => setFormData({ ...formData, cardName: e.target.value.toUpperCase() })}
                placeholder="NAMA SESUAI KARTU"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {errors.cardName && (
                <p className="text-xs text-red-600 mt-1">{errors.cardName}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Berlaku Hingga
                </label>
                <input
                  type="text"
                  value={formData.expiryDate}
                  onChange={handleExpiryChange}
                  placeholder="MM/YY"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {errors.expiryDate && (
                  <p className="text-xs text-red-600 mt-1">{errors.expiryDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <input
                  type="text"
                  value={formData.cvv}
                  onChange={handleCvvChange}
                  placeholder="123"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {errors.cvv && (
                  <p className="text-xs text-red-600 mt-1">{errors.cvv}</p>
                )}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                🔒 Transaksi Anda aman dan terenkripsi
              </p>
            </div>

            <div className="space-y-3 mt-6">
              <button
                onClick={handleSubmit}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Bayar Sekarang
              </button>
              <button
                onClick={onClose}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// E-Wallet Modal
export const EWalletModal: React.FC<EWalletModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [selectedWallet, setSelectedWallet] = useState('');

  if (!isOpen) return null;

  const wallets = [
    { id: 'dana', name: 'DANA', icon: '💰', color: 'bg-blue-500' },
    { id: 'shopee', name: 'ShopeePay', icon: '🛍️', color: 'bg-orange-500' },
    { id: 'gopay', name: 'GoPay', icon: '🏍️', color: 'bg-green-500' },
    { id: 'ovo', name: 'OVO', icon: '💜', color: 'bg-purple-500' },
  ];

  const handleConfirm = () => {
    if (selectedWallet) {
      onConfirm(selectedWallet);
    } else {
      alert('Pilih metode e-wallet terlebih dahulu');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">E-Wallet</h3>
            <p className="text-sm text-gray-600">Pilih metode e-wallet Anda</p>
          </div>

          <div className="space-y-3 mb-6">
            {wallets.map((wallet) => (
              <button
                key={wallet.id}
                onClick={() => setSelectedWallet(wallet.id)}
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  selectedWallet === wallet.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{wallet.icon}</span>
                    <span className="font-semibold text-gray-900">{wallet.name}</span>
                  </div>
                  {selectedWallet === wallet.id && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
            <p className="text-xs text-blue-800">
              💡 Anda akan diarahkan ke aplikasi {selectedWallet ? wallets.find(w => w.id === selectedWallet)?.name : 'e-wallet'} untuk menyelesaikan pembayaran
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleConfirm}
              disabled={!selectedWallet}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Lanjutkan ke Pembayaran
            </button>
            <button
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// COD Modal
export const CODModal: React.FC<CODModalProps> = ({ isOpen, onClose, onConfirm, totalAmount }) => {
  if (!isOpen) return null;

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Banknote className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Cash on Delivery (COD)</h3>
            <p className="text-sm text-gray-600">Bayar saat barang diterima</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-600">Total Pembayaran</span>
              <span className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount)}</span>
            </div>
            <p className="text-xs text-gray-500">
              Siapkan uang pas untuk memudahkan transaksi
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 space-y-2">
            <h4 className="font-semibold text-yellow-800 text-sm">Ketentuan COD:</h4>
            <ul className="text-xs text-yellow-700 space-y-1 list-disc list-inside">
              <li>Pembayaran dilakukan saat menerima barang</li>
              <li>Pastikan Anda berada di lokasi pengiriman</li>
              <li>Periksa kondisi barang sebelum membayar</li>
              <li>Driver tidak membawa uang kembalian</li>
            </ul>
          </div>

          <div className="space-y-3">
            <button
              onClick={onConfirm}
              className="w-full bg-yellow-600 text-white py-3 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
            >
              Setuju, Pesan dengan COD
            </button>
            <button
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};