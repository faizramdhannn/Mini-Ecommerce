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

  // Countdown timer
  useEffect(() => {
    // Set flash sale end time (contoh: 24 jam dari sekarang)
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
    <div className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 text-white relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer" 
             style={{ 
               backgroundSize: '200% 100%',
               animation: 'shimmer 2s infinite'
             }} 
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-2.5 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {/* Flash Icon */}
            <div className="flex items-center gap-2 animate-pulse">
              <Zap className="w-5 h-5 fill-current" />
              <span className="font-bold text-sm sm:text-base">FLASH SALE</span>
            </div>

            {/* Countdown */}
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
              className="ml-auto sm:ml-4 bg-white text-red-600 px-4 py-1.5 rounded-full font-bold text-xs sm:text-sm hover:bg-gray-100 transition-colors shadow-lg"
            >
              BELANJA SEKARANG →
            </Link>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setIsVisible(false)}
            className="ml-3 p-1 hover:bg-white/20 rounded-full transition-colors"
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