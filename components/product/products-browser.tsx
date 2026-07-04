'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight, Grid2x2, List, SlidersHorizontal, X, Package } from 'lucide-react';
import ProductCardInteractive from '@/components/product/product-card-interactive';
import type { ProductCardData } from '@/components/product/product-card-server';
import { formatPrice } from '@/lib/price';

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

const brandOptions = ['All Brands', 'Apple', 'Samsung', 'Nike', 'Adidas', 'Sony', 'LG', 'Philips', 'Generic'] as const;

export default function ProductsBrowser({ products, categories, initialCategoryId }: ProductsBrowserProps) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryId || 'all');
  const [selectedBrand, setSelectedBrand] = useState<typeof brandOptions[number]>('All Brands');
  const [sortBy, setSortBy] = useState<typeof sortOptions[number]>('Newest');
  const [priceRange, setPriceRange] = useState(10000);
  const [gridView, setGridView] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);

  const allCategories = [{ id: 'all', name: 'All Categories', slug: '' }, ...categories];

  const filtered = useMemo(() => {
    let list = [...products];

    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category?.id === selectedCategory || p.warehouse?.name === selectedCategory);
    }

    if (selectedBrand !== 'All Brands') {
      list = list.filter((p) => p.brand === selectedBrand || (p.brand && p.brand.toLowerCase().includes(selectedBrand.toLowerCase())));
    }

    list = list.filter((p) => {
      const basePrice = typeof p.base_price === 'number' ? p.base_price : p.base_price.toNumber();
      const margin = typeof p.margin_percent === 'number' ? (p.margin_percent || 15) : (p.margin_percent?.toNumber() ?? 15);
      const finalPrice = basePrice * (1 + margin / 100);
      return finalPrice <= priceRange;
    });

    if (selectedRating > 0) {
      list = list.filter((p) => {
        const rating = typeof p.rating === 'number' ? p.rating : p.rating.toNumber();
        return rating >= selectedRating;
      });
    }

    const getFinalPrice = (p: ProductCardData) => {
      const base = typeof p.base_price === 'number' ? p.base_price : p.base_price.toNumber();
      const margin = typeof p.margin_percent === 'number' ? (p.margin_percent || 15) : (p.margin_percent?.toNumber() ?? 15);
      return base * (1 + margin / 100);
    };

    if (sortBy === 'Price: Low to High') list.sort((a, b) => getFinalPrice(a) - getFinalPrice(b));
    else if (sortBy === 'Price: High to Low') list.sort((a, b) => getFinalPrice(b) - getFinalPrice(a));
    else if (sortBy === 'Top Rated') list.sort((a, b) => {
      const ra = typeof a.rating === 'number' ? a.rating : a.rating.toNumber();
      const rb = typeof b.rating === 'number' ? b.rating : b.rating.toNumber();
      return rb - ra;
    });
    else if (sortBy === 'Most Popular') list.sort((a, b) => (b.review_count || 0) - (a.review_count || 0));

    return list;
  }, [products, selectedCategory, selectedBrand, sortBy, priceRange, selectedRating]);

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Categories</h3>
        <div className="space-y-1">
          {allCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center justify-between ${
                selectedCategory === cat.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat.name}
              {selectedCategory === cat.id && <ChevronRight className="w-3 h-3" />}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Brand</h3>
        <div className="space-y-1">
          {brandOptions.map((brand) => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center justify-between ${
                selectedBrand === brand ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {brand}
              {selectedBrand === brand && <ChevronRight className="w-3 h-3" />}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Price Range</h3>
        <div className="space-y-3">
          <input
            type="range"
            min={0}
            max={10000}
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>Br 0</span>
            <span>Br {priceRange}+</span>
          </div>
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Rating</h3>
        <div className="space-y-1">
          {[5, 4, 3, 2].map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRating(selectedRating === r ? 0 : r)}
              className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-sm transition-colors ${
                selectedRating === r ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`w-4 h-4 ${i < r ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
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
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortOptions[number])}
                className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:border-blue-500 focus:outline-none"
              >
                {sortOptions.map((opt) => <option key={opt}>{opt}</option>)}
              </select>
            </div>
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setGridView(true)}
                className={`p-1.5 ${gridView ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-50'}`}
              >
                <Grid2x2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridView(false)}
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
              onClick={() => { setSelectedCategory('all'); setSelectedBrand('All Brands'); setPriceRange(10000); setSelectedRating(0); }}
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
