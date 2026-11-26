import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { FALLBACK_PRODUCT_IMAGE } from '../data/mockProducts';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/60">
      <div className="aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={product.image_url || FALLBACK_PRODUCT_IMAGE}
          onError={(e) => {
            e.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
          }}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h2 className="text-lg font-bold text-slate-900">{product.name}</h2>
        <p className="mt-1 line-clamp-1 text-xs text-slate-500">
          {product.description}
        </p>

        <p className="mt-4 text-xl font-extrabold text-slate-900">
          ${Number(product.price).toFixed(2)}
        </p>

        <button
          type="button"
          onClick={() => addToCart(product, 1)}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.99]"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </button>
      </div>
    </article>
  );
}
