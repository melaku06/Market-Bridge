'use client';

import { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronRight, Grid2x2, List, SlidersHorizontal, X, Search, MessageSquarePlus } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ProductCard from '@/components/product/product-card';
import { products, categories } from '@/lib/data';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('Relevance');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [gridView, setGridView] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...products];
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (selectedCategory !== 'All Categories') list = list.filter((p) => p.category === selectedCategory);
    list = list.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (sortBy === 'Price: Low to High') list.sort((a, b) => a.price - b.price);
    else if (sortBy === 'Price: High to Low') list.sort((a, b) => b.price - a.price);
    else if (sortBy === 'Top Rated') list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [query, selectedCategory, sortBy, priceRange]);

  const brands = ['Sony', 'JBL', 'Bose', 'Sennheiser', 'Apple'];
  const allCategories = ['All Categories', ...categories.map((c) => c.name)];

  const FilterPanel = () => (
    <div className="space-y-6">
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
              <span className="text-xs text-gray-400">
                ({products.filter((p) => cat === 'All Categories' || p.category === cat).length})
              </span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Price Range</h3>
        <input type="range" min={0} max={500} value={priceRange[1]} onChange={(e) => setPriceRange([0, Number(e.target.value)])} className="w-full accent-blue-600" />
        <div className="flex justify-between text-sm text-gray-500 mt-1"><span>$0</span><span>${priceRange[1]}+</span></div>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Brand</h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-blue-600 rounded" />
              <span className="text-sm text-gray-600">{brand}</span>
              <span className="ml-auto text-xs text-gray-400">({Math.floor(Math.random() * 30 + 10)})</span>
            </label>
          ))}
          <button className="text-sm text-blue-600 hover:underline">+ Show More</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-blue-600">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">Search results</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-6">
            <aside className="hidden lg:block w-56 flex-shrink-0">
              <div className="bg-white rounded-xl border border-gray-100 p-4 sticky top-20">
                <FilterPanel />
              </div>
            </aside>

            <div className="flex-1 min-w-0">
              <div className="mb-4">
                {query && (
                  <div>
                    <h1 className="text-lg font-bold text-gray-900">
                      Search results for <span className="text-blue-600">"{query}"</span>
                    </h1>
                    <p className="text-sm text-gray-500">{filtered.length} products found</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setFilterOpen(true)} className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                </button>
                <div className="flex items-center gap-3 ml-auto">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm text-gray-500">Sort by:</span>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:border-blue-500 focus:outline-none">
                      {['Relevance', 'Newest', 'Price: Low to High', 'Price: High to Low', 'Top Rated'].map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button onClick={() => setGridView(true)} className={`p-1.5 ${gridView ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-50'}`}><Grid2x2 className="w-4 h-4" /></button>
                    <button onClick={() => setGridView(false)} className={`p-1.5 ${!gridView ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-50'}`}><List className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-500 text-sm mb-6">
                    Can't find what you're looking for?{' '}
                    <Link href="/product-request" className="text-blue-600 hover:underline font-medium">Request a Product</Link>
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Link href="/products"><button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Browse Products</button></Link>
                    <Link href="/product-request"><button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">Request Product</button></Link>
                  </div>
                </div>
              ) : (
                <>
                  <div className={`grid gap-4 ${gridView ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
                    {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
                  </div>

                  <div className="mt-8 p-4 bg-white rounded-xl border border-gray-100 text-center">
                    <p className="text-sm text-gray-500">
                      Can't find what you're looking for?{' '}
                      <Link href="/product-request" className="text-blue-600 hover:underline font-medium">Request a Product</Link>
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-2 mt-4">
                    <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-sm hover:bg-gray-50">‹</button>
                    {[1, 2, 3].map((p) => (
                      <button key={p} className={`w-8 h-8 rounded-lg text-sm font-medium ${p === 1 ? 'bg-blue-600 text-white' : 'border border-gray-200 hover:bg-gray-50 text-gray-700'}`}>{p}</button>
                    ))}
                    <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-sm hover:bg-gray-50">›</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

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

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" /></div>}>
      <SearchResults />
    </Suspense>
  );
}
