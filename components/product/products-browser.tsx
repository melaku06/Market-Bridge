'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight, Grid2x2, List, SlidersHorizontal, X, Package } from 'lucide-react';
import ProductCardInteractive from '@/components/product/product-card-interactive';
import type { ProductCardData } from '@/components/product/product-card-server';
import { formatPrice, toNumber } from '@/lib/price';
import { useSearchFilterStore } from '@/stores/search/search-filter-store';

type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'popular';

const sortOptionMap: Record<SortOption, string> = {
  newest: 'Newest',
  price_asc: 'Price: Low to High',
  price_desc: 'Price: High to Low',
  rating: 'Top Rated',
  popular: 'Most Popular',
};

const sortOptionReverseMap: Record<string, SortOption> = {
  'Newest': 'newest',
  'Price: Low to High': 'price_asc',
  'Price: High to Low': 'price_desc',
  'Top Rated': 'rating',
  'Most Popular': 'popular',
};

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductsBrowserProps {
  products: ProductCardData[];
  categories: Category[];
  initialCategoryId?: string;
}

const sortOptions = ['Newest', 'Price: Low to High', 'Price: High to Low', 'Most Popular', 'Top Rated'] as const;

const brandOptions = ['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony', 'LG', 'Philips', 'Generic'] as const;

const subCategories = ['Smartphones', 'Laptops', 'Tablets', 'Headphones', 'Cameras', 'Smartwatches', 'Accessories'] as const;

