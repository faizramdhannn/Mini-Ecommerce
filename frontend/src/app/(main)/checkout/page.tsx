'use client';

import { useState } from 'react';
import { MapPin, CreditCard, Building2, Wallet, Truck, Tag, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PaymentModals from '@/components/payment/PaymentModals';

// Mock data
const mockAddress = {
  id: '1',
  label: 'Rumah',
  recipient: 'John Doe',
  phone: '+62 812-3456-7890',
  address: 'Jl. Sudirman No. 123, RT 001/RW 002',
  district: 'Kebayoran Baru',
  city: 'Jakarta Selatan',
  province: 'DKI Jakarta',
  postal_code: '12190',
  is_default: true,
};

const mockCartItems = [
  {
    id: 1,
    name: 'Wireless Headphones Premium',
    price: 899000,
    quantity: 2,
    image: '/products/headphone.jpg',
  },
  {
    id: 2,
    name: 'Smart Watch Series 5',
    price: 1299000,
    quantity: 1,
    image: '/products/watch.jpg',
  },
];

const mockVouchers = [
  { id: 1, code: 'WELCOME50', discount: 50000, description: 'Diskon Rp 50.000' },
  { id: 2, code: 'FREESHIP', discount: 0, description: 'Gratis Ongkir', freeShipping: true },
  { id: 3, code: 'MEGA100', discount: 100000, description: 'Diskon Rp 100.000' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [selectedVoucher, setSelectedVoucher] = useState<string | null>(null);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [showBankTransfer, setShowBankTransfer] = useState(false);
  const [showEWallet, setShowEWallet] = useState(false);
  const [showCreditCard, setShowCreditCard] = useState(false);
  const [selectedEWalletProvider, setSelectedEWalletProvider] = useState<string>('');

  const address = mockAddress;
  const cartItems = mockCartItems;

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = 15000;
  
  const appliedVoucher = mockVouchers.find(v => v.code === selectedVoucher);
  const discount = appliedVoucher?.discount || 0;
  const shippingDiscount = appliedVoucher?.freeShipping ? shippingCost : 0;
  
  const total = subtotal + shippingCost - discount - shippingDiscount;

  const handlePaymentSelect = (method: string) => {
    setSelectedPayment(method);
    
    // Open respective modals
    if (method === 'bank_transfer') {
      setShowBankTransfer(true);
    } else if (method === 'e_wallet') {
      setShowEWallet(true);
    } else if (method === 'credit_card') {
      setShowCreditCard(true);
    }
  };

  const handleVoucherSelect = (code: string) => {
    setSelectedVoucher(code);
    setShowVoucherModal(false);
  };

  const handleRemoveVoucher = () => {
    setSelectedVoucher(null);
  };

  const handleEditAddress = () => {
    router.push(`/account/addresses/${address.id}/edit?redirect=/checkout`);
  };

  const handleSelectEWallet = (provider: string) => {
    setSelectedEWalletProvider(provider);
  };

  const handleCreditCardSubmit = (data: any) => {
    console.log('Credit card data:', data);
    // Process credit card payment
    handlePlaceOrder();
  };

  const handlePlaceOrder = async () => {
    if (!selectedPayment) {
      alert('Silakan pilih metode pembayaran');
      return;
    }

    // Prepare order data
    const orderData = {
      address_id: address.id,
      items: cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      payment_method: selectedPayment,
      voucher_code: selectedVoucher,
      subtotal,
      shipping_cost: shippingCost,
      discount,
      total,
      // Add payment-specific details
      ...(selectedPayment === 'e_wallet' && { ewallet_provider: selectedEWalletProvider }),
    };

    console.log('Order data:', orderData);
    
    // TODO: Submit order to API
    // const response = await fetch('/api/orders', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(orderData),
    // });

    // Redirect to success page
    router.push('/order-success');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                  <MapPin className="w-5 h-5" />
                  Alamat Pengiriman
                </h2>
                <button
                  onClick={handleEditAddress}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  Ubah
                </button>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{address.recipient}</span>
                      <span className="text-sm bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                        {address.label}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-1">{address.phone}</p>
                    <p className="text-gray-700">
                      {address.address}, {address.district}
                    </p>
                    <p className="text-gray-700">
                      {address.city}, {address.province} {address.postal_code}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">Produk Dipesan</h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = '';
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <span className="text-gray-400 text-xs">IMG</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
                      <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                      </p>
                      <p className="text-gray-500 text-sm">
                        @Rp {item.price.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">Metode Pembayaran</h2>
              <div className="space-y-3">
                <button
                  onClick={() => handlePaymentSelect('credit_card')}
                  className={`w-full flex items-center justify-between p-4 border-2 rounded-lg transition-all ${
                    selectedPayment === 'credit_card'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-gray-700" />
                    <span className="font-medium text-gray-900">Kartu Kredit/Debit</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                <button
                  onClick={() => handlePaymentSelect('bank_transfer')}
                  className={`w-full flex items-center justify-between p-4 border-2 rounded-lg transition-all ${
                    selectedPayment === 'bank_transfer'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-gray-700" />
                    <span className="font-medium text-gray-900">Transfer Bank</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                <button
                  onClick={() => handlePaymentSelect('e_wallet')}
                  className={`w-full flex items-center justify-between p-4 border-2 rounded-lg transition-all ${
                    selectedPayment === 'e_wallet'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Wallet className="w-5 h-5 text-gray-700" />
                    <div className="text-left">
                      <span className="font-medium text-gray-900 block">E-Wallet</span>
                      {selectedEWalletProvider && (
                        <span className="text-sm text-gray-500">
                          {selectedEWalletProvider.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                <button
                  onClick={() => setSelectedPayment('cod')}
                  className={`w-full flex items-center justify-between p-4 border-2 rounded-lg transition-all ${
                    selectedPayment === 'cod'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-gray-700" />
                    <span className="font-medium text-gray-900">Bayar di Tempat (COD)</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">Ringkasan Belanja</h2>

              {/* Voucher Section */}
              <div className="mb-4">
                <button
                  onClick={() => setShowVoucherModal(true)}
                  className="w-full flex items-center justify-between p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {selectedVoucher ? `Voucher: ${selectedVoucher}` : 'Gunakan Voucher'}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
                {selectedVoucher && (
                  <button
                    onClick={handleRemoveVoucher}
                    className="text-red-600 text-sm mt-2 hover:underline"
                  >
                    Hapus voucher
                  </button>
                )}
              </div>

              <div className="space-y-3 py-4 border-y">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal Produk</span>
                  <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Ongkos Kirim</span>
                  <span className={shippingDiscount > 0 ? 'line-through text-gray-400' : ''}>
                    Rp {shippingCost.toLocaleString('id-ID')}
                  </span>
                </div>
                {shippingDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Gratis Ongkir</span>
                    <span>-Rp {shippingDiscount.toLocaleString('id-ID')}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Diskon Voucher</span>
                    <span>-Rp {discount.toLocaleString('id-ID')}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between text-lg font-bold mt-4 mb-6 text-gray-900">
                <span>Total Pembayaran</span>
                <span className="text-blue-600">Rp {total.toLocaleString('id-ID')}</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={!selectedPayment}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Buat Pesanan
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Dengan melakukan pemesanan, Anda menyetujui Syarat & Ketentuan yang berlaku
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Voucher Modal */}
      {showVoucherModal && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowVoucherModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Pilih Voucher</h3>
              <div className="space-y-3">
                {mockVouchers.map((voucher) => (
                  <button
                    key={voucher.id}
                    onClick={() => handleVoucherSelect(voucher.code)}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                      selectedVoucher === voucher.code
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Tag className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="font-semibold text-gray-900">{voucher.code}</p>
                        <p className="text-sm text-gray-600">{voucher.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowVoucherModal(false)}
                className="w-full mt-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Batal
              </button>
            </div>
          </div>
        </>
      )}

      {/* Payment Modals */}
      <PaymentModals
        showBankTransfer={showBankTransfer}
        setShowBankTransfer={setShowBankTransfer}
        showEWallet={showEWallet}
        setShowEWallet={setShowEWallet}
        showCreditCard={showCreditCard}
        setShowCreditCard={setShowCreditCard}
      />
    </div>
  );
}