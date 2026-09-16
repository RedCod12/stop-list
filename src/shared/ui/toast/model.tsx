'use client';

import { create } from 'zustand';

type Toast = { id: string; message: string };

type ToastState = {
  toasts: Toast[];
  error: (message: string) => void;
  dismiss: (id: string) => void;
};

const timers = new Map<string, number>();

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  error: (message) => {
    const id = crypto.randomUUID();
    set((state) => ({ toasts: [...state.toasts, { id, message }] }));
    timers.set(
      id,
      window.setTimeout(() => get().dismiss(id), 5000),
    );
  },
  dismiss: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
    const timer = timers.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timers.delete(id);
    }
  },
}));

export const toast = {
  error: (message: string) => useToastStore.getState().error(message),
};

export function useToast() {
  const toasts = useToastStore((state) => state.toasts);
  const error = useToastStore((state) => state.error);
  const dismiss = useToastStore((state) => state.dismiss);
  return { toasts, error, dismiss };
}
