'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ProductCard from '@/components/product/product-card';
import { productsApi, categoriesApi } from '@/lib/api';
import {
  Search, SlidersHorizontal, Grid3X3, List, X, ChevronRight, Star, Plus,
} from 'lucide-react';
import Link from 'next/link';

const BRANDS = ['Apple', 'Samsung', 'Sony', 'Nike', 'Adidas', 'H&M', 'IKEA', 'LG'];

type SortOpt = 'relevance' | 'newest' | 'price_asc' | 'price_desc' | 'top_rated';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [catId, setCatId] = useState('');
  const [brands, setBrands] = useState<string[]>([]);
  const [priceMax, setPriceMax] = useState(10000);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState<SortOpt>('relevance');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      productsApi.list({ status: 'published', limit: 100 }),
      categoriesApi.list(),
    ]).then(([pr, cr]) => {
      const all = Array.isArray(pr) ? pr : (pr as any).data || [];
      setProducts(all);
      setCategories(Array.isArray(cr) ? cr : (cr as any).data || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let arr = [...products];
    if (query) arr = arr.filter(p => p.name?.toLowerCase().includes(query.toLowerCase()) || p.description?.toLowerCase().includes(query.toLowerCase()));
    if (catId) arr = arr.filter(p => p.category_id === catId || p.category?.id === catId);
    if (brands.length) arr = arr.filter(p => brands.includes(p.brand || ''));
    arr = arr.filter(p => {
      const fp = p.final_price || p.price || 0;
      return fp <= priceMax;
    });
    if (minRating > 0) arr = arr.filter(p => (p.rating || 0) >= minRating);
    if (sort === 'price_asc') arr.sort((a, b) => (a.final_price || 0) - (b.final_price || 0));
    if (sort === 'price_desc') arr.sort((a, b) => (b.final_price || 0) - (a.final_price || 0));
    if (sort === 'top_rated') arr.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sort === 'newest') arr.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    return arr;
  }, [products, query, catId, brands, priceMax, minRating, sort]);

  const toggleBrand = (b: string) => setBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);
  const clearAll = () => { setCatId(''); setBrands([]); setPriceMax(10000); setMinRating(0); setSort('relevance'); };
  const activeFilters = [catId, ...brands, minRating > 0 ? '1' : ''].filter(Boolean).length;

  const Sidebar = () => (
    <div className="space-y-6">
      {/* Categories */}
      {categories.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-gray-800 mb-3">Category</h4>
          <div className="space-y-1">
            <button onClick={() => setCatId('')}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${catId === '' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
              All
            </button>
            {categories.map((c: any) => (
              <button key={c.id} onClick={() => setCatId(c.id)}
                className={`w-full flex justify-between px-3 py-2 rounded-xl text-sm transition-colors ${catId === c.id ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
                <span>{c.name}</span>
                <span className="text-xs text-gray-400">{c.product_count || ''}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price */}
      <div>
        <h4 className="text-sm font-bold text-gray-800 mb-3">Max Price</h4>
        <input type="range" min={0} max={10000} step={50} value={priceMax} onChange={e => setPriceMax(Number(e.target.value))} className="w-full accent-blue-600 cursor-pointer" />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0 Br</span><span className="text-blue-600 font-semibold">{priceMax.toLocaleString()} Br</span>
        </div>
      </div>

      {/* Brands */}
      <div>
        <h4 className="text-sm font-bold text-gray-800 mb-3">Brand</h4>
        <div className="space-y-2">
          {BRANDS.map(b => (
            <label key={b} className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={brands.includes(b)} onChange={() => toggleBrand(b)} className="w-4 h-4 rounded border-gray-300 text-blue-600" />
              <span className="text-sm text-gray-600">{b}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="text-sm font-bold text-gray-800 mb-3">Min Rating</h4>
        {[0,2,3,4,5].map(r => (
          <button key={r} onClick={() => setMinRating(r)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm mb-1 transition-colors ${minRating === r ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
            {r === 0 ? 'All' : (
              <span className="flex items-center gap-0.5">
                {Array.from({length: r}).map((_, i) => <Star key={i} style={{ width: 12, height: 12 }} className="text-amber-400 fill-amber-400" />)}
                <span className="text-xs text-gray-400 ml-1">& up</span>
              </span>
            )}
          </button>
        ))}
      </div>

      {activeFilters > 0 && <button onClick={clearAll} className="w-full py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-500 hover:bg-gray-50">Clear Filters ({activeFilters})</button>}
    </div>
  );

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight style={{ width: 12, height: 12 }} />
          <span className="text-gray-900 font-medium">Search Results</span>
          {query && <><ChevronRight style={{ width: 12, height: 12 }} /><span className="text-gray-900">"{query}"</span></>}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {query ? `Results for "${query}"` : 'All Products'}
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">{filtered.length} products found</p>
          </div>
          <Link href="/product-request">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-200 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors">
              <Plus style={{ width: 14, height: 14 }} /> Request a Product
            </button>
          </Link>
        </div>

        <div className="flex gap-6 items-start">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-20">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold text-gray-900">Filters</h3>
              {activeFilters > 0 && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-600">{activeFilters}</span>}
            </div>
            <Sidebar />
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <button onClick={() => setFilterOpen(true)} className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
                <SlidersHorizontal style={{ width: 14, height: 14 }} /> Filters {activeFilters > 0 && <span className="bg-blue-600 text-white text-[10px] px-1.5 rounded-full">{activeFilters}</span>}
              </button>
              <div className="flex items-center gap-2 ml-auto">
                <select value={sort} onChange={e => setSort(e.target.value as SortOpt)}
                  className="h-9 px-3 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none bg-white cursor-pointer">
                  <option value="relevance">Relevance</option>
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low–High</option>
                  <option value="price_desc">Price: High–Low</option>
                  <option value="top_rated">Top Rated</option>
                </select>
                <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                  <button onClick={() => setView('grid')} className={`w-9 h-9 flex items-center justify-center ${view === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-50'}`}>
                    <Grid3X3 style={{ width: 14, height: 14 }} />
                  </button>
                  <button onClick={() => setView('list')} className={`w-9 h-9 flex items-center justify-center ${view === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-50'}`}>
                    <List style={{ width: 14, height: 14 }} />
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({length: 8}).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                    <div className="aspect-square bg-gray-100" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 bg-gray-100 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                      <div className="h-8 bg-gray-100 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 py-20 flex flex-col items-center gap-4 text-center px-6">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl mx-auto">🔍</div>
                <h3 className="text-lg font-bold text-gray-800">No results for "{query}"</h3>
                <p className="text-sm text-gray-400 max-w-md">We couldn't find any products matching your search. Try different keywords or request the product from our team.</p>
                <Link href="/product-request">
                  <button className="mt-2 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                    style={{ background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)' }}>
                    <Plus style={{ width: 14, height: 14 }} /> Request This Product
                  </button>
                </Link>
              </div>
            ) : (
              <div className={view === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4' : 'flex flex-col gap-3'}>
                {filtered.map(p => (
                  <ProductCard key={p.id} {...p} final_price={p.final_price || p.price}
                    original_price={p.original_price} discount_percent={p.discount_percent}
                    warehouse_name={p.warehouse?.name} category_name={p.category?.name} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFilterOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-white overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold">Filters</h3>
              <button onClick={() => setFilterOpen(false)}><X style={{ width: 18, height: 18 }} /></button>
            </div>
            <Sidebar />
            <button onClick={() => setFilterOpen(false)} className="w-full mt-6 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)' }}>
              Show {filtered.length} Results
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>}>
        <SearchContent />
      </Suspense>
      <Footer />
    </>
  );
}
