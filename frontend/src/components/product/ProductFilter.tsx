'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Category, Brand, ProductFilters } from '@/types';
import { Input } from '../ui/Input';
import { productService } from '@/lib/services/product.service';
import { formatCurrency } from '@/lib/utils/format';

interface ProductFilterProps {
  onFilterChange: (filters: ProductFilters) => void;
}

export const ProductFilter = ({ onFilterChange }: ProductFilterProps) => {
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<number | undefined>();
  
  // Single price range with min and max
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000000);

  // ⭐ Read initial category from URL params
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    loadFilters();
  }, []);

  const loadFilters = async () => {
    try {
      const [categoriesData, brandsData] = await Promise.all([
        productService.getCategories(),
        productService.getBrands(),
      ]);
      setCategories(categoriesData);
      setBrands(brandsData);
    } catch (error) {
      console.error('Failed to load filters:', error);
    }
  };

  const handleCategoryChange = (categorySlug: string | undefined) => {
    setSelectedCategory(categorySlug || '');
    const newFilters: ProductFilters = {
      category_slug: categorySlug,
      brand_id: selectedBrand,
      min_price: minPrice,
      max_price: maxPrice,
    };
    onFilterChange(newFilters);
  };

  const handleBrandChange = (brandId: number | undefined) => {
    setSelectedBrand(brandId);
    const newFilters: ProductFilters = {
      category_slug: selectedCategory || undefined,
      brand_id: brandId,
      min_price: minPrice,
      max_price: maxPrice,
    };
    onFilterChange(newFilters);
  };

  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
    const value = parseInt(e.target.value);
    
    if (type === 'min') {
      const newMin = Math.min(value, maxPrice - 50000);
      setMinPrice(newMin);
      const newFilters: ProductFilters = {
        category_slug: selectedCategory || undefined,
        brand_id: selectedBrand,
        min_price: newMin,
        max_price: maxPrice,
      };
      onFilterChange(newFilters);
    } else {
      const newMax = Math.max(value, minPrice + 50000);
      setMaxPrice(newMax);
      const newFilters: ProductFilters = {
        category_slug: selectedCategory || undefined,
        brand_id: selectedBrand,
        min_price: minPrice,
        max_price: newMax,
      };
      onFilterChange(newFilters);
    }
  };

  // Calculate percentage for visual representation
  const minPercent = (minPrice / 5000000) * 100;
  const maxPercent = (maxPrice / 5000000) * 100;

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={!selectedCategory}
              onChange={() => handleCategoryChange(undefined)}
              className="w-4 h-4"
            />
            <span className="text-sm">All Categories</span>
          </label>
          {categories.map((category) => (
            <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === category.slug}
                onChange={() => handleCategoryChange(category.slug)}
                className="w-4 h-4"
              />
              <span className="text-sm">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="font-semibold mb-3">Brands</h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="brand"
              checked={!selectedBrand}
              onChange={() => handleBrandChange(undefined)}
              className="w-4 h-4"
            />
            <span className="text-sm">All Brands</span>
          </label>
          {brands.map((brand) => (
            <label key={brand.id} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="brand"
                checked={selectedBrand === brand.id}
                onChange={() => handleBrandChange(brand.id)}
                className="w-4 h-4"
              />
              <span className="text-sm">{brand.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range - Single Component */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="space-y-4">
          {/* Range Display */}
          <div className="bg-gray-100 rounded-lg p-3 text-center">
            <p className="text-sm font-medium text-gray-700">
              {formatCurrency(minPrice)} - {formatCurrency(maxPrice)}
            </p>
          </div>

          {/* Visual Range Slider Container */}
          <div className="relative pt-2 pb-6">
            {/* Track Background */}
            <div className="absolute w-full h-2 bg-gray-600 rounded-lg top-2"></div>
            
            {/* Active Range */}
            <div 
              className="absolute h-2 bg-white rounded-lg top-2"
              style={{
                left: `${minPercent}%`,
                width: `${maxPercent - minPercent}%`
              }}
            ></div>

            {/* Min Slider */}
            <input
              type="range"
              min="0"
              max="5000000"
              step="50000"
              value={minPrice}
              onChange={(e) => handlePriceRangeChange(e, 'min')}
              className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none top-2 z-20"
              style={{
                WebkitAppearance: 'none',
              }}
            />

            {/* Labels */}
            <div className="flex justify-between text-xs text-gray-500 mt-8">
              <span>{formatCurrency(0)}</span>
              <span>{formatCurrency(5000000)}</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #000;
          cursor: pointer;
          border: 3px solid #fff;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          pointer-events: all;
          position: relative;
          z-index: 30;
        }

        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #000;
          cursor: pointer;
          border: 3px solid #fff;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          pointer-events: all;
        }

        input[type="range"]::-webkit-slider-thumb:hover {
          background: #333;
          transform: scale(1.1);
        }

        input[type="range"]::-moz-range-thumb:hover {
          background: #333;
          transform: scale(1.1);
        }

        input[type="range"]::-webkit-slider-thumb:active {
          background: #000;
          transform: scale(1.2);
        }

        input[type="range"]::-moz-range-thumb:active {
          background: #000;
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
};