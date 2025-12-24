'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Search,
  ChevronDown,
  LogOut,
  Package,
  Heart,
  Settings
} from 'lucide-react';
import { FlashSaleBanner } from './FlashSaleBanner';

// ⭐ Import contexts - Comment out if they don't exist yet
// import { useAuth } from '@/contexts/AuthContext';
// import { useCart } from '@/contexts/CartContext';

// ⭐ Temporary mock hooks - Remove when actual contexts are available
const useAuth = () => {
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);
  
  useEffect(() => {
    // Check localStorage for user
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    }
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return { user, logout };
};

const useCart = () => {
  const [items, setItems] = useState<any[]>([]);
  
  useEffect(() => {
    // Check localStorage for cart
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        setItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  }, []);

  return { items };
};

// ⭐ Categories dengan slug yang sesuai database
const CATEGORIES = [
  { slug: 'accessories', name: 'Accessories' },
  { slug: 'cross-body-bag', name: 'Cross Body Bag' },
  { slug: 'laptop-sleeve', name: 'Laptop Sleeve' },
  { slug: 'messenger-bag', name: 'Messenger Bag' },
  { slug: 'sling-bag', name: 'Sling Bag' },
  { slug: 'wallet', name: 'Wallet' },
  { slug: 'backpack', name: 'Backpack' },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { items } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    router.push('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  // ⭐ Handle category click - navigate to collections with category filter
  const handleCategoryClick = (categorySlug: string) => {
    router.push(`/collections/all-product?category=${categorySlug}`);
    setShowCategoryMenu(false);
    setIsMenuOpen(false);
  };

  const cartItemsCount = items.reduce((total: number, item: any) => total + item.quantity, 0);

  return (
    <>
      <FlashSaleBanner />
      
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-md' : 'bg-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-2xl sm:text-3xl font-bold text-black">MAGADIR</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link
                href="/"
                className={`text-gray-700 hover:text-black transition-colors ${
                  pathname === '/' ? 'font-semibold text-black' : ''
                }`}
              >
                Home
              </Link>

              {/* ⭐ Categories Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                  className="flex items-center gap-1 text-gray-700 hover:text-black transition-colors"
                >
                  Categories
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {showCategoryMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowCategoryMenu(false)}
                    />
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-20">
                      <Link
                        href="/collections/all-product"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowCategoryMenu(false)}
                      >
                        All Products
                      </Link>
                      <div className="border-t border-gray-100 my-2" />
                      {CATEGORIES.map((category) => (
                        <button
                          key={category.slug}
                          onClick={() => handleCategoryClick(category.slug)}
                          className="w-full text-left block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <Link
                href="/flash-sale"
                className={`text-gray-700 hover:text-black transition-colors ${
                  pathname === '/flash-sale' ? 'font-semibold text-black' : ''
                }`}
              >
                Flash Sale
              </Link>
              
              <Link
                href="/custom-order"
                className={`text-gray-700 hover:text-black transition-colors ${
                  pathname === '/custom-order' ? 'font-semibold text-black' : ''
                }`}
              >
                Custom Order
              </Link>
            </nav>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari produk..."
                  className="w-full px-4 py-2 pl-10 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-black"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </form>

            {/* Right Icons */}
            <div className="flex items-center gap-4">
              {/* Cart */}
              <Link href="/cart" className="relative">
                <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-black transition-colors" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemsCount > 9 ? '9+' : cartItemsCount}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2"
                  >
                    <User className="w-6 h-6 text-gray-700 hover:text-black transition-colors" />
                  </button>

                  {showUserMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowUserMenu(false)}
                      />
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-20">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="font-semibold text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        
                        <Link
                          href="/account/profile"
                          className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings className="w-4 h-4" />
                          Profile Settings
                        </Link>
                        
                        <Link
                          href="/account/orders"
                          className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Package className="w-4 h-4" />
                          My Orders
                        </Link>
                        
                        <Link
                          href="/account/wishlist"
                          className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Heart className="w-4 h-4" />
                          Wishlist
                        </Link>
                        
                        <div className="border-t border-gray-100 my-2" />
                        
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:block px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                >
                  Login
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="md:hidden pb-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari produk..."
                className="w-full px-4 py-2 pl-10 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-black"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </form>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white">
            <nav className="px-4 py-4 space-y-2">
              <Link
                href="/"
                className="block py-2 text-gray-700 hover:text-black"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              {/* ⭐ Mobile Categories */}
              <div className="py-2">
                <div className="font-semibold text-gray-900 mb-2">Categories</div>
                <div className="pl-4 space-y-2">
                  <Link
                    href="/collections/all-product"
                    className="block py-1 text-gray-700 hover:text-black"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    All Products
                  </Link>
                  {CATEGORIES.map((category) => (
                    <button
                      key={category.slug}
                      onClick={() => handleCategoryClick(category.slug)}
                      className="block w-full text-left py-1 text-gray-700 hover:text-black"
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              <Link
                href="/flash-sale"
                className="block py-2 text-gray-700 hover:text-black"
                onClick={() => setIsMenuOpen(false)}
              >
                Flash Sale
              </Link>
              
              <Link
                href="/custom-order"
                className="block py-2 text-gray-700 hover:text-black"
                onClick={() => setIsMenuOpen(false)}
              >
                Custom Order
              </Link>

              {!user && (
                <Link
                  href="/login"
                  className="block py-2 text-gray-700 hover:text-black"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}