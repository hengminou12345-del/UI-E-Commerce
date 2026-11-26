import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ToastContainer() {
  const { toasts, dismissToast } = useCart();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-slide-up flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-xl"
        >
          {toast.type === 'error' ? (
            <AlertCircle className="h-4.5 w-4.5 shrink-0 text-rose-400" />
          ) : (
            <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-400" />
          )}
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            className="ml-1 text-slate-400 hover:text-white"
            aria-label="Dismiss notification"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