export default function ProductsBrowser({ products, categories, initialCategoryId }: ProductsBrowserProps) {
  const selectedCategory = useSearchFilterStore((s) => s.selectedCategory);
  const setSelectedCategory = useSearchFilterStore((s) => s.setSelectedCategory);
  const selectedSubCategory = useSearchFilterStore((s) => s.selectedSubCategory);
  const setSelectedSubCategory = useSearchFilterStore((s) => s.setSelectedSubCategory);
  const selectedBrands = useSearchFilterStore((s) => s.selectedBrands);
  const toggleBrand = useSearchFilterStore((s) => s.toggleBrand);
  const sortBy = useSearchFilterStore((s) => s.sortBy);
  const setSortBy = useSearchFilterStore((s) => s.setSortBy);
  const priceRange = useSearchFilterStore((s) => s.priceRange);
  const setPriceRange = useSearchFilterStore((s) => s.setPriceRange);
  const viewMode = useSearchFilterStore((s) => s.viewMode);
  const setViewMode = useSearchFilterStore((s) => s.setViewMode);
  const selectedRating = useSearchFilterStore((s) => s.selectedRating);
  const setSelectedRating = useSearchFilterStore((s) => s.setSelectedRating);
  const resetFilters = useSearchFilterStore((s) => s.resetFilters);

  const [filterOpen, setFilterOpen] = useState(false);

  // Initialize category from prop on first render if store is at default
  useState(() => {
    if (initialCategoryId && !selectedCategory) {
      setSelectedCategory(initialCategoryId);
    }
  });

  // Map store state to component-local conventions
  const categoryValue = selectedCategory ?? 'all';
  const ratingValue = selectedRating ?? 0;
  const priceMax = priceRange.max;
  const gridView = viewMode === 'grid';
  const sortByLabel = sortOptionMap[sortBy] ?? 'Newest';

  const allCategories = [{ id: 'all', name: 'All Categories', slug: '' }, ...categories];

  const getBrandCount = (brand: string) => {
    return products.filter((p) => p.brand?.toLowerCase().includes(brand.toLowerCase())).length;
  };

  const filtered = useMemo(() => {
    let list = [...products];

    if (categoryValue !== 'all') {
      list = list.filter((p) => p.category?.id === categoryValue || p.warehouse?.name === categoryValue);
    }

    if (selectedBrands.length > 0) {
      list = list.filter((p) => selectedBrands.some((brand) => p.brand?.toLowerCase().includes(brand.toLowerCase())));
    }

    list = list.filter((p) => {
      const finalPrice = toNumber(p.base_price) * (1 + (toNumber(p.margin_percent) || 15) / 100);
      return finalPrice <= priceMax;
    });

    if (ratingValue > 0) {
      list = list.filter((p) => {
        return toNumber(p.rating) >= ratingValue;
      });
    }

    const getFinalPrice = (p: ProductCardData) => {
      return toNumber(p.base_price) * (1 + (toNumber(p.margin_percent) || 15) / 100);
    };

    if (sortBy === 'price_asc') list.sort((a, b) => getFinalPrice(a) - getFinalPrice(b));
    else if (sortBy === 'price_desc') list.sort((a, b) => getFinalPrice(b) - getFinalPrice(a));
    else if (sortBy === 'rating') list.sort((a, b) => toNumber(b.rating) - toNumber(a.rating));
    else if (sortBy === 'popular') list.sort((a, b) => (b.review_count || 0) - (a.review_count || 0));

    return list;
  }, [products, categoryValue, selectedBrands, sortBy, priceMax, ratingValue]);

  const FilterPanel = () => (
    <div className="space-y-5">
      <div>
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Categories</h3>
        <div className="space-y-1">
          {allCategories.slice(0, 8).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id === 'all' ? null : cat.id)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                categoryValue === cat.id ? 'bg-blue-600 text-white font-medium' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
      <div className="border-t border-gray-100 pt-4">
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Sub Categories</h3>
        <div className="flex flex-wrap gap-2">
          {subCategories.map((subCat) => (
            <button
              key={subCat}
              onClick={() => setSelectedSubCategory(selectedSubCategory === subCat ? null : subCat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedSubCategory === subCat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              {subCat}
            </button>
          ))}
        </div>
      </div>
      <div className="border-t border-gray-100 pt-4">
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Brands</h3>
        <div className="space-y-2">
          {brandOptions.map((brand) => {
            const count = getBrandCount(brand);
            return (
              <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className={`text-sm transition-colors flex-1 ${selectedBrands.includes(brand) ? 'text-blue-700 font-medium' : 'text-gray-600 group-hover:text-gray-800'}`}>
                  {brand}
                </span>
                <span className={`text-xs ${selectedBrands.includes(brand) ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
                  ({count})
                </span>
              </label>
            );
          })}
        </div>
      </div>
      <div className="border-t border-gray-100 pt-4">
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Price Range</h3>
        <div className="space-y-3">
          <input
            type="range"
            min={0}
            max={10000}
            value={priceMax}
            onChange={(e) => setPriceRange({ min: 0, max: Number(e.target.value) })}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>Br 0</span>
            <span>Br {priceMax}+</span>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 pt-4">
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Rating</h3>
        <div className="space-y-1">
          {[5, 4, 3, 2].map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRating(ratingValue === r ? null : r)}
              className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-sm transition-colors ${
                ratingValue === r ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-base ${i < r ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                ))}
              </span>
              <span className="text-xs text-gray-500">& up</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex gap-6">
      <aside className="hidden lg:block w-56 flex-shrink-0">
        <div className="bg-white rounded-xl border border-gray-100 p-4 sticky top-20">
          <h2 className="font-bold text-gray-900 mb-4">Filters</h2>
          <FilterPanel />
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg font-bold text-gray-900">All Products</h1>
            <p className="text-sm text-gray-500">{filtered.length} products found</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select
                value={sortByLabel}
                onChange={(e) => setSortBy(sortOptionReverseMap[e.target.value] ?? 'newest')}
                className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:border-blue-500 focus:outline-none"
              >
                {sortOptions.map((opt) => <option key={opt}>{opt}</option>)}
              </select>
            </div>
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 ${gridView ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-50'}`}
              >
                <Grid2x2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 ${!gridView ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-50'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className={`grid gap-4 ${gridView ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
            {filtered.map((product) => (
              <ProductCardInteractive key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your filters.</p>
            <button
              onClick={() => resetFilters()}
              className="text-blue-600 hover:underline font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {filterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setFilterOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Filters</h2>
              <button onClick={() => setFilterOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <FilterPanel />
          </div>
        </div>
      )}
    </div>
  );
}
