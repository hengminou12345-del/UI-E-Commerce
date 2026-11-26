import { Link, NavLink } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { cartCount } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-neutral-950"
          >
            <img
              src="/logo.png"
              alt="atelier logo"
              className="h-7 w-7 object-contain mix-blend-multiply"
            />
            <span>
              atelier<span className="text-stone-400">.</span>
            </span>
          </Link>

          <nav className="flex items-center gap-6">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `text-sm transition ${
                  isActive
                    ? 'font-medium text-neutral-950'
                    : 'text-stone-500 hover:text-neutral-900'
                }`
              }
            >
              Shop
            </NavLink>
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `text-sm transition ${
                  isActive
                    ? 'font-medium text-neutral-950'
                    : 'text-stone-500 hover:text-neutral-900'
                }`
              }
            >
              Cart
            </NavLink>
          </nav>
        </div>

        <Link
          to="/cart"
          className="inline-flex items-center gap-2 rounded-md border border-stone-200 bg-white px-3.5 py-2 text-xs font-medium tracking-wide text-neutral-900 transition hover:border-neutral-900"
        >
          <ShoppingBag className="h-4 w-4 stroke-[1.75]" />
          <span>Bag</span>
          <span className="tabular-nums text-stone-500">({cartCount})</span>
        </Link>
      </div>
    </header>
  );
}
