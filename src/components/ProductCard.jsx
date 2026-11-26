import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { FALLBACK_PRODUCT_IMAGE } from '../data/mockProducts';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const hasDiscount =
    product.original_price && Number(product.original_price) > Number(product.price);
  const discountPct = hasDiscount
    ? Math.round(
        ((Number(product.original_price) - Number(product.price)) /
          Number(product.original_price)) *
          100
      )
    : 0;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/60">
      {/* Image */}
      <Link
        to={`/products/${product.id}`}
        className="relative aspect-[4/3] overflow-hidden bg-slate-100"
      >
        <img
          src={product.image_url || FALLBACK_PRODUCT_IMAGE}
          onError={(e) => {
            e.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
          }}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {product.is_featured && (
            <span className="rounded-full bg-slate-900/90 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-xs">
              Featured
            </span>
          )}
          {hasDiscount && (
            <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white">
              -{discountPct}%
            </span>
          )}
        </div>

        {/* Low Stock / Out of Stock Pill */}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute right-3 bottom-3 rounded-full bg-amber-100/95 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800">
            Only {product.stock} left
          </span>
        )}
        {product.stock <= 0 && (
          <span className="absolute right-3 bottom-3 rounded-full bg-rose-600 px-2.5 py-0.5 text-[11px] font-semibold text-white">
            Sold Out
          </span>
        )}
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold tracking-wider text-blue-600 uppercase">
            {product.category?.name || 'Catalog'}
          </span>
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-700">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span>{Number(product.rating || 4.8).toFixed(1)}</span>
          </div>
        </div>

        <Link to={`/products/${product.id}`} className="mt-1.5 block">
          <h3 className="line-clamp-1 text-base font-bold text-slate-900 transition group-hover:text-blue-600">
            {product.name}
          </h3>
        </Link>

        <p className="mt-1.5 line-clamp-2 flex-1 text-xs leading-relaxed text-slate-500">
          {product.description}
        </p>

        {/* Price + Action */}
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-slate-900">
              ${Number(product.price).toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-xs font-medium text-slate-400 line-through">
                ${Number(product.original_price).toFixed(2)}
              </span>
            )}
          </div>

          <button
            type="button"
            disabled={product.stock <= 0}
            onClick={() => addToCart(product, 1)}
            className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}
