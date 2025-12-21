'use client';

import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/lib/store/auth.store';
import { getWhatsAppLink } from '@/lib/utils/whatsapp';

export const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthStore();

  const handleClick = () => {
    const nickname = user?.nickname || 'Customer';
    const link = getWhatsAppLink(nickname);
    window.open(link, '_blank');
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleClick}
          className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 flex items-center gap-2 group"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
            Chat with us
          </span>
        </button>
      </div>
    </>
  );
};