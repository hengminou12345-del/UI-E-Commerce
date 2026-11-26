import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
} from 'lucide-react';
import { getProductById, getProducts } from '../services/productService';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { FALLBACK_PRODUCT_IMAGE } from '../data/mockProducts';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, setIsDrawerOpen } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setQuantity(1);
      try {
        const [item, all] = await Promise.all([
          getProductById(id),
          getProducts(),
        ]);
        if (!active) return;
        setProduct(item);
        if (item) {
          setRelated(
            all
              .filter(
                (p) =>
                  Number(p.id) !== Number(item.id) &&
                  Number(p.category_id) === Number(item.category_id)
              )
              .slice(0, 4)
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-3xl bg-slate-200" />
          <div className="space-y-4 py-4">
            <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
            <div className="h-10 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="h-24 w-full animate-pulse rounded bg-slate-100" />
            <div className="h-12 w-48 animate-pulse rounded-full bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Product not found</h1>
        <p className="mt-2 text-sm text-slate-500">
          This product may have been removed or its ID does not exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Storefront
        </Link>
      </div>
    );
  }

  const hasDiscount =
    product.original_price &&
    Number(product.original_price) > Number(product.price);
  const savings = hasDiscount
    ? Number(product.original_price) - Number(product.price)
    : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500">
        <Link to="/" className="hover:text-slate-900">
          Storefront
        </Link>
        <span>/</span>
        <span className="text-slate-700">
          {product.category?.name || 'Catalog'}
        </span>
        <span>/</span>
        <span className="truncate font-medium text-slate-900">
          {product.name}
        </span>
      </nav>

      {/* Main Grid */}
      <div className="mt-6 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-xs">
            <img
              src={product.image_url || FALLBACK_PRODUCT_IMAGE}
              onError={(e) => {
                e.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
              }}
              alt={product.name}
              className="aspect-square w-full rounded-2xl object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col justify-center lg:col-span-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold tracking-wide text-blue-700 uppercase">
              {product.category?.name || 'Catalog'}
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 font-mono text-xs text-slate-600">
              SKU: {product.sku}
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                product.stock > 0
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-rose-50 text-rose-700'
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {product.stock > 0
                ? `${product.stock} in stock`
                : 'Out of stock'}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1 font-semibold text-slate-800">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              {Number(product.rating || 4.8).toFixed(1)}
            </div>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">Verified hardware quality</span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-slate-900">
              ${Number(product.price).toFixed(2)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-lg font-medium text-slate-400 line-through">
                  ${Number(product.original_price).toFixed(2)}
                </span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                  Save ${savings.toFixed(2)}
                </span>
              </>
            )}
          </div>

          <p className="mt-5 text-base leading-relaxed text-slate-600">
            {product.description}
          </p>

          {/* Quantity & Actions */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center rounded-full border border-slate-200 bg-white p-1">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-10 text-center text-sm font-bold text-slate-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() =>
                  setQuantity((q) => Math.min(product.stock || 99, q + 1))
                }
                className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              disabled={product.stock <= 0}
              onClick={() => {
                addToCart(product, quantity);
                setIsDrawerOpen(true);
              }}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-slate-900 px-7 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </button>

            <button
              type="button"
              disabled={product.stock <= 0}
              onClick={() => {
                addToCart(product, quantity);
                navigate('/checkout');
              }}
              className="rounded-full border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Buy Now
            </button>
          </div>

          <div className="mt-8 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Express Dispatch
                </p>
                <p className="text-xs text-slate-500">
                  Free shipping on orders over $150
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-xs font-bold text-slate-900">
                  2-Year Warranty
                </p>
                <p className="text-xs text-slate-500">
                  Direct replacement guarantee
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-16 border-t border-slate-200 pt-10">
          <h2 className="text-xl font-bold text-slate-900">
            Related in {product.category?.name}
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
