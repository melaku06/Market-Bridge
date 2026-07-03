'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight, Grid2x2, List, SlidersHorizontal, X } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ProductCard from '@/components/product/product-card';
import { products, categories } from '@/lib/data';

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = categories.find((c) => c.slug === params.slug);
  const categoryName = category?.name || params.slug;

  const subCategories = ['All Electronics', 'Headphones', 'Smart Watches', 'Speakers', 'Cameras', 'Accessories', 'All Electronics'];

  const [selectedSub, setSelectedSub] = useState('All Electronics');
  const [sortBy, setSortBy] = useState('Newest');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [gridView, setGridView] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (category) list = list.filter((p) => p.categoryId === category.id);
    list = list.filter((p) => p.price <= priceRange[1]);
    if (sortBy === 'Price: Low to High') list.sort((a, b) => a.price - b.price);
    else if (sortBy === 'Price: High to Low') list.sort((a, b) => b.price - a.price);
    else if (sortBy === 'Top Rated') list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [category, sortBy, priceRange]);

  const brands = [
    { name: 'Apple', count: 12 },
    { name: 'Samsung', count: 18 },
    { name: 'Sony', count: 9 },
    { name: 'Nike', count: 15 },
    { name: 'JBL', count: 6 },
  ];

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Sub Categories</h3>
        <div className="space-y-1">
          {subCategories.map((sub, i) => (
            <button
              key={i}
              onClick={() => setSelectedSub(sub)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                selectedSub === sub ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Price Range</h3>
        <input type="range" min={0} max={500} value={priceRange[1]} onChange={(e) => setPriceRange([0, Number(e.target.value)])} className="w-full accent-blue-600" />
        <div className="flex justify-between text-sm text-gray-500 mt-1"><span>Br 0</span><span>Br {priceRange[1]}+</span></div>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Brand</h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <label key={brand.name} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-blue-600 rounded" checked={selectedBrands.includes(brand.name)} onChange={(e) => setSelectedBrands(e.target.checked ? [...selectedBrands, brand.name] : selectedBrands.filter((b) => b !== brand.name))} />
              <span className="text-sm text-gray-600">{brand.name}</span>
              <span className="ml-auto text-xs text-gray-400">({brand.count})</span>
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
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-blue-600">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">{categoryName}</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-6">
            {/* Sidebar */}
            <aside className="hidden lg:block w-56 flex-shrink-0">
              <div className="bg-white rounded-xl border border-gray-100 p-4 sticky top-20">
                <FilterPanel />
              </div>
            </aside>

            <div className="flex-1 min-w-0">
              {/* Category Banner */}
              <div className="relative rounded-xl overflow-hidden mb-5 h-32 bg-gradient-to-r from-blue-600 to-blue-800">
                <img
                  src="https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt={categoryName}
                  className="absolute inset-0 w-full h-full object-cover opacity-20"
                />
                <div className="relative z-10 px-6 py-5 flex items-center justify-between h-full">
                  <div>
                    <h1 className="text-2xl font-bold text-white">{categoryName}</h1>
                    <p className="text-blue-200 text-sm">Explore the latest {categoryName.toLowerCase()} and gadgets</p>
                  </div>
                  <div className="text-white text-right">
                    <p className="text-sm opacity-70">{filtered.length} products</p>
                  </div>
                </div>
              </div>

              {/* Sub-category tabs */}
              <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-thin">
                {subCategories.map((sub, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSub(sub)}
                    className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      selectedSub === sub ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-200 hover:text-blue-600'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500">{filtered.length} products</p>
                <div className="flex items-center gap-3">
                  <button onClick={() => setFilterOpen(true)} className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
                    <SlidersHorizontal className="w-4 h-4" /> Filters
                  </button>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm text-gray-500">Sort by:</span>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:border-blue-500 focus:outline-none">
                      {['Newest', 'Price: Low to High', 'Price: High to Low', 'Top Rated'].map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button onClick={() => setGridView(true)} className={`p-1.5 ${gridView ? 'bg-blue-600 text-white' : 'text-gray-400'}`}><Grid2x2 className="w-4 h-4" /></button>
                    <button onClick={() => setGridView(false)} className={`p-1.5 ${!gridView ? 'bg-blue-600 text-white' : 'text-gray-400'}`}><List className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                  <p className="text-gray-500 text-sm mb-4">No products found in this category</p>
                  <Link href="/products"><button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">Browse All Products</button></Link>
                </div>
              ) : (
                <div className={`grid gap-4 ${gridView ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
                  {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
                </div>
              )}

              <div className="flex items-center justify-center gap-2 mt-8">
                <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-sm hover:bg-gray-50">‹</button>
                {[1, 2, 3].map((p) => (
                  <button key={p} className={`w-8 h-8 rounded-lg text-sm font-medium ${p === 1 ? 'bg-blue-600 text-white' : 'border border-gray-200 hover:bg-gray-50 text-gray-700'}`}>{p}</button>
                ))}
                <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-sm hover:bg-gray-50">›</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {filterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setFilterOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold">Filters</h2>
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
