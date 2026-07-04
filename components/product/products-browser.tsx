'use client';

import { useState, useMemo } from 'react';
import { SlidersHorizontal, Grid3X3, List, X, ChevronDown, Star, Search } from 'lucide-react';
import ProductCardInteractive from './product-card-interactive';
import type { ProductCardData } from './product-card-server';
import type { Category } from '@/lib/types';

const BRANDS = ['Apple', 'Samsung', 'Sony', 'Nike', 'Adidas', 'H&M', 'IKEA', 'LG'];
const SUBCATEGORIES = ['Smartphones', 'Laptops', 'Audio', 'Cameras', 'Tablets', 'Wearables', 'Accessories'];

interface Props {
  products: ProductCardData[];
  categories?: Category[];
  initialCategoryId?: string;
}

type SortOpt = 'newest' | 'price_asc' | 'price_desc' | 'popular' | 'top_rated';

export default function ProductsBrowser({ products, categories = [], initialCategoryId }: Props) {
  const [catId, setCatId] = useState(initialCategoryId || '');
  const [brands, setBrands] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(10000);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState<SortOpt>('newest');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filterOpen, setFilterOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let arr = [...products];
    if (search) arr = arr.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    if (catId) arr = arr.filter(p => p.category?.id === catId);
    if (brands.length) arr = arr.filter(p => brands.includes(p.brand || ''));
    arr = arr.filter(p => {
      const base = typeof p.base_price === 'number' ? p.base_price : p.base_price.toNumber();
      const m = typeof p.margin_percent === 'number' ? (p.margin_percent || 15) : (p.margin_percent?.toNumber() ?? 15);
      const d = typeof p.discount_percent === 'number' ? p.discount_percent : (p.discount_percent?.toNumber() ?? 0);
      const fp = base * (1 + m / 100) * (1 - d / 100);
      return fp >= priceMin && fp <= priceMax;
    });
    if (minRating > 0) arr = arr.filter(p => {
      const r = typeof p.rating === 'number' ? p.rating : (p.rating?.toNumber?.() ?? 0);
      return r >= minRating;
    });
    if (sort === 'price_asc') arr.sort((a, b) => {
      const fp = (p: ProductCardData) => {
        const base = typeof p.base_price === 'number' ? p.base_price : p.base_price.toNumber();
        const m = typeof p.margin_percent === 'number' ? (p.margin_percent || 15) : (p.margin_percent?.toNumber() ?? 15);
        return base * (1 + m / 100);
      };
      return fp(a) - fp(b);
    });
    if (sort === 'price_desc') arr.sort((a, b) => {
      const fp = (p: ProductCardData) => {
        const base = typeof p.base_price === 'number' ? p.base_price : p.base_price.toNumber();
        const m = typeof p.margin_percent === 'number' ? (p.margin_percent || 15) : (p.margin_percent?.toNumber() ?? 15);
        return base * (1 + m / 100);
      };
      return fp(b) - fp(a);
    });
    if (sort === 'top_rated') arr.sort((a, b) => {
      const ra = typeof a.rating === 'number' ? a.rating : (a.rating?.toNumber?.() ?? 0);
      const rb = typeof b.rating === 'number' ? b.rating : (b.rating?.toNumber?.() ?? 0);
      return rb - ra;
    });
    return arr;
  }, [products, catId, brands, priceMin, priceMax, minRating, sort, search]);

  const toggleBrand = (b: string) => setBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);
  const clearAll = () => { setCatId(initialCategoryId || ''); setBrands([]); setPriceMin(0); setPriceMax(10000); setMinRating(0); setSort('newest'); setSearch(''); };
  const activeFilters = [catId, ...brands, minRating > 0 ? `${minRating}★+` : ''].filter(Boolean).length;

  const Sidebar = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <h4 className="text-sm font-bold text-gray-800 mb-3">Search</h4>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style={{ width: 13, height: 13 }} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…"
            className="w-full pl-8 pr-3 h-9 border border-gray-200 rounded-xl text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-gray-800 mb-3">Category</h4>
          <div className="space-y-1.5">
            <button onClick={() => setCatId('')}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${catId === '' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
              All Categories
            </button>
            {categories.map(c => (
              <button key={c.id} onClick={() => setCatId(c.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors ${catId === c.id ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
                <span>{c.name}</span>
                {c.product_count > 0 && <span className="text-xs text-gray-400">{c.product_count}</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div>
        <h4 className="text-sm font-bold text-gray-800 mb-3">Price Range</h4>
        <div className="space-y-3">
          <input type="range" min={0} max={10000} step={50} value={priceMax} onChange={e => setPriceMax(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer" />
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>0 Br</span>
            <span className="font-semibold text-blue-600">{priceMax.toLocaleString()} Br</span>
          </div>
        </div>
      </div>

      {/* Brands */}
      <div>
        <h4 className="text-sm font-bold text-gray-800 mb-3">Brands</h4>
        <div className="space-y-2">
          {BRANDS.map(b => (
            <label key={b} className="flex items-center gap-2.5 cursor-pointer group">
              <input type="checkbox" checked={brands.includes(b)} onChange={() => toggleBrand(b)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{b}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="text-sm font-bold text-gray-800 mb-3">Minimum Rating</h4>
        <div className="space-y-1.5">
          {[0, 2, 3, 4, 5].map(r => (
            <button key={r} onClick={() => setMinRating(r)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors ${minRating === r ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
              {r === 0 ? 'All Ratings' : (
                <span className="flex items-center gap-1">
                  {Array.from({length: r}).map((_, i) => <Star key={i} style={{ width: 12, height: 12 }} className="text-amber-400 fill-amber-400" />)}
                  {r < 5 && <span className="text-gray-400 text-xs">& up</span>}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {activeFilters > 0 && (
        <button onClick={clearAll} className="w-full py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors">
          Clear All Filters ({activeFilters})
        </button>
      )}
    </div>
  );

  return (
    <div className="flex gap-6 items-start">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-56 flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-20">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-bold text-gray-900">Filters</h3>
          {activeFilters > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-600">{activeFilters}</span>
          )}
        </div>
        <Sidebar />
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            {/* Mobile filter */}
            <button onClick={() => setFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              <SlidersHorizontal style={{ width: 14, height: 14 }} />
              Filters {activeFilters > 0 && <span className="bg-blue-600 text-white text-[10px] px-1.5 rounded-full">{activeFilters}</span>}
            </button>
            <p className="text-sm text-gray-500">
              <span className="font-bold text-gray-900">{filtered.length}</span> products found
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select value={sort} onChange={e => setSort(e.target.value as SortOpt)}
              className="h-9 px-3 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:border-blue-400 bg-white cursor-pointer">
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
              <option value="top_rated">Top Rated</option>
            </select>
            <div className="flex border border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => setView('grid')}
                className={`w-9 h-9 flex items-center justify-center transition-colors ${view === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-50'}`}>
                <Grid3X3 style={{ width: 14, height: 14 }} />
              </button>
              <button onClick={() => setView('list')}
                className={`w-9 h-9 flex items-center justify-center transition-colors ${view === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-50'}`}>
                <List style={{ width: 14, height: 14 }} />
              </button>
            </div>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 py-20 flex flex-col items-center gap-4 text-center px-6">
            <div className="text-5xl">🔍</div>
            <h3 className="text-lg font-bold text-gray-800">No products found</h3>
            <p className="text-sm text-gray-400">Try adjusting your filters or search terms</p>
            {activeFilters > 0 && (
              <button onClick={clearAll} className="mt-2 px-5 py-2 rounded-xl text-sm font-semibold text-white"
                style={{ background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)' }}>
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className={view === 'grid'
            ? 'grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4'
            : 'flex flex-col gap-3'}>
            {filtered.map(p => (
              view === 'list'
                ? <ListCard key={p.id} product={p} />
                : <ProductCardInteractive key={p.id} product={p} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors text-sm disabled:opacity-40" disabled>
              ‹
            </button>
            {[1,2,3].map(n => (
              <button key={n} className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold transition-colors ${n === 1 ? 'text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                style={n === 1 ? { background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)' } : {}}>
                {n}
              </button>
            ))}
            <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors text-sm">
              ›
            </button>
          </div>
        )}
      </div>

      {/* Mobile filter drawer */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFilterOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-white overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-gray-900">Filters</h3>
              <button onClick={() => setFilterOpen(false)} className="p-1 rounded-lg hover:bg-gray-100">
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>
            <Sidebar />
            <button onClick={() => setFilterOpen(false)}
              className="w-full mt-6 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)' }}>
              Show {filtered.length} Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ListCard({ product }: { product: ProductCardData }) {
  const base = typeof product.base_price === 'number' ? product.base_price : product.base_price.toNumber();
  const m = typeof product.margin_percent === 'number' ? (product.margin_percent || 15) : (product.margin_percent?.toNumber() ?? 15);
  const d = typeof product.discount_percent === 'number' ? product.discount_percent : (product.discount_percent?.toNumber() ?? 0);
  const fp = base * (1 + m / 100) * (1 - d / 100);
  const op = base * (1 + m / 100);
  const rating = typeof product.rating === 'number' ? product.rating : (product.rating?.toNumber?.() ?? 0);
  const img = product.images?.[0] || '';
  return (
    <a href={`/products/${product.id}`}
      className="bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all flex gap-4 p-4 group">
      <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
        {img ? <img src={img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
          : <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-blue-600 font-medium mb-0.5">{product.warehouse?.name || 'Verified Seller'}</p>
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-1 mb-1">{product.name}</h3>
        <div className="flex items-center gap-1 mb-2">
          {[1,2,3,4,5].map(i => <Star key={i} style={{ width: 11, height: 11 }} className={i <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />)}
          <span className="text-[11px] text-gray-400">({product.review_count || 0})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-base font-extrabold text-gray-900">{fp.toFixed(2)} Br</span>
          {d > 0 && <span className="text-xs text-gray-400 line-through">{op.toFixed(2)} Br</span>}
        </div>
      </div>
    </a>
  );
}
