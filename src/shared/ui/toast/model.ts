'use client';

import { create } from 'zustand';

type Toast = { id: string; message: string; tone: 'error' | 'success' };

type ToastState = {
  toasts: Toast[];
  error: (message: string) => void;
  success: (message: string) => void;
  dismiss: (id: string) => void;
};

const timers = new Map<string, number>();

function pushToast(
  set: (updater: (state: ToastState) => Partial<ToastState>) => void,
  get: () => ToastState,
  message: string,
  tone: Toast['tone'],
) {
  const id = crypto.randomUUID();
  set((state) => ({ toasts: [...state.toasts, { id, message, tone }] }));
  timers.set(
    id,
    window.setTimeout(() => get().dismiss(id), 5000),
  );
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  error: (message) => pushToast(set, get, message, 'error'),
  success: (message) => pushToast(set, get, message, 'success'),
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
  success: (message: string) => useToastStore.getState().success(message),
};

export function useToast() {
  const toasts = useToastStore((state) => state.toasts);
  const error = useToastStore((state) => state.error);
  const success = useToastStore((state) => state.success);
  const dismiss = useToastStore((state) => state.dismiss);
  return { toasts, error, success, dismiss };
}
