import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { FALLBACK_PRODUCT_IMAGE } from '../data/mockProducts';

const FREE_SHIPPING_THRESHOLD = 150;

export default function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    setIsDrawerOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    cartCount,
  } = useCart();
  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handleCheckout = () => {
    setIsDrawerOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={() => setIsDrawerOpen(false)}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Panel */}
      <aside className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-5 w-5 text-slate-900" />
            <h2 className="text-lg font-bold text-slate-900">
              Your Cart ({cartCount})
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsDrawerOpen(false)}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Free Shipping Bar */}
        <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-3">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
            <Truck className="h-4 w-4 text-blue-600" />
            {remaining > 0 ? (
              <span>
                Add <strong>${remaining.toFixed(2)}</strong> more for free
                express shipping
              </span>
            ) : (
              <span className="font-semibold text-emerald-700">
                Unlocked! Free express shipping applies to your order.
              </span>
            )}
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900">
                Your cart is empty
              </h3>
              <p className="mt-1 max-w-xs text-sm text-slate-500">
                Explore curated tech and workspace essentials to start building
                your setup.
              </p>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="mt-5 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 py-4">
                  <img
                    src={item.image_url || FALLBACK_PRODUCT_IMAGE}
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
                    }}
                    alt={item.name}
                    className="h-20 w-20 shrink-0 rounded-xl border border-slate-100 object-cover"
                  />
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[11px] font-semibold tracking-wide text-blue-600 uppercase">
                          {item.categoryName}
                        </p>
                        <h4 className="line-clamp-1 text-sm font-semibold text-slate-900">
                          {item.name}
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 p-0.5">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="flex h-6 w-6 items-center justify-center rounded-full text-slate-600 hover:bg-white"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="min-w-7 text-center text-xs font-semibold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="flex h-6 w-6 items-center justify-center rounded-full text-slate-600 hover:bg-white"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="text-sm font-bold text-slate-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer Summary */}
        {items.length > 0 && (
          <div className="border-t border-slate-100 bg-slate-50/70 p-6">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Subtotal</span>
              <span className="text-lg font-bold text-slate-900">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Taxes and delivery options calculated at checkout.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsDrawerOpen(false);
                  navigate('/cart');
                }}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
              >
                View Shopping Cart
              </button>
              <button
                type="button"
                onClick={handleCheckout}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600"
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
