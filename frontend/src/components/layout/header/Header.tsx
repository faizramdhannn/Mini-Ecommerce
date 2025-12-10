'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, User, Menu, X, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth.store';
import { useCartStore } from '@/lib/store/cart.store';
import { useEffect, useState } from 'react';
import { productService } from '@/lib/services/product.service';
import type { Category } from '@/types';

export const Header = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { itemCount, openCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCategories, setShowCategories] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await productService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchBar(false);
      setSearchQuery('');
    }
  };

  const toggleSearchBar = () => {
    setShowSearchBar(!showSearchBar);
    if (!showSearchBar) {
      setTimeout(() => {
        document.getElementById('search-input')?.focus();
      }, 100);
    }
  };

  if (!mounted) return null;

  const getCategorySlug = (category: Category) => {
    return category.slug || category.name.toLowerCase().replace(/\s+/g, '-');
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-black shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="text-xl sm:text-2xl font-bold text-white hover:text-gray-300 transition-colors flex-shrink-0">
              MAGADIR
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {/* Categories Dropdown */}
              <div 
                className="relative group"
                onMouseEnter={() => setShowCategories(true)}
                onMouseLeave={() => setShowCategories(false)}
              >
                <button className="flex items-center gap-1 px-3 lg:px-4 py-2 text-sm lg:text-base font-medium text-white hover:text-gray-300 transition-colors">
                  Categories
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {showCategories && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    <Link
                      href="/collections/all-product"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setShowCategories(false)}
                    >
                      All Categories
                    </Link>
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/collections/${getCategorySlug(category)}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowCategories(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Service Dropdown */}
              <div 
                className="relative group"
                onMouseEnter={() => setShowServices(true)}
                onMouseLeave={() => setShowServices(false)}
              >
                <button className="flex items-center gap-1 px-3 lg:px-4 py-2 text-sm lg:text-base font-medium text-white hover:text-gray-300 transition-colors">
                  Service
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {showServices && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg py-2 z-50">
                    <Link
                      href="/service/warranty"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setShowServices(false)}
                    >
                      Warranty Information
                    </Link>
                    <Link
                      href="/service/tracking"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setShowServices(false)}
                    >
                      Track Shipment
                    </Link>
                    <Link
                      href="/service/support"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setShowServices(false)}
                    >
                      Customer Support
                    </Link>
                  </div>
                )}
              </div>

              {/* Corporate Order */}
              <Link
                href="/corporate"
                className="px-3 lg:px-4 py-2 text-sm lg:text-base font-medium text-white hover:text-gray-300 transition-colors"
              >
                Corporate Order
              </Link>

              {/* Products */}
              <Link
                href="/collections/all-product"
                className="px-3 lg:px-4 py-2 text-sm lg:text-base font-medium text-white hover:text-gray-300 transition-colors"
              >
                All Products
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Search Button - Desktop */}
              <button 
                onClick={toggleSearchBar}
                className="hidden sm:block p-2 text-white hover:text-gray-300 rounded-full transition-colors"
                aria-label="Search products"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative p-2 text-white hover:text-gray-300 rounded-full transition-colors"
                aria-label="Shopping cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-medium">
                    {itemCount()}
                  </span>
                )}
              </button>

              {/* User */}
              {isAuthenticated ? (
                <Link
                  href="/account"
                  className="hidden sm:block p-2 text-white hover:text-gray-300 rounded-full transition-colors"
                  aria-label="My account"
                >
                  <User className="w-5 h-5" />
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:block px-4 py-2 bg-white text-black text-sm font-medium rounded-full hover:bg-gray-100 transition-colors"
                >
                  Login
                </Link>
              )}

              {/* Mobile menu button */}
              <button 
                className="md:hidden p-2 text-white hover:text-gray-300 rounded-full transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar - Desktop (Dropdown) */}
        {showSearchBar && (
          <div className="hidden sm:block bg-white border-t border-gray-200 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  id="search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full px-4 py-3 pr-12 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-black transition-colors"
                  aria-label="Submit search"
                >
                  <Search className="w-5 h-5" />
                </button>
              </form>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs text-gray-500">Press Enter to search</p>
                <button
                  onClick={() => setShowSearchBar(false)}
                  className="text-xs text-gray-500 hover:text-gray-700 underline"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          <div className="fixed top-16 left-0 right-0 bg-white z-50 md:hidden shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto">
            <nav className="px-4 py-4 space-y-2">
              {/* Search - Mobile */}
              <div className="pb-4 border-b">
                <form onSubmit={(e) => {
                  handleSearchSubmit(e);
                  setMobileMenuOpen(false);
                }} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full px-4 py-3 pr-12 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-black transition-colors"
                    aria-label="Submit search"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </form>
              </div>

              {/* Categories */}
              <div className="border-b pb-2">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Categories</p>
                <Link
                  href="/collections/all-product"
                  className="block py-2 text-base text-gray-700 hover:text-gray-900 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  All Categories
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/collections/${getCategorySlug(category)}`}
                    className="block py-2 text-base text-gray-700 hover:text-gray-900 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>

              {/* Service */}
              <div className="border-b pb-2">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Service</p>
                <Link
                  href="/service/warranty"
                  className="block py-2 text-base text-gray-700 hover:text-gray-900 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Warranty Information
                </Link>
                <Link
                  href="/service/tracking"
                  className="block py-2 text-base text-gray-700 hover:text-gray-900 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Track Shipment
                </Link>
                <Link
                  href="/service/support"
                  className="block py-2 text-base text-gray-700 hover:text-gray-900 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Customer Support
                </Link>
              </div>

              {/* Main Links */}
              <Link
                href="/corporate"
                className="block py-2 text-base font-medium text-gray-900 hover:text-gray-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Corporate Order
              </Link>
              <Link
                href="/collections/all-product"
                className="block py-2 text-base font-medium text-gray-900 hover:text-gray-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                All Products
              </Link>

              {/* User Section */}
              <div className="border-t pt-4 space-y-2">
                {isAuthenticated ? (
                  <Link
                    href="/account"
                    className="flex items-center gap-2 py-2 text-base font-medium text-gray-900 hover:text-gray-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    Profile
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="block w-full px-4 py-2 bg-black text-white text-center text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </>
      )}

      {/* Backdrop for search bar */}
      {showSearchBar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={() => setShowSearchBar(false)}
        />
      )}
    </>
  );
};