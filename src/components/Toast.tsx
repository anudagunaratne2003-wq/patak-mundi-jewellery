'use client';

import { CheckCircle2, Info, XCircle, X } from 'lucide-react';
import { useStore } from '@/store/StoreContext';

export function ToastContainer() {
  const { toasts, dismissToast } = useStore();

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
      {toasts.map((t) => {
        const Icon =
          t.type === 'success' ? CheckCircle2 : t.type === 'error' ? XCircle : Info;
        const accent =
          t.type === 'success'
            ? 'text-emerald-600'
            : t.type === 'error'
              ? 'text-red-600'
              : 'text-champagne-500';
        return (
          <div
            key={t.id}
            className="pointer-events-auto flex w-80 items-start gap-3 bg-white p-4 shadow-2xl ring-1 ring-charcoal-100 animate-slide-in-right"
          >
            <Icon size={20} className={`mt-0.5 shrink-0 ${accent}`} />
            <p className="flex-1 text-sm text-charcoal-700">{t.message}</p>
            <button
              type="button"
              onClick={() => dismissToast(t.id)}
              className="text-charcoal-300 transition-colors hover:text-charcoal-600"
              aria-label="Dismiss"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
