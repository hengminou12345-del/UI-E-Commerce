import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  ShoppingBag,
  Truck,
} from 'lucide-react';
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
      showToast(`Order ${order.order_number} placed!`);
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
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <h1 className="mt-4 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              Order Placed Successfully!
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Thank you for your purchase. Below is your order confirmation
              summary.
            </p>
          </div>

          {/* Key Order Metadata */}
          <div className="mt-7 grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">
                Order ID
              </p>
              <p className="mt-0.5 font-mono text-base font-extrabold text-slate-900">
                {completedOrder.order_number}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">
                Order Status
              </p>
              <span className="mt-1 inline-flex rounded-full bg-amber-100 px-3 py-0.5 text-xs font-bold text-amber-800">
                Order Status: {completedOrder.status || 'Pending'}
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">
                Customer Name
              </p>
              <p className="mt-0.5 font-semibold text-slate-900">
                {completedOrder.customer_name}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">
                Order Date
              </p>
              <p className="mt-0.5 font-semibold text-slate-900">
                {formattedDate}
              </p>
            </div>
          </div>

          {/* Ordered Products */}
          <div className="mt-6">
            <h2 className="text-sm font-bold tracking-wider text-slate-700 uppercase">
              Ordered Products
            </h2>
            <ul className="mt-3 divide-y divide-slate-100 rounded-2xl border border-slate-200">
              {(completedOrder.ordered_products || []).map((item) => (
                <li
                  key={item.product_id}
                  className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image_url || FALLBACK_PRODUCT_IMAGE}
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
                      }}
                      alt={item.name}
                      className="h-11 w-11 rounded-xl border border-slate-100 object-cover"
                    />
                    <div>
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <p className="text-xs text-slate-500">
                        Qty: {item.quantity} × ${Number(item.unit_price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900">
                    ${Number(item.subtotal).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Total Summary */}
          <div className="mt-5 space-y-1.5 border-t border-slate-200 pt-4 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Shipping ({completedOrder.shipping_method})</span>
              <span>${Number(completedOrder.shipping_cost || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-extrabold text-slate-900">
              <span>Total Amount</span>
              <span>${Number(completedOrder.total_amount).toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-7 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-7 py-3 text-sm font-bold text-white hover:bg-blue-600"
            >
              Back to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          Your cart is empty
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Add items to your cart before proceeding to checkout.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Explore Products
        </Link>
      </div>
    );
  }

  const inputClass = (field) =>
    `w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition ${
      errors[field]
        ? 'border-rose-500 bg-rose-50/40 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10'
        : 'border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
    }`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 text-sm text-slate-500">
        <Link to="/cart" className="inline-flex items-center gap-1 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" />
          Shopping Cart
        </Link>
        <span>/</span>
        <span className="font-semibold text-slate-900">Checkout</span>
      </div>

      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
        Checkout
      </h1>

      <form
        noValidate
        onSubmit={handleSubmit}
        className="mt-8 grid gap-8 lg:grid-cols-12"
      >
        {/* Left: Customer Form & Shipping Method */}
        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
            <h2 className="text-lg font-bold text-slate-900">
              Customer Information
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Maps directly to <code className="rounded bg-slate-100 px-1">customers</code>{' '}
              in the 5-table ERD.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  First Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.first_name}
                  onChange={(e) => handleFieldChange('first_name', e.target.value)}
                  placeholder="Sokha"
                  className={inputClass('first_name')}
                />
                {errors.first_name && (
                  <p className="mt-1 text-xs font-medium text-rose-600">
                    {errors.first_name}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Last Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.last_name}
                  onChange={(e) => handleFieldChange('last_name', e.target.value)}
                  placeholder="Dara"
                  className={inputClass('last_name')}
                />
                {errors.last_name && (
                  <p className="mt-1 text-xs font-medium text-rose-600">
                    {errors.last_name}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  placeholder="sokha@example.com"
                  className={inputClass('email')}
                />
                {errors.email && (
                  <p className="mt-1 text-xs font-medium text-rose-600">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  placeholder="+855 12 345 678"
                  className={inputClass('phone')}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs font-medium text-rose-600">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Address <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={form.address}
                  onChange={(e) => handleFieldChange('address', e.target.value)}
                  placeholder="Street 271, Sangkat Boeng Tumpun, Phnom Penh"
                  className={inputClass('address')}
                />
                {errors.address && (
                  <p className="mt-1 text-xs font-medium text-rose-600">
                    {errors.address}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <Truck className="h-5 w-5 text-blue-600" />
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
                    className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${
                      active
                        ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {method.label}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">{method.eta}</p>
                    </div>
                    <span className="text-sm font-extrabold text-slate-900">
                      ${method.cost}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
            <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>

            <ul className="mt-4 divide-y divide-slate-100">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-3 py-3">
                  <img
                    src={item.image_url || FALLBACK_PRODUCT_IMAGE}
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
                    }}
                    alt={item.name}
                    className="h-14 w-14 rounded-xl border border-slate-100 object-cover"
                  />
                  <div className="flex-1">
                    <p className="line-clamp-1 text-sm font-semibold text-slate-900">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      Qty: {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-slate-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping ({selectedShipping.label})</span>
                <span>
                  {shippingCost === 0 ? (
                    <span className="font-semibold text-emerald-600">$0.00</span>
                  ) : (
                    `$${shippingCost.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-3 text-base font-extrabold text-slate-900">
                <span>Grand Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-600 disabled:opacity-60"
            >
              <Lock className="h-4 w-4" />
              {submitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
