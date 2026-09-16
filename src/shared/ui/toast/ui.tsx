'use client';

import { useToast } from './model';

export function ToastStack() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed right-6 bottom-6 z-50 flex w-[360px] flex-col gap-2">
      {toasts.map((item) => (
        <div
          key={item.id}
          className="rounded-xl bg-ink px-4 py-3 text-sm text-white shadow-lg"
          role="status"
        >
          <div className="flex items-start justify-between gap-3">
            <p>{item.message}</p>
            <button
              type="button"
              className="text-white/70 hover:text-white"
              onClick={() => dismiss(item.id)}
              aria-label="Закрыть уведомление"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
