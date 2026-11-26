import { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Database,
  Layers,
  Menu,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { cartCount, setIsDrawerOpen, searchQuery, setSearchQuery } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  const navLinkClass = ({ isActive }) =>
    `inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
      isActive
        ? 'bg-slate-900 text-white shadow-xs'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link to="/" className="flex shrink-0 items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <div className="leading-tight">
            <span className="block text-base font-bold tracking-tight text-slate-900">
              Veloce
            </span>
            <span className="block text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
              Market
            </span>
          </div>
        </Link>

        {/* Search Bar (Desktop) */}
        <div className="hidden max-w-md flex-1 md:block">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search products, SKU, or gear..."
              aria-label="Search products"
              className="w-full rounded-full border border-slate-200 bg-slate-50/80 py-2 pr-9 pl-10 text-sm text-slate-900 placeholder-slate-400 transition outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation + Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <nav className="hidden items-center gap-1 lg:flex">
            <NavLink to="/" end className={navLinkClass}>
              <Layers className="h-3.5 w-3.5" />
              Storefront
            </NavLink>
            <NavLink to="/cart" className={navLinkClass}>
              <ShoppingBag className="h-3.5 w-3.5" />
              Shopping Cart
            </NavLink>
            <NavLink to="/admin" className={navLinkClass}>
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Manage Catalog
            </NavLink>
            <NavLink to="/erd" className={navLinkClass}>
              <Database className="h-3.5 w-3.5" />
              ERD Schema
            </NavLink>
          </nav>

          {/* Cart Button */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="relative inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-800 shadow-xs transition hover:border-slate-300 hover:bg-slate-50"
          >
            <ShoppingBag className="h-4 w-4 text-slate-700" />
            <span className="hidden sm:inline">Cart</span>
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[11px] font-bold text-white">
              {cartCount}
            </span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-700 hover:bg-slate-100 lg:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden">
          <div className="relative mb-3 md:hidden">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search products..."
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pr-4 pl-10 text-sm outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <NavLink
              to="/"
              end
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClass}
            >
              <Layers className="h-3.5 w-3.5" />
              Storefront
            </NavLink>
            <NavLink
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClass}
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Shopping Cart
            </NavLink>
            <NavLink
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClass}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Manage Catalog
            </NavLink>
            <NavLink
              to="/erd"
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClass}
            >
              <Database className="h-3.5 w-3.5" />
              ERD Schema
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
