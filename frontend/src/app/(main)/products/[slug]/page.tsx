'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Minus, Plus, ShoppingCart, Zap, Share2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { productService } from '@/lib/services/product.service';
import { useCartStore } from '@/lib/store/cart.store';
import { useAuthStore } from '@/lib/store/auth.store';
import { formatCurrency } from '@/lib/utils/format';
import type { Product } from '@/types';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    loadProduct();
  }, [params.slug]);

  const loadProduct = async () => {
    try {
      const slug = params.slug as string;
      const data = await productService.getProductBySlug(slug);
      setProduct(data);
    } catch (error) {
      console.error('Failed to load product:', error);
      toast.error('Product not found');
      router.push('/collections/all-product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      router.push('/login');
      return;
    }

    if (!product) return;

    try {
      await addItem(product.id, quantity);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!product) return null;

  const images = product.media?.map(m => m.url) || ['/images/placeholder.png'];
  
  // Calculate discount percentage
  const discountPercentage = product.compare_at_price && Number(product.compare_at_price) > product.price
    ? Math.round(((Number(product.compare_at_price) - product.price) / Number(product.compare_at_price)) * 100)
    : 0;

  // Calculate sold count
  const soldPercentage = Math.floor(Math.random() * 40) + 30;
  const soldCount = Math.floor(product.stock * soldPercentage / 100);

  const isFlashSale = discountPercentage >= 30;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Images */}
        <div>
          {/* Main Image */}
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 relative">
            <Image
              src={images[selectedImage]}
              alt={product.name}
              width={600}
              height={600}
              className="w-full h-full object-cover"
              priority
            />
            
            {/* Flash Sale Badge */}
            {isFlashSale && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-orange-600 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 text-sm font-bold shadow-lg z-10">
                <Zap className="w-4 h-4 fill-current" />
                FLASH SALE
              </div>
            )}
            
            {/* Discount Badge */}
            {discountPercentage > 0 && (
              <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg z-10">
                -{discountPercentage}%
              </div>
            )}
            
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white text-lg font-semibold">Out of Stock</span>
              </div>
            )}
          </div>
          
          {/* Thumbnail Images */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index ? 'border-black' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Description Section - Moved Below Images */}
          {product.description && (
            <div className="mt-8 bg-white rounded-lg border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Product Description</h2>
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                {product.description}
              </div>
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div>
          {/* Category & Brand Badges */}
          <div className="mb-4 flex items-center gap-2 flex-wrap">
            {product.category && (
              <Badge variant="default">{product.category.name}</Badge>
            )}
            {product.brand && (
              <Badge variant="default">{product.brand.name}</Badge>
            )}
          </div>

          {/* Product Name */}
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">{product.name}</h1>

          {/* Sold Count */}
          {soldCount > 0 && (
            <p className="text-sm text-gray-600 mb-4">
              🔥 <span className="font-semibold">Terjual {soldCount}+</span>
            </p>
          )}

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-lg ${i < Math.floor(product.rating!) ? 'text-yellow-400' : 'text-gray-300'}`}>
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm text-gray-600">({product.rating}/5.0)</span>
            </div>
          )}

          {/* Price Section */}
          <div className="mb-6 bg-gray-50 rounded-lg p-4">
            {product.compare_at_price && Number(product.compare_at_price) > product.price && (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg sm:text-xl text-gray-400 line-through">
                    {formatCurrency(Number(product.compare_at_price))}
                  </span>
                  <Badge variant="danger" className="text-xs sm:text-sm font-bold">
                    HEMAT {discountPercentage}%
                  </Badge>
                </div>
                <div className={`text-3xl sm:text-4xl font-bold ${isFlashSale ? 'text-red-600' : 'text-gray-900'}`}>
                  {formatCurrency(product.price)}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  💰 Anda hemat {formatCurrency(Number(product.compare_at_price) - product.price)}
                </p>
              </>
            )}
            
            {(!product.compare_at_price || Number(product.compare_at_price) <= product.price) && (
              <div className="text-3xl sm:text-4xl font-bold text-gray-900">
                {formatCurrency(product.price)}
              </div>
            )}
          </div>

          {/* Stock Status */}
          <div className="mb-6 flex items-center gap-2">
            <span className="text-sm font-medium">Availability:</span>
            <span className={`text-sm font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">Quantity</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-lg hover:bg-gray-100 hover:border-gray-400 transition-all disabled:opacity-50"
                disabled={quantity <= 1}
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="text-xl font-semibold w-16 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-lg hover:bg-gray-100 hover:border-gray-400 transition-all disabled:opacity-50"
                disabled={quantity >= product.stock || product.stock === 0}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 mb-6">
            <Button
              size="lg"
              fullWidth
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`text-base sm:text-lg py-4 ${
                isFlashSale ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700' : ''
              }`}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" fullWidth>
                <Heart className="w-5 h-5 mr-2" />
                Wishlist
              </Button>
              <Button variant="outline" fullWidth>
                <Share2 className="w-5 h-5 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="border-t pt-6 space-y-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <span>✓</span>
              <span>Free shipping for orders over Rp 500.000</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <span>✓</span>
              <span>30-day return policy</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <span>✓</span>
              <span>Secure payment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}