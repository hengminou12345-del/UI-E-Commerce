import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-stone-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-xs text-stone-500 sm:flex-row sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} atelier. Essential Hardware Store.</p>
        <div className="flex items-center gap-5">
          <Link to="/" className="hover:text-neutral-900">
            Shop
          </Link>
          <Link to="/cart" className="hover:text-neutral-900">
            Cart
          </Link>
          <Link to="/erd" className="hover:text-neutral-900">
            Database ERD
          </Link>
        </div>
      </div>
    </footer>
  );
}
