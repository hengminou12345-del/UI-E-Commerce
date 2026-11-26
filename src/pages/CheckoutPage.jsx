import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/productService';
import { FALLBACK_PRODUCT_IMAGE } from '../data/mockProducts';

const SHIPPING_METHODS = [
  {
    id: 'free',
    label: 'Free Shipping',
    eta: '7–20 Days',
    cost: 0,
  },
  {
    id: 'express',
    label: 'Express Shipping',
    eta: '1–3 Days',
    cost: 9,
  },
];

export default function CheckoutPage() {
  const { items, subtotal, clearCart, showToast } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    shipping_method: 'free',
  });

  const selectedShipping =
    SHIPPING_METHODS.find((m) => m.id === form.shipping_method) ||
    SHIPPING_METHODS[0];
  const shippingCost = selectedShipping.cost;
  const grandTotal = subtotal + shippingCost;

  const validate = () => {
    const nextErrors = {};
    if (!form.first_name.trim()) nextErrors.first_name = 'First name is required.';
    if (!form.last_name.trim()) nextErrors.last_name = 'Last name is required.';
    if (!form.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (!form.phone.trim()) nextErrors.phone = 'Phone number is required.';
    if (!form.address.trim()) nextErrors.address = 'Address is required.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (!validate()) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const orderedProductsSnapshot = items.map((i) => ({
        product_id: i.id,
        name: i.name,
        sku: i.sku,
        image_url: i.image_url,
        quantity: i.quantity,
        unit_price: i.price,
        subtotal: i.price * i.quantity,
      }));

      const payload = {
        customer: {
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
        },
        shipping_method: selectedShipping.label,
        shipping_cost: shippingCost,
        subtotal,
        total_amount: grandTotal,
        items: orderedProductsSnapshot,
      };

      const order = await createOrder(payload);
      setCompletedOrder({
        ...order,
        customer_name: `${form.first_name.trim()} ${form.last_name.trim()}`,
        ordered_products: orderedProductsSnapshot,
      });
      clearCart();
      showToast(`Order ${order.order_number} placed`);
    } catch {
      showToast('Could not submit order. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (completedOrder) {
    const formattedDate = new Date(
      completedOrder.order_date || Date.now()
    ).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-center gap-2 text-xs text-stone-400">
          <span>Cart</span>
          <span>&rsaquo;</span>
          <span>Shipping</span>
          <span>&rsaquo;</span>
          <span className="font-medium text-neutral-950">Confirmation</span>
        </div>

        <div className="rounded-md border border-stone-200 bg-white p-7 sm:p-10">
          <div className="flex items-center gap-3 border-b border-stone-200 pb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white">
              <Check className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-neutral-950 sm:text-2xl">
                Order Placed Successfully!
              </h1>
              <p className="text-xs text-stone-500">
                Your order has been received and recorded.
              </p>
            </div>
          </div>

          {/* Receipt Metadata */}
          <div className="mt-6 grid gap-5 border-b border-stone-200 pb-6 text-sm sm:grid-cols-2">
            <div>
              <p className="text-[11px] font-medium tracking-wider text-stone-400 uppercase">
                Order ID
              </p>
              <p className="mt-1 font-mono text-sm font-semibold text-neutral-950">
                {completedOrder.order_number}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium tracking-wider text-stone-400 uppercase">
                Status
              </p>
              <span className="mt-1 inline-block rounded border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                Order Status: {completedOrder.status || 'Pending'}
              </span>
            </div>
            <div>
              <p className="text-[11px] font-medium tracking-wider text-stone-400 uppercase">
                Customer Name
              </p>
              <p className="mt-1 font-medium text-neutral-950">
                {completedOrder.customer_name}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium tracking-wider text-stone-400 uppercase">
                Order Date
              </p>
              <p className="mt-1 font-medium text-neutral-950">
                {formattedDate}
              </p>
            </div>
          </div>

          {/* Ordered Products */}
          <div className="mt-6">
            <h2 className="text-xs font-semibold tracking-wider text-stone-500 uppercase">
              Ordered Products
            </h2>
            <ul className="mt-3 divide-y divide-stone-100">
              {(completedOrder.ordered_products || []).map((item) => (
                <li
                  key={item.product_id}
                  className="flex items-center justify-between gap-3 py-3 text-sm"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image_url || FALLBACK_PRODUCT_IMAGE}
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
                      }}
                      alt={item.name}
                      className="h-12 w-12 rounded bg-[#F4F4F2] object-cover"
                    />
                    <div>
                      <p className="font-medium text-neutral-950">{item.name}</p>
                      <p className="tabular-nums text-xs text-stone-500">
                        Qty: {item.quantity} × ${Number(item.unit_price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <span className="tabular-nums font-semibold text-neutral-950">
                    ${Number(item.subtotal).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Total Summary */}
          <div className="mt-4 space-y-2 border-t border-stone-200 pt-4 text-sm">
            <div className="flex justify-between text-stone-600">
              <span>Shipping ({completedOrder.shipping_method})</span>
              <span className="tabular-nums">
                ${Number(completedOrder.shipping_cost || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-base font-semibold text-neutral-950">
              <span>Total Amount</span>
              <span className="tabular-nums">
                ${Number(completedOrder.total_amount).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-8">
            <Link
              to="/"
              className="inline-block rounded-md bg-neutral-950 px-6 py-3 text-xs font-medium tracking-wide text-white transition hover:bg-neutral-800"
            >
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-950">
          Your cart is empty
        </h1>
        <p className="mt-2 text-sm text-stone-500">
          Add items to your cart before proceeding to checkout.
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

  const inputClass = (field) =>
    `w-full rounded-md border px-3.5 py-2.5 text-sm text-neutral-950 placeholder-stone-400 outline-none transition ${
      errors[field]
        ? 'border-rose-500 bg-rose-50/40 focus:border-rose-600'
        : 'border-stone-300 bg-white focus:border-neutral-950'
    }`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Step Trail */}
      <div className="flex items-center gap-2 text-xs text-stone-400">
        <Link to="/cart" className="hover:text-neutral-900">
          Cart
        </Link>
        <span>&rsaquo;</span>
        <span className="font-medium text-neutral-950">Shipping</span>
        <span>&rsaquo;</span>
        <span>Confirmation</span>
      </div>

      <form
        noValidate
        onSubmit={handleSubmit}
        className="mt-6 grid gap-10 lg:grid-cols-12"
      >
        {/* Left: Shipping Address & Shipping Method */}
        <div className="space-y-8 lg:col-span-7">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-neutral-950">
              Shipping Address
            </h1>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="first_name"
                  className="mb-1.5 block text-xs font-medium text-stone-700"
                >
                  First Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  value={form.first_name}
                  onChange={(e) => handleFieldChange('first_name', e.target.value)}
                  placeholder="Sokha"
                  className={inputClass('first_name')}
                />
                {errors.first_name && (
                  <p className="mt-1 text-xs text-rose-600">{errors.first_name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="last_name"
                  className="mb-1.5 block text-xs font-medium text-stone-700"
                >
                  Last Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  value={form.last_name}
                  onChange={(e) => handleFieldChange('last_name', e.target.value)}
                  placeholder="Dara"
                  className={inputClass('last_name')}
                />
                {errors.last_name && (
                  <p className="mt-1 text-xs text-rose-600">{errors.last_name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-xs font-medium text-stone-700"
                >
                  Email <span className="text-rose-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  placeholder="sokha@example.com"
                  className={inputClass('email')}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-rose-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-1.5 block text-xs font-medium text-stone-700"
                >
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  placeholder="+855 12 345 678"
                  className={inputClass('phone')}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="address"
                  className="mb-1.5 block text-xs font-medium text-stone-700"
                >
                  Address <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  value={form.address}
                  onChange={(e) => handleFieldChange('address', e.target.value)}
                  placeholder="Street 271, Sangkat Boeng Tumpun, Phnom Penh"
                  className={inputClass('address')}
                />
                {errors.address && (
                  <p className="mt-1 text-xs text-rose-600">{errors.address}</p>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-stone-200 pt-6">
            <h2 className="text-base font-semibold text-neutral-950">
              Shipping Method
            </h2>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {SHIPPING_METHODS.map((method) => {
                const active = form.shipping_method === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => handleFieldChange('shipping_method', method.id)}
                    className={`flex items-start justify-between rounded-md border p-4 text-left transition ${
                      active
                        ? 'border-neutral-950 bg-stone-50'
                        : 'border-stone-200 bg-white hover:border-stone-400'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                          active
                            ? 'border-neutral-950'
                            : 'border-stone-300'
                        }`}
                      >
                        {active && (
                          <span className="h-2 w-2 rounded-full bg-neutral-950" />
                        )}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-neutral-950">
                          {method.label}
                        </p>
                        <p className="mt-0.5 text-xs text-stone-500">
                          {method.eta}
                        </p>
                      </div>
                    </div>
                    <span className="tabular-nums text-sm font-semibold text-neutral-950">
                      ${method.cost}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Your Cart / Order Summary */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 rounded-md border border-stone-200 bg-[#FAFAFA] p-6">
            <h2 className="text-base font-semibold text-neutral-950">
              Your Cart
            </h2>

            <ul className="mt-4 divide-y divide-stone-200">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-3.5 py-3.5">
                  <div className="relative shrink-0">
                    <img
                      src={item.image_url || FALLBACK_PRODUCT_IMAGE}
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
                      }}
                      alt={item.name}
                      className="h-14 w-14 rounded bg-[#F4F4F2] object-cover"
                    />
                    <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-neutral-900 px-1 text-[10px] font-semibold text-white">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-950">
                      {item.name}
                    </p>
                    <p className="tabular-nums text-xs text-stone-500">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="tabular-nums text-sm font-semibold text-neutral-950">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-4 space-y-2.5 border-t border-stone-200 pt-4 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="tabular-nums">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Shipping ({selectedShipping.label})</span>
                <span className="tabular-nums">${shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-stone-200 pt-3 text-base font-semibold text-neutral-950">
                <span>Grand Total</span>
                <span className="tabular-nums">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full rounded-md bg-neutral-950 px-5 py-3 text-xs font-medium tracking-wide text-white transition hover:bg-neutral-800 disabled:opacity-60"
            >
              {submitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
