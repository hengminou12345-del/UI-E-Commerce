import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { FALLBACK_PRODUCT_IMAGE } from '../data/mockProducts';

export default function CartPage() {
  const { items, subtotal, cartCount, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const deliveryFee = 0;
  const grandTotal = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="text-[11px] font-medium tracking-[0.14em] text-stone-400 uppercase">
          Shopping Bag
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
          Your cart is empty
        </h1>
        <p className="mt-2 text-sm text-stone-500">
          Select Laptop, Mouse, Keyboard, or Monitor from the catalog to begin.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-md bg-neutral-950 px-6 py-3 text-xs font-medium tracking-wide text-white transition hover:bg-neutral-800"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Step Trail */}
      <div className="flex items-center gap-2 text-xs text-stone-400">
        <span className="font-medium text-neutral-950">Cart</span>
        <span>&rsaquo;</span>
        <span>Shipping</span>
        <span>&rsaquo;</span>
        <span>Confirmation</span>
      </div>

      <div className="mt-6 grid gap-10 lg:grid-cols-12">
        {/* Left: Cart Items */}
        <div className="lg:col-span-8">
          <div className="flex items-baseline justify-between border-b border-stone-200 pb-4">
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-950">
              Cart
            </h1>
            <span className="text-xs text-stone-500">{cartCount} items</span>
          </div>

          <ul className="divide-y divide-stone-200">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-5">
                  <img
                    src={item.image_url || FALLBACK_PRODUCT_IMAGE}
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
                    }}
                    alt={item.name}
                    className="h-24 w-24 shrink-0 rounded-md bg-[#F4F4F2] object-cover"
                  />
                  <div>
                    <h2 className="text-base font-semibold text-neutral-950">
                      {item.name}
                    </h2>
                    <p className="mt-1 text-xs text-stone-500">
                      SKU: {item.sku}
                    </p>
                    <p className="mt-1 tabular-nums text-xs text-stone-500">
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-6 sm:justify-end">
                  <div className="inline-flex items-center rounded-md border border-stone-200 bg-white">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center text-stone-600 transition hover:bg-stone-50"
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="min-w-8 text-center tabular-nums text-xs font-semibold text-neutral-950">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center text-stone-600 transition hover:bg-stone-50"
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <p className="min-w-20 text-right tabular-nums text-sm font-semibold text-neutral-950">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 text-stone-400 transition hover:text-rose-600"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 rounded-md border border-stone-200 bg-[#FAFAFA] p-6">
            <h2 className="text-base font-semibold text-neutral-950">
              Order Summary
            </h2>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="tabular-nums font-medium text-neutral-950">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Delivery</span>
                <span className="tabular-nums font-medium text-neutral-950">
                  ${deliveryFee.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between border-t border-stone-200 pt-4 text-base font-semibold text-neutral-950">
                <span>Grand Total</span>
                <span className="tabular-nums">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="mt-6 w-full rounded-md bg-neutral-950 px-5 py-3 text-xs font-medium tracking-wide text-white transition hover:bg-neutral-800"
            >
              Proceed to Checkout
            </button>

            <Link
              to="/"
              className="mt-3 block text-center text-xs text-stone-500 underline-offset-4 hover:text-neutral-900 hover:underline"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
