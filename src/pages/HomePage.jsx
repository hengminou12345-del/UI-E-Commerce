import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Database,
  PackageSearch,
  ShieldCheck,
  Sparkles,
  Truck,
  Zap,
} from 'lucide-react';
import { getCategories } from '../services/categoryService';
import { getProducts } from '../services/productService';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import { FALLBACK_CATEGORY_IMAGE } from '../data/mockCategories';

export default function HomePage() {
  const { searchQuery, setSearchQuery } = useCart();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const [cats, prods] = await Promise.all([
          getCategories(),
          getProducts(),
        ]);
        if (!active) return;
        setCategories(cats);
        setProducts(prods.filter((p) => p.is_active !== false));
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const categoryCounts = useMemo(() => {
    const map = {};
    for (const p of products) {
      map[p.category_id] = (map[p.category_id] || 0) + 1;
    }
    return map;
  }, [products]);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedCategory !== 'all') {
      list = list.filter(
        (p) => Number(p.category_id) === Number(selectedCategory)
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q) ||
          (p.sku || '').toLowerCase().includes(q) ||
          (p.category?.name || '').toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'price-desc':
        list.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case 'rating':
        list.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
        break;
      default:
        list.sort(
          (a, b) => Number(Boolean(b.is_featured)) - Number(Boolean(a.is_featured))
        );
    }

    return list;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const heroFeatured = useMemo(
    () => products.find((p) => p.is_featured) || products[0],
    [products]
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-10 text-white shadow-xl sm:px-10 sm:py-14 lg:px-14">
        <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-blue-600/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />

        <div className="relative grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs font-semibold text-blue-200 backdrop-blur-xs">
              <Sparkles className="h-3.5 w-3.5 text-blue-300" />
              2026 Collection · Laravel API Ready
            </span>

            <h1 className="mt-5 text-3xl leading-tight font-extrabold tracking-tight sm:text-5xl">
              Minimalist gear engineered for modern work &amp; sound.
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300">
              Curated electronics, studio audio, and ergonomic workspace tools.
              Built on a clean 5-table relational schema ready for Laravel API
              &amp; Seeder integration.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="#catalog"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-sm transition hover:bg-blue-50"
              >
                Explore Catalog
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                to="/erd"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                <Database className="h-4 w-4" />
                View 5-Table ERD
              </Link>
            </div>

            <div className="mt-9 grid grid-cols-3 gap-4 border-t border-white/10 pt-6 text-xs text-slate-300 sm:max-w-lg">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 shrink-0 text-blue-400" />
                <span>Free delivery $150+</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>2-Year Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 shrink-0 text-amber-400" />
                <span>REST API Ready</span>
              </div>
            </div>
          </div>

          {/* Hero Spotlight Card */}
          {heroFeatured && (
            <div className="lg:col-span-5">
              <Link
                to={`/products/${heroFeatured.id}`}
                className="group block overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-md transition hover:bg-white/15"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-800">
                  <img
                    src={heroFeatured.image_url}
                    alt={heroFeatured.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-slate-900/85 px-3 py-1 text-xs font-semibold text-white">
                    Hero Spotlight
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between px-1 pb-1">
                  <div>
                    <p className="text-xs font-semibold text-blue-300">
                      {heroFeatured.category?.name || 'Featured'}
                    </p>
                    <h2 className="text-base font-bold text-white">
                      {heroFeatured.name}
                    </h2>
                  </div>
                  <span className="rounded-full bg-white px-3.5 py-1.5 text-sm font-extrabold text-slate-900">
                    ${Number(heroFeatured.price).toFixed(0)}
                  </span>
                </div>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Category Strip */}
      <section className="mt-12">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Shop by Category
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Backed by the <code className="rounded bg-slate-200/70 px-1.5 py-0.5 text-xs">categories</code> table
            </p>
          </div>
          {selectedCategory !== 'all' && (
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Show All Categories
            </button>
          )}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`flex flex-col justify-between rounded-2xl border p-4 text-left transition ${
              selectedCategory === 'all'
                ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
            }`}
          >
            <span className="text-xs font-semibold tracking-wider uppercase opacity-75">
              Catalog
            </span>
            <div className="mt-4">
              <p className="text-sm font-bold">All Products</p>
              <p className="text-xs opacity-75">{products.length} items</p>
            </div>
          </button>

          {categories.map((cat) => {
            const isSelected = Number(selectedCategory) === Number(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`group flex flex-col justify-between overflow-hidden rounded-2xl border p-3.5 text-left transition ${
                  isSelected
                    ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="h-10 w-10 overflow-hidden rounded-xl bg-slate-100">
                  <img
                    src={cat.image_url || FALLBACK_CATEGORY_IMAGE}
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_CATEGORY_IMAGE;
                    }}
                    alt={cat.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="mt-3">
                  <p className="line-clamp-1 text-sm font-bold">{cat.name}</p>
                  <p className="text-xs opacity-75">
                    {categoryCounts[cat.id] || 0} items
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Catalog Toolbar & Grid */}
      <section id="catalog" className="mt-12">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Curated Products
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Showing {filteredProducts.length} of {products.length} products
              {searchQuery ? ` for "${searchQuery}"` : ''}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Clear search
              </button>
            )}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort products"
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="mt-10 flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <PackageSearch className="h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-lg font-bold text-slate-900">
              No matching products found
            </h3>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              Try clearing your search filter or switching to another category.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-5 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-600"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
