'use client';

import { useState } from 'react';
import { X, CreditCard, Building2, Smartphone } from 'lucide-react';
import Image from 'next/image';

interface PaymentModalsProps {
  isOpen: boolean;
  onClose: () => void;
  paymentMethod: string;
  onConfirm: (paymentData?: any) => void;
}

// ⭐ FIX 4: Format card number with spaces
const formatCardNumber = (value: string): string => {
  const cleaned = value.replace(/\s/g, '');
  const chunks = cleaned.match(/.{1,4}/g);
  return chunks ? chunks.join(' ') : cleaned;
};

export default function PaymentModals({ isOpen, onClose, paymentMethod, onConfirm }: PaymentModalsProps) {
  // Bank Transfer State
  const [selectedBank, setSelectedBank] = useState('');

  // E-Wallet State
  const [phoneNumber, setPhoneNumber] = useState('');

  // ⭐ FIX 4: Credit Card State
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');

  if (!isOpen) return null;

  const handleBankTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBank) {
      alert('Silakan pilih bank');
      return;
    }
    onConfirm({ bank: selectedBank });
  };

  const handleEwalletSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) {
      alert('Silakan masukkan nomor telepon');
      return;
    }
    onConfirm({ phone: phoneNumber });
  };

  // ⭐ FIX 4: Credit Card Form Submit Handler
  const handleCreditCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
      alert('Nomor kartu tidak valid');
      return;
    }
    if (!cardholderName) {
      alert('Nama pemegang kartu harus diisi');
      return;
    }
    if (!expiryMonth || !expiryYear) {
      alert('Tanggal kadaluarsa harus diisi');
      return;
    }
    if (!cvv || cvv.length < 3) {
      alert('CVV tidak valid');
      return;
    }

    const monthNum = parseInt(expiryMonth);
    if (monthNum < 1 || monthNum > 12) {
      alert('Bulan tidak valid (1-12)');
      return;
    }

    onConfirm({
      cardNumber: cardNumber.replace(/\s/g, ''),
      cardholderName,
      expiryMonth,
      expiryYear,
      cvv,
    });
  };

  // Bank Transfer Modal
  if (paymentMethod === 'bank_transfer') {
    const banks = [
      { id: 'bca', name: 'BCA', logo: '/images/banks/bca.png' },
      { id: 'mandiri', name: 'Mandiri', logo: '/images/banks/mandiri.png' },
      { id: 'bni', name: 'BNI', logo: '/images/banks/bni.png' },
      { id: 'bri', name: 'BRI', logo: '/images/banks/bri.png' },
    ];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5" />
              <h2 className="text-xl font-bold">Transfer Bank</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleBankTransferSubmit} className="p-6">
            <div className="space-y-3 mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Bank
              </label>
              {banks.map((bank) => (
                <button
                  key={bank.id}
                  type="button"
                  onClick={() => setSelectedBank(bank.id)}
                  className={`w-full flex items-center gap-4 p-4 border-2 rounded-lg transition-all ${
                    selectedBank === bank.id
                      ? 'border-black bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="w-16 h-10 relative bg-white rounded border border-gray-200 flex items-center justify-center">
                    <span className="text-xs font-semibold text-gray-600">{bank.name}</span>
                  </div>
                  <span className="font-medium">{bank.name}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={!selectedBank}
                className="flex-1 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Lanjutkan
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // E-Wallet Modal
  if (paymentMethod === 'e_wallet') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full">
          <div className="border-b px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5" />
              <h2 className="text-xl font-bold">E-Wallet</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleEwalletSubmit} className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nomor Telepon
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="08xxxxxxxxxx"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                Masukkan nomor telepon yang terdaftar di e-wallet Anda
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800"
              >
                Lanjutkan
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ⭐ FIX 4: Credit Card Modal
  if (paymentMethod === 'credit_card') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5" />
              <h2 className="text-xl font-bold">Kartu Kredit/Debit</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleCreditCardSubmit} className="p-6">
            <div className="space-y-4 mb-6">
              {/* Card Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Kartu
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => {
                    const formatted = formatCardNumber(e.target.value.replace(/\D/g, ''));
                    if (formatted.replace(/\s/g, '').length <= 16) {
                      setCardNumber(formatted);
                    }
                  }}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-mono"
                  maxLength={19}
                  required
                />
              </div>

              {/* Cardholder Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Pemegang Kartu
                </label>
                <input
                  type="text"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value.toUpperCase())}
                  placeholder="NAMA SESUAI KARTU"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black uppercase"
                  required
                />
              </div>

              {/* Expiry Date & CVV */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bulan
                  </label>
                  <input
                    type="number"
                    value={expiryMonth}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.length <= 2) {
                        setExpiryMonth(val);
                      }
                    }}
                    placeholder="MM"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-center"
                    min="1"
                    max="12"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tahun
                  </label>
                  <input
                    type="number"
                    value={expiryYear}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.length <= 4) {
                        setExpiryYear(val);
                      }
                    }}
                    placeholder="YYYY"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-center"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="password"
                    value={cvv}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      if (val.length <= 4) {
                        setCvv(val);
                      }
                    }}
                    placeholder="123"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-center"
                    maxLength={4}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <div className="text-blue-600 mt-0.5">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">Pembayaran Aman</p>
                  <p className="text-xs text-blue-700">
                    Informasi kartu Anda dienkripsi dan aman. Kami tidak menyimpan detail kartu Anda.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800"
              >
                Bayar Sekarang
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return null;
}