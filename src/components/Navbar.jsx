import { Link, NavLink } from 'react-router-dom';
import { Database, ShoppingBag, Store } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { cartCount } = useCart();

  const navLinkClass = ({ isActive }) =>
    `inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
      isActive
        ? 'bg-slate-900 text-white'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
            <Store className="h-4.5 w-4.5" />
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900">
            TechStore
          </span>
        </Link>

        <nav className="flex items-center gap-1.5 sm:gap-2">
          <NavLink to="/" end className={navLinkClass}>
            Products
          </NavLink>
          <NavLink to="/erd" className={navLinkClass}>
            <Database className="h-3.5 w-3.5" />
            ERD
          </NavLink>
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <ShoppingBag className="h-4 w-4 text-slate-700" />
            <span>Cart</span>
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-900 px-1.5 text-[11px] font-bold text-white">
              {cartCount}
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
