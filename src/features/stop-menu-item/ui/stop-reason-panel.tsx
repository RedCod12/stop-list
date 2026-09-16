'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';

import type { MenuItem, MenuItemFilters } from '@/entities/menu-item';

import { useStopPanel } from '../model';
import { StopReasonForm } from './stop-reason-form';

type StopReasonPanelProps = {
  items: MenuItem[];
  filters: MenuItemFilters;
};

export function StopReasonPanel({ items, filters }: StopReasonPanelProps) {
  const { panelOpen, selectedId, closePanel } = useStopPanel();
  const selected = items.find((item) => item.id === selectedId);
  const editing = selected?.status.kind === 'stopped';

  useEffect(() => {
    if (!panelOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closePanel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closePanel, panelOpen]);

  return (
    <AnimatePresence>
      {panelOpen && selected ? (
        <>
          <motion.button
            type="button"
            aria-label="Закрыть панель"
            className="fixed inset-0 z-30 bg-ink/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePanel}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="stop-panel-title"
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            className="fixed top-0 right-0 z-40 flex h-full w-[400px] max-w-full flex-col bg-white p-6 shadow-2xl"
          >
            <h2 id="stop-panel-title" className="text-lg font-semibold">
              {editing ? 'Изменить стоп' : 'Поставить в стоп-лист'}
            </h2>
            <p className="mt-1 text-sm text-ink/60">{selected.title}</p>
            <StopReasonForm
              selected={selected}
              filters={filters}
              editing={Boolean(editing)}
            />
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
