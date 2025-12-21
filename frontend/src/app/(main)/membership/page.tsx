'use client';

import { Crown, Star, Gift, Zap, TrendingUp } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth.store';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/utils/format';

export default function MembershipPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  // Simulate user points (in real app, fetch from backend)
  const userPoints = user ? 15420 : 0; // Example: user has spent Rp 15,420,000
  
  // Membership tiers based on points
  const tiers = [
    {
      name: 'Bronze',
      minPoints: 0,
      maxPoints: 9999,
      color: 'from-amber-700 to-amber-900',
      benefits: ['5% discount on all products', '1 voucher/month', 'Standard shipping'],
      icon: Crown,
    },
    {
      name: 'Silver',
      minPoints: 10000,
      maxPoints: 49999,
      color: 'from-gray-400 to-gray-600',
      benefits: ['10% discount on all products', '3 vouchers/month', 'Free shipping over Rp 200k', 'Priority support'],
      icon: Star,
    },
    {
      name: 'Gold',
      minPoints: 50000,
      maxPoints: 99999,
      color: 'from-yellow-400 to-yellow-600',
      benefits: ['15% discount on all products', '5 vouchers/month', 'Free shipping all orders', 'Early access to sales', 'Birthday gift'],
      icon: Gift,
    },
    {
      name: 'Platinum',
      minPoints: 100000,
      maxPoints: Infinity,
      color: 'from-purple-400 to-purple-600',
      benefits: ['20% discount on all products', '10 vouchers/month', 'Free express shipping', 'VIP support', 'Exclusive events', 'Double points on purchases'],
      icon: Zap,
    },
  ];

  const getCurrentTier = () => {
    return tiers.find(tier => userPoints >= tier.minPoints && userPoints <= tier.maxPoints) || tiers[0];
  };

  const getNextTier = () => {
    const current = getCurrentTier();
    const currentIndex = tiers.findIndex(t => t.name === current.name);
    return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null;
  };

  const currentTier = getCurrentTier();
  const nextTier = getNextTier();
  const pointsToNextTier = nextTier ? nextTier.minPoints - userPoints : 0;
  const progressPercentage = nextTier 
    ? ((userPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100
    : 100;

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-4 py-2 rounded-full mb-6">
            <Crown className="w-5 h-5 fill-current" />
            <span className="font-bold">MAGADIR MEMBERSHIP</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Points-Based Membership
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Earn 1 point for every Rp 1,000 you spend. Unlock better benefits as you level up!
          </p>
        </div>

        {/* User Points Card (if logged in) */}
        {isAuthenticated && user && (
          <div className="mb-12 bg-gradient-to-r from-gray-900 to-black rounded-2xl p-8 border border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-1">Hello, {user.nickname}!</h2>
                <p className="text-gray-400">Your current tier: <span className={`font-bold bg-gradient-to-r ${currentTier.color} bg-clip-text text-transparent`}>{currentTier.name}</span></p>
              </div>
              <div className={`w-20 h-20 bg-gradient-to-br ${currentTier.color} rounded-full flex items-center justify-center`}>
                {(() => {
                  const Icon = currentTier.icon;
                  return <Icon className="w-10 h-10 text-white fill-current" />;
                })()}
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Your Points</span>
                <span className="text-2xl font-bold">{userPoints.toLocaleString('id-ID')}</span>
              </div>
              
              {nextTier && (
                <>
                  <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden mb-2">
                    <div 
                      className={`h-4 bg-gradient-to-r ${nextTier.color} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-400 text-right">
                    {pointsToNextTier.toLocaleString('id-ID')} points to {nextTier.name}
                  </p>
                </>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-800">
              <div className="text-center">
                <p className="text-2xl font-bold">{formatCurrency(userPoints * 1000)}</p>
                <p className="text-xs text-gray-400">Total Spent</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{currentTier.name}</p>
                <p className="text-xs text-gray-400">Current Tier</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{nextTier ? nextTier.name : 'MAX'}</p>
                <p className="text-xs text-gray-400">Next Tier</p>
              </div>
            </div>
          </div>
        )}

        {/* How it Works */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
            <TrendingUp className="w-6 h-6" />
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="font-bold mb-2">Shop & Earn</h3>
              <p className="text-sm text-gray-400">Rp 1,000 = 1 point</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="font-bold mb-2">Level Up</h3>
              <p className="text-sm text-gray-400">Accumulate points to reach higher tiers</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="font-bold mb-2">Enjoy Benefits</h3>
              <p className="text-sm text-gray-400">Get exclusive discounts and perks</p>
            </div>
          </div>
        </div>

        {/* Membership Tiers */}
        <h2 className="text-2xl font-bold mb-8 text-center">Membership Tiers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {tiers.map((tier, index) => {
            const Icon = tier.icon;
            const isCurrentTier = isAuthenticated && tier.name === currentTier.name;
            
            return (
              <div
                key={index}
                className={`bg-white rounded-2xl p-6 transition-all ${
                  isCurrentTier ? 'ring-4 ring-yellow-400 shadow-xl' : ''
                }`}
              >
                {isCurrentTier && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                      <Star className="w-4 h-4 fill-current" />
                      YOUR TIER
                    </div>
                  </div>
                )}

                <div className={`w-16 h-16 bg-gradient-to-br ${tier.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="w-8 h-8 text-white fill-current" />
                </div>

                <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">
                  {tier.name}
                </h3>
                
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-600">
                    {tier.minPoints === 0 
                      ? `0 - ${tier.maxPoints.toLocaleString('id-ID')} pts`
                      : tier.maxPoints === Infinity
                      ? `${tier.minPoints.toLocaleString('id-ID')}+ pts`
                      : `${tier.minPoints.toLocaleString('id-ID')} - ${tier.maxPoints.toLocaleString('id-ID')} pts`
                    }
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    ({formatCurrency(tier.minPoints * 1000)}
                    {tier.maxPoints !== Infinity && ` - ${formatCurrency(tier.maxPoints * 1000)}`} spent)
                  </p>
                </div>

                <ul className="space-y-3">
                  {tier.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <Star className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5 fill-current" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        {!isAuthenticated && (
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl p-8 text-center text-black">
            <h2 className="text-3xl font-bold mb-4">Start Earning Points Today!</h2>
            <p className="text-lg mb-6">Create an account and start your journey to exclusive benefits</p>
            <button
              onClick={() => router.push('/register')}
              className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors"
            >
              Create Account
            </button>
          </div>
        )}

        {/* FAQ */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            <div>
              <h3 className="font-semibold mb-2">How do I earn points?</h3>
              <p className="text-gray-400 text-sm">
                You earn 1 point for every Rp 1,000 you spend on any purchase. Points are automatically added to your account after order completion.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Do points expire?</h3>
              <p className="text-gray-400 text-sm">
                No, your points and tier status never expire as long as your account remains active.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Can I use my discount immediately?</h3>
              <p className="text-gray-400 text-sm">
                Yes! Your tier benefits are applied automatically to your account and can be used on your next purchase.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What happens if I reach a higher tier?</h3>
              <p className="text-gray-400 text-sm">
                Your benefits upgrade automatically when you reach the required points. You'll receive an email notification and can start enjoying your new perks immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}