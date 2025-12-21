'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthStore } from '@/lib/store/auth.store';
import { cartService } from '@/lib/services/cart.service';
import { userService } from '@/lib/services/user.service';
import { orderService } from '@/lib/services/order.service';
import type { Cart, UserAddress } from '@/types';
import { toast } from 'react-hot-toast';
import { MapPin, Plus, CreditCard, Truck } from 'lucide-react';
import PaymentModals from '@/components/payment/PaymentModals';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [cart, setCart] = useState<Cart | null>(null);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [isLoadingCart, setIsLoadingCart] = useState(true);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Payment modal states
  const [showBankTransfer, setShowBankTransfer] = useState(false);
  const [showEWallet, setShowEWallet] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);

  // ⭐ UPDATED: Support checkout from selected items
  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/checkout');
      return;
    }

    const fetchCartData = async () => {
      try {
        setIsLoadingCart(true);
        
        // ⭐ Check if checkout from selected items
        const checkoutItemsStr = sessionStorage.getItem('checkoutItems');
        
        if (checkoutItemsStr) {
          // ⭐ Checkout from selected items only
          const selectedItems = JSON.parse(checkoutItemsStr);
          const mockCart = {
            id: 1,
            user_id: user.id,
            items: selectedItems,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          setCart(mockCart);
          
          // ⭐ Clear after use
          sessionStorage.removeItem('checkoutItems');
        } else {
          // ⭐ Checkout all items (fallback)
          const data = await cartService.getCart();
          setCart(data);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        toast.error('Failed to load cart');
      } finally {
        setIsLoadingCart(false);
      }
    };

    fetchCartData();
    fetchAddresses();
  }, [user, router]);

  const fetchAddresses = async () => {
    if (!user) return;
    
    try {
      setIsLoadingAddresses(true);
      const data = await userService.getUserAddresses(user.id);
      setAddresses(data);
      
      // Auto-select default address
      const defaultAddress = data.find(addr => addr.is_default);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress.id);
      } else if (data.length > 0) {
        setSelectedAddress(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  const calculateTotals = () => {
    if (!cart?.items) return { subtotal: 0, shipping: 0, total: 0 };

    const subtotal = cart.items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    const shipping = 20000; // Fixed shipping cost
    const total = subtotal + shipping;

    return { subtotal, shipping, total };
  };

  const handleSubmitOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    if (!cart?.items || cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      setIsSubmitting(true);

      const orderData = {
        items: cart.items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity
        })),
        payment_method: paymentMethod,
        shipping_cost: 20000,
        address_id: selectedAddress
      };

      const order = await orderService.createOrder(orderData);
      setCreatedOrderId(order.id);

      // Show payment modal based on method
      if (paymentMethod === 'bank_transfer') {
        setShowBankTransfer(true);
      } else if (paymentMethod === 'e_wallet') {
        setShowEWallet(true);
      } else {
        // COD or other methods - redirect to orders
        toast.success('Order created successfully!');
        router.push('/account?tab=orders');
      }

    } catch (error: any) {
      console.error('Error creating order:', error);
      toast.error(error.response?.data?.message || 'Failed to create order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentComplete = () => {
    setShowBankTransfer(false);
    setShowEWallet(false);
    toast.success('Order placed successfully!');
    router.push('/account?tab=orders');
  };

  const totals = calculateTotals();

  if (!user) {
    return null;
  }

  if (isLoadingCart || isLoadingAddresses) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-900 mb-4">Your cart is empty</p>
          <button
            onClick={() => router.push('/products')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Address & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">Delivery Address</h2>
                </div>
                <button
                  onClick={() => router.push('/account/addresses/new?redirect=/checkout')}
                  className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New</span>
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No addresses found</p>
                  <button
                    onClick={() => router.push('/account/addresses/new?redirect=/checkout')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add Address
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <label
                      key={address.id}
                      className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedAddress === address.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-start">
                        <input
                          type="radio"
                          name="address"
                          value={address.id}
                          checked={selectedAddress === address.id}
                          onChange={() => setSelectedAddress(address.id)}
                          className="mt-1 mr-3"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold text-gray-900">
                              {address.recipient_name}
                            </span>
                            {address.is_default && (
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                                Default
                              </span>
                            )}
                            {address.label && (
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                {address.label}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{address.phone}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {address.address_line}, {address.city}, {address.province} {address.postal_code}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-4">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
              </div>

              <div className="space-y-3">
                <label className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === 'bank_transfer' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                }`}>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      value="bank_transfer"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <span className="font-semibold text-gray-900">Bank Transfer</span>
                      <p className="text-sm text-gray-600">BCA, Mandiri, BNI, BRI</p>
                    </div>
                  </div>
                </label>

                <label className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === 'e_wallet' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                }`}>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      value="e_wallet"
                      checked={paymentMethod === 'e_wallet'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <span className="font-semibold text-gray-900">E-Wallet</span>
                      <p className="text-sm text-gray-600">GoPay, OVO, DANA, ShopeePay</p>
                    </div>
                  </div>
                </label>

                <label className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === 'cod' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                }`}>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <span className="font-semibold text-gray-900">Cash on Delivery (COD)</span>
                      <p className="text-sm text-gray-600">Bayar saat barang diterima</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-start space-x-3">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={item.product.media?.[0]?.url || '/placeholder-product.png'}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold text-gray-900">
                        Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-6 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.items.length} items)</span>
                  <span>Rp {totals.subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Rp {totals.shipping.toLocaleString('id-ID')}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-blue-600">
                      Rp {totals.total.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handleSubmitOrder}
                disabled={isSubmitting || !selectedAddress || !paymentMethod}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By placing your order, you agree to our Terms & Conditions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modals */}
      {createdOrderId && (
        <PaymentModals
          orderId={createdOrderId}
          totalAmount={totals.total}
          showBankTransfer={showBankTransfer}
          showEWallet={showEWallet}
          onClose={handlePaymentComplete}
        />
      )}
    </div>
  );
}