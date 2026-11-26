import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { FALLBACK_PRODUCT_IMAGE } from '../data/mockProducts';

export default function CartPage() {
  const {
    items,
    subtotal,
    cartCount,
    updateQuantity,
    removeFromCart,
    showToast,
  } = useCart();
  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);

  const discount = appliedPromo === 'SAVE10' ? subtotal * 0.1 : 0;
  const deliveryFee = 0;
  const grandTotal = Math.max(0, subtotal - discount + deliveryFee);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    if (code === 'SAVE10') {
      setAppliedPromo('SAVE10');
      showToast('Promo code SAVE10 applied (10% off)');
    } else {
      showToast('Invalid promo code. Try SAVE10.', 'error');
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h1 className="mt-4 text-2xl font-extrabold text-slate-900">
          Your Shopping Cart is Empty
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Browse our catalog (Laptop, Mouse, Keyboard, Monitor) and click Add to
          Cart to start your order.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
            Shopping Cart ({cartCount})
          </h1>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        {/* Left: Cart Items */}
        <div className="lg:col-span-8">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
            <ul className="divide-y divide-slate-100">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
                >
                  <div className="flex items-center gap-4">
                    <Link to={`/products/${item.id}`} className="shrink-0">
                      <img
                        src={item.image_url || FALLBACK_PRODUCT_IMAGE}
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
                        }}
                        alt={item.name}
                        className="h-24 w-24 rounded-2xl border border-slate-100 object-cover"
                      />
                    </Link>
                    <div>
                      <span className="text-[11px] font-bold tracking-wider text-blue-600 uppercase">
                        {item.categoryName}
                      </span>
                      <Link
                        to={`/products/${item.id}`}
                        className="mt-0.5 block text-lg font-bold text-slate-900 hover:text-blue-600"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-0.5 font-mono text-xs text-slate-400">
                        SKU: {item.sku} · Unit Price: ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-6 sm:justify-end">
                    {/* Update QTY */}
                    <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 p-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 hover:bg-white"
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-8 text-center text-sm font-bold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 hover:bg-white"
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Line Subtotal */}
                    <div className="min-w-20 text-right">
                      <p className="text-base font-extrabold text-slate-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="rounded-xl p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-7">
            <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Standard Delivery</span>
                <span className="font-semibold text-emerald-600">Free</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Promo ({appliedPromo})</span>
                  <span className="font-semibold">-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-slate-100 pt-3 text-base font-extrabold text-slate-900">
                <span>Grand Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <form onSubmit={handleApplyPromo} className="mt-5 flex gap-2">
              <div className="relative flex-1">
                <Tag className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Promo code (SAVE10)"
                  className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pr-3 pl-8 text-xs outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
              <button
                type="submit"
                className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Apply
              </button>
            </form>

            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-600"
            >
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
