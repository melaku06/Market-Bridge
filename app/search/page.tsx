'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronRight, Grid2x2, List, SlidersHorizontal, X, Search } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ProductCard from '@/components/product/product-card';
import { productsApi, categoriesApi } from '@/lib/api';
import type { Product, Category } from '@/lib/types';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('Relevance');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [gridView, setGridView] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productsApi.list({ status: 'published' }),
          categoriesApi.list(),
        ]);
        // Handle both { data: [...] } and direct array responses
        const productsData = Array.isArray(productsRes) ? productsRes : (productsRes as { data?: Product[] }).data || [];
        const categoriesData = Array.isArray(categoriesRes) ? categoriesRes : [];
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filtered = products.filter((p) => {
    if (query) {
      const q = query.toLowerCase();
      const matchesQuery = p.name.toLowerCase().includes(q) ||
        (p.category_name?.toLowerCase().includes(q)) ||
        (p.description?.toLowerCase().includes(q));
      if (!matchesQuery) return false;
    }
    if (selectedCategory !== 'All Categories') {
      if (p.category_name !== selectedCategory) return false;
    }
    if (selectedBrands.length > 0) {
      if (!selectedBrands.some((brand) => p.brand?.toLowerCase().includes(brand.toLowerCase()))) return false;
    }
    const price = p.final_price ?? 0;
    if (price < priceRange[0] || price > priceRange[1]) return false;
    return true;
  }).sort((a, b) => {
    const priceA = a.final_price ?? 0;
    const priceB = b.final_price ?? 0;
    if (sortBy === 'Price: Low to High') return priceA - priceB;
    if (sortBy === 'Price: High to Low') return priceB - priceA;
    if (sortBy === 'Top Rated') return b.rating - a.rating;
    if (sortBy === 'Newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    return 0;
  });

  const brands = ['Apple', 'Samsung', 'Sony', 'JBL', 'Bose', 'Sennheiser', 'LG', 'Philips'];
  const subCategories = ['Smartphones', 'Laptops', 'Tablets', 'Headphones', 'Cameras', 'Smartwatches', 'Accessories'];
  const allCategories = ['All Categories', ...categories.map((c) => c.name)];
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);

  const getCategoryCount = (cat: string) => {
    if (cat === 'All Categories') return products.length;
    return products.filter((p) => p.category_name === cat).length;
  };

  const getBrandCount = (brand: string) => {
    return products.filter((p) => p.brand?.toLowerCase().includes(brand.toLowerCase())).length;
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) => prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]);
  };

  const FilterPanel = () => (
    <div className="space-y-5">
      <div>
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Categories</h3>
        <div className="space-y-1">
          {allCategories.slice(0, 8).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-sm transition-colors flex items-center justify-between ${
                selectedCategory === cat ? 'bg-blue-600 text-white font-medium' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat}
              <span className={`text-xs ${selectedCategory === cat ? 'text-white/70' : 'text-gray-400'}`}>
                ({getCategoryCount(cat)})
              </span>
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
          {brands.map((brand) => {
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
        <input type="range" min={0} max={10000} value={priceRange[1]} onChange={(e) => setPriceRange([0, Number(e.target.value)])} className="w-full accent-blue-600" />
        <div className="flex justify-between text-sm text-gray-500 mt-1"><span>Br 0</span><span>Br {priceRange[1]}+</span></div>
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
