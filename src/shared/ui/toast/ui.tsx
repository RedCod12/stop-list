'use client';

import { AnimatePresence, motion } from 'framer-motion';

import { cn } from '@/shared/lib';

import { useToast } from './model';

export function ToastStack() {
  const { toasts, dismiss } = useToast();

  return (
    <div
      className="fixed right-6 bottom-6 z-50 flex w-[360px] flex-col gap-2"
      aria-live="polite"
      aria-relevant="additions text"
    >
      <AnimatePresence initial={false}>
        {toasts.map((item) => (
          <motion.div
            key={item.id}
            role="status"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className={cn(
              'rounded-xl px-4 py-3 text-sm shadow-lg',
              item.tone === 'error'
                ? 'bg-ink text-white'
                : 'bg-white text-ink ring-1 ring-ink/10',
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <p>{item.message}</p>
              <button
                type="button"
                className={cn(
                  item.tone === 'error'
                    ? 'text-white/70 hover:text-white'
                    : 'text-ink/45 hover:text-ink',
                )}
                onClick={() => dismiss(item.id)}
                aria-label="Закрыть уведомление"
              >
                ×
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
