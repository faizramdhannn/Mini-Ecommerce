'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/lib/store/cart.store';
import { useAuthStore } from '@/lib/store/auth.store';
import { orderService } from '@/lib/services/order.service';
import { formatCurrency } from '@/lib/utils/format';
import { PAYMENT_METHODS, SHIPPING_COST } from '@/lib/utils/constants';
import { BankTransferModal, CreditCardModal, EWalletModal, CODModal } from '@/components/payment/PaymentModals';
import toast from 'react-hot-toast';
import type { CartItem } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, fetchCart, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [selectedPayment, setSelectedPayment] = useState('bank_transfer');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchCart();
  }, [isAuthenticated, fetchCart, router]);

  const subtotal = cart?.items?.reduce(
    (sum: number, item: CartItem) => sum + item.product.price * item.quantity,
    0
  ) || 0;

  const total = subtotal + SHIPPING_COST;

  const handleCheckout = async () => {
    if (!cart?.items || cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Show payment modal based on selected method
    setShowPaymentModal(true);
  };

  const handlePaymentConfirm = async (paymentData?: any) => {
    if (!cart?.items || cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsProcessing(true);
    setShowPaymentModal(false);

    try {
      const orderData = {
        items: cart.items.map((item: CartItem) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
        payment_method: selectedPayment,
        shipping_cost: SHIPPING_COST,
      };

      const order = await orderService.createOrder(orderData);
      
      // For bank transfer, automatically mark as paid
      if (selectedPayment === 'bank_transfer') {
        // In real app, this would be done by admin after verifying payment
        // For demo purposes, we simulate instant payment confirmation
        toast.success('Order created! Waiting for payment confirmation');
      } else {
        toast.success('Payment processed successfully!');
      }
      
      await clearCart();
      router.push(`/checkout/success?order_id=${order.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create order');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Button onClick={() => router.push('/products')}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl text-black font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {cart.items.map((item: CartItem) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product.media?.[0]?.url || '/images/placeholder.png'}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-600">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    <p className="font-semibold mt-1 text-gray-600">
                      {formatCurrency(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl text-black font-semibold mb-4">Payment Method</h2>
            <div className="space-y-3 text-gray-600">
              {PAYMENT_METHODS.map((method) => (
                <label
                  key={method.value}
                  className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.value}
                    checked={selectedPayment === method.value}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="font-medium">{method.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border p-6 sticky top-24">
            <h2 className="text-xl text-black font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-600">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-gray-600">{formatCurrency(SHIPPING_COST)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-black text-lg font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            <Button
              fullWidth
              size="lg"
              onClick={handleCheckout}
              isLoading={isProcessing}
            >
              Place Order
            </Button>
          </div>
        </div>
      </div>

      {/* Payment Modals */}
      <BankTransferModal
        isOpen={showPaymentModal && selectedPayment === 'bank_transfer'}
        onClose={() => setShowPaymentModal(false)}
        onConfirm={handlePaymentConfirm}
      />

      <CreditCardModal
        isOpen={showPaymentModal && selectedPayment === 'credit_card'}
        onClose={() => setShowPaymentModal(false)}
        onConfirm={handlePaymentConfirm}
      />

      <EWalletModal
        isOpen={showPaymentModal && selectedPayment === 'e_wallet'}
        onClose={() => setShowPaymentModal(false)}
        onConfirm={handlePaymentConfirm}
      />

      <CODModal
        isOpen={showPaymentModal && selectedPayment === 'cod'}
        onClose={() => setShowPaymentModal(false)}
        onConfirm={handlePaymentConfirm}
        totalAmount={total}
      />
    </div>
  );
}