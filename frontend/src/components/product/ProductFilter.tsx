'use client';

import { useState, useEffect } from 'react';
import type { Category, Brand, ProductFilters } from '@/types';
import { Input } from '../ui/Input';
import { productService } from '@/lib/services/product.service';

interface ProductFilterProps {
  onFilterChange: (filters: ProductFilters) => void;
}

export const ProductFilter = ({ onFilterChange }: ProductFilterProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filters, setFilters] = useState<ProductFilters>({});

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

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

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
              onChange={() => handleFilterChange('category_slug', undefined)}
              className="w-4 h-4"
            />
            <span className="text-sm">All Categories</span>
          </label>
          {categories.map((category) => (
            <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                onChange={() => handleFilterChange('category_slug', category.slug)}
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
              onChange={() => handleFilterChange('brand_id', undefined)}
              className="w-4 h-4"
            />
            <span className="text-sm">All Brands</span>
          </label>
          {brands.map((brand) => (
            <label key={brand.id} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="brand"
                onChange={() => handleFilterChange('brand_id', brand.id)}
                className="w-4 h-4"
              />
              <span className="text-sm">{brand.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="space-y-2">
          <Input
            type="number"
            placeholder="Min price"
            className="text-black" 
            onChange={(e) => handleFilterChange('min_price', e.target.value ? parseFloat(e.target.value) : undefined)}
          />
          <Input
            type="number"
            placeholder="Max price"
            className="text-black" 
            onChange={(e) => handleFilterChange('max_price', e.target.value ? parseFloat(e.target.value) : undefined)}
          />
        </div>
      </div>
    </div>
  );
};