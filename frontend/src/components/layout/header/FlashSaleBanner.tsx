'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Zap } from 'lucide-react';

export const FlashSaleBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [colorScheme, setColorScheme] = useState({
    gradient: 'from-red-600 via-orange-600 to-yellow-600',
    buttonBg: 'bg-white',
    buttonText: 'text-red-600',
    shimmer: 'from-transparent via-white to-transparent',
  });

  // Get color scheme based on current hour
  const getColorScheme = () => {
    const hour = new Date().getHours();
    
    // 00:00 - 08:00 = Orange (seperti sekarang)
    if (hour >= 0 && hour < 8) {
      return {
        gradient: 'from-red-600 via-orange-600 to-yellow-600',
        buttonBg: 'bg-white',
        buttonText: 'text-red-600',
        shimmer: 'from-transparent via-white to-transparent',
      };
    }
    // 08:00 - 16:00 = Blue
    else if (hour >= 8 && hour < 16) {
      return {
        gradient: 'from-blue-600 via-cyan-500 to-blue-400',
        buttonBg: 'bg-white',
        buttonText: 'text-blue-600',
        shimmer: 'from-transparent via-white to-transparent',
      };
    }
    // 16:00 - 24:00 = Dark
    else {
      return {
        gradient: 'from-gray-900 via-gray-800 to-gray-700',
        buttonBg: 'bg-white',
        buttonText: 'text-gray-900',
        shimmer: 'from-transparent via-gray-600 to-transparent',
      };
    }
  };

  // Update color scheme when component mounts and every minute
  useEffect(() => {
    setColorScheme(getColorScheme());
    
    const interval = setInterval(() => {
      setColorScheme(getColorScheme());
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Countdown timer
  useEffect(() => {
    const flashSaleEnd = new Date();
    flashSaleEnd.setHours(23, 59, 59, 999);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = flashSaleEnd.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`bg-gradient-to-r ${colorScheme.gradient} text-white relative overflow-hidden transition-all duration-1000`}>
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className={`absolute inset-0 bg-gradient-to-r ${colorScheme.shimmer} animate-shimmer`}
          style={{ 
            backgroundSize: '200% 100%',
            animation: 'shimmer 2s infinite'
          }} 
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-2.5 relative z-10">
        <div className="flex items-center justify-center gap-3">
          {/* Flash Icon */}
          <div className="flex items-center gap-2 animate-pulse">
            <Zap className="w-5 h-5 fill-current" />
            <span className="font-bold text-sm sm:text-base">FLASH SALE</span>
          </div>

          {/* Countdown - Desktop */}
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <span>Berakhir dalam:</span>
            <div className="flex items-center gap-1">
              <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded font-bold min-w-[32px] text-center">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <span>:</span>
              <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded font-bold min-w-[32px] text-center">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <span>:</span>
              <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded font-bold min-w-[32px] text-center">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
            </div>
          </div>

          {/* CTA */}
          <Link 
            href="/flash-sale" 
            className={`${colorScheme.buttonBg} ${colorScheme.buttonText} px-4 py-1.5 rounded-full font-bold text-xs sm:text-sm hover:opacity-90 transition-all shadow-lg`}
          >
            BELANJA SEKARANG →
          </Link>

          {/* Close Button */}
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-white/20 rounded-full transition-colors absolute right-4"
            aria-label="Close banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Countdown */}
        <div className="sm:hidden flex items-center justify-center gap-2 text-xs mt-1">
          <span>Berakhir:</span>
          <div className="flex items-center gap-1">
            <div className="bg-white/20 px-1.5 py-0.5 rounded font-bold">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <span>:</span>
            <div className="bg-white/20 px-1.5 py-0.5 rounded font-bold">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <span>:</span>
            <div className="bg-white/20 px-1.5 py-0.5 rounded font-bold">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};