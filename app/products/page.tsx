'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Filter, Grid2x2, List, ChevronRight, SlidersHorizontal, X, Package, Star } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ProductCard from '@/components/product/product-card';
import { productsApi, categoriesApi } from '@/lib/api';
import type { Product, Category } from '@/lib/mock-db';

const sortOptions = ['Newest', 'Price: Low to High', 'Price: High to Low', 'Most Popular', 'Top Rated'];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('Newest');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [gridView, setGridView] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await categoriesApi.list();
        setCategories(res);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const params: Record<string, string> = { status: 'published' };
        if (selectedCategory !== 'All Categories') {
          const cat = categories.find(c => c.name === selectedCategory);
          if (cat) params.category = cat.id;
        }

        let res = await productsApi.list(params);
        // Handle both { data: [...] } and direct array responses
        let list = Array.isArray(res) ? res : (res as { data?: Product[] }).data || [];

        // Apply client-side filters
        list = list.filter((p) => p.final_price >= priceRange[0] && p.final_price <= priceRange[1]);
        if (selectedRating > 0) list = list.filter((p) => p.rating >= selectedRating);

        // Sort
        if (sortBy === 'Price: Low to High') list.sort((a, b) => a.final_price - b.final_price);
        else if (sortBy === 'Price: High to Low') list.sort((a, b) => b.final_price - a.final_price);
        else if (sortBy === 'Top Rated') list.sort((a, b) => b.rating - a.rating);
        else if (sortBy === 'Most Popular') list.sort((a, b) => b.sold_count - a.sold_count);
        else list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        setProducts(list);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [selectedCategory, sortBy, priceRange, selectedRating, categories]);

  const allCategories = ['All Categories', ...categories.map((c) => c.name)];

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Categories</h3>
        <div className="space-y-1">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center justify-between ${
                selectedCategory === cat ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat}
              {selectedCategory === cat && <ChevronRight className="w-3 h-3" />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Price Range</h3>
        <div className="space-y-3">
          <input
            type="range"
            min={0}
            max={500}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([0, Number(e.target.value)])}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>$0</span>
            <span>${priceRange[1]}+</span>
          </div>
        </div>
      </div>

      {/* Rating */}
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
                    <Star key={i} className={`w-4 h-4 ${i < r ? 'fill-yellow-400' : ''}`} />
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-blue-600">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">All Products</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-6">
            {/* Sidebar */}
            <aside className="hidden lg:block w-56 flex-shrink-0">
              <div className="bg-white rounded-xl border border-gray-100 p-4 sticky top-20">
                <h2 className="font-bold text-gray-900 mb-4">Filters</h2>
                <FilterPanel />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-lg font-bold text-gray-900">All Products</h1>
                  <p className="text-sm text-gray-500">{loading ? 'Loading...' : `${products.length} products found`}</p>
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
                      onChange={(e) => setSortBy(e.target.value)}
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

              {/* Products Grid */}
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : products.length > 0 ? (
                <div className={`grid gap-4 ${gridView ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl p-12 text-center">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your filters.</p>
                  <button
                    onClick={() => { setSelectedCategory('All Categories'); setPriceRange([0, 500]); setSelectedRating(0); }}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Filter Drawer */}
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

      <Footer />
    </div>
  );
}
