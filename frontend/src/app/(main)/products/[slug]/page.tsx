"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  Heart,
  Share2,
  Star,
  Minus,
  Plus,
  ShoppingCart,
  Check,
} from "lucide-react";
import { productService } from "@/lib/services/product.service";
import { cartService } from "@/lib/services/cart.service";
import type { Product } from "@/types";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

// ⭐ FIX 3: Color extraction from product name
const extractColorsFromName = (productName: string): string[] => {
  const colors = productName.split(" - ").slice(1);
  return colors.filter(Boolean);
};

// ⭐ FIX 3: Get product name without color suffix
const getProductNameWithoutColor = (productName: string): string => {
  return productName.split(" - ")[0];
};

// ⭐ FIX 3: Color styles mapping
const COLOR_STYLES: Record<
  string,
  { bg: string; border: string; ring: string }
> = {
  black: { bg: "bg-black", border: "border-gray-700", ring: "ring-black" },
  white: { bg: "bg-white", border: "border-gray-300", ring: "ring-gray-400" },
  red: { bg: "bg-red-600", border: "border-red-700", ring: "ring-red-600" },
  blue: { bg: "bg-blue-600", border: "border-blue-700", ring: "ring-blue-600" },
  green: {
    bg: "bg-green-600",
    border: "border-green-700",
    ring: "ring-green-600",
  },
  yellow: {
    bg: "bg-yellow-400",
    border: "border-yellow-500",
    ring: "ring-yellow-400",
  },
  pink: { bg: "bg-pink-500", border: "border-pink-600", ring: "ring-pink-500" },
  purple: {
    bg: "bg-purple-600",
    border: "border-purple-700",
    ring: "ring-purple-600",
  },
  grey: { bg: "bg-gray-500", border: "border-gray-600", ring: "ring-gray-500" },
  gray: { bg: "bg-gray-500", border: "border-gray-600", ring: "ring-gray-500" },
  brown: {
    bg: "bg-amber-700",
    border: "border-amber-800",
    ring: "ring-amber-700",
  },
  navy: { bg: "bg-blue-900", border: "border-blue-950", ring: "ring-blue-900" },
  orange: {
    bg: "bg-orange-500",
    border: "border-orange-600",
    ring: "ring-orange-500",
  },
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // ⭐ FIX 3: Color selection state
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>("");

  useEffect(() => {
    loadProduct();
  }, [slug]);

  // ⭐ FIX 3: Extract colors when product loads
  useEffect(() => {
    if (product) {
      const colors = extractColorsFromName(product.name);
      setAvailableColors(colors);

      // Auto-select first color if available
      if (colors.length > 0 && !selectedColor) {
        setSelectedColor(colors[0]);
      }
    }
  }, [product]);

  const loadProduct = async () => {
    try {
      setIsLoading(true);
      const data = await productService.getProductBySlug(slug);
      setProduct(data);
    } catch (error) {
      console.error("Failed to load product:", error);
      alert("Produk tidak ditemukan");
      router.push("/collections/all-product");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    // ⭐ FIX 3: Validate color selection
    if (availableColors.length > 0 && !selectedColor) {
      alert("Silakan pilih warna terlebih dahulu");
      return;
    }

    try {
      setIsAddingToCart(true);
      // ⭐ FIXED: Correct addToCart call
      await cartService.addToCart(product.id, quantity);

      // ⭐ FIX 3: Include color in success message
      const colorText = selectedColor ? ` - ${selectedColor}` : "";
      const confirmView = window.confirm(
        `${product.name}${colorText} berhasil ditambahkan ke keranjang. Lihat keranjang?`
      );

      if (confirmView) {
        router.push("/cart");
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Gagal menambahkan ke keranjang");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;

    // ⭐ FIX 3: Validate color selection
    if (availableColors.length > 0 && !selectedColor) {
      alert("Silakan pilih warna terlebih dahulu");
      return;
    }

    try {
      // ⭐ FIXED: Correct addToCart call
      await cartService.addToCart(product.id, quantity);
      router.push("/checkout");
    } catch (error: any) {
      alert(error.response?.data?.message || "Gagal memproses pembelian");
    }
  };

  const calculateDiscount = () => {
    if (
      !product ||
      !product.compare_at_price ||
      product.compare_at_price <= product.price
    ) {
      return 0;
    }
    return Math.round(
      ((product.compare_at_price - product.price) / product.compare_at_price) *
        100
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-200 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded animate-pulse" />
              <div className="h-12 bg-gray-200 rounded animate-pulse w-1/2" />
              <div className="h-20 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const images = product.media?.map((m) => m.url) || [
    "/images/placeholder.png",
  ];
  const discount = calculateDiscount();
  const displayName =
    availableColors.length > 0
      ? getProductNameWithoutColor(product.name)
      : product.name;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-black">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              href="/collections/all-product"
              className="text-gray-600 hover:text-black"
            >
              Products
            </Link>
            {product.category && (
              <>
                <span className="text-gray-400">/</span>
                <Link
                  href={`/collections/${product.category.slug}`}
                  className="text-gray-600 hover:text-black"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <span className="text-gray-400">/</span>
            <span className="text-black font-medium truncate">
              {displayName}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          Kembali
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
                unoptimized
              />
              {discount > 0 && (
                <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  -{discount}%
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden ${
                      selectedImage === idx ? "ring-2 ring-black" : ""
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {product.category && (
              <Link
                href={`/collections/${product.category.slug}`}
                className="text-sm text-gray-600 hover:text-black"
              >
                {product.category.name}
              </Link>
            )}

            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {displayName}
              </h1>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  (4.97) • 29 ulasan
                </span>
              </div>

              <div className="flex items-baseline gap-3">
                <div className="text-3xl md:text-4xl font-bold text-gray-900">
                  {formatCurrency(product.price)}
                </div>
                {product.compare_at_price &&
                  product.compare_at_price > product.price && (
                    <div className="text-xl text-gray-400 line-through">
                      {formatCurrency(product.compare_at_price)}
                    </div>
                  )}
              </div>
            </div>

            {/* ⭐ FIX 3: Color Selector */}
            {availableColors.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-900">
                    Pilih Warna
                  </label>
                  {selectedColor && (
                    <span className="text-sm text-gray-600 capitalize">
                      {selectedColor}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((color) => {
                    const colorKey = color.toLowerCase();
                    const colorStyle =
                      COLOR_STYLES[colorKey] || COLOR_STYLES["black"];
                    const isSelected = selectedColor === color;

                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                          isSelected
                            ? `${colorStyle.ring} ring-4 ring-offset-2`
                            : colorStyle.border
                        }`}
                        title={color}
                      >
                        <div
                          className={`w-full h-full rounded-full ${colorStyle.bg}`}
                        >
                          {isSelected && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Check
                                className={`w-5 h-5 ${
                                  colorKey === "white"
                                    ? "text-black"
                                    : "text-white"
                                }`}
                              />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.stock === 0 ? (
                <>
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-red-600 font-medium">
                    Produk habis
                  </span>
                </>
              ) : product.stock < 10 ? (
                <>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-yellow-600 font-medium">
                    Tersisa {product.stock} stok
                  </span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600 font-medium">
                    Stok tersedia
                  </span>
                </>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                Jumlah
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-10 h-10 flex items-center text-black justify-center border border-black rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    setQuantity(Math.max(1, Math.min(product.stock, val)));
                  }}
                  className="w-16 h-10 text-center text-black border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  min="1"
                  max={product.stock}
                />
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  disabled={quantity >= product.stock}
                  className="w-10 h-10 flex items-center text-black justify-center border border-black rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAddingToCart}
                className="flex-1 bg-white border-2 border-black text-black py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                {isAddingToCart ? "Menambahkan..." : "Tambah ke Keranjang"}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Beli Sekarang
              </button>
            </div>

            {/* Additional Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="flex-1 flex items-center justify-center gap-2 py-2 border border-black rounded-lg hover:bg-gray-50"
              >
                <Heart
                  className={`w-5 text-red-500 h-5 ${
                    isFavorite ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                <span className="text-sm text-black font-medium">Favorit</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2 border border-black rounded-lg hover:bg-gray-50">
                <Share2 className="w-5 text-black h-5" />
                <span className="text-sm text-black font-medium">Bagikan</span>
              </button>
            </div>

            {/* Product Details */}
            <div className="pt-6 border-t space-y-3">
              <h3 className="font-semibold text-gray-900">Detail Produk</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Kategori</span>
                  <span className="text-gray-900 font-medium">
                    {product.category?.name || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Detail Section - Static */}
        <div className="mt-16 bg-white border-t pt-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Left Content */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                    {displayName}
                  </h2>

                  <p className="text-gray-600 text-base leading-relaxed mb-8">
                    Dengan desain yang inovatif dan elegan, mampu memuat banyak
                    barang untuk traveling hingga 1 minggu.
                  </p>
                </div>

                {/* Rating Section */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Apa Kata Sobat Torch
                  </h3>

                  {/* Average Rating */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="w-5 h-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <div className="text-sm">
                      <span className="font-bold text-gray-900">
                        4.97 dari 5
                      </span>
                      <p className="text-gray-600">
                        Berdasarkan dari total 29 ulasan
                      </p>
                    </div>
                  </div>

                  {/* Rating Breakdown */}
                  <div className="space-y-2">
                    {/* 5 Stars */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-24">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="w-3 h-3 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-900 rounded-full"
                          style={{ width: "96.5%" }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8 text-right">
                        28
                      </span>
                    </div>

                    {/* 4 Stars */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-24">
                        {[1, 2, 3, 4].map((star) => (
                          <Star
                            key={star}
                            className="w-3 h-3 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                        <Star className="w-3 h-3 text-gray-300" />
                      </div>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-900 rounded-full"
                          style={{ width: "3.5%" }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8 text-right">
                        1
                      </span>
                    </div>

                    {/* 3 Stars */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-24">
                        {[1, 2, 3].map((star) => (
                          <Star
                            key={star}
                            className="w-3 h-3 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                        {[1, 2].map((star) => (
                          <Star key={star} className="w-3 h-3 text-gray-300" />
                        ))}
                      </div>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-900 rounded-full"
                          style={{ width: "0%" }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8 text-right">
                        0
                      </span>
                    </div>

                    {/* 2 Stars */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-24">
                        {[1, 2].map((star) => (
                          <Star
                            key={star}
                            className="w-3 h-3 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                        {[1, 2, 3].map((star) => (
                          <Star key={star} className="w-3 h-3 text-gray-300" />
                        ))}
                      </div>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-900 rounded-full"
                          style={{ width: "0%" }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8 text-right">
                        0
                      </span>
                    </div>

                    {/* 1 Star */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-24">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {[1, 2, 3, 4].map((star) => (
                          <Star key={star} className="w-3 h-3 text-gray-300" />
                        ))}
                      </div>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-900 rounded-full"
                          style={{ width: "0%" }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8 text-right">
                        0
                      </span>
                    </div>
                  </div>

                  {/* Authenticity Badge */}
                  <div className="flex justify-center items-center gap-10">
                    <div className="flex flex-col items-center pt-6">
                      <div className="w-20 h-20 mb-2">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="#cbd5e0"
                            strokeWidth="2"
                          />
                          <path
                            d="M 30 45 L 45 60 L 70 35"
                            fill="none"
                            stroke="#2563eb"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M 25 20 Q 25 15 30 15 L 40 15 L 50 5 L 60 15 L 70 15 Q 75 15 75 20 L 75 30"
                            fill="none"
                            stroke="#2563eb"
                            strokeWidth="2"
                          />
                          <path
                            d="M 75 70 Q 75 75 70 75 L 60 75 L 50 85 L 40 75 L 30 75 Q 25 75 25 70 L 25 60"
                            fill="none"
                            stroke="#2563eb"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                      <p className="text-xs text-gray-600 font-medium">
                        DIAMOND
                      </p>
                      <p className="text-xs text-gray-600">AUTHENTIC</p>
                      <p className="text-sm font-bold text-gray-900 mt-1">
                        100.0
                      </p>
                    </div>
                    <h2 className="flex items-center text-center text-sm font-medium text-gray-900">
                      Dijamin 100% Asli oleh Magadir
                    </h2>
                  </div>
                </div>
              </div>

              {/* Right Image */}
              <div className="relative aspect-[3/3] bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop"
                  alt={`${displayName} lifestyle`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
