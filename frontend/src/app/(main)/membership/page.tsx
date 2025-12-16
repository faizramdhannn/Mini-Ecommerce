'use client';

import { Crown, Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function MembershipPage() {
  const router = useRouter();

  const benefits = [
    'Exclusive member-only discounts up to 20%',
    'Free shipping on all orders',
    'Early access to new products and sales',
    'Birthday special vouchers',
    'Priority customer support',
    'Exclusive member events and workshops',
  ];

  const plans = [
    {
      name: 'Silver',
      price: 99000,
      duration: '3 months',
      color: 'from-gray-400 to-gray-600',
      benefits: ['10% discount', 'Free shipping over 200k', '2 vouchers/month'],
    },
    {
      name: 'Gold',
      price: 299000,
      duration: '1 year',
      color: 'from-yellow-400 to-yellow-600',
      popular: true,
      benefits: ['15% discount', 'Free shipping all orders', '5 vouchers/month', 'Priority support'],
    },
    {
      name: 'Platinum',
      price: 599000,
      duration: '2 years',
      color: 'from-purple-400 to-purple-600',
      benefits: ['20% discount', 'Free shipping + express', '10 vouchers/month', 'VIP support', 'Exclusive events'],
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-4 py-2 rounded-full mb-6">
            <Crown className="w-5 h-5 fill-current" />
            <span className="font-bold">PREMIUM MEMBERSHIP</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Join Magadir Membership
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Unlock exclusive benefits, special discounts, and premium shopping experience
          </p>
        </div>

        {/* Benefits */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Member Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl p-8 ${
                plan.popular ? 'ring-4 ring-yellow-400' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current" />
                    MOST POPULAR
                  </div>
                </div>
              )}

              <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Crown className="w-8 h-8 text-white fill-current" />
              </div>

              <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">
                {plan.name}
              </h3>
              
              <div className="text-center mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  Rp {plan.price.toLocaleString('id-ID')}
                </span>
                <p className="text-gray-600 text-sm mt-1">{plan.duration}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>

              <Button
                fullWidth
                variant={plan.popular ? 'primary' : 'outline'}
                onClick={() => router.push('/checkout-membership')}
              >
                Choose {plan.name}
              </Button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            <div>
              <h3 className="font-semibold mb-2">How do I become a member?</h3>
              <p className="text-gray-400 text-sm">
                Simply choose a membership plan above and complete the payment. Your membership will be activated immediately.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Can I cancel my membership?</h3>
              <p className="text-gray-400 text-sm">
                Yes, you can cancel anytime. However, refunds are only available within 7 days of purchase.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">How do I use my member vouchers?</h3>
              <p className="text-gray-400 text-sm">
                Vouchers will be automatically added to your account each month. You can view and apply them during checkout.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}