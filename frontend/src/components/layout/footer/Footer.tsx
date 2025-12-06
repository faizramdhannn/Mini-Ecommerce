import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-black text-white mt-12 sm:mt-16 md:mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">MAGADIR</h3>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              Your Palugada Store, We Can Help Anything You Want.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Shop</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
              <li><Link href="/products" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/products?category=new" className="hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link href="/products?category=sale" className="hover:text-white transition-colors">Sale</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Help</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
              <li><Link href="/orders" className="hover:text-white transition-colors">Order Status</Link></li>
              <li><Link href="/profile" className="hover:text-white transition-colors">My Account</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Follow Us</h4>
            <div className="flex space-x-3 sm:space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-gray-400">
          <p>&copy; 2025 Magadir. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};